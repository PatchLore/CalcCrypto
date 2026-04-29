'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LaunchBanner() {
  const [dismissed, setDismissed] = useState(true); // Default to hidden until we check localStorage
  const [mounted, setMounted] = useState(false);

  // Check feature flag and localStorage on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    
    // Check feature flag
    const showBanner = process.env.NEXT_PUBLIC_SHOW_LAUNCH_BANNER === 'true';
    if (!showBanner) {
      setDismissed(true);
      return;
    }

    // Check localStorage for dismissal
    try {
      const dismissedValue = localStorage.getItem('calccrypto_banner_dismissed');
      if (dismissedValue === 'true') {
        setDismissed(true);
      } else {
        setDismissed(false);
      }
    } catch (e) {
      // localStorage not available (SSR or private browsing)
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem('calccrypto_banner_dismissed', 'true');
    } catch (e) {
      // localStorage not available
    }
  };

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted || dismissed) {
    return null;
  }

  return (
    <div 
      className="animate-fade-in bg-gradient-to-r from-purple-600 to-blue-600 text-white"
      role="banner"
      aria-label="Launch announcement"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm md:text-base font-medium">
            <span className="hidden sm:inline">🎉 </span>
            <strong>New:</strong> Token Price Calculator with Deterministic Risk Assessment is now live.
            <Link 
              href="/blog/token-price-calculator-launch"
              className="ml-2 underline hover:no-underline font-bold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 rounded"
              onClick={() => setDismissed(true)}
            >
              See how it works →
            </Link>
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
          aria-label="Dismiss announcement"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
}