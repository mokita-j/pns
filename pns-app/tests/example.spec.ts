import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/PNS/);
});

test('navigation works', async ({ page }) => {
  await page.goto('/');

  // Check if the main heading is visible
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // Check if the main content is visible
  await expect(page.getByRole('main')).toBeVisible();
});
