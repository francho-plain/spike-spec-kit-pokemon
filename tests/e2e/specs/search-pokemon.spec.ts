import { test, expect } from '@playwright/test'

test('search and view pokemon user flow', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Wait for page to load
  await expect(page).toHaveTitle(/MyPokeDex/)

  // Type in search bar
  await page.fill('input[placeholder*="Search"]', 'pikachu')

  // Wait for results
  await page.waitForSelector('.pokemon-card')

  // Click on first result
  await page.click('.pokemon-card:first-child')

  // Check detail page
  await expect(page).toHaveURL(/\/pokemon\/\d+/)
  await expect(page.locator('h1')).toContainText('Pikachu')
})