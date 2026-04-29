/**
 * Comprehensive Test Suite for Shared Calculation Engine
 * Tests all edge cases and validation scenarios
 */

import {
  toNumber,
  percentToDecimal,
  calculateTrade,
  calculateDCA,
  calculateMining,
  calculateStaking,
  calculatePercentageChange
} from './src/lib/calcEngine.js';

console.log('==================================================');
console.log('CALCULATION ENGINE COMPREHENSIVE TEST SUITE');
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
    return keysA.every(key => isCloseEnough(a[key], b[key]));
  }
  return a === b;
}

function test(testName, input, expected) {
  totalTests++;
  const result = input();
  const pass = isCloseEnough(result, expected);
  passedTests += pass ? 1 : 0;
  
  console.log(`${pass ? '✅' : '❌'} ${testName}`);
  if (!pass) {
    console.log(`   Expected: ${JSON.stringify(expected)}`);
    console.log(`   Actual:   ${JSON.stringify(result)}`);
  }
  return pass;
}

// -----------------------------------------------------------------------------
// 🔢 BASE UTILITY FUNCTION TESTS
// -----------------------------------------------------------------------------
console.log('\n📌 UTILITY FUNCTIONS');
console.log('----------------------------------------');

test('toNumber: valid number', () => toNumber(123), 123);
test('toNumber: string number', () => toNumber("123.45"), 123.45);
test('toNumber: invalid string returns 0', () => toNumber("abc"), 0);
test('toNumber: null returns 0', () => toNumber(null), 0);
test('toNumber: undefined returns 0', () => toNumber(undefined), 0);
test('toNumber: NaN returns 0', () => toNumber(NaN), 0);
test('toNumber: Infinity returns 0', () => toNumber(Infinity), 0);

test('percentToDecimal: 0.1% → 0.001', () => percentToDecimal(0.1), 0.001);
test('percentToDecimal: 1% → 0.01', () => percentToDecimal(1), 0.01);
test('percentToDecimal: 100% → 1.0', () => percentToDecimal(100), 1);
test('percentToDecimal: invalid input returns 0', () => percentToDecimal("invalid"), 0);

// -----------------------------------------------------------------------------
// 💹 TRADE / PROFIT LOSS CALCULATOR TESTS
// -----------------------------------------------------------------------------
console.log('\n📌 TRADE CALCULATOR');
console.log('----------------------------------------');

console.log('  🟢 HAPPY PATH');
test('Standard trade profit', 
  () => calculateTrade({ buyPrice: 50000, sellPrice: 60000, quantity: 2, feePercent: 0.1 }),
  { buyValue: 100000, sellValue: 120000, buyFee: 100, sellFee: 120, totalFees: 220, grossProfit: 20000, netProfit: 19780, roi: 19.78 }
);

console.log('\n  🔴 ZERO VALUES');
test('All inputs zero', 
  () => calculateTrade({ buyPrice: 0, sellPrice: 0, quantity: 0, feePercent: 0 }),
  { buyValue: 0, sellValue: 0, buyFee: 0, sellFee: 0, totalFees: 0, grossProfit: 0, netProfit: 0, roi: 0 }
);

console.log('\n  🎟️ NO FEE SCENARIO');
test('Zero fee percent', 
  () => calculateTrade({ buyPrice: 50000, sellPrice: 60000, quantity: 2, feePercent: 0 }),
  { buyValue: 100000, sellValue: 120000, buyFee: 0, sellFee: 0, totalFees: 0, grossProfit: 20000, netProfit: 20000, roi: 20 }
);

console.log('\n  📉 NEGATIVE OUTCOME (LOSS)');
test('Sell price lower than buy price', 
  () => calculateTrade({ buyPrice: 60000, sellPrice: 50000, quantity: 2, feePercent: 0.1 }),
  { buyValue: 120000, sellValue: 100000, buyFee: 120, sellFee: 100, totalFees: 220, grossProfit: -20000, netProfit: -20220, roi: -16.85 }
);

console.log('\n  🛡️ EDGE PROTECTION');
test('Zero buy price (no division by zero)', 
  () => calculateTrade({ buyPrice: 0, sellPrice: 60000, quantity: 2, feePercent: 0.1 }),
  { buyValue: 0, sellValue: 120000, buyFee: 0, sellFee: 120, totalFees: 120, grossProfit: 120000, netProfit: 119880, roi: 0 }
);

console.log('\n  💎 HIGH VALUES');
test('Million dollar trade', 
  () => calculateTrade({ buyPrice: 50000, sellPrice: 60000, quantity: 100, feePercent: 0.1 }),
  { buyValue: 5000000, sellValue: 6000000, buyFee: 5000, sellFee: 6000, totalFees: 11000, grossProfit: 1000000, netProfit: 989000, roi: 19.78 }
);

// -----------------------------------------------------------------------------
// 📊 DCA CALCULATOR TESTS
// -----------------------------------------------------------------------------
console.log('\n📌 DCA CALCULATOR');
console.log('----------------------------------------');

console.log('  🟢 HAPPY PATH');
test('Standard DCA calculation', 
  () => calculateDCA({ monthlyInvestment: 1000, months: 12, avgBuyPrice: 50000, currentPrice: 60000, feePercent: 0.1 }),
  { totalInvestment: 12000, totalFees: 12, netInvestment: 11988, coins: 0.23976, currentValue: 14385.6, profit: 2385.6, roi: 19.88 }
);

console.log('\n  🔴 ZERO VALUES');
test('All inputs zero', 
  () => calculateDCA({ monthlyInvestment: 0, months: 0, avgBuyPrice: 0, currentPrice: 0, feePercent: 0 }),
  { totalInvestment: 0, totalFees: 0, netInvestment: 0, coins: 0, currentValue: 0, profit: 0, roi: 0 }
);

console.log('\n  🎟️ NO FEE SCENARIO');
test('Zero fee percent', 
  () => calculateDCA({ monthlyInvestment: 1000, months: 12, avgBuyPrice: 50000, currentPrice: 60000, feePercent: 0 }),
  { totalInvestment: 12000, totalFees: 0, netInvestment: 12000, coins: 0.24, currentValue: 14400, profit: 2400, roi: 20 }
);

console.log('\n  📉 NEGATIVE OUTCOME (LOSS)');
test('Current price below average buy price', 
  () => calculateDCA({ monthlyInvestment: 1000, months: 12, avgBuyPrice: 60000, currentPrice: 50000, feePercent: 0.1 }),
  { totalInvestment: 12000, totalFees: 12, netInvestment: 11988, coins: 0.1998, currentValue: 9990, profit: -2010, roi: -16.75 }
);

console.log('\n  🛡️ EDGE PROTECTION');
test('Zero average buy price (no division by zero)', 
  () => calculateDCA({ monthlyInvestment: 1000, months: 12, avgBuyPrice: 0, currentPrice: 60000, feePercent: 0.1 }),
  { totalInvestment: 12000, totalFees: 12, netInvestment: 11988, coins: 0, currentValue: 0, profit: -12000, roi: -100 }
);

console.log('\n  💎 HIGH VALUES');
test('Large DCA investment', 
  () => calculateDCA({ monthlyInvestment: 10000, months: 60, avgBuyPrice: 50000, currentPrice: 60000, feePercent: 0.1 }),
  { totalInvestment: 600000, totalFees: 600, netInvestment: 599400, coins: 11.988, currentValue: 719280, profit: 119280, roi: 19.88 }
);

// -----------------------------------------------------------------------------
// ⛏️ MINING CALCULATOR TESTS
// -----------------------------------------------------------------------------
console.log('\n📌 MINING CALCULATOR');
console.log('----------------------------------------');

test('Standard mining calculation',
  () => calculateMining({ hashrate: 100, powerConsumption: 3000, electricityCost: 0.15, poolFeePercent: 1, difficulty: 28000000000000, price: 50000 }),
  { dailyHashrate: 100, dailyReward: 0.00022451526352337435, dailyRevenue: 11.11350554440703, dailyPoolFee: 0.11225763176168718, dailyElectricityCost: 10.799999999999999, dailyTotalCosts: 10.799999999999999, dailyProfit: 0.3135055444070307, monthlyProfit: 9.405166332210921 }
);

test('Zero difficulty input handled safely',
  () => calculateMining({ hashrate: 100, powerConsumption: 3000, electricityCost: 0.15, poolFeePercent: 1, difficulty: 0, price: 50000 }),
  { dailyHashrate: 100, dailyReward: 0, dailyRevenue: 0, dailyPoolFee: 0, dailyElectricityCost: 10.799999999999999, dailyTotalCosts: 10.799999999999999, dailyProfit: -10.799999999999999, monthlyProfit: -323.99999999999994 }
);

// -----------------------------------------------------------------------------
// 💰 STAKING CALCULATOR TESTS
// -----------------------------------------------------------------------------
console.log('\n📌 STAKING CALCULATOR');
console.log('----------------------------------------');

test('Standard staking calculation',
  () => calculateStaking({ amount: 10000, stakingRatePercent: 5, durationDays: 365, compoundFrequency: 'yearly' }),
  { finalAmount: 10500, totalRewards: 500 }
);

test('Daily compounding',
  () => calculateStaking({ amount: 10000, stakingRatePercent: 5, durationDays: 365, compoundFrequency: 'daily' }),
  { finalAmount: 10512.674964674133, totalRewards: 512.6749646741333 }
);

// -----------------------------------------------------------------------------
// 📈 PERCENTAGE CHANGE TESTS
// -----------------------------------------------------------------------------
console.log('\n📌 PERCENTAGE CHANGE');
console.log('----------------------------------------');

test('Positive change', () => calculatePercentageChange(100, 150), 50);
test('Negative change', () => calculatePercentageChange(100, 75), -25);
test('Zero old value returns 0', () => calculatePercentageChange(0, 100), 0);

// -----------------------------------------------------------------------------
// ✅ TEST SUMMARY
// -----------------------------------------------------------------------------
console.log('\n==================================================');
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} PASSED`);
console.log('==================================================');

if (passedTests === totalTests) {
  console.log('\n🎉 ALL TESTS PASSED! Calculation engine is working correctly.');
} else {
  console.log(`\n⚠️  ${totalTests - passedTests} TESTS FAILED`);
}