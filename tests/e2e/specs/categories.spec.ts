import { test, expect } from '@playwright/test'

test('category browsing user flow', async ({ page }) => {
  // Mock the Pokemon API
  await page.route('**', async route => {
    const url = route.request().url()
    if (url.includes('pokeapi.co') && url.includes('/pokemon?limit=1000')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          count: 2,
          next: null,
          previous: null,
          results: [
            { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
            { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' }
          ]
        })
      })
    } else if (url.includes('pokeapi.co') && url.includes('/type/fire')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          pokemon: [
            { pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } },
            { pokemon: { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' } }
          ]
        })
      })
    } else if (url.includes('pokeapi.co') && url.includes('/generation/1')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          pokemon_species: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
            { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' }
          ]
        })
      })
    } else if (url.includes('pokeapi.co') && url.includes('/pokemon/4')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 4,
          name: 'charmander',
          sprites: {
            front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
            other: {
              'official-artwork': {
                front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
              }
            }
          },
          types: [{ type: { name: 'fire' } }],
          stats: [
            { base_stat: 39, stat: { name: 'hp' } },
            { base_stat: 52, stat: { name: 'attack' } },
            { base_stat: 43, stat: { name: 'defense' } },
            { base_stat: 60, stat: { name: 'special-attack' } },
            { base_stat: 50, stat: { name: 'special-defense' } },
            { base_stat: 65, stat: { name: 'speed' } }
          ],
          height: 6,
          weight: 85,
          abilities: [
            { ability: { name: 'blaze' } },
            { ability: { name: 'solar-power' } }
          ],
          species: {
            url: 'https://pokeapi.co/api/v2/pokemon-species/4/'
          }
        })
      })
    } else {
      await route.continue()
    }
  })

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
  await page.goto('http://localhost:3000/pokemon/4')

  // Should navigate to Pokemon detail page
  await expect(page).toHaveURL(/\/pokemon\/\d+/)
  await expect(page.locator('h1')).toBeVisible()
})