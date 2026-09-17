'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/Button';
import { trackButtonClick } from '@/lib/analytics';

interface ShareResultProps {
  /** Ref to the visible result element to capture. Read-only: never mutated except for a temporary watermark node that is removed after capture. */
  targetRef: RefObject<HTMLElement | null>;
  /** Canonical page path used for the X/Twitter share URL, e.g. "/calculators/profit-loss". */
  pagePath: string;
  /** Human-readable calculator name used for the file name and share text, e.g. "Profit/Loss". */
  label: string;
}

const SITE_URL = 'https://www.calccrypto.com';
const WATERMARK_TEXT = 'CalcCrypto.com';

type Status = 'idle' | 'capturing' | 'ready' | 'error';

export function ShareResult({ targetRef, pagePath, label }: ShareResultProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) {
        window.clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const capture = async () => {
    const node = targetRef.current;
    if (!node) {
      setError('Result is not available yet. Calculate first, then try again.');
      setStatus('error');
      return;
    }
    setStatus('capturing');
    setError('');

    // Temporary watermark node: appended for the capture only, then removed.
    // This keeps the React tree, inputs, state, and displayed values untouched.
    const badge = document.createElement('div');
    badge.textContent = WATERMARK_TEXT;
    badge.setAttribute('data-share-watermark', 'true');
    badge.style.cssText =
      'text-align:center;font-size:12px;letter-spacing:0.04em;' +
      'padding:12px 0 2px;opacity:0.65;font-family:inherit;';

    node.appendChild(badge);
    try {
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
      setImageUrl(dataUrl);
      setStatus('ready');
      trackButtonClick('share_result_capture', label);
    } catch {
      setStatus('error');
      setError('Could not generate the image. Please try again.');
    } finally {
      badge.remove();
    }
  };

  const reset = () => {
    setImageUrl(null);
    setStatus('idle');
    setError('');
    setToast('');
  };

  const fileName = `calccrypto-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-result.png`;
  // Kept short (well under 200 chars for every calculator label) to leave room for the URL.
  // No image is attached via the intent URL — X intents do not support that.
  const shareText = `My ${label} result — calculated with CalcCrypto (estimates only, not financial advice)`;

  const handleShareToX = () => {
    // Auto-download the PNG first so the user can paste it into the X compose window.
    if (imageUrl) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    setToast('Image downloaded. Paste it when X opens.');
    if (toastTimer.current !== null) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => setToast(''), 5000);
    trackButtonClick('share_result_x', label);
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(`${SITE_URL}${pagePath}`);
    window.open(`https://x.com/intent/post?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-4 border-t border-crypto-border pt-4">
      {status !== 'ready' ? (
        <div className="space-y-2">
          <Button
            onClick={capture}
            variant="secondary"
            className="w-full"
            loading={status === 'capturing'}
            aria-label={`Share ${label} result as image`}
          >
            {status === 'capturing' ? 'Generating image…' : 'Share Result'}
          </Button>
          {status === 'error' && error && (
            <p role="alert" className="text-sm text-crypto-error-600 dark:text-crypto-error-400">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={`${label} result snapshot with CalcCrypto.com watermark`}
              className="mx-auto max-h-72 rounded-lg border border-crypto-border"
            />
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            {imageUrl && (
              <a href={imageUrl} download={fileName} className="flex-1">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => trackButtonClick('share_result_download', label)}
                >
                  Download Image
                </Button>
              </a>
            )}
            <Button
              variant="secondary"
              className="w-full flex-1"
              onClick={handleShareToX}
            >
              Share to X / Twitter
            </Button>
          </div>
          {toast && (
            <p
              role="status"
              className="rounded-md border border-crypto-success-200 bg-crypto-success-50 px-3 py-2 text-sm text-crypto-success-600 dark:border-crypto-success-800 dark:bg-crypto-success-950 dark:text-crypto-success-400"
            >
              {toast}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            className="text-xs text-crypto-muted-foreground underline-offset-2 hover:underline"
          >
            Generate a new image
          </button>
          <p className="text-xs text-crypto-muted-foreground">
            Image includes a small “{WATERMARK_TEXT}” watermark. Values are estimates only.
          </p>
        </div>
      )}
    </div>
  );
}
