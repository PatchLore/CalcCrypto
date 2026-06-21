/**
 * Position Size Calculator Tests
 * Custom Node runner following calcEngine.test.js pattern
 */

const {
  calculatePositionSize,
  validatePositionSizeInputs,
  parsePositionSizeInputs,
  formatTokenAmount,
  getAllocationCategory,
} = require('./src/lib/positionSize');

console.log('==================================================');
console.log('POSITION SIZE CALCULATOR TEST SUITE');
console.log('==================================================\n');

let totalTests = 0;
let passedTests = 0;

function isCloseEnough(a, b, precision = 8) {
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < Math.pow(10, -precision);
  }
  if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!(key in b)) return false;
      if (!isCloseEnough(a[key], b[key], precision)) return false;
    }
    return true;
  }
  return a === b;
}

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    console.log(`  ✗ ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  totalTests++;
  if (isCloseEnough(actual, expected)) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    console.log(`  ✗ ${message} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// ================================================
// Section 1: Validation
// ================================================
console.log('\n--- Validation Tests ---\n');

const validInput = { accountSize: 1000, riskPercentage: 2, entryPrice: 0.10, stopLossPrice: 0.09 };

assertEqual(validatePositionSizeInputs(validInput).valid, true, 'Valid inputs pass validation');
assertEqual(validatePositionSizeInputs({ ...validInput, accountSize: 0 }).valid, false, 'Zero account size fails');
assertEqual(validatePositionSizeInputs({ ...validInput, accountSize: -500 }).valid, false, 'Negative account size fails');
assertEqual(validatePositionSizeInputs({ ...validInput, riskPercentage: 0 }).valid, false, 'Zero risk percentage fails');
assertEqual(validatePositionSizeInputs({ ...validInput, riskPercentage: 150 }).valid, false, 'Risk over 100% fails');
assertEqual(validatePositionSizeInputs({ ...validInput, entryPrice: 0 }).valid, false, 'Zero entry price fails');
assertEqual(validatePositionSizeInputs({ ...validInput, stopLossPrice: 0 }).valid, false, 'Zero stop loss fails');
assertEqual(validatePositionSizeInputs({ ...validInput, entryPrice: 0.10, stopLossPrice: 0.10 }).valid, false, 'Entry equals stop loss fails');
assertEqual(validatePositionSizeInputs({ ...validInput, entryPrice: 0.09, stopLossPrice: 0.10 }).valid, false, 'Entry below stop loss fails');

const errors = validatePositionSizeInputs({ accountSize: 0, riskPercentage: 0, entryPrice: 0, stopLossPrice: 0 }).errors;
assert(errors.length === 4, 'Returns 4 errors when all inputs are zero');
assert(errors.some(e => e.field === 'accountSize'), 'Includes accountSize error');
assert(errors.some(e => e.field === 'riskPercentage'), 'Includes riskPercentage error');
assert(errors.some(e => e.field === 'entryPrice'), 'Includes entryPrice error');
assert(errors.some(e => e.field === 'stopLossPrice'), 'Includes stopLossPrice error');

// ================================================
// Section 2: Calculation Logic
// ================================================
console.log('\n--- Calculation Tests ---\n');

const calc1 = calculatePositionSize({ accountSize: 1000, riskPercentage: 2, entryPrice: 0.10, stopLossPrice: 0.09 });
assert(calc1 !== null, 'Standard calculation returns a result');
assertEqual(calc1.riskAmount, 20, 'Risk Amount = 1000 × 2% = $20');
assertEqual(calc1.positionSize, 2000, 'Position Size = 20 / 0.01 = 2000 tokens');
assertEqual(calc1.capitalRequired, 200, 'Capital Required = 2000 × 0.10 = $200');
assertEqual(calc1.stopDistancePercent, 10, 'Stop Distance = (0.10 - 0.09) / 0.10 × 100 = 10%');

const calc2 = calculatePositionSize({ accountSize: 50000, riskPercentage: 1, entryPrice: 50000, stopLossPrice: 48000 });
assert(calc2 !== null, 'BTC-size calculation returns a result');
assertEqual(calc2.riskAmount, 500, 'Risk Amount = 50000 × 1% = $500');
assertEqual(calc2.positionSize, 0.25, 'Position Size = 500 / 2000 = 0.25 BTC');
assertEqual(calc2.capitalRequired, 12500, 'Capital Required = 0.25 × 50000 = $12,500');
assertEqual(calc2.stopDistancePercent, 4, 'Stop Distance = 2000 / 50000 × 100 = 4%');

// Tight stop = larger position
const calc3 = calculatePositionSize({ accountSize: 10000, riskPercentage: 1, entryPrice: 20, stopLossPrice: 19 });
assert(calc3 !== null, 'Tight stop returns result');
assertEqual(calc3.positionSize, 100, 'Tight stop: position = 100 tokens');

// Wide stop = smaller position
const calc4 = calculatePositionSize({ accountSize: 10000, riskPercentage: 1, entryPrice: 20, stopLossPrice: 10 });
assert(calc4 !== null, 'Wide stop returns result');
assertEqual(calc4.positionSize, 10, 'Wide stop: position = 10 tokens');

// Invalid inputs return null
assert(calculatePositionSize({ accountSize: 0, riskPercentage: 1, entryPrice: 10, stopLossPrice: 9 }) === null, 'Zero account returns null');
assert(calculatePositionSize({ accountSize: 1000, riskPercentage: 0, entryPrice: 10, stopLossPrice: 9 }) === null, 'Zero risk returns null');
assert(calculatePositionSize({ accountSize: 1000, riskPercentage: 1, entryPrice: 10, stopLossPrice: 10 }) === null, 'Entry=stop returns null');

// ================================================
// Section 3: Crypto edge cases
// ================================================
console.log('\n--- Crypto Edge Cases ---\n');

const calc5 = calculatePositionSize({ accountSize: 5000, riskPercentage: 1, entryPrice: 0.000001, stopLossPrice: 0.0000008 });
assert(calc5 !== null, 'Low-value token returns result');
assertEqual(calc5.riskAmount, 50, 'Risk Amount = $50');
assertEqual(calc5.positionSize, 250000000, 'Position = 250M tokens');
assertEqual(calc5.stopDistancePercent, 20, 'Stop Distance = 20%');

const calc6 = calculatePositionSize({ accountSize: 100000, riskPercentage: 0.5, entryPrice: 75000, stopLossPrice: 72000 });
assert(calc6 !== null, 'High-value asset returns result');
assertEqual(calc6.riskAmount, 500, 'Risk Amount = $500');
assertEqual(calc6.positionSize, 0.16666667, 'Position = 0.1667 BTC');

const calc7 = calculatePositionSize({ accountSize: 100, riskPercentage: 1, entryPrice: 1.50, stopLossPrice: 1.49 });
assert(calc7 !== null, 'Small account returns result');
assertEqual(calc7.positionSize, 100, 'Position = 100 tokens');

// ================================================
// Section 4: parsePositionSizeInputs
// ================================================
console.log('\n--- Parse Inputs Tests ---\n');

const parsed = parsePositionSizeInputs({ accountSize: '1000', riskPercentage: '2', entryPrice: '0.10', stopLossPrice: '0.09' });
assertEqual(parsed.accountSize, 1000, 'Parsed accountSize');
assertEqual(parsed.riskPercentage, 2, 'Parsed riskPercentage');
assertEqual(parsed.entryPrice, 0.1, 'Parsed entryPrice');
assertEqual(parsed.stopLossPrice, 0.09, 'Parsed stopLossPrice');

assertEqual(parsePositionSizeInputs({ accountSize: '', riskPercentage: '', entryPrice: '', stopLossPrice: '' }).accountSize, 0, 'Empty strings parse to 0');

// ================================================
// Section 5: formatTokenAmount
// ================================================
console.log('\n--- Format Token Amount Tests ---\n');

assertEqual(formatTokenAmount(2000), '2,000', 'Formats 2000 with commas, no trailing zeros');
assertEqual(formatTokenAmount(0.5), '0.5', 'Formats 0.5 without trailing zeros');
assertEqual(formatTokenAmount(0.55978504), '0.559785', 'Truncates to 6 decimal places');
assertEqual(formatTokenAmount(0.00076195), '0.000762', 'Rounds to 6 decimal places');
assertEqual(formatTokenAmount(0.000001), '1.0000e-6', 'Formats very small amount as exponential');

// ================================================
// Section 6: getAllocationCategory
// ================================================
console.log('\n--- Allocation Category Tests ---\n');

assertEqual(getAllocationCategory(5).label, 'Conservative Allocation', '< 10% is Conservative');
assertEqual(getAllocationCategory(9.9).label, 'Conservative Allocation', '9.9% is Conservative');
assertEqual(getAllocationCategory(10).label, 'Moderate Allocation', '10% is Moderate');
assertEqual(getAllocationCategory(24.9).label, 'Moderate Allocation', '24.9% is Moderate');
assertEqual(getAllocationCategory(25).label, 'Large Allocation', '25% is Large');
assertEqual(getAllocationCategory(49.9).label, 'Large Allocation', '49.9% is Large');
assertEqual(getAllocationCategory(50).label, 'Very Large Allocation', '50% is Very Large');
assertEqual(getAllocationCategory(75).label, 'Very Large Allocation', '75% is Very Large');
assert(getAllocationCategory(75).description !== undefined, 'Very Large Allocation has description');

// ================================================
// Summary
// ================================================
console.log('\n==================================================');
console.log(`Results: ${passedTests}/${totalTests} tests passed`);
console.log('==================================================');

if (passedTests === totalTests) {
  console.log('\n✓ All tests passed!\n');
  process.exit(0);
} else {
  console.log(`\n✗ ${totalTests - passedTests} test(s) failed\n`);
  process.exit(1);
}
