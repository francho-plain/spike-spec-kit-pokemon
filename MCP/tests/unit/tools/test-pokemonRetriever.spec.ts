import { pokemonRetrieverTool } from '../../../src/tools/pokemonRetriever';

describe('PokemonRetrieverTool', () => {
  describe('execute', () => {
    it('should return Pokemon data for valid name', async () => {
      const result = await pokemonRetrieverTool.execute({ name: 'pikachu' });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.toUpperCase()).toContain('PIKACHU');
      expect(result).toContain('electric');
    });

    it('should handle invalid Pokemon name', async () => {
      const result = await pokemonRetrieverTool.execute({ name: 'invalidpokemon' });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('not found');
    });

    it('should validate input parameters', async () => {
      const result1 = await pokemonRetrieverTool.execute({ name: '' });
      expect(result1).toContain('Error');
      expect(result1).toContain('non-empty string');
      
      const result2 = await pokemonRetrieverTool.execute({ name: 'INVALID' });
      expect(result2).toContain('Error');
      expect(result2).toContain('lowercase');
    });
  });

  describe('tool definition', () => {
    it('should have correct name', () => {
      expect(pokemonRetrieverTool.name).toBe('get_pokemon');
    });

    it('should have description', () => {
      expect(pokemonRetrieverTool.description).toContain('Pokemon');
    });

    it('should have input schema', () => {
      expect(pokemonRetrieverTool.inputSchema).toBeDefined();
      expect(pokemonRetrieverTool.inputSchema.type).toBe('object');
      expect(pokemonRetrieverTool.inputSchema.required).toContain('name');
    });
  });
});