import { test, expect } from '@playwright/test';

test.describe('My Web Application Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Actions to perform before each test, like navigating to the application
        await page.goto('https://example.com');
    });

    test('Homepage should load correctly', async ({ page }) => {
        // Assertions for the homepage
        await expect(page).toHaveURL('https://example.com');
        await expect(page).toHaveTitle('Example Domain');
    });

    test('Homepage should have a specific element', async ({ page }) => {
        // Check for a specific element on the page
        const exampleElement = await page.locator('selector-for-element');
        await expect(exampleElement).toBeVisible();
    });
});