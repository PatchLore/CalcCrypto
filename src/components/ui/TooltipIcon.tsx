'use client';

import { useState } from 'react';

interface TooltipIconProps {
  text: string;
}

export function TooltipIcon({ text }: TooltipIconProps) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        onBlur={() => setShow(false)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="inline-flex items-center justify-center w-4 h-4 min-w-[16px] min-h-[16px] ml-1.5 rounded-full text-[10px] text-crypto-muted-foreground border border-crypto-border hover:bg-crypto-muted/50 hover:text-crypto-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-help"
        aria-label={text}
        tabIndex={0}
      >
        ?
      </button>
      {show && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-crypto-foreground bg-crypto-background border border-crypto-border rounded-lg shadow-lg whitespace-normal max-w-[220px] z-50 leading-relaxed pointer-events-none"
          role="tooltip"
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-crypto-background border-r border-b border-crypto-border rotate-45" />
        </div>
      )}
    </span>
  );
}
