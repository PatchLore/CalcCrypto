'use server';

import type { YouTubeVideo, YouTubeChannelResponse, YouTubePlaylistItemResponse } from '@/types/youtube';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Fetches the uploads playlist ID for a given YouTube channel.
 * The uploads playlist ID is typically the channel ID with 'UC' → 'UU'.
 */
async function getUploadsPlaylistId(channelId: string): Promise<string> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY environment variable is not set');
  }

  const url = new URL(`${YOUTUBE_API_BASE}/channels`);
  url.searchParams.set('part', 'contentDetails');
  url.searchParams.set('id', channelId);
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  });

  if (!response.ok) {
    throw new Error(`YouTube API channel fetch failed: ${response.status} ${response.statusText}`);
  }

  const data: YouTubeChannelResponse = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error(`No channel found for ID: ${channelId}`);
  }

  return data.items[0].contentDetails.relatedPlaylists.uploads;
}

/**
 * Fetches the latest videos from a YouTube channel using the Data API v3.
 * Steps:
 * 1. Get the uploads playlist ID from the channel.
 * 2. Fetch the playlist items (videos) from that playlist.
 *
 * @param channelId - The YouTube channel ID (starts with 'UC...').
 * @param maxResults - Number of videos to return (max 50).
 */
export async function fetchLatestVideos(
  channelId: string,
  maxResults: number = 6
): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY environment variable is not set');
  }

  if (!channelId) {
    throw new Error('YOUTUBE_CHANNEL_ID environment variable is not set');
  }

  // Step 1: Get the uploads playlist ID
  const uploadsPlaylistId = await getUploadsPlaylistId(channelId);

  // Step 2: Fetch playlist items (latest videos)
  const url = new URL(`${YOUTUBE_API_BASE}/playlistItems`);
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('playlistId', uploadsPlaylistId);
  url.searchParams.set('maxResults', String(Math.min(maxResults, 50)));
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  });

  if (!response.ok) {
    throw new Error(`YouTube API playlist fetch failed: ${response.status} ${response.statusText}`);
  }

  const data: YouTubePlaylistItemResponse = await response.json();

  if (!data.items || data.items.length === 0) {
    return [];
  }

  return data.items.map((item) => ({
    videoId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    thumbnails: item.snippet.thumbnails,
    channelTitle: item.snippet.channelTitle,
  }));
}