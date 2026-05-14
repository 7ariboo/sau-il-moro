import { test, expect } from '@playwright/test';

test.describe('Sau Il Moro E-commerce Flow', () => {

  test('Home page and product filtering', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('h1').first()).toContainText('SAU IL MORO');

    const select = page.locator('select');
    await select.selectOption('Resina');
    await expect(page.locator('text=Coltello Arburese Resina')).toBeVisible();
    await expect(page.locator('text=Coltello Pattada Corno')).not.toBeVisible();
  });

  test('Add to cart and checkout flow', async ({ page }) => {
    await page.goto('http://localhost:3000/products/1');
    await page.click('button:has-text("Aggiungi al carrello")');

    await page.locator('header button').filter({ has: page.locator('svg path[d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"]') }).click();
    await expect(page.locator('text=Il tuo Carrello')).toBeVisible();

    await page.click('text=Procedi al Checkout');
    await expect(page).toHaveURL(/.*checkout/);

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '123456789');
    await page.fill('input[name="name"]', 'Mario');
    await page.fill('input[name="surname"]', 'Rossi');
    await page.click('text=Continua alla Spedizione');

    await expect(page.locator('text=Indirizzo di Spedizione')).toBeVisible();
    await page.fill('input[name="address"]', 'Via Roma 1');
    await page.fill('input[name="city"]', 'Cagliari');
    await page.fill('input[name="zip"]', '09100');
    await page.click('text=Vai al Pagamento');

    await expect(page.locator('text=Pagamento Sicuro')).toBeVisible();
    await page.click('button:has-text("Paga")');
    await expect(page.locator('text=Ordine Confermato')).toBeVisible();
  });

  test('Wishlist functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Heart icon button is within ProductCard
    // Let's use the button that contains the heart svg
    const heartButton = page.locator('button').filter({ has: page.locator('svg path[d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"]') }).first();
    await heartButton.click();

    await page.goto('http://localhost:3000/account');
    await page.waitForLoadState('networkidle');

    // Click on "Lista dei Desideri" tab
    await page.click('text=Lista dei Desideri');

    // Check if the product is in the list
    await expect(page.locator('h3').filter({ hasText: 'Coltello Pattada Corno' })).toBeVisible({ timeout: 5000 });
  });
});
