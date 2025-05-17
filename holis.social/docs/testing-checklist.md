# Holis Modular Site Testing Checklist

_Last updated: 2025-05-11_

---

## ✅ Manual Testing Steps

1. **Test Each Route**
   - [ ] `/` (Homepage)
   - [ ] `/about`
   - [ ] `/contribute`
   - [ ] `/how-it-works`
   - [ ] `/use-cases/tenants`
   - [ ] `/use-cases/mutual-aid`
   - [ ] `/use-cases/artists`
   - [ ] `/use-cases/indigenous`
   - Confirm each page loads and displays the correct content.

2. **Validate Markdown Rendering**
   - [ ] Headings, lists, tables, and blockquotes render as expected
   - [ ] Page title appears in browser tab
   - [ ] Metadata (description, image) is present in `<head>` if supported

3. **Check Navigation and Links**
   - [ ] All navigation links work
   - [ ] All internal links in page content work
   - [ ] Non-existent routes (e.g., `/not-a-page`) return a 404

4. **Error Handling**
   - [ ] Corrupt or missing markdown files do not crash the site
   - [ ] Fallback title or error message is shown if metadata is missing

5. **Static Assets**
   - [ ] Static images (e.g., `/static/assets/community-focused.png`) load or redirect as expected
   - [ ] Favicon loads

---

## 🛠️ Automated Testing Script Outline (Playwright Example)

```js
// playwright.config.js should be set up for your dev server
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

describe('Holis Modular Site', () => {
  for (const route of routes) {
    test(`renders ${route}`, async ({ page }) => {
      await page.goto(`http://localhost:8787${route}`);
      await expect(page.locator('main, .content')).toBeVisible();
      // Optionally check for a heading or unique text
    });
  }

  test('returns 404 for non-existent page', async ({ page }) => {
    const response = await page.goto('http://localhost:8787/not-a-page');
    expect(response.status()).toBe(404);
  });

  test('static asset loads', async ({ page }) => {
    const response = await page.goto('http://localhost:8787/static/assets/community-focused.png');
    expect(response.status()).toBe(200);
  });
});
```

---

## 📝 Notes
- Update the script for your actual dev server port and static asset paths.
- For Cypress, the structure is similar—use `cy.visit()` and `cy.get()`.
- Expand tests to check for metadata, navigation, and error messages as needed. 