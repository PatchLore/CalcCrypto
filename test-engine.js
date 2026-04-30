/**
 * Test script to verify calculation engine works correctly
 */

import { calculateTrade, calculateDCA } from './src/lib/calcEngine.js';

console.log('=== CALCULATION ENGINE TESTS ===\n');

// TEST CASE 1: TRADE CALCULATION
console.log('TEST 1: Trade Calculation');
console.log('Input: buyPrice=50000, sellPrice=60000, quantity=2, fee=0.1%');
const tradeResult = calculateTrade({
  buyPrice: 50000,
  sellPrice: 60000,
  quantity: 2,
  feePercent: 0.1
});
console.log('Expected: totalFees=220, netProfit=19780');
console.log('Actual:   totalFees=' + tradeResult.totalFees + ', netProfit=' + tradeResult.netProfit);
console.log('✓ PASS:', tradeResult.totalFees === 220 && tradeResult.netProfit === 19780 ? 'YES' : 'NO');
console.log('');

// TEST CASE 2: DCA CALCULATION
console.log('TEST 2: DCA Calculation');
console.log('Input: monthly=1000, months=12, avg=50000, current=60000, fee=0.1%');
const dcaResult = calculateDCA({
  monthlyInvestment: 1000,
  months: 12,
  avgBuyPrice: 50000,
  currentPrice: 60000,
  feePercent: 0.1
});
console.log('Expected: totalFees=12, profit=2385.60');
console.log('Actual:   totalFees=' + dcaResult.totalFees + ', profit=' + dcaResult.profit.toFixed(2));
console.log('✓ PASS:', dcaResult.totalFees === 12 && dcaResult.profit === 2385.6 ? 'YES' : 'NO');
console.log('');

console.log('=== TEST COMPLETE ===');