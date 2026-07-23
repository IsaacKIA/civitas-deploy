# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: civitas.spec.ts >> Tenant Dashboard >> tenant rent page shows MoMo payment option
- Location: tests\civitas.spec.ts:156:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/dashboard/tenant/rent", waiting until "domcontentloaded"

```

# Test source

```ts
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
  120 |     await page.goto(`${BASE}/dashboard/owner/finances`, { waitUntil: 'domcontentloaded' });
  121 |     await expect(page.locator('text=Financial Statements').first()).toBeVisible();
  122 |     await expect(page.locator('text=Net Owner Payout').first()).toBeVisible();
  123 |   });
  124 | 
  125 |   test('rent act escrow calculator renders on finances page', async ({ page }) => {
  126 |     await page.goto(`${BASE}/dashboard/owner/finances`, { waitUntil: 'domcontentloaded' });
  127 |     await expect(page.locator('text=Ghana Rent Act').first()).toBeVisible();
  128 |   });
  129 | 
  130 |   test('solar energy page shows battery gauge', async ({ page }) => {
  131 |     await page.goto(`${BASE}/dashboard/owner/energy`, { waitUntil: 'domcontentloaded' });
  132 |     await expect(page.locator('text=Solar').first()).toBeVisible();
  133 |   });
  134 | 
  135 |   test('maintenance wizard step 1 renders 8 category tiles', async ({ page }) => {
  136 |     await page.goto(`${BASE}/dashboard/owner/maintenance`, { waitUntil: 'domcontentloaded' });
  137 |     await expect(page.locator('text=Plumbing').first()).toBeVisible();
  138 |     await expect(page.locator('text=Electrical').first()).toBeVisible();
  139 |     await expect(page.locator('text=Solar').first()).toBeVisible();
  140 |   });
  141 | 
  142 |   test('property onboarding wizard step 1 renders', async ({ page }) => {
  143 |     await page.goto(`${BASE}/dashboard/owner/properties/new`, { waitUntil: 'domcontentloaded' });
  144 |     await expect(page.locator('text=Step 1').first()).toBeVisible();
  145 |   });
  146 | });
  147 | 
  148 | // ─────────────────────────────────────────────────────────────────────────────
  149 | // GROUP 6: Tenant Dashboard (authenticated)
  150 | // ─────────────────────────────────────────────────────────────────────────────
  151 | test.describe('Tenant Dashboard', () => {
  152 |   test.beforeEach(async ({ page }) => {
  153 |     await page.context().addCookies([AUTH_COOKIE]);
  154 |   });
  155 | 
  156 |   test('tenant rent page shows MoMo payment option', async ({ page }) => {
> 157 |     await page.goto(`${BASE}/dashboard/tenant/rent`, { waitUntil: 'domcontentloaded' });
      |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  158 |     await expect(page.locator('text=MTN MoMo, text=MoMo').first()).toBeVisible().catch(() =>
  159 |       expect(page.locator('h1').first()).toBeVisible()
  160 |     );
  161 |   });
  162 | 
  163 |   test('lease page renders Ghana Rent Act label', async ({ page }) => {
  164 |     await page.goto(`${BASE}/dashboard/tenant/lease`, { waitUntil: 'domcontentloaded' });
  165 |     await expect(page.locator('h1').first()).toBeVisible();
  166 |   });
  167 | });
  168 | 
  169 | // ─────────────────────────────────────────────────────────────────────────────
  170 | // GROUP 7: Investor Dashboard (authenticated)
  171 | // ─────────────────────────────────────────────────────────────────────────────
  172 | test.describe('Investor Dashboard', () => {
  173 |   test.beforeEach(async ({ page }) => {
  174 |     await page.context().addCookies([AUTH_COOKIE]);
  175 |   });
  176 | 
  177 |   test('marketplace page renders impact projects', async ({ page }) => {
  178 |     await page.goto(`${BASE}/dashboard/investor/marketplace`, { waitUntil: 'domcontentloaded' });
  179 |     await expect(page.locator('text=Green Township, text=Civitas Green').first()).toBeVisible().catch(() =>
  180 |       expect(page.locator('h1').first()).toBeVisible()
  181 |     );
  182 |   });
  183 | 
  184 |   test('ESG page loads', async ({ page }) => {
  185 |     await page.goto(`${BASE}/dashboard/investor/esg`, { waitUntil: 'domcontentloaded' });
  186 |     await expect(page.locator('h1').first()).toBeVisible();
  187 |   });
  188 | 
  189 |   test('dividends page loads', async ({ page }) => {
  190 |     await page.goto(`${BASE}/dashboard/investor/dividends`, { waitUntil: 'domcontentloaded' });
  191 |     await expect(page.locator('h1').first()).toBeVisible();
  192 |   });
  193 | });
  194 | 
  195 | // ─────────────────────────────────────────────────────────────────────────────
  196 | // GROUP 8: Technician Dashboard (authenticated)
  197 | // ─────────────────────────────────────────────────────────────────────────────
  198 | test.describe('Technician Dashboard', () => {
  199 |   test.beforeEach(async ({ page }) => {
  200 |     await page.context().addCookies([AUTH_COOKIE]);
  201 |   });
  202 | 
  203 |   test('technician kanban board loads', async ({ page }) => {
  204 |     await page.goto(`${BASE}/dashboard/technician`, { waitUntil: 'domcontentloaded' });
  205 |     await expect(page.locator('h1').first()).toBeVisible();
  206 |   });
  207 | 
  208 |   test('earnings ledger page loads', async ({ page }) => {
  209 |     await page.goto(`${BASE}/dashboard/technician/earnings`, { waitUntil: 'domcontentloaded' });
  210 |     await expect(page.locator('h1').first()).toBeVisible();
  211 |   });
  212 | });
  213 | 
```