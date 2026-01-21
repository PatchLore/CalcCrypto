/* Feedback form for user suggestions and calculator ideas.
 * Privacy-first: no accounts, no tracking, no server-side storage.
 * Submissions are sent via the user's email client using a mailto: link.
 */
'use client';

import React, { FormEvent, useState } from 'react';

const SUPPORT_EMAIL = 'crypcal@mail.com';

function FeedbackForm() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitted(false);

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setError('Please add a short message before sending.');
      return;
    }

    const subject = 'CrypCal feedback / calculator idea';
    const bodyLines = [
      trimmedMessage,
      '',
      email.trim() ? `Reply email (optional): ${email.trim()}` : '',
    ].filter(Boolean);

    const body = bodyLines.join('\n');
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    // Trigger the user's email client without storing data on our side.
    if (typeof window !== 'undefined') {
      window.location.href = mailtoUrl;
    }

    setSubmitted(true);
  };

  return (
    <section
      aria-labelledby="feedback-heading"
      className="w-full rounded-lg border border-crypto-border bg-crypto-surface/60 p-4 shadow-sm"
    >
      <div className="space-y-2">
        <h2
          id="feedback-heading"
          className="text-sm font-semibold text-crypto-foreground"
        >
          Have feedback or a calculator idea?
        </h2>
        <p className="text-xs text-crypto-muted-foreground">
          Help shape future CrypCal features. No signup required.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        <div className="space-y-1">
          <label
            htmlFor="feedback-message"
            className="block text-xs font-medium text-crypto-muted-foreground"
          >
            Message <span className="text-crypto-accent">*</span>
          </label>
          <textarea
            id="feedback-message"
            name="message"
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-md border border-crypto-border bg-crypto-background px-3 py-2 text-xs text-crypto-foreground shadow-sm outline-none focus:border-crypto-accent focus:ring-1 focus:ring-crypto-accent"
            placeholder="Share a calculator idea or suggest an improvement..."
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="feedback-email"
            className="block text-xs font-medium text-crypto-muted-foreground"
          >
            Email (optional)
          </label>
          <input
            id="feedback-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-crypto-border bg-crypto-background px-3 py-2 text-xs text-crypto-foreground shadow-sm outline-none focus:border-crypto-accent focus:ring-1 focus:ring-crypto-accent"
            placeholder="Only if you’d like a reply"
          />
        </div>
        {error && (
          <p className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
        {submitted && !error && (
          <p className="text-xs text-crypto-muted-foreground">
            Thanks — your feedback helps improve CrypCal.
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-crypto-accent px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-crypto-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crypto-accent focus-visible:ring-offset-2 focus-visible:ring-offset-crypto-background"
          >
            Send feedback
          </button>
        </div>
      </form>
    </section>
  );
}

export default FeedbackForm;

