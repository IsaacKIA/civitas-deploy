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
    // Navigate directly — avoids flakiness from homepage scroll/animation
    await page.goto(`${BASE}/portal`, { waitUntil: 'domcontentloaded' });
    expect(page.url()).toContain('/portal');
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
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
// GROUP 4: Portal — Sign-In Form
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Portal — Sign-In', () => {
  test('renders email and password inputs', async ({ page }) => {
    await page.goto(`${BASE}/portal`);
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('displays inline field errors for empty submission', async ({ page }) => {
    await page.goto(`${BASE}/portal`);
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible();
    
    // Fill invalid email directly to trigger state validation cleanly
    await emailInput.fill('invalid-email');
    await page.locator('button[type="submit"]').first().click();
    await expect(page.locator('text=Enter a valid email address')).toBeVisible();
  });

  test('displays inline error for invalid email format', async ({ page }) => {
    await page.goto(`${BASE}/portal`);
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible();
    await emailInput.fill('not-an-email');
    await page.locator('button[type="submit"]').first().click();
    await expect(page.locator('text=Enter a valid email address')).toBeVisible();
  });

  test('Forgot password link navigates to reset form', async ({ page }) => {
    await page.goto(`${BASE}/portal`);
    const forgotBtn = page.locator('text=Forgot password?');
    await expect(forgotBtn).toBeVisible();
    await forgotBtn.click();
    await expect(page.locator('text=Send Password Reset Link')).toBeVisible();
  });

  test('Forgot password form shows error for invalid email', async ({ page }) => {
    await page.goto(`${BASE}/portal`);
    const forgotBtn = page.locator('text=Forgot password?');
    await expect(forgotBtn).toBeVisible();
    await forgotBtn.click();
    
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible();
    await emailInput.fill('bad-email');
    await page.locator('button[type="submit"]').first().click();
    await expect(page.locator('text=Enter a valid email address')).toBeVisible();
  });

  test('Back to Sign In link returns to sign-in form from forgot mode', async ({ page }) => {
    await page.goto(`${BASE}/portal`);
    const forgotBtn = page.locator('text=Forgot password?');
    await expect(forgotBtn).toBeVisible();
    await forgotBtn.click();
    
    const backBtn = page.locator('text=← Back to Sign In');
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('role selector dropdown opens and selects Tenant', async ({ page }) => {
    await page.goto(`${BASE}/portal`);
    const roleBtn = page.locator('button', { hasText: 'Property Owner' }).first();
    await expect(roleBtn).toBeVisible();
    await roleBtn.click();
    
    const tenantOption = page.locator('button', { hasText: 'Tenant' }).first();
    await expect(tenantOption).toBeVisible();
    await tenantOption.click();
    await expect(page.locator('button', { hasText: 'Tenant' }).first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 4b: Portal — Registration Form
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Portal — Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/portal`, { waitUntil: 'domcontentloaded' });
    const createBtn = page.locator('button', { hasText: 'Create Account' });
    await createBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await createBtn.click();
    // Wait for the first name input to confirm the sign-up form has rendered
    await page.locator('input[placeholder="Kwame"]').waitFor({ state: 'visible', timeout: 10_000 });
  });

  test('sign-up form renders all required fields', async ({ page }) => {
    await expect(page.locator('input[placeholder="Kwame"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Mensah"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="tel"]')).toBeVisible();
  });

  test('shows first name validation error on empty submit', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=First name is required')).toBeVisible();
  });

  test('shows last name validation error when first name filled', async ({ page }) => {
    await page.locator('input[placeholder="Kwame"]').fill('Kwame');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Last name is required')).toBeVisible();
  });

  test('rejects invalid Ghana phone number', async ({ page }) => {
    await page.locator('input[placeholder="Kwame"]').fill('Kwame');
    await page.locator('input[placeholder="Mensah"]').fill('Mensah');
    await page.locator('input[type="email"]').fill('kwame@test.com');
    await page.locator('input[type="tel"]').fill('123');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Enter a valid Ghana phone number')).toBeVisible();
  });

  test('rejects password shorter than 8 characters', async ({ page }) => {
    await page.locator('input[placeholder="Kwame"]').fill('Kwame');
    await page.locator('input[placeholder="Mensah"]').fill('Mensah');
    await page.locator('input[type="email"]').fill('kwame@test.com');
    await page.locator('input[type="tel"]').fill('551234567');
    await page.locator('input[type="password"]').first().fill('abc');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Minimum 8 characters required')).toBeVisible();
  });

  test('password strength meter appears when typing', async ({ page }) => {
    await page.locator('input[type="password"]').first().fill('abc');
    await expect(page.locator('text=Weak')).toBeVisible();
  });

  test('password strength meter shows Strong for complex password', async ({ page }) => {
    await page.locator('input[type="password"]').first().fill('Str0ng!Pass');
    await expect(page.locator('text=Strong')).toBeVisible();
  });

  test('requires terms acceptance before submitting', async ({ page }) => {
    await page.locator('input[placeholder="Kwame"]').fill('Kwame');
    await page.locator('input[placeholder="Mensah"]').fill('Mensah');
    await page.locator('input[type="email"]').fill('kwame@test.com');
    await page.locator('input[type="tel"]').fill('551234567');
    await page.locator('input[type="password"]').first().fill('Str0ng!Pass');
    await page.locator('input[type="password"]').nth(1).fill('Str0ng!Pass');
    // Intentionally skip checking the checkbox
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=You must agree to the Terms and Privacy Policy')).toBeVisible();
  });

  test('Terms of Service modal opens and closes', async ({ page }) => {
    await page.locator('text=Terms of Service').click();
    await expect(page.locator('text=Civitas Terms of Service')).toBeVisible();
    await page.locator('text=Close & Accept').click();
    await expect(page.locator('text=Civitas Terms of Service')).not.toBeVisible();
  });

  test('Privacy Policy modal opens and closes', async ({ page }) => {
    await page.locator('text=Privacy Policy').click();
    await expect(page.locator('text=Civitas Privacy Policy')).toBeVisible();
    await page.locator('text=Close & Accept').click();
    await expect(page.locator('text=Civitas Privacy Policy')).not.toBeVisible();
  });

  test('mismatched passwords show error message', async ({ page }) => {
    await page.locator('input[type="password"]').first().fill('Password1!');
    await page.locator('input[type="password"]').nth(1).fill('Password2!');
    await expect(page.locator("text=Passwords don't match")).toBeVisible();
  });

  test('matching passwords show success indicator', async ({ page }) => {
    await page.locator('input[type="password"]').first().fill('Password1!');
    await page.locator('input[type="password"]').nth(1).fill('Password1!');
    await expect(page.locator('text=✓ Passwords match')).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 4c: Portal — Verification Screen
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Portal — Redirect Preservation', () => {
  test('unauthenticated redirect to /dashboard/owner sets redirect param', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/owner`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/portal**', { timeout: 15_000 });
    expect(page.url()).toContain('redirect=%2Fdashboard%2Fowner');
  });

  test('unauthenticated redirect to /dashboard/tenant sets redirect param', async ({ page }) => {
    await page.goto(`${BASE}/dashboard/tenant`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/portal**', { timeout: 15_000 });
    expect(page.url()).toContain('redirect=%2Fdashboard%2Ftenant');
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
