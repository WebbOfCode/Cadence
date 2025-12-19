'use client';

import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import BranchSwitcher from './BranchSwitcher';

export function Header() {
  const router = useRouter();
  const { reset, missionPlan } = useOnboardingStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleReset = () => {
    if (confirm('Are you sure? This will clear your mission plan and return to onboarding.')) {
      reset();
      router.push('/onboarding');
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="site-header border-b-2 border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8 flex-1">
          <button
            onClick={() => router.push('/')}
            className="text-xl md:text-2xl font-bold tracking-tight hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            Cadence
          </button>
          {missionPlan && (
            <nav className="hidden md:flex gap-4 lg:gap-6">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors whitespace-nowrap"
              >
                Dashboard
              </button>
                <button
                  onClick={() => router.push('/benefits-scanner')}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors whitespace-nowrap"
                >
                  Benefits
                </button>
                <button
                  onClick={() => router.push('/housing-finder')}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors whitespace-nowrap"
                >
                  Housing
                </button>
              <button
                onClick={() => router.push('/mos-translator')}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors whitespace-nowrap"
              >
                MOS
              </button>
            </nav>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <BranchSwitcher />
          {missionPlan && (
            <button
              onClick={handleReset}
              className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium border-2 border-gray-200 rounded-lg hover:border-black transition-colors whitespace-nowrap"
            >
              New Plan
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 flex-shrink-0 ml-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden border-t-2 border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <BranchSwitcher compact />
            {missionPlan && (
              <>
                <button
                  onClick={() => {
                    router.push('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    router.push('/benefits-scanner');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded"
                >
                  Benefits Scanner
                </button>
                  <button
                    onClick={() => {
                      router.push('/housing-finder');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded"
                  >
                    Housing Finder
                  </button>
                <button
                  onClick={() => {
                    router.push('/mos-translator');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded"
                >
                  MOS Translator
                </button>
                <hr className="my-2" />
                <button
                  onClick={handleReset}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded border-2 border-red-200"
                >
                  New Plan
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
