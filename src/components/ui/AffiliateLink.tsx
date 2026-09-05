'use client';

import { trackEvent } from '@/lib/analytics';

type AffiliateLinkProps = {
  href: string;
  /** Which page/tool the click came from, e.g. "dca". Used as the GA4 label. */
  source: string;
  /** Partner name, e.g. "koinly". Combined with source into the event label. */
  partner?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Outbound affiliate link that reports the click to GA4.
 *
 * Without this the site has no way to attribute affiliate revenue to a
 * calculator, so there is no signal for which tools are worth promoting. Kept
 * as a client component so it can be dropped into the statically rendered
 * calculator pages, which are server components and cannot carry an onClick.
 *
 * Always renders rel="sponsored" alongside noopener/noreferrer, which is what
 * search engines expect on a monetised link.
 */
export function AffiliateLink({
  href,
  source,
  partner = 'koinly',
  className,
  children,
}: AffiliateLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
      onClick={() => trackEvent('affiliate_click', 'Monetisation', `${partner}_${source}`)}
    >
      {children}
    </a>
  );
}
