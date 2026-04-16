'use client';

import React, { useState } from 'react';

interface NewsletterResult {
  success: boolean;
  message: string;
}

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NewsletterResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data: NewsletterResult = await response.json();
      setResult(data);

      if (data.success) {
        setEmail('');
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-hide success/error messages after 5 seconds
  React.useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-primary mb-4">Stay Updated</h3>
      <p className="text-secondary mb-4">
        Get the latest crypto calculator insights and updates delivered to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-crypto-background/50 border border-crypto-border rounded-lg text-crypto-foreground placeholder-crypto-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-primary hover:bg-primary/80 text-primary-foreground font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {result && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            result.success
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}