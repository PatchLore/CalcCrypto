import { test, expect } from '@playwright/test';
test.describe('Crypto Macro isolated feature', () => {
  test.beforeEach(async ({ page }) => { await page.addInitScript(() => { /* fixture mode is server-side; this keeps browser tests deterministic */ }); });
  test('dashboard presents the macro alignment product', async ({ page }) => { await page.goto('/crypto-macro'); await expect(page.getByRole('heading', { name: /See the market relationships/i })).toBeVisible(); await expect(page.getByText(/Macro Alignment/i)).toBeVisible(); await expect(page.getByText(/Statistical observations/i)).toBeVisible(); });
  test('methodology explains the calculations', async ({ page }) => { await page.goto('/crypto-macro/methodology'); await expect(page.getByRole('heading', { name: /How Crypto Macro calculates/i })).toBeVisible(); await expect(page.getByText(/Correlation does not imply causation/i).first()).toBeVisible(); });
  test('waitlist consent gate is explicit', async ({ page }) => { await page.goto('/crypto-macro'); const button = page.getByRole('button', { name: /Join waitlist/i }); await expect(button).toBeDisabled(); await page.getByRole('checkbox').check(); await expect(button).toBeEnabled(); });
  test('calculators remain reachable', async ({ page }) => { await page.goto('/calculators'); await expect(page.getByRole('heading', { name: /calculators/i })).toBeVisible(); });
});
