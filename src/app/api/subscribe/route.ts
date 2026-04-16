import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);
const subscribersPath = path.join(process.cwd(), 'src', 'data', 'subscribers.json');

// Simple in-memory rate limiting (resets on server restart)
// In production, you'd want Redis or a database for this
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const MAX_SUBSCRIPTIONS_PER_HOUR = 10;
const HOUR_IN_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    console.log('[Newsletter] Starting subscription process');

    const { email } = await request.json();
    console.log('[Newsletter] Received email:', email);

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('[Newsletter] Email validation failed');
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim();
    console.log('[Newsletter] Trimmed email:', trimmedEmail);

    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    const now = Date.now();
    const rateLimitKey = clientIP;
    const currentLimit = rateLimit.get(rateLimitKey);

    if (currentLimit) {
      if (now > currentLimit.resetTime) {
        // Reset the limit
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

    // Save to JSON file
    let subscribers: Array<{ email: string; subscribedAt: string }> = [];
    try {
      console.log('[Newsletter] Reading subscribers file:', subscribersPath);
      const fileContent = readFileSync(subscribersPath, 'utf-8');
      subscribers = JSON.parse(fileContent);
      console.log('[Newsletter] Loaded', subscribers.length, 'existing subscribers');
    } catch (error) {
      const err = error as Error;
      console.log('[Newsletter] File read error (expected for first run):', err.message);
      // File doesn't exist yet, subscribers array remains empty
    }

    // Check for duplicates
    if (subscribers.some(sub => sub.email === trimmedEmail)) {
      console.log('[Newsletter] Duplicate email detected');
      return NextResponse.json(
        { success: false, message: 'This email is already subscribed to our newsletter.' },
        { status: 400 }
      );
    }

    // Add new subscriber
    subscribers.push({
      email: trimmedEmail,
      subscribedAt: new Date().toISOString()
    });

    // Write back to file
    try {
      console.log('[Newsletter] Writing subscribers file');
      
      // Ensure directory exists
      const dataDir = path.dirname(subscribersPath);
      if (!existsSync(dataDir)) {
        console.log('[Newsletter] Creating data directory:', dataDir);
        mkdirSync(dataDir, { recursive: true });
      }
      
      writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
      console.log('[Newsletter] Successfully saved subscriber');
    } catch (fileError) {
      const err = fileError as Error;
      console.error('[Newsletter] File write error:');
      console.error('  Path:', subscribersPath);
      console.error('  Error:', err.message);
      console.error('  Stack:', err.stack);
      throw fileError;
    }

    // Send admin notification (don't block on failure)
    try {
      await resend.emails.send({
        from: 'CrypCal <onboarding@resend.dev>',
        to: 'crypcal@mail.com',
        subject: '📧 New CalCrypto Newsletter Subscriber',
        text: `New subscriber: ${trimmedEmail} joined on ${new Date().toLocaleString()}`,
      });
    } catch (emailError) {
      const err = emailError as Error;
      console.error('Failed to send admin notification email:', err.message);
      // Continue - don't block subscription
    }

    // Send welcome email to subscriber (don't block on failure)
    try {
      console.log('[Newsletter] Sending welcome email to:', trimmedEmail);
      
      const welcomeResult = await resend.emails.send({
        from: 'CrypCal <onboarding@resend.dev>',
        to: trimmedEmail,
        subject: 'Welcome to CalCrypto Newsletter!',
        text: `Thanks for subscribing to CalCrypto updates!

You'll get crypto calculator insights, risk monitoring news, and new feature announcements.

Unsubscribe link will be added soon.

- CalCrypto Team`,
      });
      
      console.log('[Newsletter] Welcome email send result:', welcomeResult);
      
      if (welcomeResult.error) {
        console.error('[Newsletter] Welcome email Resend API error:', welcomeResult.error);
      } else {
        console.log('[Newsletter] Welcome email sent successfully, id:', welcomeResult.data?.id);
      }
      
    } catch (emailError) {
      const err = emailError as Error;
      console.error('[Newsletter] ❌ Failed to send welcome email:');
      console.error('  Recipient:', trimmedEmail);
      console.error('  Error message:', err.message);
      console.error('  Error stack:', err.stack);
      // Continue - don't block subscription, this is non-critical
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!'
    });

  } catch (error) {
    const err = error as Error;
    console.error('❌ Newsletter API 500 ERROR:');
    console.error('  Message:', err.message);
    console.error('  Stack:', err.stack);
    console.error('  Full error object:', error);
    
    // Return actual error details in development only
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