'use client'
import Image from 'next/image'
import { useState } from 'react'

// FIX-2A: Updated interface to match ReactMarkdown img props
interface MdxImageProps {
  src?: string
  alt?: string
  width?: number | string
  height?: number | string
  caption?: string
}

// FIX-2A: MDX custom Image component for blog post inline content images
export function MdxImage({ 
  src, 
  alt, 
  width = 800, 
  height = 450,
  caption 
}: MdxImageProps) {
  // Handle cases where src/alt might be undefined from markdown
  if (!src) return null;
  const finalWidth = typeof width === 'string' ? parseInt(width) : width;
  const finalHeight = typeof height === 'string' ? parseInt(height) : height;
  const [isLoading, setIsLoading] = useState(true)

  return (
    <figure className="my-8">
      <div 
        className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <Image
          src={src}
          alt={alt || 'Blog post image'}
          fill
          className={`object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          sizes="(max-width: 768px) 100vw, 800px"
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}