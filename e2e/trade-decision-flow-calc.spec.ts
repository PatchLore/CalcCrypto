import { test, expect } from '@playwright/test';

test.describe('Trade Decision Flow — calculation accuracy', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trade-decision-flow');
  });

  test('position size, liquidity, slippage, and final score are arithmetically correct', async ({ page }) => {
    // Step 1
    await page.getByPlaceholder(/e\.?g\.? BTC/).fill('BTC');
    await page.getByRole('spinbutton', { name: /token price/i }).fill('50000');
    await page.getByRole('spinbutton', { name: /24h volume/i }).fill('5000000');
    await page.getByRole('button', { name: /Next.*Position Sizing/i }).click();

    // Step 2: accountSize=10000, risk%=1, entry=50000, stop=45000
    // riskAmount=100, positionSize=100/5000=0.02, capitalRequired=1000, stopDist%=10%
    await page.getByRole('spinbutton', { name: /account size/i }).fill('10000');
    await page.getByRole('spinbutton', { name: /risk per trade/i }).fill('1');
    await page.getByRole('spinbutton', { name: /entry price/i }).fill('50000');
    await page.getByPlaceholder('e.g. 45000').fill('45000');
    await page.getByRole('button', { name: /Next.*Liquidity Check/i }).click();

    // Step 3: ratio%=0.02%, impact%=0.04%, score=95 (0.02% < 0.1% threshold)
    await expect(page.getByText('Step 3: Liquidity Check')).toBeVisible();
    await page.getByRole('button', { name: /Next.*Trade Verdict/i }).click();

    // Step 4: final score = risk(40) + liquidity(95/100*40=38) + slippage(20) = 98
    await expect(page.getByText('Step 4: Trade Feasibility Summary')).toBeVisible();

    // Verify via clipboard
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: /Copy to Clipboard/ }).click();
    await page.getByRole('button', { name: /✓ Copied/ }).waitFor({ state: 'visible', timeout: 3000 });

    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('Token: BTC');
    expect(text).toContain('Position Size: 0.020000 BTC');
    expect(text).toContain('Risk: $100');
    expect(text).toContain('Trade Value: $1,000');
    expect(text).toContain('Liquidity Score: 95/100');
    expect(text).toContain('Estimated Slippage (Round Trip): 0.04%');
    expect(text).toContain('Market Impact: 0.04%');
    expect(text).toContain('Final Score: 98/100');
  });

  test('handles high-risk trade correctly', async ({ page }) => {
    // Step 1: price=10, volume=50000
    await page.getByPlaceholder(/e\.?g\.? BTC/).fill('BTC');
    await page.getByRole('spinbutton', { name: /token price/i }).fill('10');
    await page.getByRole('spinbutton', { name: /24h volume/i }).fill('50000');
    await page.getByRole('button', { name: /Next.*Position Sizing/i }).click();

    // Step 2: account=5000, risk%=15, entry=10, stop=8
    // riskAmount=750, posSize=375, capitalRequired=3750
    await page.getByRole('spinbutton', { name: /account size/i }).fill('5000');
    await page.getByRole('spinbutton', { name: /risk per trade/i }).fill('15');
    await page.getByRole('spinbutton', { name: /entry price/i }).fill('10');
    await page.getByPlaceholder('e.g. 45000').fill('8');
    await page.getByRole('button', { name: /Next.*Liquidity Check/i }).click();

    // Step 3: ratio%=7.5%, impact%=15%, score=25 (7.5% < 10% threshold)
    await expect(page.getByText('Step 3: Liquidity Check')).toBeVisible();
    await page.getByRole('button', { name: /Next.*Trade Verdict/i }).click();

    // Step 4: final = risk(0) + liquidity(25/100*40=10) + slippage(0) = 10
    await expect(page.getByText('Step 4: Trade Feasibility Summary')).toBeVisible();

    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: /Copy to Clipboard/ }).click();

    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('Liquidity Score: 25/100');
    expect(text).toContain('Final Score: 10/100');
    expect(text).toContain('Position Size: 375.000000 BTC');
    expect(text).toContain('Risk: $750');
    expect(text).toContain('Trade Value: $3,750');
    expect(text).toContain('Verdict: Trade carries significant risk');
  });

  test('no token ticker uses fallback label', async ({ page }) => {
    await page.getByRole('spinbutton', { name: /token price/i }).fill('1');
    await page.getByRole('spinbutton', { name: /24h volume/i }).fill('100000');
    await page.getByRole('button', { name: /Next.*Position Sizing/i }).click();

    await page.getByRole('spinbutton', { name: /account size/i }).fill('1000');
    await page.getByRole('spinbutton', { name: /risk per trade/i }).fill('1');
    await page.getByRole('spinbutton', { name: /entry price/i }).fill('1');
    await page.getByPlaceholder('e.g. 45000').fill('0.9');
    await page.getByRole('button', { name: /Next.*Liquidity Check/i }).click();
    await page.getByRole('button', { name: /Next.*Trade Verdict/i }).click();

    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: /Copy to Clipboard/ }).click();

    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('Token: Token');
  });
});
