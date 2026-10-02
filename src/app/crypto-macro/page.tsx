import Dashboard from '@/components/crypto-macro/Dashboard';
import { getSnapshot } from '@/lib/crypto-macro/data/snapshot';
export const dynamic = 'force-dynamic';
export default async function CryptoMacroPage() { return <Dashboard snapshot={await getSnapshot()} />; }
