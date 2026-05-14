import { test, expect } from '@playwright/test';

test('verify sau il moro site visual', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });

  // 1. Home Page
  await page.goto('http://localhost:3000/');
  await expect(page.locator('h1').first()).toContainText('SAU IL MORO');
  await page.screenshot({ path: 'verification/landing.png', fullPage: true });

  // 2. Product Page
  await page.goto('http://localhost:3000/products/1');
  await expect(page.locator('h1').nth(1)).toBeVisible();
  await page.screenshot({ path: 'verification/product.png', fullPage: true });

  // 3. Cart Interaction
  await page.click('button:has-text("Aggiungi al carrello")');
  await page.locator('header button').filter({ has: page.locator('svg path[d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"]') }).click();

  // Wait for drawer animation
  await page.waitForTimeout(1000);

  // Verify drawer is visible
  await expect(page.locator('text=Il tuo Carrello')).toBeVisible();
  await page.screenshot({ path: 'verification/cart_drawer.png' });
});
