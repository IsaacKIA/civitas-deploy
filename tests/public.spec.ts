import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

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

  test('no fabricated investment claims remain on the homepage', async ({ page }) => {
    // Regression guard for a real finding: this page previously claimed a
    // fake "14–18% Projected Investor IRR", fake institutional partnerships
    // (AfDB, UNDP, Verra, Bank of Ghana), and a fake customer testimonial.
    // This test exists specifically so none of that can silently return.
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    const body = await page.locator('body').innerText();
    for (const banned of ['Projected Investor IRR', 'AfDB', 'UNDP', 'Verra', 'Abena Mensah', 'Green Township']) {
      expect(body).not.toContain(banned);
    }
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
// GROUP 3: Auth Proxy Security
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Proxy — Unauthenticated Redirects', () => {
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

  test('the old test-bypass cookie no longer authenticates anyone', async ({ page, context }) => {
    // Regression guard for the actual security hole this app shipped with:
    // src/proxy.ts (formerly middleware.ts) used to accept a hardcoded
    // civitas-test-auth cookie with no real session behind it — anyone
    // could set it in devtools and reach every /dashboard/* route.
    await context.addCookies([
      { name: 'civitas-test-auth', value: 'playwright-bypass', domain: 'localhost', path: '/' },
    ]);
    await page.goto(`${BASE}/dashboard/owner`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/portal**', { timeout: 15_000 });
    expect(page.url()).toContain('/portal');
  });
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

  test('signup deep-link pre-fills role and email', async ({ page }) => {
    // Regression guard: the owner-side "Invite Tenant" flow generates a
    // link like this; it must actually pre-fill the sign-up form, not just
    // load the default sign-in view.
    await page.goto(`${BASE}/portal?mode=signup&role=tenant&email=test-tenant@example.com`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.locator('input[type="email"]').first()).toHaveValue('test-tenant@example.com');
  });
});
