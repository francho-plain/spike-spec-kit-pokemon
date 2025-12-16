import { ValidationUtils } from '../utils/validation';
import { PokemonNotFoundError, handleError } from '../utils/errors';
import { getPokemonWithCache } from '../utils/pokemonHelpers';
import { Pokemon } from '../types/pokemon';

interface GetPokemonInput {
  name: string;
}

export const pokemonRetrieverTool = {
  name: 'get_pokemon',
  description: 'Retrieve detailed information about a Pokemon by name from PokeAPI',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the Pokemon to retrieve (case-insensitive)',
      },
    },
    required: ['name'],
  },
  execute: async (input: GetPokemonInput): Promise<string> => {
    try {
      // Validate input
      ValidationUtils.validatePokemonName(input.name);

      const sanitizedName = ValidationUtils.sanitizePokemonName(input.name);

      // Fetch Pokemon with cache
      const pokemon = await getPokemonWithCache(sanitizedName);

      return formatPokemonData(pokemon);
    } catch (error) {
      if (error instanceof PokemonNotFoundError) {
        return `Error: ${error.message}`;
      }
      const handledError = handleError(error);
      return `Error: ${handledError.message}`;
    }
  },
};

function formatPokemonData(pokemon: Pokemon): string {
  return `**${pokemon.name.toUpperCase()}**

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
