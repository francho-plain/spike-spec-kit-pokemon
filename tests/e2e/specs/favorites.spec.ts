import { test, expect } from '@playwright/test'

test('favorites user flow', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Navigate to a Pokemon detail page
  await page.click('[data-testid="pokemon-card"]:first-child')

  // Wait for detail page to load
  await expect(page).toHaveURL(/\/pokemon\/\d+/)

  // Click favorite button
  await page.click('[data-testid="favorite-button"]')

  // Navigate to favorites page
  await page.goto('http://localhost:3000/favorites')

  // Check favorites page loads
  await expect(page).toHaveURL('/favorites')
  await expect(page.locator('h1')).toContainText('Favorites')
})