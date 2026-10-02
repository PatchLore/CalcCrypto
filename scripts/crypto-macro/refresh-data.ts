import { assertDevelopmentDatabase } from '../../src/lib/crypto-macro/db/production-guard';
import { refreshEnabledSources } from '../../src/lib/crypto-macro/data/refresh';
(async () => {
  assertDevelopmentDatabase();
  const result = await refreshEnabledSources();
  console.log(JSON.stringify({ refreshed: result.refreshed.map(item => ({ id: item.id, count: item.points.length })), unavailable: result.unavailable }));
})();
