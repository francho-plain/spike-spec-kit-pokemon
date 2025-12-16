/**
 * Configuration constants for the Pokemon MCP Server
 */

/** API Configuration */
export const API_CONFIG = {
  /** PokeAPI base URL */
  BASE_URL: 'https://pokeapi.co/api/v2',
  /** Request timeout in milliseconds */
  TIMEOUT: 5000,
  /** User agent string for API requests */
  USER_AGENT: 'Pokemon-MCP-Server/1.0',
} as const;

/** Cache Configuration */
export const CACHE_CONFIG = {
  /** Default TTL in seconds (24 hours - Pokemon data is static) */
  DEFAULT_TTL: 86400,
  /** Check period multiplier */
  CHECK_PERIOD_MULTIPLIER: 0.2,
} as const;

/** Validation Limits */
export const VALIDATION_LIMITS = {
  /** Maximum length for Pokemon names */
  MAX_NAME_LENGTH: 50,
  /** Maximum stat value */
  MAX_STAT_VALUE: 255,
  /** Minimum stat value */
  MIN_STAT_VALUE: 0,
} as const;

/** Stat names mapping */
export const STAT_NAMES = {
  HP: 'hp',
  ATTACK: 'attack',
  DEFENSE: 'defense',
  SPECIAL_ATTACK: 'special-attack',
  SPECIAL_DEFENSE: 'special-defense',
  SPEED: 'speed',
} as const;

/** Display names for stats */
export const STAT_DISPLAY_NAMES = [
  'HP',
  'Attack',
  'Defense',
  'Special Attack',
  'Special Defense',
  'Speed',
] as const;
