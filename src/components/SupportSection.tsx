import React from "react";

function SupportSection() {
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

        <div className="space-y-2">
          <p className="text-xs text-crypto-muted-foreground">
            Interested in sponsoring development, suggesting new calculators, or
            exploring enterprise use?
            <br />
            Contact: support@crypcal.com
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

