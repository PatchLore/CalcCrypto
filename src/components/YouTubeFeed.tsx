'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import type { YouTubeVideo, YouTubeFeedProps } from '@/types/youtube';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getBestThumbnail(video: YouTubeVideo) {
  // Prefer maxres, fall back through standard → high → medium → default
  return video.thumbnails.maxres ?? video.thumbnails.standard ?? video.thumbnails.high;
}

interface VideoModalProps {
  video: YouTubeVideo;
  onClose: () => void;
}

function VideoModal({ video, onClose }: VideoModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${video.title}`}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          aria-label="Close video"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Video iframe */}
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video info below player */}
        <div className="p-4 md:p-6 bg-crypto-background/95">
          <h3 className="text-lg font-semibold text-primary md:text-xl line-clamp-2">
            {video.title}
          </h3>
          <p className="mt-1 text-sm text-secondary">
            {video.channelTitle} · {formatDate(video.publishedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function YouTubeFeed({ maxResults = 6, className = '' }: YouTubeFeedProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  // Fetch videos on mount
  useEffect(() => {
    let cancelled = false;

    async function loadVideos() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/youtube?maxResults=${maxResults}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.statusText}`);
        }
        const data = await response.json();
        if (!cancelled) {
          setVideos(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load videos');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadVideos();

    return () => {
      cancelled = true;
    };
  }, [maxResults]);

  const openModal = useCallback((video: YouTubeVideo) => {
    setSelectedVideo(video);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: maxResults }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-crypto-border/60 bg-crypto-background/40 overflow-hidden">
              <div className="aspect-video bg-white/5" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center ${className}`}>
        <p className="text-red-400 text-sm">Unable to load YouTube videos at this time.</p>
        <p className="mt-1 text-secondary text-xs">{error}</p>
      </div>
    );
  }

  // No videos
  if (videos.length === 0) {
    return (
      <div className={`rounded-2xl border border-crypto-border/60 bg-crypto-background/40 p-6 text-center ${className}`}>
        <p className="text-secondary">No videos available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <>
      <div className={className}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => {
            const thumbnail = getBestThumbnail(video);
            return (
              <button
                key={video.videoId}
                onClick={() => openModal(video)}
                className="group relative overflow-hidden rounded-2xl border border-crypto-border/60 bg-crypto-background/40 text-left transition-all duration-300 hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-black">
                  <Image
                    src={thumbnail.url}
                    alt={video.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform duration-300 group-hover:scale-110 md:h-14 md:w-14">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ml-0.5 md:w-6 md:h-6"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Video info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-primary line-clamp-2 transition-colors group-hover:text-red-400 md:text-base">
                    {video.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-secondary">
                    {formatDate(video.publishedAt)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={closeModal} />
      )}
    </>
  );
}