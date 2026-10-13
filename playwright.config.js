import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './',

    testMatch: '**/*.spec.js',

    timeout: 120000,

        reporter: [
        ['list'],
        ['allure-playwright', {
            resultsDir: './allure-results'
        }]
    ],

    use: {
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure'
    }
});