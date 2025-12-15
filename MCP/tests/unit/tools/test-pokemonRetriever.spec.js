"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pokemonRetriever_1 = require("../../../src/tools/pokemonRetriever");
describe('PokemonRetrieverTool', () => {
    describe('execute', () => {
        it('should return Pokemon data for valid name', async () => {
            const result = await pokemonRetriever_1.pokemonRetrieverTool.execute({ name: 'pikachu' });
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result.toUpperCase()).toContain('PIKACHU');
            expect(result).toContain('electric');
        });
        it('should handle invalid Pokemon name', async () => {
            const result = await pokemonRetriever_1.pokemonRetrieverTool.execute({ name: 'invalidpokemon' });
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result).toContain('not found');
        });
        it('should validate input parameters', async () => {
            const result1 = await pokemonRetriever_1.pokemonRetrieverTool.execute({ name: '' });
            expect(result1).toContain('Error');
            expect(result1).toContain('non-empty string');
            const result2 = await pokemonRetriever_1.pokemonRetrieverTool.execute({ name: 'INVALID' });
            expect(result2).toContain('Error');
            expect(result2).toContain('lowercase');
        });
    });
    describe('tool definition', () => {
        it('should have correct name', () => {
            expect(pokemonRetriever_1.pokemonRetrieverTool.name).toBe('get_pokemon');
        });
        it('should have description', () => {
            expect(pokemonRetriever_1.pokemonRetrieverTool.description).toContain('Pokemon');
        });
        it('should have input schema', () => {
            expect(pokemonRetriever_1.pokemonRetrieverTool.inputSchema).toBeDefined();
            expect(pokemonRetriever_1.pokemonRetrieverTool.inputSchema.type).toBe('object');
            expect(pokemonRetriever_1.pokemonRetrieverTool.inputSchema.required).toContain('name');
        });
    });
});
//# sourceMappingURL=test-pokemonRetriever.spec.js.map