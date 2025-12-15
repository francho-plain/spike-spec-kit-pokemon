import axios, { AxiosResponse } from 'axios';
import { PokemonApiResponse, Pokemon, PokemonStats } from '../types/pokemon';

export class PokeApiService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  async getPokemon(name: string): Promise<Pokemon> {
    try {
      const response: AxiosResponse<PokemonApiResponse> = await axios.get(
        `${this.baseUrl}/pokemon/${name.toLowerCase()}`,
        {
          timeout: 5000, // 5 second timeout
          headers: {
            'User-Agent': 'Pokemon-MCP-Server/1.0'
          }
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
    const stats: PokemonStats = {
      hp: apiData.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
      attack: apiData.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
      defense: apiData.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
      specialAttack: apiData.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
      specialDefense: apiData.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
      speed: apiData.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
    };

    const types = apiData.types
      .sort((a, b) => a.slot - b.slot)
      .map(t => t.type.name);

    const abilities = apiData.abilities
      .filter(a => !a.is_hidden)
      .map(a => a.ability.name);

    return {
      name: apiData.name,
      types,
      stats,
      abilities,
      // evolutionChain would require additional API calls
    };
  }
}