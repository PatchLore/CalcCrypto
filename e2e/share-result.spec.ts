import { test, expect } from '@playwright/test';

test('share result captures image with watermark', async ({ page }) => {
  await page.goto('/calculators/profit-loss');
  await page.getByLabel('Buy Price (USD)').fill('100');
  await page.getByLabel('Sell Price (USD)').fill('150');
  await page.getByLabel('Quantity').fill('10');
  await page.getByRole('button', { name: 'Calculate Profit/Loss' }).click();

  await expect(page.getByRole('region', { name: 'Profit/Loss calculation results' })).toBeVisible();

  await page.getByRole('button', { name: 'Share Profit/Loss result as image' }).click();

  // Download link with data URL should appear
  const download = page.getByRole('button', { name: 'Download Image' });
  await expect(download).toBeVisible({ timeout: 15000 });
  const href = await page.locator('a[download]').first().getAttribute('href');
  expect(href).toMatch(/^data:image\/png;base64,/);

  // Watermark badge must have been removed from the live DOM after capture
  await expect(page.locator('[data-share-watermark]')).toHaveCount(0);

  // Displayed values unchanged by capture
  await expect(page.getByRole('region', { name: 'Profit/Loss calculation results' })).toContainText('$500.00');

  // X share: auto-downloads the PNG, shows a toast, and opens x.com intent in a new tab
  const [downloadEvent, popup] = await Promise.all([
    page.waitForEvent('download'),
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'Share to X / Twitter' }).click(),
  ]);
  expect(downloadEvent.suggestedFilename()).toMatch(/^calccrypto-.*-result\.png$/);
  await expect(page.getByRole('status')).toHaveText('Image downloaded. Paste it when X opens.');
  expect(popup.url()).toContain('https://x.com/intent/post?');
  expect(popup.url()).toContain(`url=${encodeURIComponent('https://www.calccrypto.com/calculators/profit-loss')}`);
});
