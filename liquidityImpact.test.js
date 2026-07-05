const { calculateMarketImpact, calculateSlippage } = require('./src/lib/liquidityCalculations');
const { calculateRiskScore, getRiskLabel, getSlippageColor } = require('./src/lib/riskScoring');
const { getWarnings } = require('./src/lib/warnings');

console.log('==================================================');
console.log('LIQUIDITY IMPACT CALCULATOR — TEST SUITE');
console.log('==================================================\n');

let total = 0;
let passed = 0;

function isCloseEnough(a, b, precision = 4) {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < 10 ** -precision;
  if (typeof a === 'object' && typeof b === 'object' && a && b) {
    for (const k of Object.keys(a)) { if (!(k in b) || !isCloseEnough(a[k], b[k], precision)) return false; }
    return true;
  }
  return a === b;
}
function assert(cond, msg) { total++; if (cond) { passed++; console.log(`  ✓ ${msg}`); } else { console.log(`  ✗ ${msg}`); } }
function eq(a, b, msg) {
  total++;
  if (isCloseEnough(a, b)) { passed++; console.log(`  ✓ ${msg}`); }
  else { console.log(`  ✗ ${msg} — expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }
}

// ================================================
console.log('\n--- Market Impact ---\n');

const r1 = calculateMarketImpact({ tradeSize: 5000, volume24h: 100000 });
assert(r1 !== null, 'Valid inputs return result');
eq(r1.impactPercent, 10, '$5k on $100k vol → 10% impact');
eq(r1.ratioPercent, 5, 'Ratio = 5% of volume');

const r2 = calculateMarketImpact({ tradeSize: 100, volume24h: 1000000 });
assert(r2 !== null, 'Small trade returns result');
eq(r2.impactPercent, 0.02, '$100 on $1M vol → 0.02% impact');

assert(calculateMarketImpact({ tradeSize: 0, volume24h: 100 }) === null, 'Zero trade size → null');
assert(calculateMarketImpact({ tradeSize: 100, volume24h: 0 }) === null, 'Zero volume → null');

const r3 = calculateMarketImpact({ tradeSize: 1_000_000, volume24h: 100_000 });
assert(r3 !== null, 'Very large trade returns result');
eq(r3.impactPercent, 100, 'Impact clamped at 100%');
eq(r3.ratioPercent, 1000, 'Ratio = 1000% of volume');

// ================================================
console.log('\n--- Slippage ---\n');

const s1 = calculateSlippage(10);
eq(s1.entrySlippage, 4, '10% impact → entry 4%');
eq(s1.exitSlippage, 6, '10% impact → exit 6%');
eq(s1.totalRoundTrip, 10, '10% impact → round trip 10%');

const s2 = calculateSlippage(0.02);
eq(s2.entrySlippage, 0.01, '0.02% impact → entry 0.01%');
eq(s2.exitSlippage, 0.01, '0.02% impact → exit 0.01%');
eq(s2.totalRoundTrip, 0.02, 'Round trip = 0.02%');

const s3 = calculateSlippage(100);
eq(s3.entrySlippage, 40, '100% impact → entry 40%');
eq(s3.exitSlippage, 60, '100% impact → exit 60%');
eq(s3.totalRoundTrip, 100, 'Round trip = 100%');

// ================================================
console.log('\n--- Risk Score ---\n');

eq(calculateRiskScore(0), 100, '0% ratio → 100');
eq(calculateRiskScore(0.05), 95, '0.05% → 95');
eq(calculateRiskScore(0.1), 80, '0.1% → 80');
eq(calculateRiskScore(0.5), 65, '0.5% → 65');
eq(calculateRiskScore(1), 45, '1% → 45');
eq(calculateRiskScore(5), 25, '5% → 25');
eq(calculateRiskScore(10), 20, '10% → 20');
eq(calculateRiskScore(50), 0, '50% → 0');

// ================================================
console.log('\n--- Risk Labels ---\n');

eq(getRiskLabel(100), 'Excellent', '100 → Excellent');
eq(getRiskLabel(80), 'Excellent', '80 → Excellent');
eq(getRiskLabel(79), 'Good', '79 → Good');
eq(getRiskLabel(60), 'Good', '60 → Good');
eq(getRiskLabel(59), 'Moderate', '59 → Moderate');
eq(getRiskLabel(40), 'Moderate', '40 → Moderate');
eq(getRiskLabel(39), 'Poor', '39 → Poor');
eq(getRiskLabel(20), 'Poor', '20 → Poor');
eq(getRiskLabel(19), 'Dangerous', '19 → Dangerous');
eq(getRiskLabel(0), 'Dangerous', '0 → Dangerous');

// ================================================
console.log('\n--- Warnings ---\n');

assert(getWarnings(0.5).length === 0, '0.5% → no warning');
eq(getWarnings(1).length, 1, '1% → 1 warning');
eq(getWarnings(1)[0].type, 'moderate', '1% → moderate');
eq(getWarnings(5)[0].type, 'high', '5% → high');
eq(getWarnings(10)[0].type, 'extreme', '10% → extreme');
eq(getWarnings(50)[0].type, 'extreme', '50% → extreme');
assert(getWarnings(15).length === 1, '15% → only 1 (extreme, highest severity)');

// ================================================
console.log('\n--- Slippage Color ---\n');

assert(getSlippageColor(0.5).includes('success'), '< 1% → green');
assert(getSlippageColor(1.5).includes('warning'), '1-3% → amber');
assert(getSlippageColor(5).includes('error'), '> 3% → red');

// ================================================
console.log('\n==================================================');
console.log(`Results: ${passed}/${total} tests passed`);
console.log('==================================================');

if (passed === total) { console.log('\n✓ All tests passed!\n'); process.exit(0); }
else { console.log(`\n✗ ${total - passed} test(s) failed\n`); process.exit(1); }
