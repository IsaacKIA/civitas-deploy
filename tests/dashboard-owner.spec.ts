import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

test.describe('Owner Dashboard', () => {
  test('owner home dashboard loads with a real heading', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toContainText('Owner Dashboard');
  });

  test('finances page shows the escrow ledger section', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner/finances`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Escrow & Rent Schedule').first()).toBeVisible();
    await expect(page.locator('text=Ghana Rent Act').first()).toBeVisible();
  });

  test('maintenance list page loads with a Log New Issue action', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner/maintenance`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Log New Issue').first()).toBeVisible();
  });

  test('new maintenance request wizard renders real categories', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner/maintenance/new`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Plumbing').first()).toBeVisible();
    await expect(page.locator('text=Electrical').first()).toBeVisible();
  });

  test('property onboarding wizard renders the details step', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner/properties/new`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('documents page shows the upload action', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner/documents`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Upload Document').first()).toBeVisible();
  });
});
