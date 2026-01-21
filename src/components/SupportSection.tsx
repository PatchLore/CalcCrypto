'use client';

import React, { useState } from "react";

const BASE_ENS = "calcrypto.base.eth";
const SOL_ADDRESS = "HeBkqewaL7dFtcHGhjBFxXz8ZPJCcEf1PRfBRQRX9vnX";

function SupportSection() {
  const [baseCopied, setBaseCopied] = useState(false);
  const [solCopied, setSolCopied] = useState(false);

  const handleCopy = async (value: string, type: "base" | "sol") => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      }
      if (type === "base") {
        setBaseCopied(true);
        setTimeout(() => setBaseCopied(false), 1500);
      } else {
        setSolCopied(true);
        setTimeout(() => setSolCopied(false), 1500);
      }
    } catch {
      // Silently fail to avoid disrupting the UI.
    }
  };

  return (
    <section
      aria-labelledby="support-crypcal-heading"
      className="w-full rounded-lg border border-crypto-border bg-crypto-surface/60 p-4 shadow-sm"
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <h2
            id="support-crypcal-heading"
            className="text-sm font-semibold text-crypto-foreground"
          >
            Support CrypCal
          </h2>
          <p className="text-xs text-crypto-muted-foreground">
            CrypCal is built and maintained independently to provide clear,
            deterministic crypto calculations — without ads, accounts, or
            hidden incentives.
          </p>
          <p className="text-xs text-crypto-muted-foreground">
            If you find the platform useful, you can optionally support ongoing
            development and new calculators.
          </p>
          <p className="text-[11px] text-crypto-muted-foreground">
            Support is always optional and does not unlock features or influence
            calculator results.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-crypto-accent px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-crypto-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crypto-accent focus-visible:ring-offset-2 focus-visible:ring-offset-crypto-background"
          >
            Support development
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-crypto-border bg-crypto-background px-3 py-1.5 text-xs font-medium text-crypto-foreground shadow-sm transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crypto-accent focus-visible:ring-offset-2 focus-visible:ring-offset-crypto-background"
          >
            Support via crypto
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
          <div className="space-y-2 rounded-md border border-crypto-border bg-crypto-background/60 p-3">
            <p className="text-xs font-semibold text-crypto-foreground">
              ETH / USDC on Base
            </p>
            <div className="flex items-center justify-center min-h-[8rem]">
              <img
                src="/qr/base.png"
                alt="Support CrypCal via ETH / USDC on Base"
                className="block h-32 w-32 shrink-0 rounded-md border border-crypto-border bg-white object-contain"
              />
            </div>
            <p className="flex flex-wrap items-center gap-2 break-all text-[11px] text-crypto-muted-foreground">
              <span>ENS: {BASE_ENS}</span>
              <button
                type="button"
                onClick={() => handleCopy(BASE_ENS, "base")}
                className="rounded border border-crypto-border px-2 py-0.5 text-[10px] text-crypto-foreground hover:bg-white/5"
              >
                Copy
              </button>
              {baseCopied && (
                <span className="text-[10px] text-crypto-foreground/80">
                  Copied
                </span>
              )}
            </p>
          </div>

          <div className="space-y-2 rounded-md border border-crypto-border bg-crypto-background/60 p-3">
            <p className="text-xs font-semibold text-crypto-foreground">
              Solana
            </p>
            <div className="flex items-center justify-center min-h-[8rem]">
              <img
                src="/qr/sol.png"
                alt="Support CrypCal via Solana"
                className="block h-32 w-32 shrink-0 rounded-md border border-crypto-border bg-white object-contain"
              />
            </div>
            <p className="flex flex-wrap items-center gap-2 break-all text-[11px] text-crypto-muted-foreground">
              <span>{SOL_ADDRESS}</span>
              <button
                type="button"
                onClick={() => handleCopy(SOL_ADDRESS, "sol")}
                className="rounded border border-crypto-border px-2 py-0.5 text-[10px] text-crypto-foreground hover:bg-white/5"
              >
                Copy
              </button>
              {solCopied && (
                <span className="text-[10px] text-crypto-foreground/80">
                  Copied
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-crypto-muted-foreground">
            Interested in sponsoring development, suggesting new calculators, or
            exploring enterprise use?
            <br />
            Contact: crypcal@mail.com
          </p>
          <p className="text-[11px] text-crypto-muted-foreground">
            CrypCal will remain free, privacy-first, and independent.
          </p>
        </div>
      </div>
    </section>
  );
}

export default SupportSection;

