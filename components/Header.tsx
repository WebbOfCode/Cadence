'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import BranchSwitcher from './BranchSwitcher';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { reset, missionPlan } = useOnboardingStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Only home page has hero section
  const hasHeroSection = pathname === '/';

  // Nike-style scroll detection - manipulates DOM classes directly
  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('header');
      if (!header) return;

      if (hasHeroSection) {
        // Home page: switch based on scroll position
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
          header.classList.remove('dark-mode');
        } else {
          header.classList.remove('scrolled');
          header.classList.add('dark-mode');
        }
      } else {
        // Non-home pages: always use scrolled style
        header.classList.add('scrolled');
        header.classList.remove('dark-mode');
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Set initial state on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasHeroSection]);

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
      <div className="container-full flex items-center justify-between gap-4 py-4 px-4 md:px-6">
        {/* Logo */}
        <button
          onClick={() => router.push('/')}
          className="text-lg md:text-2xl font-black uppercase tracking-tighter hover:opacity-70 transition-opacity whitespace-nowrap flex-shrink-0"
        >
          Cadence
        </button>
        
        {/* Navigation - centered and responsive */}
        <nav className="hidden lg:flex gap-2 flex-shrink-0">
          <button
            onClick={() => router.push('/dashboard')}
            className="nav-link text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5"
          >
            Mission Plans
          </button>
          <button
            onClick={() => router.push('/benefits-scanner')}
            className="nav-link text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5"
          >
            Benefits
          </button>
          <button
            onClick={() => router.push('/housing-finder')}
            className="nav-link text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5"
          >
            Housing
          </button>
          <button
            onClick={() => router.push('/support-groups')}
            className="nav-link text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5"
          >
            Support
          </button>
          <button
            onClick={() => router.push('/mos-translator')}
            className="nav-link text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5"
          >
            MOS
          </button>
        </nav>

        {/* Right section - Branch switcher and CTA */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <div className="hidden sm:block">
            <BranchSwitcher />
          </div>
          {missionPlan ? (
            <button
              onClick={handleReset}
              className="btn-nike btn-nike-primary text-xs py-2 px-4 md:px-6 whitespace-nowrap"
            >
              Reset
            </button>
          ) : (
            <button
              onClick={() => router.push('/onboarding')}
              className="btn-nike btn-nike-primary text-xs py-2 px-4 md:px-6 whitespace-nowrap"
            >
              Start
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 flex-shrink-0"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - full width below header */}
      {isMenuOpen && (
        <div className="lg:hidden border-t-2 border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            <BranchSwitcher compact />
            <button
              onClick={() => {
                router.push('/dashboard');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded-none"
            >
              Mission Plans
            </button>
            <button
              onClick={() => {
                router.push('/benefits-scanner');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded-none"
            >
              Benefits
            </button>
            <button
              onClick={() => {
                router.push('/housing-finder');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition-colors rounded-none"
            >
              Housing
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
            {missionPlan && (
              <>
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
