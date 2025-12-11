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
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => router.push('/')}
            className="text-2xl font-bold tracking-tight hover:opacity-70 transition-opacity"
          >
            Cadence
          </button>
          {missionPlan && (
            <nav className="hidden md:flex gap-6">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/benefits-scanner')}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Benefits Scanner
              </button>
              <button
                onClick={() => router.push('/mos-translator')}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                MOS Translator
              </button>
            </nav>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <BranchSwitcher />
          {missionPlan && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
            >
              New Plan
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden border-t-2 border-gray-200 bg-white">
          <div className="px-6 py-4 space-y-4">
            <BranchSwitcher compact />
            {missionPlan && (
              <>
                <button
                  onClick={() => {
                    router.push('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    router.push('/benefits-scanner');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Benefits Scanner
                </button>
                <button
                  onClick={() => {
                    router.push('/mos-translator');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  MOS Translator
                </button>
                <button
                  onClick={handleReset}
                  className="block w-full text-left text-sm font-medium text-gray-600 hover:text-black transition-colors"
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
