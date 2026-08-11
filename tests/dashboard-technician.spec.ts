import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

test.describe('Technician Dashboard', () => {
  test('technician home renders My Jobs', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/technician`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toContainText('My Jobs');
  });

  test('earnings page is honest about no compensation model existing', async ({ page }) => {
    // Regression guard: this page used to show a fabricated GHS payout
    // total with no real compensation model behind it. It should say so
    // plainly instead.
    await page.goto(`${BASE}/dashboard/technician/earnings`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=aren\u2019t set up yet').first()).toBeVisible();
  });

  test('profile page shows the real signed-in account, not a hardcoded name', async ({ page }) => {
    // Regression guard: this page used to hardcode "Kofi Acheampong" for
    // every technician regardless of who was actually signed in.
    await page.goto(`${BASE}/dashboard/technician/profile`, { waitUntil: 'domcontentloaded' });
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('Kofi Acheampong');
  });

  test('history page loads', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/technician/history`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toContainText('Job History');
  });

  test('technician is blocked from the owner section', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner`, { waitUntil: 'domcontentloaded' });
    await expect(page).not.toHaveURL(/\/dashboard\/owner$/);
  });
});
