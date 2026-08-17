import { isValidElement, type ReactNode } from 'react';
import { BLOCK_PREFIX, renderBlock } from './blocks';

/**
 * ReactMarkdown `pre` override that turns component blocks into React
 * components while leaving ordinary code blocks untouched.
 *
 * A component block is a fenced code block whose info string starts with `cc-`:
 *
 *   ```cc-key-takeaway
 *   { "points": ["..."] }
 *   ```
 *
 * remark turns that into <pre><code class="language-cc-key-takeaway">…</code></pre>.
 * Intercepting at `pre` (rather than `code`) means the custom component is not
 * wrapped in a stray <pre>. Anything unrecognised or malformed falls through to
 * the normal code-block rendering, so an authoring error degrades visibly
 * instead of breaking the build.
 */

interface CodeChildProps {
  className?: unknown;
  children?: ReactNode;
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  return '';
}

export function MarkdownBlock({ children, ...props }: { children?: ReactNode }) {
  // The single child of a fenced block is the <code> element.
  const child = Array.isArray(children) ? children[0] : children;

  if (isValidElement(child)) {
    const { className, children: codeChildren } = child.props as CodeChildProps;

    if (typeof className === 'string') {
      const match = /(?:^|\s)language-([\w-]+)/.exec(className);
      const lang = match?.[1];

      if (lang && lang.startsWith(BLOCK_PREFIX)) {
        const name = lang.slice(BLOCK_PREFIX.length);
        const rendered = renderBlock(name, extractText(codeChildren));
        if (rendered) return rendered;
        // Unknown name or bad JSON: fall through to the plain <pre> below.
      }
    }
  }

  return <pre {...props}>{children}</pre>;
}
