import { PokeApiService } from '../../src/services/pokeApi';

describe('Pokemon Comparison Logic', () => {
  let pokeApiService: PokeApiService;

  beforeEach(() => {
    pokeApiService = new PokeApiService();
  });

  describe('Comparison Scenarios', () => {
    it('should compare two different Pokemon successfully', async () => {
      const pikachu = await pokeApiService.getPokemon('pikachu');
      const charizard = await pokeApiService.getPokemon('charizard');

      expect(pikachu).toBeDefined();
      expect(charizard).toBeDefined();
      expect(pikachu.name).toBe('pikachu');
      expect(charizard.name).toBe('charizard');

      // Verify they have different stats
      expect(pikachu.stats.hp).not.toBe(charizard.stats.hp);
      expect(pikachu.stats.attack).not.toBe(charizard.stats.attack);
      expect(pikachu.stats.speed).not.toBe(charizard.stats.speed);
    });

    it('should handle same Pokemon comparison', async () => {
      const pikachu1 = await pokeApiService.getPokemon('pikachu');
      const pikachu2 = await pokeApiService.getPokemon('pikachu');

      expect(pikachu1).toBeDefined();
      expect(pikachu2).toBeDefined();
      expect(pikachu1.name).toBe(pikachu2.name);
      expect(pikachu1.stats.hp).toBe(pikachu2.stats.hp);
      expect(pikachu1.stats.attack).toBe(pikachu2.stats.attack);
      expect(pikachu1.types).toEqual(pikachu2.types);
    });

    it('should handle Pokemon with different type combinations', async () => {
      const bulbasaur = await pokeApiService.getPokemon('bulbasaur'); // grass/poison
      const charizard = await pokeApiService.getPokemon('charizard'); // fire/flying

      expect(bulbasaur).toBeDefined();
      expect(charizard).toBeDefined();
      expect(bulbasaur.types).not.toEqual(charizard.types);
      expect(bulbasaur.types).toContain('grass');
      expect(charizard.types).toContain('fire');
    });

    it('should handle Pokemon with single vs multiple types', async () => {
      const pikachu = await pokeApiService.getPokemon('pikachu'); // electric only
      const charizard = await pokeApiService.getPokemon('charizard'); // fire/flying

      expect(pikachu).toBeDefined();
      expect(charizard).toBeDefined();
      expect(pikachu.types).toHaveLength(1);
      expect(charizard.types).toHaveLength(2);
    });

    it('should handle Pokemon with different ability sets', async () => {
      const pikachu = await pokeApiService.getPokemon('pikachu');
      const charizard = await pokeApiService.getPokemon('charizard');

      expect(pikachu).toBeDefined();
      expect(charizard).toBeDefined();
      expect(pikachu.abilities).toBeDefined();
      expect(charizard.abilities).toBeDefined();
      // Abilities should be different
      expect(pikachu.abilities).not.toEqual(charizard.abilities);
    });
  });

  describe('Error Handling in Comparison Context', () => {
    it('should handle first Pokemon not found', async () => {
      await expect(pokeApiService.getPokemon('notapokemon')).rejects.toThrow(
        "Pokemon 'notapokemon' not found"
      );
    });

    it('should handle second Pokemon not found', async () => {
      const pikachu = await pokeApiService.getPokemon('pikachu');
      expect(pikachu).toBeDefined();

      await expect(pokeApiService.getPokemon('alsonotapokemon')).rejects.toThrow(
        "Pokemon 'alsonotapokemon' not found"
      );
    });

    it('should handle network errors during comparison setup', async () => {
      // Mock axios to simulate network error
      const axios = require('axios');
      const originalGet = axios.get;
      const error: any = new Error('Network error');
      error.isAxiosError = true;
      axios.get = jest.fn().mockRejectedValue(error);

      await expect(pokeApiService.getPokemon('pikachu')).rejects.toThrow('Network error');

      // Restore original
      axios.get = originalGet;
    });
  });
});
