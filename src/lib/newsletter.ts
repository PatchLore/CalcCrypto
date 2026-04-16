import fs from 'fs';
import path from 'path';

export interface NewsletterResult {
  success: boolean;
  message: string;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function subscribeToNewsletter(email: string): NewsletterResult {
  // Validate email
  if (!validateEmail(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    };
  }

  try {
    const subscribersFile = path.join(process.cwd(), 'src', 'data', 'subscribers.json');

    // Create data directory if it doesn't exist
    const dataDir = path.dirname(subscribersFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read existing subscribers or create empty array
    let subscribers: string[] = [];
    if (fs.existsSync(subscribersFile)) {
      const data = fs.readFileSync(subscribersFile, 'utf8');
      subscribers = JSON.parse(data);
    }

    // Check for duplicates
    if (subscribers.includes(email)) {
      return {
        success: false,
        message: 'This email is already subscribed to our newsletter.',
      };
    }

    // Add new subscriber
    subscribers.push(email);

    // Write back to file
    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));

    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!',
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.',
    };
  }
}