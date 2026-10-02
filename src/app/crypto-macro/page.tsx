import type { Metadata } from 'next';
import Link from 'next/link';
import { healthReport, type ConnectionKind } from '@/lib/crypto-macro/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const title = 'Crypto Macro | CalcCrypto';
const description =
  'Crypto Macro database status. Server-side only, backed by an isolated development Neon branch.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://www.calccrypto.com/crypto-macro' },
  openGraph: { title, description, url: '/crypto-macro', siteName: 'CalcCrypto', type: 'website' },
  robots: { index: false, follow: false },
};

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={
        ok
          ? 'inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300'
          : 'inline-flex items-center rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300'
      }
    >
      {ok ? 'OK' : 'FAIL'} &middot; {label}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-crypto-border/40 py-2 last:border-b-0">
      <span className="text-sm text-crypto-muted-foreground">{label}</span>
      <span className="font-mono text-sm text-crypto-foreground">{value}</span>
    </div>
  );
}

export default async function CryptoMacroPage() {
  const report = await healthReport({ kinds: ['pooled', 'direct'] as ConnectionKind[] });
  const { env, connections } = report;
  const configured = env.pooledConfigured && env.directConfigured;
  const allOk = configured && connections.length > 0 && connections.every((entry) => entry.ok);

  return (
    <div className="min-h-screen bg-crypto-background">
      <header className="glass-card mx-4 mt-4">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-sm font-bold text-primary rounded-lg px-3 py-2 border border-crypto-border/60 bg-crypto-background/60">
                CC
              </div>
              <div className="text-2xl font-bold text-primary">Crypto Macro</div>
            </div>
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-secondary hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/calculators" className="text-secondary hover:text-primary transition-colors">
                Calculators
              </Link>
              <Link href="/crypto-macro" className="text-primary font-medium">
                Crypto Macro
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-crypto-foreground">Crypto Macro</h1>
            <p className="mx-auto max-w-2xl text-lg text-crypto-muted-foreground">
              Database status for the Crypto Macro module. This page is server-rendered on every request and
              reads an isolated development database branch. No connection details are exposed here.
            </p>
            <div className="flex justify-center pt-1">
              <Badge ok={allOk} label={allOk ? 'database reachable' : 'database not ready'} />
            </div>
          </div>

          <section className="rounded-2xl border border-crypto-border/60 bg-crypto-background/40 p-6">
            <h2 className="text-xl font-semibold text-crypto-foreground mb-4">Environment</h2>
            <Row label="Environment identifier" value={report.environment ?? 'not set'} />
            <Row label="Pooled variable configured" value={env.pooledConfigured ? 'yes' : 'no'} />
            <Row label="Direct variable configured" value={env.directConfigured ? 'yes' : 'no'} />
            <Row label="Pooled variable uses pooled endpoint" value={env.pooledUsesPooler === null ? 'unknown' : env.pooledUsesPooler ? 'yes' : 'no'} />
            <Row label="Direct variable avoids pooled endpoint" value={env.directUsesPooler === null ? 'unknown' : env.directUsesPooler ? 'no' : 'yes'} />
            <Row label="Both variables address the same branch" value={env.endpointIdsMatch === null ? 'unknown' : env.endpointIdsMatch ? 'yes' : 'no'} />
            <Row label="Database" value={env.database ?? 'unknown'} />
          </section>

          <section className="rounded-2xl border border-crypto-border/60 bg-crypto-background/40 p-6">
            <h2 className="text-xl font-semibold text-crypto-foreground mb-4">Connections</h2>
            {connections.length === 0 ? (
              <p className="text-sm text-crypto-muted-foreground">
                No connection attempted because the environment is not fully configured.
              </p>
            ) : (
              <div className="space-y-4">
                {connections.map((entry) => (
                  <div key={entry.kind} className="rounded-xl border border-crypto-border/50 bg-crypto-background/30 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-sm text-crypto-foreground">
                        {entry.kind === 'pooled' ? 'pooled connection' : 'direct connection'}
                      </span>
                      <Badge ok={entry.ok} label={entry.ok ? 'reachable' : (entry.errorCategory ?? 'failed')} />
                    </div>
                    <div className="mt-3 space-y-1">
                      <Row label="Round trip" value={`${entry.latencyMs} ms`} />
                      <Row label="Reported database" value={entry.database ?? 'n/a'} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-crypto-border/60 bg-crypto-background/40 p-6">
            <h2 className="text-xl font-semibold text-crypto-foreground mb-3">Module status</h2>
            <p className="text-sm text-crypto-muted-foreground">
              The database layer is in place and isolated under the module directory. The analysis schema,
              calculation surface and dashboard have not been defined yet, so this page reports
              infrastructure status only.
            </p>
          </section>

          <div className="text-center">
            <Link
              href="/api/crypto-macro/health?connections=both"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-crypto-border px-5 py-3 text-sm font-medium text-crypto-foreground transition-colors hover:bg-white/5"
            >
              View health endpoint JSON
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
