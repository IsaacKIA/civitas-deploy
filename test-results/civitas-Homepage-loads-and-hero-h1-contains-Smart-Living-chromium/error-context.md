# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: civitas.spec.ts >> Homepage >> loads and hero h1 contains Smart Living
- Location: tests\civitas.spec.ts:17:7

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /Civitas/i
Received string:  ""
Timeout: 10000ms

Call log:
  - Expect "toHaveTitle" with timeout 10000ms
    21 × unexpected value ""

```

```yaml
- navigation:
  - button "previous" [disabled]:
    - img "previous"
  - text: 1/1
  - button "next" [disabled]:
    - img "next"
- img
- img
- text: Next.js 16.2.11 Turbopack
- img
- dialog "Runtime Error":
  - text: Runtime Error
  - button "Copy Error Info":
    - img
  - button "No related documentation found" [disabled]:
    - img
  - button "Attach Node.js inspector":
    - img
  - text: Manifest file is empty
- contentinfo:
  - region "Error feedback":
    - paragraph:
      - link "Was this helpful?":
        - /url: https://nextjs.org/telemetry#error-feedback
    - button "Mark as helpful"
    - button "Mark as not helpful"
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- button "Collapse issues badge":
  - img
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const BASE = 'http://localhost:3000';
  4   | 
  5   | // Auth bypass cookie that the Civitas middleware accepts in non-production runs
  6   | const AUTH_COOKIE = {
  7   |   name: 'civitas-test-auth',
  8   |   value: 'playwright-bypass',
  9   |   domain: 'localhost',
  10  |   path: '/',
  11  | };
  12  | 
  13  | // ─────────────────────────────────────────────────────────────────────────────
  14  | // GROUP 1: Homepage & Public Pages
  15  | // ─────────────────────────────────────────────────────────────────────────────
  16  | test.describe('Homepage', () => {
  17  |   test('loads and hero h1 contains Smart Living', async ({ page }) => {
  18  |     await page.goto(BASE, { waitUntil: 'domcontentloaded' });
> 19  |     await expect(page).toHaveTitle(/Civitas/i);
      |                        ^ Error: expect(page).toHaveTitle(expected) failed
  20  |     await expect(page.locator('h1').first()).toContainText('Smart Living');
  21  |   });
  22  | 
  23  |   test('CTA navigates to /portal', async ({ page }) => {
  24  |     await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  25  |     await page.locator('a[href="/portal"]').first().click();
  26  |     await page.waitForURL('**/portal', { timeout: 15_000 });
  27  |     expect(page.url()).toContain('/portal');
  28  |   });
  29  | 
  30  |   test('footer contact link is visible', async ({ page }) => {
  31  |     await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  32  |     await expect(page.locator('a[href="mailto:admin@civitasestate.com"]').first()).toBeVisible();
  33  |   });
  34  | 
  35  |   test('custom 404 page renders for unknown routes', async ({ page }) => {
  36  |     await page.goto(`${BASE}/does-not-exist-xyz`, { waitUntil: 'domcontentloaded' });
  37  |     await expect(page.locator('text=404')).toBeVisible();
  38  |     await expect(page.locator('text=Page Not Found')).toBeVisible();
  39  |   });
  40  | });
  41  | 
  42  | // ─────────────────────────────────────────────────────────────────────────────
  43  | // GROUP 2: SEO & PWA
  44  | // ─────────────────────────────────────────────────────────────────────────────
  45  | test.describe('SEO & PWA', () => {
  46  |   test('robots.txt disallows /dashboard/', async ({ page }) => {
  47  |     const res = await page.goto(`${BASE}/robots.txt`, { waitUntil: 'commit' });
  48  |     expect(res?.status()).toBe(200);
  49  |     const body = await res!.text();
  50  |     expect(body).toContain('Disallow: /dashboard/');
  51  |   });
  52  | 
  53  |   test('sitemap.xml is served with 200', async ({ page }) => {
  54  |     const res = await page.goto(`${BASE}/sitemap.xml`, { waitUntil: 'commit' });
  55  |     expect(res?.status()).toBe(200);
  56  |   });
  57  | 
  58  |   test('manifest.webmanifest returns Civitas app name', async ({ page }) => {
  59  |     const res = await page.goto(`${BASE}/manifest.webmanifest`, { waitUntil: 'commit' });
  60  |     expect(res?.status()).toBe(200);
  61  |     const json = await res!.json();
  62  |     expect(json.name).toContain('Civitas');
  63  |     expect(json.display).toBe('standalone');
  64  |   });
  65  | });
  66  | 
  67  | // ─────────────────────────────────────────────────────────────────────────────
  68  | // GROUP 3: Auth Middleware Security
  69  | // ─────────────────────────────────────────────────────────────────────────────
  70  | test.describe('Auth Middleware — Unauthenticated Redirects', () => {
  71  |   const protectedRoutes = [
  72  |     '/dashboard/owner',
  73  |     '/dashboard/tenant',
  74  |     '/dashboard/technician',
  75  |     '/dashboard/investor',
  76  |   ];
  77  | 
  78  |   for (const route of protectedRoutes) {
  79  |     test(`redirects unauthenticated ${route} → /portal`, async ({ page }) => {
  80  |       await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
  81  |       await page.waitForURL('**/portal**', { timeout: 15_000 });
  82  |       expect(page.url()).toContain('/portal');
  83  |     });
  84  |   }
  85  | });
  86  | 
  87  | // ─────────────────────────────────────────────────────────────────────────────
  88  | // GROUP 4: Portal Sign-In Page
  89  | // ─────────────────────────────────────────────────────────────────────────────
  90  | test.describe('Portal Authentication', () => {
  91  |   test('sign-in form renders email and password fields', async ({ page }) => {
  92  |     await page.goto(`${BASE}/portal`, { waitUntil: 'domcontentloaded' });
  93  |     await expect(page.locator('input[type="email"]').first()).toBeVisible();
  94  |     await expect(page.locator('input[type="password"]').first()).toBeVisible();
  95  |   });
  96  | 
  97  |   test('submit with empty fields shows HTML5 validation', async ({ page }) => {
  98  |     await page.goto(`${BASE}/portal`, { waitUntil: 'domcontentloaded' });
  99  |     await page.locator('button[type="submit"]').first().click();
  100 |     // HTML5 required fields prevent form submission — email input should still be empty
  101 |     const emailInput = page.locator('input[type="email"]').first();
  102 |     await expect(emailInput).toBeVisible();
  103 |   });
  104 | });
  105 | 
  106 | // ─────────────────────────────────────────────────────────────────────────────
  107 | // GROUP 5: Owner Dashboard (authenticated via test bypass cookie)
  108 | // ─────────────────────────────────────────────────────────────────────────────
  109 | test.describe('Owner Dashboard', () => {
  110 |   test.beforeEach(async ({ page }) => {
  111 |     await page.context().addCookies([AUTH_COOKIE]);
  112 |   });
  113 | 
  114 |   test('owner home dashboard loads with portfolio heading', async ({ page }) => {
  115 |     await page.goto(`${BASE}/dashboard/owner`, { waitUntil: 'domcontentloaded' });
  116 |     await expect(page.locator('h1').first()).toBeVisible();
  117 |   });
  118 | 
  119 |   test('owner finances page renders P&L statement', async ({ page }) => {
```