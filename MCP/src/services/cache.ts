import NodeCache from 'node-cache';
import { CACHE_CONFIG } from '../utils/constants';

export class CacheService {
  private cache: NodeCache;

  constructor(ttlSeconds: number = CACHE_CONFIG.DEFAULT_TTL) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * CACHE_CONFIG.CHECK_PERIOD_MULTIPLIER,
      useClones: false, // Don't clone objects for better performance
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: string | number): boolean {
    return ttl !== undefined ? this.cache.set(key, value, ttl) : this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  flushAll(): void {
    this.cache.flushAll();
  }

  getStats(): NodeCache.Stats {
    return this.cache.getStats();
  }
}
