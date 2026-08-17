import type { ReactNode } from 'react';

/**
 * Wraps Markdown tables in a horizontally scrollable container.
 *
 * Comparison tables are routinely wider than a phone viewport. Without this the
 * table is clipped by the prose container rather than scrolling, so columns
 * become unreachable on mobile. Applies to every post, not just flagship guides.
 */
export function MarkdownTable({ children, ...props }: { children?: ReactNode }) {
  return (
    <div
      className="not-prose my-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
      role="region"
      aria-label="Comparison table, scrollable horizontally"
      tabIndex={0}
    >
      <table
        {...props}
        className="w-full min-w-[38rem] border-collapse text-left text-sm text-crypto-muted-foreground"
      >
        {children}
      </table>
    </div>
  );
}

export function MarkdownTh({ children, ...props }: { children?: ReactNode }) {
  return (
    <th
      {...props}
      className="border-b border-crypto-border/60 px-3 py-2.5 align-bottom text-xs font-bold uppercase tracking-wide text-crypto-foreground"
    >
      {children}
    </th>
  );
}

export function MarkdownTd({ children, ...props }: { children?: ReactNode }) {
  return (
    <td {...props} className="border-b border-crypto-border/30 px-3 py-2.5 align-top leading-snug">
      {children}
    </td>
  );
}
