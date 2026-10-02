import { assertDevelopmentDatabase } from '../../src/lib/crypto-macro/db/production-guard';
import { queryDirect } from '../../src/lib/crypto-macro/db/client';
(async () => {
  assertDevelopmentDatabase();
  const rows = await queryDirect('SELECT email, consent_at, consent_version, signup_source FROM crypto_macro_waitlist ORDER BY consent_at DESC', [], { readOnly: true });
  process.stdout.write(JSON.stringify(rows, null, 2));
})();
