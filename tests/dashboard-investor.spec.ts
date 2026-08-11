import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

test.describe('Investor Dashboard', () => {
  test('investor home is honest that no investment product exists yet', async ({ page }) => {
    // Regression guard for the most severe finding in this whole project:
    // this page used to let a signed-in user "commit" fake investment
    // amounts into fabricated projects with a fabricated guaranteed IRR.
    // It must never show investment content again without a real product
    // behind it.
    await page.goto(`${BASE}/dashboard/investor`, { waitUntil: 'domcontentloaded' });
    const body = await page.locator('body').innerText();
    expect(body).toContain("isn't open on Civitas yet");
    for (const banned of ['IRR', 'Green Township', 'Invest →']) {
      expect(body).not.toContain(banned);
    }
  });

  test('marketplace page has no investable projects or commit flow', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/investor/marketplace`, { waitUntil: 'domcontentloaded' });
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('Invest →');
    expect(body).not.toContain('IRR');
  });

  test('ESG page loads without fabricated certification claims', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/investor/esg`, { waitUntil: 'domcontentloaded' });
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('Verra');
  });

  test('dividends page loads', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/investor/dividends`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('documents page exists (previously a dead nav link with no page.tsx at all)', async ({ page }) => {
    const res = await page.goto(`${BASE}/dashboard/investor/documents`, { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(200);
  });

  test('investor is blocked from the owner section', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner`, { waitUntil: 'domcontentloaded' });
    await expect(page).not.toHaveURL(/\/dashboard\/owner$/);
  });
});
