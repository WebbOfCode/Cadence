"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const HousingSchema = z.object({
  location: z.string().min(2, "Enter a city, state or zip"),
  maxRent: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine((v) => (v === undefined ? true : v > 0), {
      message: "Enter a positive number",
    }),
  beds: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine((v) => (v === undefined ? true : v >= 0), {
      message: "Enter 0 for studio or higher",
    }),
  pets: z.boolean().optional(),
  accessible: z.boolean().optional(),
  voucher: z.boolean().optional(),
});

type HousingForm = z.infer<typeof HousingSchema>;

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
  image?: string;
}

export default function HousingFinderPage() {
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<HousingForm>({
    resolver: zodResolver(HousingSchema),
    defaultValues: {
      location: "Nashville, TN",
      maxRent: undefined,
      beds: undefined,
      pets: false,
      accessible: false,
      voucher: false,
    },
  });

  const onSubmit = async (data: HousingForm) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/housing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!resp.ok) throw new Error("Failed to search housing");
      const json = await resp.json();
      setResults(json.results);
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Housing Finder</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Apartment & Home Finder</h1>
        <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
          Search veteran-friendly housing by location, budget, bedrooms, and access needs. We prioritize affordable and voucher-friendly options first.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Location */}
        <fieldset className="border-l-4 border-gray-900 pl-6 space-y-5">
          <div>
            <legend className="text-lg font-semibold text-gray-900 mb-1">Where are you looking?</legend>
            <p className="text-sm text-gray-600">City, state, or ZIP helps us filter local listings.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">City / State / ZIP</label>
            <input
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              placeholder="e.g., Nashville, TN or 37211"
              {...register("location")}
            />
            {errors.location && (
              <p className="text-xs text-red-700 mt-2">{errors.location.message}</p>
            )}
          </div>
        </fieldset>

        {/* Preferences */}
        <fieldset className="border-l-4 border-blue-600 pl-6 space-y-5">
          <div>
            <legend className="text-lg font-semibold text-gray-900 mb-1">Your Preferences</legend>
            <p className="text-sm text-gray-600">Budget, bedrooms, and any access or voucher needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Max Monthly Rent</label>
              <input
                className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="e.g., 1500"
                inputMode="numeric"
                {...register("maxRent")}
              />
              {errors.maxRent && (
                <p className="text-xs text-red-700 mt-2">{String(errors.maxRent.message)}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Bedrooms</label>
              <select
                className="w-full border-2 border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                {...register("beds")}
              >
                <option value="">Any</option>
                <option value="0">Studio</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
              {errors.beds && (
                <p className="text-xs text-red-700 mt-2">{String(errors.beds.message)}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 rounded border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5" {...register("pets")}/>
                <span className="text-sm font-medium text-gray-900">Pet Friendly</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5" {...register("accessible")}/>
                <span className="text-sm font-medium text-gray-900">Accessible</span>
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 p-3 rounded border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors w-fit">
              <input type="checkbox" className="w-5 h-5" {...register("voucher")}/>
              <span className="text-sm font-medium text-gray-900">Voucher Friendly (Section 8/HUD-VASH)</span>
            </label>
          </div>
        </fieldset>

        {/* Submit */}
        <div className="border-t-2 border-gray-200 pt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 md:py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-base md:text-lg"
          >
            {loading ? "Searching..." : "Find Housing"}
          </button>
          {error && (
            <p className="text-xs text-red-700 mt-3">{error}</p>
          )}
        </div>
      </form>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-10 space-y-6">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-300 mb-2">Found Listings</p>
            <p className="text-4xl md:text-5xl font-bold mb-4">{results.length}</p>
            <p className="text-sm text-gray-200">Sorted by affordability and match</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.map((l) => (
              <section key={l.id} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{l.title}</h3>
                    <p className="text-sm text-gray-700">{l.address}, {l.city}, {l.state} {l.zip}</p>
                  </div>
                  <p className="text-lg font-bold text-green-700">${l.rent}</p>
                </div>
                <p className="text-sm text-gray-700 mb-3">{l.beds === 0 ? "Studio" : `${l.beds} BR`} • {l.baths} BA</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {l.petFriendly && <span className="px-2 py-1 text-xs bg-gray-100 rounded">Pets OK</span>}
                  {l.accessible && <span className="px-2 py-1 text-xs bg-gray-100 rounded">Accessible</span>}
                  {l.voucherAccepted && <span className="px-2 py-1 text-xs bg-gray-100 rounded">Voucher</span>}
                  {l.veteranFriendly && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Veteran Friendly</span>}
                </div>

                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-xs px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-medium"
                >
                  View Listing →
                </a>
              </section>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center">Listings shown are examples. Connect with local housing authorities and property managers for real availability.</p>
        </div>
      )}
    </div>
  );
}
