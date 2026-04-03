import { defineConfig, devices } from '@playwright/test'
//import 'dotenv/config'

require('dotenv').config();

export default defineConfig({

    // Root folder where all spec files live
    testDir: './tests',

    // Run all tests in parallel by default
    fullyParallel: true,

    // Fail the build on CI if test.only is accidentally left in
    forbidOnly: !!process.env.CI,

    // Retry failed tests once on CI, no retries locally
    retries: process.env.CI ? 1 : 0,

    // Number of parallel workers — half of available CPUs locally, 1 on CI
    workers: process.env.CI ? 1 : undefined,

    // HTML report saved to playwright-report/
    reporter: 'html',

    use: {
        baseURL: 'https://automationteststore.com/',

        // Keep a trace on first retry to help debug failures
        trace: 'on-first-retry',

        // Take a screenshot on failure
        screenshot: 'only-on-failure',
    },

    projects: [

        // ── Step 1: Registration must always run first and alone ─────────────
        {
            name: 'registration',
            testMatch: '**/CreateAccount.spec.ts',
            use: { ...devices['Desktop Chrome'] },
        },

        // ── Step 2: Login depends on registration completing successfully ────
        {
            name: 'login',
            testMatch: '**/Login.spec.ts',
            dependencies: ['registration'],
            use: { ...devices['Desktop Chrome'] },
        },

        // ── Step 3: All other tests run in parallel after setup is done ──────
        // Registration and Login specs are excluded here to avoid double runs
        {
            name: 'chromium',
            testIgnore: ['**/CreateAccount.spec.ts', '**/Login.spec.ts'],
            use: { ...devices['Desktop Chrome'] },
        },
    ],
})