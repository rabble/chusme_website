import { test, expect } from '@playwright/test';
const routes = [
    '/',
    '/about',
    '/contribute',
    '/how-it-works',
    '/use-cases/tenants',
    '/use-cases/mutual-aid',
    '/use-cases/artists',
    '/use-cases/indigenous',
];
test.describe('Holis Modular Site', () => {
    for (const route of routes) {
        test(`renders ${route}`, async ({ page }) => {
            await page.goto(route);
            await expect(page.locator('main, .content')).toBeVisible();
            // Optionally check for a heading or unique text
        });
    }
    test('returns 404 for non-existent page', async ({ page }) => {
        const response = await page.goto('/not-a-page');
        expect(response && response.status()).toBe(404);
    });
    test('static asset loads', async ({ page }) => {
        const response = await page.goto('/static/assets/community-focused.png');
        expect(response && response.status()).toBe(200);
    });
});
