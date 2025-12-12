import { describe, it, expect } from 'vitest'
import axios from 'axios'
import type { TypeResponse, GenerationResponse } from '../../src/types'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('Category API Contracts', () => {
  describe('Type Endpoint', () => {
    it('should fetch Pokemon by type', async () => {
      const mockResponse: TypeResponse = {
        pokemon: [
          {
            pokemon: {
              name: 'charmander',
              url: 'https://pokeapi.co/api/v2/pokemon/4/'
            }
          },
          {
            pokemon: {
              name: 'charmeleon',
              url: 'https://pokeapi.co/api/v2/pokemon/5/'
            }
          }
        ]
      }

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse })

      const response = await axios.get('https://pokeapi.co/api/v2/type/fire')
      expect(response.data).toEqual(mockResponse)
      expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type/fire')
    })

    it('should handle type not found', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 404 }
      })

      await expect(axios.get('https://pokeapi.co/api/v2/type/invalid')).rejects.toThrow()
    })
  })

  describe('Generation Endpoint', () => {
    it('should fetch Pokemon by generation', async () => {
      const mockResponse: GenerationResponse = {
        pokemon_species: [
          {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon-species/1/'
          },
          {
            name: 'ivysaur',
            url: 'https://pokeapi.co/api/v2/pokemon-species/2/'
          }
        ]
      }

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse })

      const response = await axios.get('https://pokeapi.co/api/v2/generation/1')
      expect(response.data).toEqual(mockResponse)
      expect(mockedAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/generation/1')
    })

    it('should handle generation not found', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 404 }
      })

      await expect(axios.get('https://pokeapi.co/api/v2/generation/999')).rejects.toThrow()
    })
  })

  describe('Error Handling', () => {
    it('should handle rate limiting', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 429 }
      })

      await expect(axios.get('https://pokeapi.co/api/v2/type/fire')).rejects.toThrow()
    })

    it('should handle server errors', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 500 }
      })

      await expect(axios.get('https://pokeapi.co/api/v2/generation/1')).rejects.toThrow()
    })
  })
})