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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
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
      className={`site-header ${isScrolled ? 'scrolled' : ''}`}
      id="header"
    >
      <div className={`w-full flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
        {/* Logo */}
        <button
          onClick={() => router.push('/')}
          className="text-white text-xl font-bold uppercase tracking-wider hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0"
        >
          Cadence
        </button>
        
        {/* Navigation - hidden on smaller screens */}
        <nav className="hidden xl:flex gap-9 mx-auto flex-shrink-0">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-300 hover:text-white text-base font-bold uppercase tracking-wide transition-colors duration-200 whitespace-nowrap"
          >
            Mission Plans
          </button>
          <button
            onClick={() => router.push('/benefits-scanner')}
            className="text-gray-300 hover:text-white text-base font-bold uppercase tracking-wide transition-colors duration-200 whitespace-nowrap"
          >
            Benefits
          </button>
          <button
            onClick={() => router.push('/housing-finder')}
            className="text-gray-300 hover:text-white text-base font-bold uppercase tracking-wide transition-colors duration-200 whitespace-nowrap"
          >
            Housing
          </button>
          <button
            onClick={() => router.push('/support')}
            className="text-gray-300 hover:text-white text-base font-bold uppercase tracking-wide transition-colors duration-200 whitespace-nowrap"
          >
            Support
          </button>
          <button
            onClick={() => router.push('/mos-translator')}
            className="text-gray-300 hover:text-white text-base font-bold uppercase tracking-wide transition-colors duration-200 whitespace-nowrap"
          >
            MOS
          </button>
        </nav>

        {/* Right section - Branch switcher and CTA */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 ml-auto">
          <div className="hidden md:block">
            <BranchSwitcher />
          </div>
          {missionPlan ? (
            <button
              onClick={handleReset}
              className="bg-white text-black px-4 md:px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors uppercase tracking-wide whitespace-nowrap"
            >
              Reset
            </button>
          ) : (
            <button
              onClick={() => router.push('/onboarding')}
              className="bg-white text-black px-4 md:px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors uppercase tracking-wide whitespace-nowrap"
            >
              Start
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="xl:hidden p-2 flex-shrink-0 ml-2 text-white"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - full width below header */}
      {isMenuOpen && (
        <div className="xl:hidden border-t border-white/20 bg-black/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            <BranchSwitcher compact />
            <button
              onClick={() => {
                router.push('/dashboard');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors rounded-none"
            >
              Mission Plans
            </button>
            <button
              onClick={() => {
                router.push('/benefits-scanner');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors rounded-none"
            >
              Benefits
            </button>
            <button
              onClick={() => {
                router.push('/housing-finder');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors rounded-none"
            >
              Housing
            </button>
            <button
              onClick={() => {
                router.push('/support');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors rounded-none"
            >
              Support
            </button>
            <button
              onClick={() => {
                router.push('/mos-translator');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors rounded-none"
            >
              MOS Translator
            </button>
            {missionPlan && (
              <>
                <hr className="my-2 border-white/20" />
                <button
                  onClick={handleReset}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors rounded-none border border-red-400/30"
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
