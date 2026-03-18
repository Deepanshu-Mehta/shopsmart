const { test, expect } = require('@playwright/test');

// Authenticate as the E2E test user before every test
test.beforeEach(async ({ context, page }) => {
  await context.addCookies([
    {
      name: 'token',
      value: process.env.E2E_AUTH_TOKEN,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
  await page.goto('/');
  await expect(page.getByText('Test · Out')).toBeVisible({ timeout: 10_000 });
  await page.locator('.product-card').first().waitFor({ timeout: 10_000 });
});

test.describe('Storefront', () => {
  test('VESTIR brand is visible and products load from real API', async ({ page }) => {
    await expect(page.getByText('VESTIR')).toBeVisible();

    // At least one product card from the seeded database
    const cards = page.locator('.product-card');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('category filter shows only matching products', async ({ page }) => {
    await page.getByRole('tab', { name: 'tops' }).click();

    // "Linen Drape Top" is a tops product in the seed data
    await expect(page.getByText('Linen Drape Top')).toBeVisible({ timeout: 5_000 });

    // Bottoms products should not be visible
    await page.getByRole('tab', { name: 'bottoms' }).click();
    await expect(page.getByText('Linen Drape Top')).not.toBeVisible();
  });

  test('product modal opens on card click and closes on Escape', async ({ page }) => {
    // Click the first product card
    await page.locator('.product-card').first().click();

    const panel = page.getByRole('dialog', { name: 'Product detail' });
    await expect(panel).toBeVisible({ timeout: 5_000 });

    // Size and colour selectors are present
    await expect(panel.getByRole('group', { name: 'Size selector' })).toBeVisible();
    await expect(panel.getByRole('group', { name: 'Colour selector' })).toBeVisible();

    // ADD TO BAG button present
    await expect(panel.getByText('ADD TO BAG')).toBeVisible();

    // Escape closes the modal
    await page.keyboard.press('Escape');
    await expect(panel).not.toBeVisible({ timeout: 3_000 });
  });

  test('newsletter subscription shows thank you message', async ({ page }) => {
    await page.getByLabel('Email address').fill('playwright-test@vestir.com');
    await page.getByRole('button', { name: /Subscribe/i }).click();

    await expect(page.getByText(/Thank you\. You're in\./)).toBeVisible({ timeout: 5_000 });
  });
});
