import { Pokemon } from '../types/pokemon';
import { PokeApiService } from '../services/pokeApi';
import { CacheService } from '../services/cache';

/**
 * Shared helper functions for Pokemon operations
 */

const pokeApiService = new PokeApiService();
const cacheService = new CacheService();

/**
 * Fetches a Pokemon from cache or API
 * @param name - Sanitized Pokemon name
 * @returns Pokemon data
 */
export async function getPokemonWithCache(name: string): Promise<Pokemon> {
  const startTime = Date.now();
  
  const cached = cacheService.get<Pokemon>(name);
  if (cached) {
    const duration = Date.now() - startTime;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache HIT] ${name} fetched in ${duration}ms`);
    }
    return cached;
  }

  const pokemon = await pokeApiService.getPokemon(name);
  cacheService.set(name, pokemon);
  
  const duration = Date.now() - startTime;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Cache MISS] ${name} fetched from API in ${duration}ms`);
  }
  
  return pokemon;
}

/**
 * Gets the shared cache service instance
 * @returns CacheService instance
 */
export function getCacheService(): CacheService {
  return cacheService;
}

/**
 * Gets the shared PokeAPI service instance
 * @returns PokeApiService instance
 */
export function getPokeApiService(): PokeApiService {
  return pokeApiService;
}

/**
 * Gets cache statistics for monitoring
 * @returns Cache stats object with hits, misses, keys, etc.
 */
export function getCacheStats() {
  return cacheService.getStats();
}

/**
 * Clears all cached Pokemon data
 * Useful for testing or when fresh data is needed
 */
export function clearCache(): void {
  cacheService.flushAll();
  if (process.env.NODE_ENV === 'development') {
    console.log('[Cache] All entries cleared');
  }
}
