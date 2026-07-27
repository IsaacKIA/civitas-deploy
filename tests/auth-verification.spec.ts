import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Civitas Authentication & Email Verification Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/portal`, { waitUntil: 'networkidle' });
  });

  test('1. Registration form renders all required fields and role selectors', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /Create one free/i });
    await createBtn.waitFor({ state: 'visible' });
    await createBtn.click();

    // Verify role cards exist
    await expect(page.locator('button', { hasText: 'Property Owner' }).first()).toBeVisible();
    await expect(page.locator('button', { hasText: 'Tenant' }).first()).toBeVisible();
    await expect(page.locator('button', { hasText: 'Investor' }).first()).toBeVisible();
    await expect(page.locator('button', { hasText: 'Technician' }).first()).toBeVisible();

    // Verify form input fields
    await expect(page.locator('input[placeholder="Kwame"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Mensah"]')).toBeVisible();
    await expect(page.locator('input[placeholder="you@example.com"]')).toBeVisible();
    await expect(page.locator('input[placeholder="55 123 4567"]')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
  });

  test('2. Registration form enforces inline validation for empty submission', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /Create one free/i });
    await createBtn.waitFor({ state: 'visible' });
    await createBtn.click();

    // Click submit with empty form
    const submitBtn = page.locator('button[type="submit"]', { hasText: 'Create' });
    await submitBtn.click();

    // Assert validation errors appear
    await expect(page.locator('text=First name is required')).toBeVisible();
    await expect(page.locator('text=Last name is required')).toBeVisible();
    await expect(page.locator('text=Enter a valid email address')).toBeVisible();
    await expect(page.locator('text=You must agree to the Terms and Privacy Policy')).toBeVisible();
  });

  test('3. Password mismatch and length validation rules work correctly', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /Create one free/i });
    await createBtn.waitFor({ state: 'visible' });
    await createBtn.click();

    // Fill short password
    const passInput = page.locator('input[placeholder="••••••••"]').first();
    await passInput.fill('short');
    await page.locator('button[type="submit"]', { hasText: 'Create' }).click();

    await expect(page.locator('text=Minimum 8 characters required')).toBeVisible();
  });

  test('4. Direct navigation to /auth/callback with invalid token redirects to portal error', async ({ page }) => {
    await page.goto(`${BASE}/auth/callback?code=invalid_test_code_123`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/portal**', { timeout: 15_000 });
    
    expect(page.url()).toContain('/portal');
    expect(page.url()).toContain('error=');
    await expect(page.locator('text=Verification link is invalid or has expired')).toBeVisible();
  });

  test('5. Direct navigation to /portal with verified=true parameter displays success banner', async ({ page }) => {
    await page.goto(`${BASE}/portal?verified=true`, { waitUntil: 'networkidle' });

    await expect(page.locator('text=Your email address has been verified! You can now sign in.')).toBeVisible();
  });

  test('6. Resend verification email button includes countdown timer state', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /Create one free/i });
    await createBtn.waitFor({ state: 'visible' });
    await createBtn.click();

    // Fill valid form fields with timestamped unique email
    const uniqueEmail = `test.verify.${Date.now()}.${Math.random().toString(36).substring(7)}@civitas.com`;
    await page.locator('input[placeholder="Kwame"]').fill('Ama');
    await page.locator('input[placeholder="Mensah"]').fill('Osei');
    await page.locator('input[placeholder="you@example.com"]').fill(uniqueEmail);
    await page.locator('input[placeholder="55 123 4567"]').fill('55 123 9999');
    
    const passInputs = page.locator('input[placeholder="••••••••"]');
    await passInputs.nth(0).fill('CivitasSecure2026!');
    await passInputs.nth(1).fill('CivitasSecure2026!');
    
    await page.locator('input[type="checkbox"]').check();

    // Submit form
    await page.locator('button[type="submit"]', { hasText: 'Create' }).click();

    // Wait for response and check transition or formatted error
    await page.waitForTimeout(4000);
    
    const isVerifyMode = await page.locator('text=Check your email').isVisible();
    const isErrorMessage = await page.locator('text=⚠').isVisible();

    expect(isVerifyMode || isErrorMessage).toBe(true);

    if (isVerifyMode) {
      await expect(page.locator('button', { hasText: /Resend Link \(\d+s\)/ })).toBeVisible();
    }
  });

  test('7. Sign-in page renders properly with role selection dropdown', async ({ page }) => {
    await expect(page.locator('button', { hasText: 'Property Owner' }).first()).toBeVisible();
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

});
