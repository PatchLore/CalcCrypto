import { test, expect } from '@playwright/test';

test.describe('Trade Decision Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trade-decision-flow');
    await expect(page.getByRole('heading', { name: /Trade Decision Flow/i })).toBeVisible();
  });

  test('loads the page with step 1 active', async ({ page }) => {
    await expect(page.getByText('Step 1: Token Overview')).toBeVisible();
    await expect(page.getByRole('button', { name: /Next.*Position Sizing/i })).toBeDisabled();
  });

  test('step 1 advances to step 2 when token data is filled', async ({ page }) => {
    await page.getByPlaceholder(/e\.?g\.? BTC/).fill('BTC');
    await page.getByRole('spinbutton', { name: /token price/i }).fill('50000');
    await page.getByRole('spinbutton', { name: /24h volume/i }).fill('5000000');
    await page.getByRole('button', { name: /Next.*Position Sizing/i }).click();
    await expect(page.getByText('Step 2: Position Sizing')).toBeVisible();
  });

  test('step 1 cannot proceed without price and volume', async ({ page }) => {
    await page.getByPlaceholder(/e\.?g\.? BTC/).fill('BTC');
    await expect(page.getByRole('button', { name: /Next.*Position Sizing/i })).toBeDisabled();
  });

  test('full flow renders verdict with score and export buttons', async ({ page }) => {
    // Step 1
    await page.getByPlaceholder(/e\.?g\.? BTC/).fill('BTC');
    await page.getByRole('spinbutton', { name: /token price/i }).fill('50000');
    await page.getByRole('spinbutton', { name: /24h volume/i }).fill('5000000');
    await page.getByRole('button', { name: /Next.*Position Sizing/i }).click();

    // Step 2
    await expect(page.getByText('Step 2: Position Sizing')).toBeVisible();
    await page.getByRole('spinbutton', { name: /account size/i }).fill('10000');
    await page.getByRole('spinbutton', { name: /risk per trade/i }).fill('1');
    await page.getByRole('spinbutton', { name: /entry price/i }).fill('50000');
    await page.getByPlaceholder('e.g. 45000').fill('45000');
    await page.getByRole('button', { name: /Next.*Liquidity Check/i }).click();

    // Step 3
    await expect(page.getByText('Step 3: Liquidity Check')).toBeVisible();
    await expect(page.getByText(/Liquidity Score/).first()).toBeVisible();
    await page.getByRole('button', { name: /Next.*Trade Verdict/i }).click();

    // Step 4
    await expect(page.getByText('Step 4: Trade Feasibility Summary')).toBeVisible();
    await expect(page.getByText(/Trade Score/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy to Clipboard/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Download .txt/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Print/ })).toBeVisible();
  });

  test('copies export text to clipboard', async ({ page }) => {
    await page.getByPlaceholder(/e\.?g\.? BTC/).fill('BTC');
    await page.getByRole('spinbutton', { name: /token price/i }).fill('50000');
    await page.getByRole('spinbutton', { name: /24h volume/i }).fill('5000000');
    await page.getByRole('button', { name: /Next.*Position Sizing/i }).click();

    await page.getByRole('spinbutton', { name: /account size/i }).fill('10000');
    await page.getByRole('spinbutton', { name: /risk per trade/i }).fill('1');
    await page.getByRole('spinbutton', { name: /entry price/i }).fill('50000');
    await page.getByPlaceholder('e.g. 45000').fill('45000');
    await page.getByRole('button', { name: /Next.*Liquidity Check/i }).click();

    await page.getByRole('button', { name: /Next.*Trade Verdict/i }).click();

    await expect(page.getByText('Step 4: Trade Feasibility Summary')).toBeVisible();

    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: /Copy to Clipboard/ }).click();

    await expect(page.getByRole('button', { name: /✓ Copied/ })).toBeVisible();

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('TRADE PLAN SUMMARY');
    expect(clipboard).toContain('Final Score: ');
    expect(clipboard).toContain('Token: BTC');
  });

  test('downloads .txt file', async ({ page }) => {
    await page.getByPlaceholder(/e\.?g\.? BTC/).fill('BTC');
    await page.getByRole('spinbutton', { name: /token price/i }).fill('50000');
    await page.getByRole('spinbutton', { name: /24h volume/i }).fill('5000000');
    await page.getByRole('button', { name: /Next.*Position Sizing/i }).click();

    await page.getByRole('spinbutton', { name: /account size/i }).fill('10000');
    await page.getByRole('spinbutton', { name: /risk per trade/i }).fill('1');
    await page.getByRole('spinbutton', { name: /entry price/i }).fill('50000');
    await page.getByPlaceholder('e.g. 45000').fill('45000');
    await page.getByRole('button', { name: /Next.*Liquidity Check/i }).click();

    await page.getByRole('button', { name: /Next.*Trade Verdict/i }).click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /Download .txt/ }).click(),
    ]);

    expect(download.suggestedFilename()).toBe('trade-plan.txt');
  });

  test('sticky summary panel shows live data', async ({ page }) => {
    await page.getByPlaceholder(/e\.?g\.? BTC/).fill('SOL');
    await page.getByRole('spinbutton', { name: /token price/i }).fill('150');
    await page.getByRole('spinbutton', { name: /24h volume/i }).fill('2000000');

    await expect(page.getByPlaceholder(/e\.?g\.? BTC/)).toHaveValue('SOL');
    await page.getByRole('button', { name: /Next.*Position Sizing/i }).click();

    await page.getByRole('spinbutton', { name: /account size/i }).fill('5000');
    await page.getByRole('spinbutton', { name: /risk per trade/i }).fill('2');
    await page.getByRole('spinbutton', { name: /entry price/i }).fill('150');
    await page.getByPlaceholder('e.g. 45000').fill('140');

    await expect(page.getByText(/Trade Value/).first()).toBeVisible();
  });
});
