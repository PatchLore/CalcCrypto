export function TrustBadge() {
  return (
    <div 
      className="flex items-center gap-2 text-xs text-crypto-muted-foreground 
                 bg-crypto-muted/30 border border-crypto-border rounded-md 
                 px-3 py-2 w-fit"
      role="note"
      aria-label="Calculator disclaimer"
    >
      <span aria-hidden="true">🔒</span>
      <span>
        Educational estimates only · Not financial advice · 
        No data stored · No wallet connection
      </span>
    </div>
  )
}