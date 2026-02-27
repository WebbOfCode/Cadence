'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Building2, HeartHandshake, Shield } from 'lucide-react';

interface SupportResource {
  name: string;
  type: 'VA Vet Center' | 'VA Medical Center' | 'VA Benefits Office' | 'VSO' | 'Community';
  url: string;
  description?: string;
}

export default function SupportGroupsPage() {
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<SupportResource[]>([]);
  const [stateCode, setStateCode] = useState<string | null>(null);
  const validZip = useMemo(() => /^\d{5}$/.test(zip), [zip]);

  useEffect(() => {
    // Hydrate from localStorage
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('cadence-zip') || '';
    if (stored && /^\d{5}$/.test(stored)) {
      setZip(stored);
      void findResources(stored);
    }
  }, []);

  const findResources = async (z: string) => {
    if (!/^\d{5}$/.test(z)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/support-groups?zip=${encodeURIComponent(z)}`);
      if (!res.ok) throw new Error('Failed to fetch resources');
      const data = await res.json();
      setResources(data.resources || []);
      setStateCode(data.state || null);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cadence-zip', z);
      }
    } catch (e) {
      console.error(e);
      setResources([]);
      setStateCode(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8 md:mb-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Find Support Near You</h1>
          <p className="text-lg text-gray-600 mt-2">Enter your ZIP code to see Vet Centers, VA facilities, and veteran groups nearby.</p>
        </div>

        <div className="mb-8 p-4 md:p-6 border-2 border-gray-200 rounded-lg">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                inputMode="numeric"
                pattern="\\d{5}"
                placeholder="Enter 5-digit ZIP"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, '').slice(0,5))}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <button
              onClick={() => findResources(zip)}
              disabled={!validZip || loading}
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-600 transition-colors"
            >
              <Search className="mr-2" size={18} />
              {loading ? 'Searching...' : 'Find Groups'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">We remember your ZIP on this device for faster results next time.</p>
        </div>

        {stateCode && (
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-gray-800 text-sm">
            <Shield size={16} /> State detected: {stateCode}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r, idx) => (
            <motion.a
              key={`${r.type}-${idx}`}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="block p-6 border-2 border-gray-200 rounded-xl hover:border-black transition-all bg-white"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-lg bg-black text-white flex items-center justify-center">
                  {r.type === 'VA Vet Center' && <HeartHandshake size={18} />}
                  {r.type === 'VA Medical Center' && <Building2 size={18} />}
                  {r.type === 'VA Benefits Office' && <Shield size={18} />}
                  {r.type === 'VSO' && <Shield size={18} />}
                  {r.type === 'Community' && <HeartHandshake size={18} />}
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">{r.type}</p>
                  <h3 className="text-lg font-bold text-gray-900">{r.name}</h3>
                </div>
              </div>
              {r.description && (
                <p className="text-sm text-gray-600">{r.description}</p>
              )}
              <p className="text-sm font-medium text-blue-700 mt-3">Open locator</p>
            </motion.a>
          ))}
        </div>

        {resources.length === 0 && !loading && (
          <div className="text-center text-gray-600 mt-8">
            Enter your ZIP to see nearby support resources.
          </div>
        )}
      </div>
    </div>
  );
}
