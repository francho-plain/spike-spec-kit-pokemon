import axios from 'axios'
import type { Pokemon, PokemonListResponse } from '../types'
import { performanceMonitor } from '../utils/performance'

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000, // 10 second timeout
})

// Pokemon API client
export const pokeApi = {
  // Get paginated list of Pokemon
  async getPokemonList(limit = 1000): Promise<PokemonListResponse> {
    const startTime = performance.now()
    try {
      const response = await api.get(`/pokemon?limit=${limit}`)
      performanceMonitor.measureApiCall('getPokemonList', startTime)
      return response.data
    } catch (error) {
      performanceMonitor.measureApiCall('getPokemonList', startTime)
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please check your internet connection.')
        }
        if (error.response && error.response.status === 404) {
          throw new Error('Pokemon data not found.')
        }
        if (error.response && error.response.status >= 500) {
          throw new Error('Server error. Please try again later.')
        }
        throw new Error(`Failed to load Pokemon list: ${error.message}`)
      }
      throw new Error('An unexpected error occurred while loading Pokemon.')
    }
  },

  // Get Pokemon details by id or name
  async getPokemon(idOrName: string | number): Promise<Pokemon> {
    const startTime = performance.now()
    try {
      const response = await api.get(`/pokemon/${idOrName}`)
      performanceMonitor.measureApiCall(`getPokemon(${idOrName})`, startTime)
      return response.data
    } catch (error) {
      performanceMonitor.measureApiCall(`getPokemon(${idOrName})`, startTime)
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please check your internet connection.')
        }
        if (error.response && error.response.status === 404) {
          throw new Error('Pokemon not found. Please check the ID or name.')
        }
        if (error.response && error.response.status >= 500) {
          throw new Error('Server error. Please try again later.')
        }
        throw new Error(`Failed to load Pokemon details: ${error.message}`)
      }
      throw new Error('An unexpected error occurred while loading Pokemon details.')
    }
  },

  // Get Pokemon by type
  async getPokemonByType(type: string) {
    const startTime = performance.now()
    try {
      const response = await api.get(`/type/${type}`)
      performanceMonitor.measureApiCall(`getPokemonByType(${type})`, startTime)
      return response.data
    } catch (error) {
      performanceMonitor.measureApiCall(`getPokemonByType(${type})`, startTime)
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please check your internet connection.')
        }
        if (error.response && error.response.status === 404) {
          throw new Error(`Pokemon type "${type}" not found.`)
        }
        if (error.response && error.response.status >= 500) {
          throw new Error('Server error. Please try again later.')
        }
        throw new Error(`Failed to load Pokemon by type: ${error.message}`)
      }
      throw new Error('An unexpected error occurred while loading Pokemon by type.')
    }
  },

  // Get Pokemon by generation
  async getPokemonByGeneration(generation: number) {
    const startTime = performance.now()
    try {
      const response = await api.get(`/generation/${generation}`)
      performanceMonitor.measureApiCall(`getPokemonByGeneration(${generation})`, startTime)
      return response.data
    } catch (error) {
      performanceMonitor.measureApiCall(`getPokemonByGeneration(${generation})`, startTime)
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please check your internet connection.')
        }
        if (error.response && error.response.status === 404) {
          throw new Error(`Generation ${generation} not found.`)
        }
        if (error.response && error.response.status >= 500) {
          throw new Error('Server error. Please try again later.')
        }
        throw new Error(`Failed to load Pokemon by generation: ${error.message}`)
      }
      throw new Error('An unexpected error occurred while loading Pokemon by generation.')
    }
  },
}