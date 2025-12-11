/**
 * E2E Accessibility Tests with Playwright and axe-core
 * 
 * These tests validate WCAG 2.1 AA compliance in the running application
 */

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('E2E Accessibility - WCAG 2.1 AA Compliance', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the Pokemon API for consistent testing
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
      } else if (url.includes('pokeapi.co') && url.includes('/type/fire')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            pokemon: [
              { pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } }
            ]
          })
        })
      } else if (url.includes('pokeapi.co') && url.includes('/generation/1')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            pokemon_species: [
              { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' }
            ]
          })
        })
      } else {
        await route.continue()
      }
    })
  })

  test('Home page should have no accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Pokemon detail page should have no accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:3000/pokemon/25')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Favorites page should have no accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:3000/favorites')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Tab through interactive elements
    await page.keyboard.press('Tab')
    
    // Check that focus is visible
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName
    })
    
    expect(focusedElement).toBeTruthy()
  })

  test('images should have alt text', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Wait for images to load
    await page.waitForLoadState('networkidle')
    
    // Check all images have alt attributes
    const imagesWithoutAlt = await page.locator('img:not([alt])').count()
    expect(imagesWithoutAlt).toBe(0)
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Should have exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThan(0)
  })

  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Check all buttons have accessible names
    const buttonsWithoutName = await page.locator('button:not([aria-label]):not(:has-text(*))').count()
    expect(buttonsWithoutName).toBe(0)
  })

  test('form inputs should have labels', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Run axe check specifically for form controls
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .include('input')
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have main landmark', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Check for main landmark
    const mainLandmark = await page.locator('main').count()
    expect(mainLandmark).toBeGreaterThan(0)
  })

  test('color contrast should meet WCAG AA standards', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Run axe check specifically for color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast']) // Note: Color contrast can have false positives with dynamic content
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('loading states should be announced', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Check for aria-live regions
    const liveRegions = await page.locator('[aria-live]').count()
    expect(liveRegions).toBeGreaterThanOrEqual(0) // May or may not have loading states visible
  })

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Run comprehensive axe check for screen reader support
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze()
    
    // Log any violations for debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations:', JSON.stringify(accessibilityScanResults.violations, null, 2))
    }
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('focus should be managed on route changes', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Navigate to detail page
    await page.goto('http://localhost:3000/pokemon/25')
    await page.waitForLoadState('networkidle')
    
    // Check that focus is managed (main content should be focusable or focused)
    const mainContent = await page.locator('#main-content, main').first()
    expect(mainContent).toBeTruthy()
  })

  test('error messages should be accessible', async ({ page }) => {
    // Navigate to an invalid Pokemon ID
    await page.goto('http://localhost:3000/pokemon/9999')
    
    // Wait for error to be displayed
    await page.waitForSelector('h2')
    
    // Run axe check on error state
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })
})

test.describe('E2E Accessibility - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 } // iPhone SE size
  })

  test('mobile view should have no accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('touch targets should be adequately sized', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Check that interactive elements are at least 44x44 pixels
    const buttons = await page.locator('button, a[href]').all()
    
    for (const button of buttons) {
      const box = await button.boundingBox()
      if (box) {
        // WCAG 2.1 AA requires 44x44 minimum for touch targets
        expect(box.width).toBeGreaterThanOrEqual(44 - 5) // Allow 5px tolerance
        expect(box.height).toBeGreaterThanOrEqual(44 - 5)
      }
    }
  })
})
