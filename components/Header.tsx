'use client';

import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import BranchSwitcher from './BranchSwitcher';

export function Header() {
  const router = useRouter();
  const { reset, missionPlan } = useOnboardingStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Nike-style scroll detection - manipulates DOM classes directly
  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('header');
      if (!header) return;

      if (window.scrollY > 100) {
        // Scrolled past hero - solid white header
        header.classList.add('scrolled');
        header.classList.remove('dark-mode');
      } else {
        // On hero - transparent with white text
        header.classList.remove('scrolled');
        header.classList.add('dark-mode');
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Set initial state on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleReset = () => {
    if (confirm('Are you sure? This will clear your mission plan and return to onboarding.')) {
      reset();
      router.push('/onboarding');
      setIsMenuOpen(false);
    }
  };

  return (
    <header 
      className="site-header transition-all duration-500 dark-mode"
      id="header"
    >
      <div className="container-full flex justify-between items-center py-4 px-6">
        <button
          onClick={() => router.push('/')}
          className="text-2xl font-black uppercase tracking-tighter hover:opacity-70 transition-opacity whitespace-nowrap"
        >
          Cadence
        </button>
        
        {/* Navigation - always visible */}
        <nav className="hidden md:flex gap-12 absolute left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => router.push('/dashboard')}
              className="nav-link"
            >
              Mission Plans
            </button>
            <button
              onClick={() => router.push('/benefits-scanner')}
              className="nav-link"
            >
              Benefits
            </button>
            <button
              onClick={() => router.push('/housing-finder')}
              className="nav-link"
            >
              Housing
            </button>
            <button
              onClick={() => router.push('/support-groups')}
              className="nav-link"
            >
              Support
            </button>
            <button
              onClick={() => router.push('/mos-translator')}
              className="nav-link"
            >
              MOS
            </button>
        </nav>

        <div className="flex items-center gap-4">
          <BranchSwitcher />
          {missionPlan ? (
            <button
              onClick={handleReset}
              className="btn-nike btn-nike-primary text-xs py-2 px-6 hidden md:inline-flex"
            >
              Reset
            </button>
          ) : (
            <button
              onClick={() => router.push('/onboarding')}
              className="btn-nike btn-nike-primary text-xs py-2 px-6 hidden md:inline-flex"
            >
              Get Started
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
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded-none"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    router.push('/benefits-scanner');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded-none"
                >
                  Benefits Scanner
                </button>
                  <button
                    onClick={() => {
                      router.push('/housing-finder');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded-none"
                  >
                    Housing Finder
                  </button>
                <button
                  onClick={() => {
                    router.push('/mos-translator');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded-none"
                >
                  MOS Translator
                </button>
                <button
                  onClick={() => {
                    router.push('/support-groups');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded-none"
                >
                  Support Groups
                </button>
                <hr className="my-2" />
                <button
                  onClick={handleReset}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-none border-2 border-red-200"
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
