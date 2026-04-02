import { NextResponse } from "next/server";

export interface HousingQuery {
  location?: string;
  maxRent?: number;
  beds?: number;
  pets?: boolean;
  accessible?: boolean;
  voucher?: boolean;
}

interface Listing {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  rent: number;
  beds: number;
  baths: number;
  petFriendly: boolean;
  accessible: boolean;
  voucherAccepted: boolean;
  veteranFriendly: boolean;
  url: string;
}

const STATE_MAP: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA",
  hawaii: "HI", idaho: "ID", illinois: "IL", indiana: "IN", iowa: "IA",
  kansas: "KS", kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS", missouri: "MO",
  montana: "MT", nebraska: "NE", nevada: "NV", "new hampshire": "NH", "new jersey": "NJ",
  "new mexico": "NM", "new york": "NY", "north carolina": "NC", "north dakota": "ND",
  ohio: "OH", oklahoma: "OK", oregon: "OR", pennsylvania: "PA", "rhode island": "RI",
  "south carolina": "SC", "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT",
  vermont: "VT", virginia: "VA", washington: "WA", "west virginia": "WV",
  wisconsin: "WI", wyoming: "WY", "district of columbia": "DC",
};

function normalizeState(input: string): string {
  const trimmed = input.trim();
  // Already a 2-letter code — just uppercase it
  if (trimmed.length === 2) return trimmed.toUpperCase();
  // Full state name — look up the code
  return STATE_MAP[trimmed.toLowerCase()] || trimmed.toUpperCase();
}

function parseLocation(location: string) {
  const normalized = location.trim();

  if (/^\d{5}$/.test(normalized)) {
    return { zip: normalized };
  }

  if (normalized.includes(",")) {
    const [city, state] = normalized.split(",").map(s => s.trim());
    return { city, state: normalizeState(state) };
  }

  return { city: normalized };
}

async function fetchRealListings(location: string): Promise<Listing[]> {
  // RentCast API (replaces the defunct Realty Mole API)
  // Sign up at https://www.rentcast.io/api to get a key
  const apiKey = process.env.RENTCAST_API_KEY;

  if (!apiKey) {
    throw new Error("RENTCAST_API_KEY environment variable is not configured. Get a key at https://www.rentcast.io/api");
  }

  const parsed = parseLocation(location);
  const params = new URLSearchParams();

  if (parsed.zip) {
    params.append("zipCode", parsed.zip);
  } else if (parsed.city && parsed.state) {
    params.append("city", parsed.city);
    params.append("state", parsed.state);
  } else if (parsed.city) {
    params.append("city", parsed.city);
  }

  params.append("limit", "20");
  params.append("status", "Active");

  const url = `https://api.rentcast.io/v1/listings/rental/long-term?${params.toString()}`;

  console.log("Housing API request:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Api-Key": apiKey,
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(`Housing API error ${response.status}:`, body);
    if (response.status === 429) {
      throw new Error("Housing search is temporarily unavailable — API rate limit reached. Please try again later.");
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("Housing API key is invalid or expired. Check RENTCAST_API_KEY in your environment.");
    }
    throw new Error(`Housing API returned ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const raw: any[] = Array.isArray(data) ? data : [];

  console.log(`Housing API returned ${raw.length} raw listings`);
  if (raw.length > 0) {
    console.log("Sample listing fields:", JSON.stringify(raw[0], null, 2));
  }

  const listings = raw
    .map(transformListing)
    .filter((l): l is Listing => l !== null);

  console.log(`${listings.length} listings after transformation`);
  return listings;
}

function transformListing(apiListing: any): Listing | null {
  try {
    // RentCast returns `price` as monthly rent for rental listings
    const rent = apiListing.price ?? 0;
    if (rent <= 0 || rent > 50000) return null;

    const beds = apiListing.bedrooms ?? 0;
    const baths = apiListing.bathrooms ?? 1;

    const address =
      apiListing.addressLine1 ||
      apiListing.formattedAddress ||
      "Address unavailable";
    const city = apiListing.city || "";
    const state = apiListing.state || "";
    const zip = apiListing.zipCode || "";

    const addressShort = address.split(",")[0];
    const title =
      apiListing.formattedAddress?.split(",")[0] ||
      `${beds === 0 ? "Studio" : `${beds}BR`} ${baths}BA — ${addressShort}`;

    return {
      id: apiListing.id || `listing-${Date.now()}-${Math.random()}`,
      title,
      address,
      city,
      state,
      zip,
      rent,
      beds,
      baths,
      petFriendly: false,
      accessible: false,
      voucherAccepted: false,
      veteranFriendly: false,
      url: `https://www.google.com/search?q=${encodeURIComponent(`${address}, ${city}, ${state} ${zip} rental listing`)}`,
    };
  } catch (error) {
    console.error("Error transforming listing:", error);
    return null;
  }
}

function filterListings(listings: Listing[], q: HousingQuery) {
  return listings
    .filter((l) => {
      const matchesRent = q.maxRent !== undefined ? l.rent <= q.maxRent : true;
      const matchesBeds = q.beds !== undefined ? l.beds >= q.beds : true;
      const matchesPets = q.pets ? l.petFriendly : true;
      const matchesAccessible = q.accessible ? l.accessible : true;
      const matchesVoucher = q.voucher ? l.voucherAccepted : true;
      return matchesRent && matchesBeds && matchesPets && matchesAccessible && matchesVoucher;
    })
    .sort((a, b) => a.rent - b.rent)
    .slice(0, 20);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    if (!location) {
      return NextResponse.json({ error: "Location is required", results: [] }, { status: 400 });
    }

    const q: HousingQuery = {
      location,
      maxRent: searchParams.get("maxRent") ? Number(searchParams.get("maxRent")) : undefined,
      beds: searchParams.get("beds") ? Number(searchParams.get("beds")) : undefined,
      pets: searchParams.get("pets") === "true",
      accessible: searchParams.get("accessible") === "true",
      voucher: searchParams.get("voucher") === "true",
    };

    const listings = await fetchRealListings(location);
    const results = filterListings(listings, q);

    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to search housing";
    console.error("Housing GET error:", message);
    return NextResponse.json({ error: message, results: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as HousingQuery;

    if (!body.location) {
      return NextResponse.json({ error: "Location is required", results: [] }, { status: 400 });
    }

    const q: HousingQuery = {
      location: body.location,
      maxRent: body.maxRent,
      beds: body.beds,
      pets: Boolean(body.pets),
      accessible: Boolean(body.accessible),
      voucher: Boolean(body.voucher),
    };

    console.log("Housing search query:", q);

    const listings = await fetchRealListings(q.location!);
    const results = filterListings(listings, q);

    console.log(`Found ${results.length} listings for "${q.location}"`);
    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to search housing";
    console.error("Housing POST error:", message);
    return NextResponse.json({ error: message, results: [] }, { status: 500 });
  }
}
