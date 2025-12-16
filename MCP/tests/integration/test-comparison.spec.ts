import { describe, it, expect } from 'vitest';
import { pokemonComparerTool } from '../../src/tools/pokemonComparer';

describe('Pokemon Comparison Tool', () => {
  it('should compare two different Pokemon successfully', async () => {
    const result = await pokemonComparerTool.execute({ pokemon1: 'pikachu', pokemon2: 'charizard' });
    expect(result).toContain('PIKACHU');
    expect(result).toContain('CHARIZARD');
    expect(result).toContain('Stats Difference');
  }, 10000);

  it('should handle same Pokemon comparison', async () => {
    const result = await pokemonComparerTool.execute({ pokemon1: 'pikachu', pokemon2: 'pikachu' });
    expect(result).toContain('identical');
  }, 10000);

  it('should handle Pokemon with different type combinations', async () => {
    const result = await pokemonComparerTool.execute({ pokemon1: 'bulbasaur', pokemon2: 'charizard' });
    expect(result).toContain('grass');
    expect(result).toContain('fire');
  }, 10000);

  it('should handle Pokemon with single vs multiple types', async () => {
    const result = await pokemonComparerTool.execute({ pokemon1: 'pikachu', pokemon2: 'charizard' });
    expect(result).toContain('electric');
    expect(result).toContain('fire');
  }, 10000);

  it('should handle Pokemon with different ability sets', async () => {
    const result = await pokemonComparerTool.execute({ pokemon1: 'pikachu', pokemon2: 'charizard' });
    expect(result).toContain('Ability Comparison');
  }, 10000);

  it('should handle first Pokemon not found', async () => {
    const result = await pokemonComparerTool.execute({ pokemon1: 'notapokemon', pokemon2: 'pikachu' });
    expect(result).toContain('Error');
    expect(result).toContain('notapokemon');
  }, 10000);

  it('should handle second Pokemon not found', async () => {
    const result = await pokemonComparerTool.execute({ pokemon1: 'pikachu', pokemon2: 'alsonotapokemon' });
    expect(result).toContain('Error');
    expect(result).toContain('alsonotapokemon');
  }, 10000);
});
