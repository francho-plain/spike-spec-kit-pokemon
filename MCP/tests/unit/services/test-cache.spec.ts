import { describe, it, expect, beforeEach } from 'vitest';
import { CacheService } from '../../../src/services/cache';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService(1); // 1 second TTL for testing
  });

  describe('set and get', () => {
    it('should store and retrieve a value', () => {
      cacheService.set('key1', 'value1');
      expect(cacheService.get('key1')).toBe('value1');
    });

    it('should return undefined for non-existent key', () => {
      expect(cacheService.get('nonexistent')).toBeUndefined();
    });

    it('should handle complex objects', () => {
      const obj = { name: 'pikachu', level: 25, moves: ['thunderbolt'] };
      cacheService.set('pokemon', obj);
      expect(cacheService.get('pokemon')).toEqual(obj);
    });

    it('should allow custom TTL per key', () => {
      cacheService.set('key1', 'value1', 10);
      expect(cacheService.get('key1')).toBe('value1');
    });
  });

  describe('has', () => {
    it('should return true for existing key', () => {
      cacheService.set('key1', 'value1');
      expect(cacheService.has('key1')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(cacheService.has('nonexistent')).toBe(false);
    });
  });

  describe('del', () => {
    it('should delete a key', () => {
      cacheService.set('key1', 'value1');
      expect(cacheService.has('key1')).toBe(true);
      
      cacheService.del('key1');
      expect(cacheService.has('key1')).toBe(false);
    });

    it('should return 1 when deleting existing key', () => {
      cacheService.set('key1', 'value1');
      expect(cacheService.del('key1')).toBe(1);
    });

    it('should return 0 when deleting non-existent key', () => {
      expect(cacheService.del('nonexistent')).toBe(0);
    });
  });

  describe('flushAll', () => {
    it('should clear all entries', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');
      cacheService.set('key3', 'value3');

      cacheService.flushAll();

      expect(cacheService.has('key1')).toBe(false);
      expect(cacheService.has('key2')).toBe(false);
      expect(cacheService.has('key3')).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      cacheService.set('key1', 'value1');
      cacheService.get('key1'); // hit
      cacheService.get('nonexistent'); // miss

      const stats = cacheService.getStats();
      
      expect(stats).toHaveProperty('keys');
      expect(stats).toHaveProperty('hits');
      expect(stats).toHaveProperty('misses');
      expect(stats.keys).toBe(1);
      expect(stats.hits).toBeGreaterThanOrEqual(1);
      expect(stats.misses).toBeGreaterThanOrEqual(1);
    });
  });

  describe('TTL expiration', () => {
    it('should expire entries after TTL', async () => {
      const shortTTLCache = new CacheService(0.1); // 0.1 seconds
      shortTTLCache.set('key1', 'value1');
      
      expect(shortTTLCache.get('key1')).toBe('value1');
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(shortTTLCache.get('key1')).toBeUndefined();
    });
  });

  describe('type safety', () => {
    it('should maintain type information', () => {
      interface Pokemon {
        name: string;
        level: number;
      }

      const pokemon: Pokemon = { name: 'pikachu', level: 25 };
      cacheService.set<Pokemon>('pokemon', pokemon);
      
      const retrieved = cacheService.get<Pokemon>('pokemon');
      expect(retrieved).toEqual(pokemon);
      expect(retrieved?.name).toBe('pikachu');
    });
  });
});
