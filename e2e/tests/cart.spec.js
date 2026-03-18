const { test, expect } = require('@playwright/test');
const { Pool } = require('pg');
const path = require('path');

// Load server .env for local dev so DATABASE_URL is available here too
require('dotenv').config({ path: path.join(__dirname, '../../server/.env') });

const E2E_CART_ID = 'e2e-cart-001';

// Clear all cart items for the E2E test user before each test
async function clearCart() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query(`DELETE FROM "CartItem" WHERE "cartId" = $1`, [E2E_CART_ID]);
  await pool.end();
}

// Authenticate as E2E test user and navigate to home
test.beforeEach(async ({ context, page }) => {
  await clearCart();

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

test.describe('Cart', () => {
  test('cart opens with empty bag message when user has no items', async ({ page }) => {
    await page.getByRole('button', { name: /Shopping bag/i }).click();

    const drawer = page.getByRole('dialog', { name: 'Shopping bag' });
    await expect(drawer).toBeVisible({ timeout: 5_000 });
    await expect(drawer.getByText(/Your bag is empty/i)).toBeVisible({ timeout: 5_000 });

    await drawer.getByRole('button', { name: /Close bag/i }).click();
    await expect(drawer).not.toBeVisible({ timeout: 3_000 });
  });

  test('add product to cart via modal — badge increments and item appears in cart', async ({
    page,
  }) => {
    const badge = page.locator('button[aria-label="Shopping bag"] span');
    const initialCount = parseInt((await badge.textContent()) || '0', 10);

    // Open product modal for the first card
    await page.locator('.product-card').first().click();
    const panel = page.getByRole('dialog', { name: 'Product detail' });
    await expect(panel).toBeVisible({ timeout: 5_000 });

    // Select size M and colour Sand
    await panel.getByRole('button', { name: 'M' }).click();
    await panel.getByRole('button', { name: 'Sand' }).click();

    // Add to bag
    await panel.getByText('ADD TO BAG').click();
    await expect(panel.getByText(/ADDED/)).toBeVisible({ timeout: 3_000 });

    // Cart badge should increment
    await expect(badge).toHaveText(String(initialCount + 1), { timeout: 3_000 });

    // Close the modal
    await page.keyboard.press('Escape');

    // Open cart drawer and verify item is listed
    await page.getByRole('button', { name: /Shopping bag/i }).click();
    const drawer = page.getByRole('dialog', { name: 'Shopping bag' });
    await expect(drawer).toBeVisible({ timeout: 5_000 });
    await expect(drawer.getByText('Linen Drape Top')).toBeVisible({ timeout: 5_000 });
    await expect(drawer.getByText(/M · Sand/)).toBeVisible();
  });

  test('remove item from cart — bag shows empty after removal', async ({ page }) => {
    // First add an item via the modal
    await page.locator('.product-card').first().click();
    const panel = page.getByRole('dialog', { name: 'Product detail' });
    await expect(panel).toBeVisible({ timeout: 5_000 });
    await panel.getByText('ADD TO BAG').click();
    await expect(panel.getByText(/ADDED/)).toBeVisible({ timeout: 3_000 });
    await page.keyboard.press('Escape');

    // Open cart drawer
    await page.getByRole('button', { name: /Shopping bag/i }).click();
    const drawer = page.getByRole('dialog', { name: 'Shopping bag' });
    await expect(drawer.getByText('Linen Drape Top')).toBeVisible({ timeout: 5_000 });

    // Click the × remove button
    await drawer.getByRole('button', { name: /Remove item/i }).click();

    // Bag should now be empty
    await expect(drawer.getByText(/Your bag is empty/i)).toBeVisible({ timeout: 5_000 });
  });
});
