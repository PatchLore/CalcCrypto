import { NextRequest, NextResponse } from 'next/server';
import { subscribeEmail } from '@/lib/newsletter';

const rateLimit = new Map<string, { count: number; resetTime: number }>();
const MAX_SUBSCRIPTIONS_PER_HOUR = 10;
const HOUR_IN_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim();

    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    const now = Date.now();
    const rateLimitKey = clientIP;
    const currentLimit = rateLimit.get(rateLimitKey);

    if (currentLimit) {
      if (now > currentLimit.resetTime) {
        rateLimit.set(rateLimitKey, { count: 1, resetTime: now + HOUR_IN_MS });
      } else if (currentLimit.count >= MAX_SUBSCRIPTIONS_PER_HOUR) {
        return NextResponse.json(
          { success: false, message: 'Too many subscriptions from this IP. Please try again later.' },
          { status: 429 }
        );
      } else {
        currentLimit.count++;
      }
    } else {
      rateLimit.set(rateLimitKey, { count: 1, resetTime: now + HOUR_IN_MS });
    }

    const result = await subscribeEmail(trimmedEmail);

    return NextResponse.json(result);

  } catch (error) {
    const err = error as Error;
    const isDev = process.env.NODE_ENV === 'development';

    return NextResponse.json(
      {
        success: false,
        message: isDev ? `Server error: ${err.message}` : 'An error occurred. Please try again later.',
        error: isDev ? err.stack : undefined
      },
      { status: 500 }
    );
  }
}
