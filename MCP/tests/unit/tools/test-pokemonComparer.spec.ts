import { describe, it, expect } from 'vitest';
import { pokemonComparerTool } from '../../../src/tools/pokemonComparer';

describe('PokemonComparerTool', () => {
  describe('execute', () => {
    it('should return comparison data for two valid Pokemon', async () => {
      const result = await pokemonComparerTool.execute({
        pokemon1: 'pikachu',
        pokemon2: 'charizard'
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.toUpperCase()).toContain('PIKACHU');
      expect(result.toUpperCase()).toContain('CHARIZARD');
      expect(result).toContain('Comparison');
      expect(result).toContain('Stats Difference');
    });

    it('should handle same Pokemon comparison', async () => {
      const result = await pokemonComparerTool.execute({
        pokemon1: 'pikachu',
        pokemon2: 'pikachu'
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('identical');
    });

    it('should handle invalid first Pokemon name', async () => {
      const result = await pokemonComparerTool.execute({
        pokemon1: 'invalidpokemon',
        pokemon2: 'pikachu'
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('Error');
      expect(result).toContain('invalidpokemon');
    });

    it('should handle invalid second Pokemon name', async () => {
      const result = await pokemonComparerTool.execute({
        pokemon1: 'pikachu',
        pokemon2: 'invalidpokemon'
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('Error');
      expect(result).toContain('invalidpokemon');
    });

    it('should handle both invalid Pokemon names', async () => {
      const result = await pokemonComparerTool.execute({
        pokemon1: 'invalid1',
        pokemon2: 'invalid2'
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('Error');
    });

    it('should validate input parameters', async () => {
      const result1 = await pokemonComparerTool.execute({
        pokemon1: '',
        pokemon2: 'pikachu'
      });
      expect(result1).toContain('Error');
      expect(result1).toContain('non-empty string');

      const result2 = await pokemonComparerTool.execute({
        pokemon1: 'PIKACHU',
        pokemon2: 'pikachu'
      });
      expect(result2).toContain('Error');
      expect(result2).toContain('lowercase');
    });
  });

  describe('tool definition', () => {
    it('should have correct name', () => {
      expect(pokemonComparerTool.name).toBe('compare_pokemon');
    });

    it('should have description', () => {
      expect(pokemonComparerTool.description).toContain('Compare');
      expect(pokemonComparerTool.description).toContain('Pokemon');
    });

    it('should have input schema', () => {
      expect(pokemonComparerTool.inputSchema).toBeDefined();
      expect(pokemonComparerTool.inputSchema.type).toBe('object');
      expect(pokemonComparerTool.inputSchema.required).toContain('pokemon1');
      expect(pokemonComparerTool.inputSchema.required).toContain('pokemon2');
    });
  });
});
