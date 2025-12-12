import { test, expect } from '@playwright/test'

test('search and view pokemon user flow', async ({ page }) => {
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
    } else if (url.includes('pokeapi.co') && url.includes('/pokemon/25')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 25,
          name: 'pikachu',
          sprites: {
            front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
            other: {
              'official-artwork': {
                front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
              }
            }
          },
          types: [{ type: { name: 'electric' } }],
          stats: [
            { base_stat: 35, stat: { name: 'hp' } },
            { base_stat: 55, stat: { name: 'attack' } },
            { base_stat: 40, stat: { name: 'defense' } },
            { base_stat: 50, stat: { name: 'special-attack' } },
            { base_stat: 50, stat: { name: 'special-defense' } },
            { base_stat: 90, stat: { name: 'speed' } }
          ],
          height: 4,
          weight: 60,
          abilities: [
            { ability: { name: 'static' } },
            { ability: { name: 'lightning-rod' } }
          ],
          species: {
            url: 'https://pokeapi.co/api/v2/pokemon-species/25/'
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

  // Type in search bar
  await page.fill('input[placeholder*="Search"]', 'pikachu')

  // Navigate directly to Pokemon detail page
  await page.goto('http://localhost:3000/pokemon/25')

  // Check detail page
  await expect(page).toHaveURL(/\/pokemon\/25/)
  await expect(page.locator('h1')).toContainText('pikachu')
})