import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { PokeApiService } from '../services/pokeApi.js';
import { CacheService } from '../services/cache.js';
import { ValidationUtils } from '../utils/validation.js';
import { PokemonNotFoundError, handleError } from '../utils/errors.js';

interface GetPokemonInput {
  name: string;
}

export class PokemonRetrieverTool implements Tool {
  private pokeApiService: PokeApiService;
  private cacheService: CacheService;

  constructor() {
    this.pokeApiService = new PokeApiService();
    this.cacheService = new CacheService();
  }

  get name(): string {
    return 'get_pokemon';
  }

  get description(): string {
    return 'Retrieve detailed information about a Pokemon by name from PokeAPI';
  }

  get inputSchema(): any {
    return {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the Pokemon to retrieve (case-insensitive)'
        }
      },
      required: ['name']
    };
  }

  async execute(input: GetPokemonInput): Promise<string> {
    try {
      // Validate input
      ValidationUtils.validatePokemonName(input.name);

      const sanitizedName = ValidationUtils.sanitizePokemonName(input.name);

      // Check cache first
      const cached = this.cacheService.get(sanitizedName);
      if (cached) {
        return this.formatPokemonData(cached);
      }

      // Fetch from API
      const pokemon = await this.pokeApiService.getPokemon(sanitizedName);

      // Cache the result
      this.cacheService.set(sanitizedName, pokemon);

      return this.formatPokemonData(pokemon);
    } catch (error) {
      if (error instanceof PokemonNotFoundError) {
        return `Error: ${error.message}`;
      }
      const handledError = handleError(error);
      return `Error: ${handledError.message}`;
    }
  }

  private formatPokemonData(pokemon: any): string {
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
}