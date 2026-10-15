import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './Tests',

    timeout: 120000,
    workers: process.env.CI ? 1 : undefined,

    reporter: [
        ['line'],
        ['html', {
            open: 'never',
            outputFolder: 'playwright-report'
        }],
        ['allure-playwright', {
            resultsDir: 'allure-results'
        }]
    ],

    use: {
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure'
    },

    projects: [
        {
            name: 'Desktop Chrome',
            testMatch: '**/Desktop/**/*.spec.js',
            use: { ...devices['Desktop Chrome'], channel: 'chromium' }
        },
        {
            name: 'Android',
            testMatch: '**/Mobile/**/*.spec.js',
            use: { ...devices['Pixel 5'] }
        },
        {
            name: 'iPhone',
            testMatch: '**/Mobile/**/*.spec.js',
            use: { ...devices['iPhone 12'] }
        }
    ]
});