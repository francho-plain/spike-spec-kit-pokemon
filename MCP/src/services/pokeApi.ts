import axios, { AxiosResponse } from 'axios';
import { PokemonApiResponse, Pokemon, PokemonStats } from '../types/pokemon';
import { API_CONFIG, STAT_NAMES } from '../utils/constants';

export class PokeApiService {
  private readonly baseUrl = API_CONFIG.BASE_URL;

  async getPokemon(name: string): Promise<Pokemon> {
    try {
      const response: AxiosResponse<PokemonApiResponse> = await axios.get(
        `${this.baseUrl}/pokemon/${name.toLowerCase()}`,
        {
          timeout: API_CONFIG.TIMEOUT,
          headers: {
            'User-Agent': API_CONFIG.USER_AGENT,
          },
        }
      );

      return this.transformApiResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Pokemon '${name}' not found`);
        }
        if (error.response?.status === 429) {
          throw new Error('PokeAPI rate limit exceeded. Please try again later.');
        }
        throw new Error(`Failed to fetch Pokemon data: ${error.message}`);
      }
      if (error instanceof Error) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw new Error('Network error: Unknown error occurred');
    }
  }

  private transformApiResponse(apiData: PokemonApiResponse): Pokemon {
    // Create a map for faster stat lookup
    const statsMap = new Map(apiData.stats.map(s => [s.stat.name, s.base_stat]));
    
    const stats: PokemonStats = {
      hp: statsMap.get(STAT_NAMES.HP) || 0,
      attack: statsMap.get(STAT_NAMES.ATTACK) || 0,
      defense: statsMap.get(STAT_NAMES.DEFENSE) || 0,
      specialAttack: statsMap.get(STAT_NAMES.SPECIAL_ATTACK) || 0,
      specialDefense: statsMap.get(STAT_NAMES.SPECIAL_DEFENSE) || 0,
      speed: statsMap.get(STAT_NAMES.SPEED) || 0,
    };

    const types = apiData.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name);

    const abilities = apiData.abilities.filter((a) => !a.is_hidden).map((a) => a.ability.name);

    return {
      name: apiData.name,
      types,
      stats,
      abilities,
      // evolutionChain would require additional API calls
    };
  }
}
