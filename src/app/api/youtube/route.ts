import { NextRequest, NextResponse } from 'next/server';
import { fetchLatestVideos } from '@/lib/youtube';

export async function GET(request: NextRequest) {
  try {
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!channelId) {
      return NextResponse.json(
        { error: 'YOUTUBE_CHANNEL_ID environment variable is not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const maxResultsParam = searchParams.get('maxResults');
    const maxResults = maxResultsParam ? parseInt(maxResultsParam, 10) : 6;

    if (isNaN(maxResults) || maxResults < 1 || maxResults > 50) {
      return NextResponse.json(
        { error: 'maxResults must be between 1 and 50' },
        { status: 400 }
      );
    }

    const videos = await fetchLatestVideos(channelId, maxResults);

    return NextResponse.json(videos, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('YouTube API route error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch YouTube videos',
      },
      { status: 500 }
    );
  }
}