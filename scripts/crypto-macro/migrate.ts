import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { queryDirect } from '../../src/lib/crypto-macro/db/client';
import { assertDevelopmentDatabase } from '../../src/lib/crypto-macro/db/production-guard';
export function splitMigrationStatements(sql: string): string[] {
  const statements: string[] = [];
  let start = 0;
  let quoted = false;
  for (let index = 0; index < sql.length; index += 1) {
    const char = sql[index];
    if (char === "'" && sql[index + 1] === "'") { index += 1; continue; }
    if (char === "'") { quoted = !quoted; continue; }
    if (char === ';' && !quoted) {
      const statement = sql.slice(start, index).trim();
      if (statement) statements.push(statement);
      start = index + 1;
    }
  }
  const finalStatement = sql.slice(start).trim();
  if (finalStatement) statements.push(finalStatement);
  return statements;
}
(async () => {
  assertDevelopmentDatabase();
  const sql = await readFile(path.join(process.cwd(), 'src/lib/crypto-macro/db/migrations/001_crypto_macro.sql'), 'utf8');
  for (const statement of splitMigrationStatements(sql)) await queryDirect(statement, [], { readOnly: false });
  console.log('Crypto Macro development migration applied.');
})();
