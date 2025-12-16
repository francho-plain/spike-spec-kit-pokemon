import { VALIDATION_LIMITS } from './constants';

export class ValidationUtils {
  /**
   * Validates a Pokemon name
   * @param name - The Pokemon name to validate
   * @returns true if valid, throws error if invalid
   */
  static validatePokemonName(name: string): boolean {
    if (!name || typeof name !== 'string') {
      throw new Error('Pokemon name must be a non-empty string');
    }

    const trimmed = name.trim();
    if (trimmed.length === 0) {
      throw new Error('Pokemon name cannot be empty');
    }

    // Pokemon names are lowercase, alphanumeric with hyphens
    const validNameRegex = /^[a-z0-9-]+$/;
    if (!validNameRegex.test(trimmed)) {
      throw new Error('Pokemon name must contain only lowercase letters, numbers, and hyphens');
    }

    if (trimmed.length > VALIDATION_LIMITS.MAX_NAME_LENGTH) {
      throw new Error(`Pokemon name is too long (max ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters)`);
    }

    return true;
  }

  /**
   * Sanitizes a Pokemon name for API calls
   * @param name - The name to sanitize
   * @returns sanitized name
   */
  static sanitizePokemonName(name: string): string {
    return name.trim().toLowerCase();
  }

  /**
   * Validates Pokemon stats object
   * @param stats - The stats object to validate
   * @returns true if valid
   */
  static validatePokemonStats(stats: Record<string, number>): boolean {
    const requiredStats = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'];

    for (const stat of requiredStats) {
      if (
        typeof stats[stat] !== 'number' ||
        stats[stat] < VALIDATION_LIMITS.MIN_STAT_VALUE ||
        stats[stat] > VALIDATION_LIMITS.MAX_STAT_VALUE
      ) {
        throw new Error(
          `Invalid ${stat} stat: must be a number between ${VALIDATION_LIMITS.MIN_STAT_VALUE} and ${VALIDATION_LIMITS.MAX_STAT_VALUE}`
        );
      }
    }

    return true;
  }
}
