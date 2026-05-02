'use client';

export function AdsUnit({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      {/* BEGIN AADS AD UNIT 2436376 */}
      <div 
        id="frame" 
        style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 99998 }}
      >
        <iframe
          data-aa='2436376'
          src='//acceptable.a-ads.com/2436376/?size=Adaptive'
          style={{
            border: 0,
            padding: 0,
            width: '70%',
            height: 'auto',
            overflow: 'hidden',
            display: 'block',
            margin: 'auto'
          }}
          title="A-Ads Advertisement"
          scrolling="no"
        />
      </div>
      {/* END AADS AD UNIT 2436376 */}
    </div>
  );
}