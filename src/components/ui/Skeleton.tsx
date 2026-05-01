interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 
                  dark:bg-gray-700 ${className}`}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 
                    dark:border-gray-700 p-4">
      <Skeleton className="h-5 w-2/5" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/5' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export function SkeletonResult() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-label="Loading calculator results"
    >
      <Skeleton className="h-8 w-1/3" />
      <div className="grid grid-cols-2 gap-3">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={2} />
        <SkeletonCard lines={2} />
        <SkeletonCard lines={2} />
      </div>
      <span className="sr-only">Loading results, please wait...</span>
    </div>
  )
}