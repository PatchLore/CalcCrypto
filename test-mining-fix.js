import { calculateMining } from './src/lib/calcEngine.js';

console.log('✅ 100 TH/s Mining Results:');
const result = calculateMining({
  hashrate: 100,
  powerConsumption: 3000,
  electricityCost: 0.15,
  poolFeePercent: 1,
  difficulty: 85e12,
  price: 60000
});

console.log('   Daily Revenue:       $' + result.dailyRevenue.toFixed(2));
console.log('   Daily Electricity:   $' + result.dailyElectricityCost.toFixed(2));
console.log('   Daily Pool Fee:      $' + result.dailyPoolFee.toFixed(2));
console.log('   ------------------------------');
console.log('   Daily Total Costs:   $' + result.dailyTotalCosts.toFixed(2));
console.log('   Daily Profit:        $' + result.dailyProfit.toFixed(2));
console.log('   Monthly Profit:      $' + result.monthlyProfit.toFixed(2));