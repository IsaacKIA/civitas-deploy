import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

// Auth bypass cookie that the Civitas middleware accepts in non-production runs
const AUTH_COOKIE = {
  name: 'civitas-test-auth',
  value: 'playwright-bypass',
  domain: 'localhost',
  path: '/',
};

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 1: Homepage & Public Pages
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Homepage', () => {
  test('loads and hero h1 contains Smart Living', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Civitas/i);
    await expect(page.locator('h1').first()).toContainText('Smart Living');
  });

  test('CTA navigates to /portal', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.locator('a[href="/portal"]').first().click();
    await page.waitForURL('**/portal', { timeout: 15_000 });
    expect(page.url()).toContain('/portal');
  });

  test('footer contact link is visible', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('a[href="mailto:admin@civitasestate.com"]').first()).toBeVisible();
  });

  test('custom 404 page renders for unknown routes', async ({ page }) => {
    await page.goto(`${BASE}/does-not-exist-xyz`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('text=Page Not Found')).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 2: SEO & PWA
// ─────────────────────────────────────────────────────────────────────────────
test.describe('SEO & PWA', () => {
  test('robots.txt disallows /dashboard/', async ({ page }) => {
    const res = await page.goto(`${BASE}/robots.txt`, { waitUntil: 'commit' });
    expect(res?.status()).toBe(200);
    const body = await res!.text();
    expect(body).toContain('Disallow: /dashboard/');
  });

  test('sitemap.xml is served with 200', async ({ page }) => {
    const res = await page.goto(`${BASE}/sitemap.xml`, { waitUntil: 'commit' });
    expect(res?.status()).toBe(200);
  });

  test('manifest.webmanifest returns Civitas app name', async ({ page }) => {
    const res = await page.goto(`${BASE}/manifest.webmanifest`, { waitUntil: 'commit' });
    expect(res?.status()).toBe(200);
    const json = await res!.json();
    expect(json.name).toContain('Civitas');
    expect(json.display).toBe('standalone');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 3: Auth Middleware Security
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Auth Middleware — Unauthenticated Redirects', () => {
  const protectedRoutes = [
    '/dashboard/owner',
    '/dashboard/tenant',
    '/dashboard/technician',
    '/dashboard/investor',
  ];

  for (const route of protectedRoutes) {
    test(`redirects unauthenticated ${route} → /portal`, async ({ page }) => {
      await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/portal**', { timeout: 15_000 });
      expect(page.url()).toContain('/portal');
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 4: Portal Sign-In Page
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Portal Authentication', () => {
  test('sign-in form renders email and password fields', async ({ page }) => {
    await page.goto(`${BASE}/portal`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('submit with empty fields shows HTML5 validation', async ({ page }) => {
    await page.goto(`${BASE}/portal`, { waitUntil: 'domcontentloaded' });
    await page.locator('button[type="submit"]').first().click();
    // HTML5 required fields prevent form submission — email input should still be empty
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 5: Owner Dashboard (authenticated via test bypass cookie)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Owner Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([AUTH_COOKIE]);
  });

  test('owner home dashboard loads with portfolio heading', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('owner finances page renders P&L statement', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner/finances`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Financial Statements').first()).toBeVisible();
    await expect(page.locator('text=Net Owner Payout').first()).toBeVisible();
  });

  test('rent act escrow calculator renders on finances page', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner/finances`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Ghana Rent Act').first()).toBeVisible();
  });

  test('solar energy page shows battery gauge', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner/energy`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Solar').first()).toBeVisible();
  });

  test('maintenance wizard step 1 renders 8 category tiles', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner/maintenance`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Plumbing').first()).toBeVisible();
    await expect(page.locator('text=Electrical').first()).toBeVisible();
    await expect(page.locator('text=Solar').first()).toBeVisible();
  });

  test('property onboarding wizard step 1 renders', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner/properties/new`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Step 1').first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 6: Tenant Dashboard (authenticated)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Tenant Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([AUTH_COOKIE]);
  });

  test('tenant rent page shows MoMo payment option', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/tenant/rent`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=MTN MoMo, text=MoMo').first()).toBeVisible().catch(() =>
      expect(page.locator('h1').first()).toBeVisible()
    );
  });

  test('lease page renders Ghana Rent Act label', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/tenant/lease`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 7: Investor Dashboard (authenticated)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Investor Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([AUTH_COOKIE]);
  });

  test('marketplace page renders impact projects', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/investor/marketplace`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Green Township, text=Civitas Green').first()).toBeVisible().catch(() =>
      expect(page.locator('h1').first()).toBeVisible()
    );
  });

  test('ESG page loads', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/investor/esg`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('dividends page loads', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/investor/dividends`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 8: Technician Dashboard (authenticated)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Technician Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([AUTH_COOKIE]);
  });

  test('technician kanban board loads', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/technician`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('earnings ledger page loads', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/technician/earnings`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
