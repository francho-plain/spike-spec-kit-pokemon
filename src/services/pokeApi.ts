import axios from 'axios'
import type { Pokemon, PokemonListResponse } from '../types'

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
})

// Pokemon API client
export const pokeApi = {
  // Get paginated list of Pokemon
  async getPokemonList(limit = 1000): Promise<PokemonListResponse> {
    const response = await api.get(`/pokemon?limit=${limit}`)
    return response.data
  },

  // Get Pokemon details by id or name
  async getPokemon(idOrName: string | number): Promise<Pokemon> {
    const response = await api.get(`/pokemon/${idOrName}`)
    return response.data
  },

  // Get Pokemon by type
  async getPokemonByType(type: string) {
    const response = await api.get(`/type/${type}`)
    return response.data
  },

  // Get Pokemon by generation
  async getPokemonByGeneration(generation: number) {
    const response = await api.get(`/generation/${generation}`)
    return response.data
  },
}