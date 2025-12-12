import { PokemonRetrieverTool } from '../../src/tools/pokemonRetriever';

describe('PokemonRetrieverTool', () => {
  let tool: PokemonRetrieverTool;

  beforeEach(() => {
    tool = new PokemonRetrieverTool();
  });

  describe('execute', () => {
    it('should return Pokemon data for valid name', async () => {
      const result = await tool.execute({ name: 'pikachu' });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('pikachu');
      expect(result).toContain('electric');
    });

    it('should handle invalid Pokemon name', async () => {
      const result = await tool.execute({ name: 'invalidpokemon' });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('not found');
    });

    it('should validate input parameters', async () => {
      await expect(tool.execute({ name: '' })).rejects.toThrow('Validation error');
      await expect(tool.execute({ name: 'INVALID' })).rejects.toThrow('Validation error');
    });
  });

  describe('getDefinition', () => {
    it('should return tool definition', () => {
      const definition = tool.getDefinition();

      expect(definition).toBeDefined();
      expect(definition.name).toBe('get_pokemon');
      expect(definition.description).toContain('Pokemon');
      expect(definition.inputSchema).toBeDefined();
    });
  });
});