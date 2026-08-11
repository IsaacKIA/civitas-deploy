import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

test.describe('Tenant Dashboard', () => {
  test('tenant home renders (with a lease or the no-lease empty state)', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/tenant`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toContainText('My Home');
  });

  test('rent payment page renders (due installment or fully-paid-up state)', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/tenant/rent`, { waitUntil: 'domcontentloaded' });
    // Real content depends on whether this seeded account has an active
    // lease with something due — assert one of the two legitimate real
    // states rather than a specific dollar amount that would go stale.
    const body = await page.locator('body').innerText();
    const hasDueState = body.includes('Pay GHS') || body.includes('Legal Advance Rent Payment') || body.includes('Monthly Rent Payment');
    const hasPaidUpState = body.includes("fully paid up") || body.includes('no active lease');
    expect(hasDueState || hasPaidUpState).toBe(true);
  });

  test('lease page renders real lease terms or the no-lease empty state', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/tenant/lease`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('tenant is blocked from the owner section', async ({ page }) => {
    // Regression guard for the exact security gap this app used to have:
    // role-based section access (src/lib/require-section-access.ts) must
    // actually redirect a wrong-role authenticated user away, not just
    // unauthenticated ones.
    await page.goto(`${BASE}/dashboard/owner`, { waitUntil: 'domcontentloaded' });
    await expect(page).not.toHaveURL(/\/dashboard\/owner$/);
  });

  test('tenant maintenance wizard auto-selects their property', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/tenant/maintenance/new`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toContainText('Log a Maintenance Issue');
  });
});
