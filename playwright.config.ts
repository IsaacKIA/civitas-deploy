import { defineConfig, devices } from '@playwright/test';

/**
 * Authenticated dashboard projects are only added when their test
 * account's credentials are actually configured. This is deliberate: if
 * TEST_OWNER_EMAIL/PASSWORD aren't set, the 'dashboard-owner' project
 * simply doesn't exist for this run, rather than existing and crashing
 * trying to load a storageState file that auth.setup.ts never created
 * because it skipped. `npx playwright test` always runs the public-page
 * suite cleanly with zero configuration; the authenticated suites opt in
 * as real test accounts get seeded.
 */
const hasOwnerCreds = !!(process.env.TEST_OWNER_EMAIL && process.env.TEST_OWNER_PASSWORD);
const hasTenantCreds = !!(process.env.TEST_TENANT_EMAIL && process.env.TEST_TENANT_PASSWORD);
const hasTechnicianCreds = !!(process.env.TEST_TECHNICIAN_EMAIL && process.env.TEST_TECHNICIAN_PASSWORD);
const hasInvestorCreds = !!(process.env.TEST_INVESTOR_EMAIL && process.env.TEST_INVESTOR_PASSWORD);
const hasAnyAuthCreds = hasOwnerCreds || hasTenantCreds || hasTechnicianCreds || hasInvestorCreds;

const authenticatedProjects = [
  hasOwnerCreds && {
    name: 'dashboard-owner',
    testMatch: /dashboard-owner\.spec\.ts/,
    dependencies: ['setup'],
    use: { ...devices['Desktop Chrome'], storageState: 'tests/.auth/owner.json' },
  },
  hasTenantCreds && {
    name: 'dashboard-tenant',
    testMatch: /dashboard-tenant\.spec\.ts/,
    dependencies: ['setup'],
    use: { ...devices['Desktop Chrome'], storageState: 'tests/.auth/tenant.json' },
  },
  hasTechnicianCreds && {
    name: 'dashboard-technician',
    testMatch: /dashboard-technician\.spec\.ts/,
    dependencies: ['setup'],
    use: { ...devices['Desktop Chrome'], storageState: 'tests/.auth/technician.json' },
  },
  hasInvestorCreds && {
    name: 'dashboard-investor',
    testMatch: /dashboard-investor\.spec\.ts/,
    dependencies: ['setup'],
    use: { ...devices['Desktop Chrome'], storageState: 'tests/.auth/investor.json' },
  },
].filter((p): p is Exclude<typeof p, false> => !!p);

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'public',
      testMatch: /public\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // The setup project only needs to exist when at least one dashboard
    // project depends on it — an empty setup project with nothing
    // depending on it is harmless, but skip adding it at all when there's
    // nothing configured, to keep `playwright test` output clean.
    ...(hasAnyAuthCreds
      ? [{ name: 'setup', testMatch: /auth\.setup\.ts/, use: { ...devices['Desktop Chrome'] } }]
      : []),
    ...authenticatedProjects,
  ],
});
