import { PokeApiService } from '../services/pokeApi';
import { CacheService } from '../services/cache';
import { ValidationUtils } from '../utils/validation';
import { PokemonNotFoundError, handleError } from '../utils/errors';

interface ComparePokemonInput {
  pokemon1: string;
  pokemon2: string;
}

const pokeApiService = new PokeApiService();
const cacheService = new CacheService();

export const pokemonComparerTool = {
  name: 'compare_pokemon',
  description: 'Compare two Pokemon showing differences in stats, types, and abilities',
  inputSchema: {
    type: 'object',
    properties: {
      pokemon1: {
        type: 'string',
        description: 'Name of the first Pokemon to compare'
      },
      pokemon2: {
        type: 'string',
        description: 'Name of the second Pokemon to compare'
      }
    },
    required: ['pokemon1', 'pokemon2']
  },
  execute: async (input: ComparePokemonInput): Promise<string> => {
    try {
      // Validate inputs
      ValidationUtils.validatePokemonName(input.pokemon1);
      ValidationUtils.validatePokemonName(input.pokemon2);

      const name1 = ValidationUtils.sanitizePokemonName(input.pokemon1);
      const name2 = ValidationUtils.sanitizePokemonName(input.pokemon2);

      // Check if comparing same Pokemon
      if (name1 === name2) {
        const pokemon = await getPokemonWithCache(name1);
        return formatSamePokemonComparison(pokemon);
      }

      // Fetch both Pokemon
      const [pokemon1, pokemon2] = await Promise.all([
        getPokemonWithCache(name1),
        getPokemonWithCache(name2)
      ]);

      return formatComparison(pokemon1, pokemon2);
    } catch (error) {
      if (error instanceof PokemonNotFoundError) {
        return `Error: ${error.message}`;
      }
      const handledError = handleError(error);
      return `Error: ${handledError.message}`;
    }
  }
};

async function getPokemonWithCache(name: string) {
  const cached = cacheService.get(name);
  if (cached) {
    return cached;
  }

  const pokemon = await pokeApiService.getPokemon(name);
  cacheService.set(name, pokemon);
  return pokemon;
}

function formatSamePokemonComparison(pokemon: any): string {
  return `**${pokemon.name.toUpperCase()}** vs **${pokemon.name.toUpperCase()}**

These are identical Pokemon - no comparison needed!

**Types:** ${pokemon.types.join(', ')}

**Stats:**
- HP: ${pokemon.stats.hp}
- Attack: ${pokemon.stats.attack}
- Defense: ${pokemon.stats.defense}
- Special Attack: ${pokemon.stats.specialAttack}
- Special Defense: ${pokemon.stats.specialDefense}
- Speed: ${pokemon.stats.speed}

**Abilities:** ${pokemon.abilities.join(', ')}

*Data cached for performance*`;
}

function formatComparison(pokemon1: any, pokemon2: any): string {
  const statsDiff = calculateStatsDifference(pokemon1.stats, pokemon2.stats);
  const typeComparison = compareTypes(pokemon1.types, pokemon2.types);
  const abilityComparison = compareAbilities(pokemon1.abilities, pokemon2.abilities);

  return `**${pokemon1.name.toUpperCase()}** vs **${pokemon2.name.toUpperCase()}**

## Stats Difference
${formatStatsComparison(pokemon1, pokemon2, statsDiff)}

## Type Comparison
${typeComparison}

## Ability Comparison
${abilityComparison}

*Data cached for performance*`;
}

function calculateStatsDifference(stats1: any, stats2: any) {
  return {
    hp: stats1.hp - stats2.hp,
    attack: stats1.attack - stats2.attack,
    defense: stats1.defense - stats2.defense,
    specialAttack: stats1.specialAttack - stats2.specialAttack,
    specialDefense: stats1.specialDefense - stats2.specialDefense,
    speed: stats1.speed - stats2.speed
  };
}

function formatStatsComparison(pokemon1: any, pokemon2: any, diff: any): string {
  const statNames = ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'];
  const statKeys = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'];

  let result = '| Stat | ' + pokemon1.name.toUpperCase() + ' | ' + pokemon2.name.toUpperCase() + ' | Difference |\n';
  result += '|------|------|------|------------|\n';

  statKeys.forEach((key, index) => {
    const val1 = pokemon1.stats[key];
    const val2 = pokemon2.stats[key];
    const difference = diff[key];
    const diffSymbol = difference > 0 ? '+' : '';
    result += `| ${statNames[index]} | ${val1} | ${val2} | ${diffSymbol}${difference} |\n`;
  });

  return result;
}

function compareTypes(types1: string[], types2: string[]): string {
  const unique1 = types1.filter(t => !types2.includes(t));
  const unique2 = types2.filter(t => !types1.includes(t));
  const common = types1.filter(t => types2.includes(t));

  let result = `**${types1.join('/')}** vs **${types2.join('/')}**\n\n`;

  if (common.length > 0) {
    result += `**Common types:** ${common.join(', ')}\n`;
  }

  if (unique1.length > 0) {
    result += `**Unique to first Pokemon:** ${unique1.join(', ')}\n`;
  }

  if (unique2.length > 0) {
    result += `**Unique to second Pokemon:** ${unique2.join(', ')}\n`;
  }

  return result;
}

function compareAbilities(abilities1: string[], abilities2: string[]): string {
  const unique1 = abilities1.filter(a => !abilities2.includes(a));
  const unique2 = abilities2.filter(a => !abilities1.includes(a));
  const common = abilities1.filter(a => abilities2.includes(a));

  let result = `**${abilities1.join(', ')}** vs **${abilities2.join(', ')}**\n\n`;

  if (common.length > 0) {
    result += `**Common abilities:** ${common.join(', ')}\n`;
  }

  if (unique1.length > 0) {
    result += `**Unique to first Pokemon:** ${unique1.join(', ')}\n`;
  }

  if (unique2.length > 0) {
    result += `**Unique to second Pokemon:** ${unique2.join(', ')}\n`;
  }

  return result;
}