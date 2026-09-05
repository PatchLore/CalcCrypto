'use client';

import { trackEvent } from '@/lib/analytics';

type OutboundLinkProps = {
  href: string;
  /** Which page/tool the click came from, e.g. "staking". Part of the GA4 label. */
  source: string;
  /**
   * Partner being linked to, e.g. "koinly" or "coingecko". Required, and
   * deliberately has no default: a default here previously caused non-Koinly
   * links to be reported to GA4 as Koinly clicks.
   */
  partner: string;
  /**
   * True only for links that actually earn a commission. Controls
   * rel="sponsored" and which GA4 event is sent. A plain recommendation that
   * earns nothing must not be marked sponsored, and must not be reported as
   * affiliate revenue.
   */
  sponsored?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Tracked outbound link.
 *
 * Kept as a client component so it can be used inside the statically rendered
 * calculator pages, which are server components and cannot carry an onClick.
 */
export function OutboundLink({
  href,
  source,
  partner,
  sponsored = false,
  className,
  children,
}: OutboundLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel={sponsored ? 'noopener noreferrer sponsored' : 'noopener noreferrer'}
      className={className}
      onClick={() =>
        trackEvent(
          sponsored ? 'affiliate_click' : 'partner_click',
          sponsored ? 'Monetisation' : 'Outbound',
          `${partner}_${source}`
        )
      }
    >
      {children}
    </a>
  );
}

/**
 * Convenience wrapper for links that genuinely earn a commission. Anything
 * rendered through this is reported as affiliate revenue and marked sponsored,
 * so use OutboundLink directly for unpaid partner recommendations.
 */
export function AffiliateLink(props: Omit<OutboundLinkProps, 'sponsored'>) {
  return <OutboundLink {...props} sponsored />;
}
