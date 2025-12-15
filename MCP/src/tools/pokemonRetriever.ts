import { PokeApiService } from '../services/pokeApi';
import { CacheService } from '../services/cache';
import { ValidationUtils } from '../utils/validation';
import { PokemonNotFoundError, handleError } from '../utils/errors';

interface GetPokemonInput {
  name: string;
}

const pokeApiService = new PokeApiService();
const cacheService = new CacheService();

export const pokemonRetrieverTool = {
  name: 'get_pokemon',
  description: 'Retrieve detailed information about a Pokemon by name from PokeAPI',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the Pokemon to retrieve (case-insensitive)'
      }
    },
    required: ['name']
  },
  execute: async (input: GetPokemonInput): Promise<string> => {
    try {
      // Validate input
      ValidationUtils.validatePokemonName(input.name);

      const sanitizedName = ValidationUtils.sanitizePokemonName(input.name);

      // Check cache first
      const cached = cacheService.get(sanitizedName);
      if (cached) {
        return formatPokemonData(cached);
      }

      // Fetch from API
      const pokemon = await pokeApiService.getPokemon(sanitizedName);

      // Cache the result
      cacheService.set(sanitizedName, pokemon);

      return formatPokemonData(pokemon);
    } catch (error) {
      if (error instanceof PokemonNotFoundError) {
        return `Error: ${error.message}`;
      }
      const handledError = handleError(error);
      return `Error: ${handledError.message}`;
    }
  }
};

function formatPokemonData(pokemon: any): string {
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