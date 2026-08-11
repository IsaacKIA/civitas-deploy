import { test as setup, expect } from '@playwright/test';

/**
 * Replaces the old `civitas-test-auth` bypass cookie, which was a real
 * security hole (see src/proxy.ts) — anyone could set that cookie in
 * devtools and reach every /dashboard/* route with no real session. Now
 * that the bypass is gone, authenticated tests need a real Supabase
 * session, so this signs in real seeded accounts through the actual
 * /portal UI (exercising real sign-in code, not a shortcut) and saves each
 * session's storageState for the dashboard test files to reuse.
 *
 * Requires 4 real accounts to already exist in whatever Supabase project
 * BASE_URL points at, with credentials supplied via env vars:
 *   TEST_OWNER_EMAIL / TEST_OWNER_PASSWORD       (role: client)
 *   TEST_TENANT_EMAIL / TEST_TENANT_PASSWORD     (role: tenant)
 *   TEST_TECHNICIAN_EMAIL / TEST_TECHNICIAN_PASSWORD (role: technician)
 *   TEST_INVESTOR_EMAIL / TEST_INVESTOR_PASSWORD (role: investor)
 *
 * Sign up each account once via /portal (or seed them directly in
 * Supabase) before running the authenticated suites. Without these env
 * vars set, each setup test below is skipped — not failed — so `npx
 * playwright test` still runs the public-page suite cleanly with zero
 * config.
 */

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

interface RoleCreds {
  role: 'owner' | 'tenant' | 'technician' | 'investor';
  email: string | undefined;
  password: string | undefined;
  homePath: string;
}

const ROLE_CREDS: RoleCreds[] = [
  { role: 'owner', email: process.env.TEST_OWNER_EMAIL, password: process.env.TEST_OWNER_PASSWORD, homePath: '/dashboard/owner' },
  { role: 'tenant', email: process.env.TEST_TENANT_EMAIL, password: process.env.TEST_TENANT_PASSWORD, homePath: '/dashboard/tenant' },
  { role: 'technician', email: process.env.TEST_TECHNICIAN_EMAIL, password: process.env.TEST_TECHNICIAN_PASSWORD, homePath: '/dashboard/technician' },
  { role: 'investor', email: process.env.TEST_INVESTOR_EMAIL, password: process.env.TEST_INVESTOR_PASSWORD, homePath: '/dashboard/investor' },
];

for (const { role, email, password, homePath } of ROLE_CREDS) {
  setup(`authenticate as ${role}`, async ({ page }) => {
    setup.skip(!email || !password, `TEST_${role.toUpperCase()}_EMAIL / _PASSWORD not set — skipping ${role} auth setup`);

    await page.goto(`${BASE}/portal`, { waitUntil: 'domcontentloaded' });
    await page.locator('input[type="email"]').first().fill(email!);
    await page.locator('input[type="password"]').first().fill(password!);
    await page.locator('button[type="submit"]').first().click();

    // A successful sign-in redirects to this role's dashboard home —
    // confirms the session is real, not just that the form submitted.
    await page.waitForURL(`**${homePath}**`, { timeout: 15_000 });
    await expect(page).toHaveURL(new RegExp(homePath));

    await page.context().storageState({ path: `tests/.auth/${role}.json` });
  });
}
