import { describe, it, expect } from 'vitest'
import { pokeApi } from '../../src/services/pokeApi'

describe('PokeAPI Contract Tests', () => {
  it('should fetch pokemon list with correct structure', async () => {
    const data = await pokeApi.getPokemonList(10)
    expect(data).toHaveProperty('count')
    expect(data).toHaveProperty('results')
    expect(Array.isArray(data.results)).toBe(true)
    expect(data.results.length).toBeGreaterThan(0)
    expect(data.results[0]).toHaveProperty('name')
    expect(data.results[0]).toHaveProperty('url')
  })

  it('should fetch pokemon details with correct structure', async () => {
    const pokemon = await pokeApi.getPokemon(1)
    expect(pokemon).toHaveProperty('id')
    expect(pokemon).toHaveProperty('name')
    expect(pokemon).toHaveProperty('sprites')
    expect(pokemon).toHaveProperty('types')
    expect(pokemon).toHaveProperty('stats')
    expect(pokemon.id).toBe(1)
    expect(pokemon.name).toBe('bulbasaur')
  })

  it('should fetch pokemon by type', async () => {
    const data = await pokeApi.getPokemonByType('fire')
    expect(data).toHaveProperty('pokemon')
    expect(Array.isArray(data.pokemon)).toBe(true)
  })

  it('should fetch pokemon by generation', async () => {
    const data = await pokeApi.getPokemonByGeneration(1)
    expect(data).toHaveProperty('pokemon_species')
    expect(Array.isArray(data.pokemon_species)).toBe(true)
  })
})