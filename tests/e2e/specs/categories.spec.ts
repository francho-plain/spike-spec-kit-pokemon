import { test, expect } from '@playwright/test'

test('category browsing user flow', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Wait for page to load
  await expect(page).toHaveTitle(/MyPokeDex/)

  // Navigate to categories (assuming there's a link or button)
  // For now, let's assume categories are on the home page or accessible via navigation
  // This test will need to be updated once the UI integration is complete

  // Check that category browsing elements are present
  await expect(page.locator('text=Browse by Type')).toBeVisible()
  await expect(page.locator('text=Browse by Generation')).toBeVisible()

  // Test type browsing
  const fireButton = page.locator('button:has-text("fire")')
  await expect(fireButton).toBeVisible()
  await fireButton.click()

  // Wait for results to load
  await page.waitForSelector('[data-testid="pokemon-card"], .pokemon-item, .pokemon-list')

  // Check that some fire-type Pokemon are displayed
  // This is a basic check - in a real scenario we'd check for specific Pokemon
  const pokemonElements = page.locator('.pokemon-item, [data-testid="pokemon-card"], .pokemon-list div')
  await expect(pokemonElements.first()).toBeVisible()

  // Test generation browsing
  const gen1Button = page.locator('button:has-text("Generation 1")')
  await expect(gen1Button).toBeVisible()
  await gen1Button.click()

  // Wait for results to load
  await page.waitForSelector('[data-testid="pokemon-card"], .pokemon-item, .pokemon-list')

  // Check that generation 1 Pokemon are displayed
  await expect(pokemonElements.first()).toBeVisible()

  // Test clicking on a Pokemon to go to detail view
  await pokemonElements.first().click()

  // Should navigate to Pokemon detail page
  await expect(page).toHaveURL(/\/pokemon\/\d+/)
  await expect(page.locator('h1')).toBeVisible()
})