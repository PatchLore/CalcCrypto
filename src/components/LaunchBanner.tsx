'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Announcement {
  id: string;
  label: string;
  text: string;
  href: string;
  emoji: string;
  isNew: boolean;
}

// `label` is the badge text only — the emoji is rendered separately from
// `emoji`, so do not repeat it here or it shows twice.
const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'tax-by-country',
    label: 'NEW',
    emoji: '🧾',
    text: 'Crypto Tax by Country — UK, US, Australia & EU compared for 2026',
    href: '/blog/crypto-tax-by-country-compared',
    isNew: true,
  },
  {
    id: 'youtube',
    label: 'NEW',
    emoji: '🎬',
    text: 'CalcCrypto on YouTube — White paper reviews backed by real numbers',
    href: '/channel',
    isNew: true,
  },
  {
    id: 'trade-flow',
    label: 'NEW',
    emoji: '⚖️',
    text: 'Trade Decision Flow — Step-by-step position & liquidity risk assessment',
    href: '/trade-decision-flow',
    isNew: true,
  },
  {
    id: 'position-size',
    label: 'TOOL',
    emoji: '📐',
    text: 'Position Size Calculator — Set stop-losses and size entries by risk level',
    href: '/calculators/position-size',
    isNew: false,
  },
  {
    id: 'liquidity-impact',
    label: 'TOOL',
    emoji: '📊',
    text: 'Liquidity Impact Calculator — Estimate slippage and execution depth',
    href: '/liquidity-impact-calculator',
    isNew: false,
  },
];

// Versioned: bump the suffix whenever ANNOUNCEMENTS gains something users
// should see again. A past dismissal must never permanently silence future
// announcements — the unversioned key did exactly that.
const DISMISSED_KEY = 'calccrypto-banner-dismissed-v2';

export function LaunchBanner() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % ANNOUNCEMENTS.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
  };

  if (!visible) return null;

  const announcement = ANNOUNCEMENTS[current];

  return (
    <div
      className="w-full bg-gradient-to-r from-blue-600/90 to-purple-600/90 
                 backdrop-blur-sm border-b border-white/10"
      role="banner"
      aria-label="Product announcements"
    >
      <div className="container mx-auto px-4 py-2.5 flex items-center 
                      justify-between gap-4 max-w-7xl">
        
        {/* Left spacer for centering */}
        <div className="w-6 shrink-0 hidden sm:block" />

        {/* Announcement content */}
        <Link
          href={announcement.href}
          className={`flex items-center gap-2 text-white text-sm 
                     font-medium hover:underline underline-offset-2
                     transition-opacity duration-300 flex-1 justify-center
                     text-center
                     ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
        >
          <span 
            className={`text-xs font-bold px-1.5 py-0.5 rounded 
                       ${announcement.isNew 
                         ? 'bg-yellow-400 text-yellow-900' 
                         : 'bg-white/20 text-white'}`}
          >
            {announcement.label}
          </span>
          <span aria-hidden="true">{announcement.emoji}</span>
          <span>{announcement.text}</span>
          <span aria-hidden="true" className="opacity-70">→</span>
        </Link>

        {/* Dot indicators + dismiss */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1">
            {ANNOUNCEMENTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to announcement ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all
                  ${i === current 
                    ? 'bg-white w-3' 
                    : 'bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss announcements banner"
            className="text-white/70 hover:text-white transition-colors 
                       text-lg leading-none p-1"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}