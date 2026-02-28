import { NextResponse } from "next/server";
import listings from "../../../data/housing_listings.json";

export interface HousingQuery {
  location?: string; // city, state or zip
  maxRent?: number;
  beds?: number;
  pets?: boolean;
  accessible?: boolean;
  voucher?: boolean;
}

function filterListings(q: HousingQuery) {
  if (!listings || !Array.isArray(listings)) {
    console.error("Housing listings data is not available or not an array");
    return [];
  }

  const normalize = (s: string) => s.trim().toLowerCase();
  const loc = q.location ? normalize(q.location) : undefined;

  return (listings as any[])
    .filter((l) => {
      // Location filter - handle city,state format or zip
      let matchesLocation = true;
      if (loc) {
        const cityState = normalize(`${l.city}, ${l.state}`);
        const cityStateNoSpace = normalize(`${l.city},${l.state}`);
        const cityOnly = normalize(l.city);
        const stateOnly = normalize(l.state);
        const zipOnly = normalize(l.zip || "");
        
        matchesLocation = 
          cityState.includes(loc) ||
          cityStateNoSpace.includes(loc) ||
          (loc.includes(cityOnly) && loc.includes(stateOnly)) ||
          zipOnly === loc ||
          zipOnly.includes(loc);
      }

      const matchesRent = q.maxRent !== undefined ? Number(l.rent) <= Number(q.maxRent) : true;
      const matchesBeds = q.beds !== undefined ? Number(l.beds) >= Number(q.beds) : true;
      const matchesPets = q.pets ? Boolean(l.petFriendly) : true;
      const matchesAccessible = q.accessible ? Boolean(l.accessible) : true;
      const matchesVoucher = q.voucher ? Boolean(l.voucherAccepted) : true;

      return (
        matchesLocation &&
        matchesRent &&
        matchesBeds &&
        matchesPets &&
        matchesAccessible &&
        matchesVoucher
      );
    })
    .sort((a, b) => Number(a.rent) - Number(b.rent))
    .slice(0, 20);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q: HousingQuery = {
      location: searchParams.get("location") || undefined,
      maxRent: searchParams.get("maxRent") ? Number(searchParams.get("maxRent")) : undefined,
      beds: searchParams.get("beds") ? Number(searchParams.get("beds")) : undefined,
      pets: searchParams.get("pets") === "true",
      accessible: searchParams.get("accessible") === "true",
      voucher: searchParams.get("voucher") === "true",
    };
    const results = filterListings(q);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Housing GET error:", error);
    return NextResponse.json(
      { error: "Failed to search housing", results: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as HousingQuery;
    const q: HousingQuery = {
      location: body.location,
      maxRent: body.maxRent,
      beds: body.beds,
      pets: Boolean(body.pets),
      accessible: Boolean(body.accessible),
      voucher: Boolean(body.voucher),
    };
    console.log("Housing search query:", q);
    const results = filterListings(q);
    console.log(`Found ${results.length} listings matching criteria`);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Housing POST error:", error);
    return NextResponse.json(
      { error: "Failed to search housing", results: [] },
      { status: 500 }
    );
  }
}
