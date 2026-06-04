const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export async function subscribeEmail(email: string): Promise<{ success: boolean; message: string }> {
  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    throw new Error('Missing Resend API Key or Audience ID in environment variables.');
  }

  try {
    const res = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 409) {
        return { success: true, message: 'Already subscribed' };
      }
      throw new Error(data.message || 'Failed to subscribe via Resend API');
    }

    return { success: true, message: 'Subscribed successfully' };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    throw error;
  }
}
