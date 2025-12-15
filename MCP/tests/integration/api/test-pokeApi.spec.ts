import { PokeApiService } from '../../../src/services/pokeApi';

describe('PokeApiService', () => {
  let pokeApiService: PokeApiService;

  beforeEach(() => {
    pokeApiService = new PokeApiService();
  });

  describe('getPokemon', () => {
    it('should return Pokemon data for valid name', async () => {
      const pokemon = await pokeApiService.getPokemon('pikachu');

      expect(pokemon).toBeDefined();
      expect(pokemon.name).toBe('pikachu');
      expect(pokemon.types).toContain('electric');
      expect(pokemon.stats).toBeDefined();
      expect(pokemon.stats.hp).toBeGreaterThan(0);
      expect(pokemon.abilities).toBeDefined();
      expect(Array.isArray(pokemon.abilities)).toBe(true);
    });

    it('should throw error for invalid Pokemon name', async () => {
      await expect(pokeApiService.getPokemon('invalidpokemon123')).rejects.toThrow(
        "Pokemon 'invalidpokemon123' not found"
      );
    });

    it('should handle network errors', async () => {
      // Mock axios to simulate network error
      const originalGet = require('axios').get;
      require('axios').get = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(pokeApiService.getPokemon('pikachu')).rejects.toThrow('Network error');

      // Restore original
      require('axios').get = originalGet;
    });

    it('should handle rate limit errors', async () => {
      // Mock axios to simulate 429 error
      const axios = require('axios');
      const originalGet = axios.get;
      const error: any = new Error('Request failed with status code 429');
      error.isAxiosError = true;
      error.response = {
        status: 429,
        data: 'Too Many Requests'
      };
      axios.get = jest.fn().mockRejectedValue(error);

      await expect(pokeApiService.getPokemon('pikachu')).rejects.toThrow(
        'PokeAPI rate limit exceeded'
      );

      // Restore original
      axios.get = originalGet;
    });
  });
});