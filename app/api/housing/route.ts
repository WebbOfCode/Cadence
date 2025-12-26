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
  const normalize = (s: string) => s.trim().toLowerCase();
  const loc = q.location ? normalize(q.location) : undefined;

  return (listings as any[])
    .filter((l) => {
      // Location filter
      const matchesLocation = loc
        ? [l.city, l.state, l.zip].some((v: string) => normalize(v).includes(loc))
        : true;

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
  const { searchParams } = new URL(req.url);
  const q: HousingQuery = {
    location: searchParams.get("location") || undefined,
    maxRent: searchParams.get("maxRent") ? Number(searchParams.get("maxRent")) : undefined,
    beds: searchParams.get("beds") ? Number(searchParams.get("beds")) : undefined,
    pets: searchParams.get("pets") === "true" || undefined,
    accessible: searchParams.get("accessible") === "true" || undefined,
    voucher: searchParams.get("voucher") === "true" || undefined,
  };
  const results = filterListings(q);
  return NextResponse.json({ results });
}

export async function POST(req: Request) {
  const body = (await req.json()) as HousingQuery;
  const q: HousingQuery = {
    location: body.location,
    maxRent: body.maxRent,
    beds: body.beds,
    pets: body.pets,
    accessible: body.accessible,
    voucher: body.voucher,
  };
  const results = filterListings(q);
  return NextResponse.json({ results });
}
