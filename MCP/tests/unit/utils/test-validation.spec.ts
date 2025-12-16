import { describe, it, expect } from 'vitest';
import { ValidationUtils } from '../../../src/utils/validation';
import { VALIDATION_LIMITS } from '../../../src/utils/constants';

describe('ValidationUtils', () => {
  describe('validatePokemonName', () => {
    it('should accept valid lowercase Pokemon names', () => {
      expect(ValidationUtils.validatePokemonName('pikachu')).toBe(true);
      expect(ValidationUtils.validatePokemonName('charizard')).toBe(true);
      expect(ValidationUtils.validatePokemonName('mr-mime')).toBe(true);
      expect(ValidationUtils.validatePokemonName('farfetchd')).toBe(true);
    });

    it('should accept names with numbers', () => {
      expect(ValidationUtils.validatePokemonName('porygon2')).toBe(true);
      expect(ValidationUtils.validatePokemonName('type-null')).toBe(true);
    });

    it('should reject empty string', () => {
      expect(() => ValidationUtils.validatePokemonName('')).toThrow(
        'Pokemon name must be a non-empty string'
      );
    });

    it('should reject whitespace-only string', () => {
      expect(() => ValidationUtils.validatePokemonName('   ')).toThrow(
        'Pokemon name cannot be empty'
      );
    });

    it('should reject non-string values', () => {
      expect(() => ValidationUtils.validatePokemonName(null as unknown as string)).toThrow(
        'Pokemon name must be a non-empty string'
      );
      expect(() => ValidationUtils.validatePokemonName(undefined as unknown as string)).toThrow(
        'Pokemon name must be a non-empty string'
      );
      expect(() => ValidationUtils.validatePokemonName(123 as unknown as string)).toThrow(
        'Pokemon name must be a non-empty string'
      );
    });

    it('should reject names with uppercase letters', () => {
      expect(() => ValidationUtils.validatePokemonName('Pikachu')).toThrow(
        'Pokemon name must contain only lowercase letters, numbers, and hyphens'
      );
      expect(() => ValidationUtils.validatePokemonName('CHARIZARD')).toThrow(
        'Pokemon name must contain only lowercase letters, numbers, and hyphens'
      );
    });

    it('should reject names with special characters', () => {
      expect(() => ValidationUtils.validatePokemonName('pikachu!')).toThrow(
        'Pokemon name must contain only lowercase letters, numbers, and hyphens'
      );
      expect(() => ValidationUtils.validatePokemonName('char@izard')).toThrow(
        'Pokemon name must contain only lowercase letters, numbers, and hyphens'
      );
      expect(() => ValidationUtils.validatePokemonName('pika chu')).toThrow(
        'Pokemon name must contain only lowercase letters, numbers, and hyphens'
      );
    });

    it('should reject names exceeding max length', () => {
      const longName = 'a'.repeat(VALIDATION_LIMITS.MAX_NAME_LENGTH + 1);
      expect(() => ValidationUtils.validatePokemonName(longName)).toThrow(
        `Pokemon name is too long (max ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters)`
      );
    });

    it('should accept names at max length boundary', () => {
      const maxLengthName = 'a'.repeat(VALIDATION_LIMITS.MAX_NAME_LENGTH);
      expect(ValidationUtils.validatePokemonName(maxLengthName)).toBe(true);
    });
  });

  describe('sanitizePokemonName', () => {
    it('should convert to lowercase', () => {
      expect(ValidationUtils.sanitizePokemonName('PIKACHU')).toBe('pikachu');
      expect(ValidationUtils.sanitizePokemonName('Charizard')).toBe('charizard');
    });

    it('should trim whitespace', () => {
      expect(ValidationUtils.sanitizePokemonName('  pikachu  ')).toBe('pikachu');
      expect(ValidationUtils.sanitizePokemonName('\tcharizard\n')).toBe('charizard');
    });

    it('should handle already sanitized names', () => {
      expect(ValidationUtils.sanitizePokemonName('pikachu')).toBe('pikachu');
      expect(ValidationUtils.sanitizePokemonName('mr-mime')).toBe('mr-mime');
    });

    it('should combine trimming and lowercasing', () => {
      expect(ValidationUtils.sanitizePokemonName('  PIKACHU  ')).toBe('pikachu');
      expect(ValidationUtils.sanitizePokemonName(' Mr-Mime ')).toBe('mr-mime');
    });
  });

  describe('validatePokemonStats', () => {
    const validStats = {
      hp: 45,
      attack: 55,
      defense: 65,
      specialAttack: 75,
      specialDefense: 85,
      speed: 95,
    };

    it('should accept valid stats', () => {
      expect(ValidationUtils.validatePokemonStats(validStats)).toBe(true);
    });

    it('should accept stats at boundary values', () => {
      const minStats = {
        hp: VALIDATION_LIMITS.MIN_STAT_VALUE,
        attack: VALIDATION_LIMITS.MIN_STAT_VALUE,
        defense: VALIDATION_LIMITS.MIN_STAT_VALUE,
        specialAttack: VALIDATION_LIMITS.MIN_STAT_VALUE,
        specialDefense: VALIDATION_LIMITS.MIN_STAT_VALUE,
        speed: VALIDATION_LIMITS.MIN_STAT_VALUE,
      };
      expect(ValidationUtils.validatePokemonStats(minStats)).toBe(true);

      const maxStats = {
        hp: VALIDATION_LIMITS.MAX_STAT_VALUE,
        attack: VALIDATION_LIMITS.MAX_STAT_VALUE,
        defense: VALIDATION_LIMITS.MAX_STAT_VALUE,
        specialAttack: VALIDATION_LIMITS.MAX_STAT_VALUE,
        specialDefense: VALIDATION_LIMITS.MAX_STAT_VALUE,
        speed: VALIDATION_LIMITS.MAX_STAT_VALUE,
      };
      expect(ValidationUtils.validatePokemonStats(maxStats)).toBe(true);
    });

    it('should reject stats below minimum', () => {
      const invalidStats = { ...validStats, hp: -1 };
      expect(() => ValidationUtils.validatePokemonStats(invalidStats)).toThrow(
        `Invalid hp stat: must be a number between ${VALIDATION_LIMITS.MIN_STAT_VALUE} and ${VALIDATION_LIMITS.MAX_STAT_VALUE}`
      );
    });

    it('should reject stats above maximum', () => {
      const invalidStats = { ...validStats, attack: 256 };
      expect(() => ValidationUtils.validatePokemonStats(invalidStats)).toThrow(
        `Invalid attack stat: must be a number between ${VALIDATION_LIMITS.MIN_STAT_VALUE} and ${VALIDATION_LIMITS.MAX_STAT_VALUE}`
      );
    });

    it('should reject non-number stats', () => {
      const invalidStats = { ...validStats, defense: '50' as unknown as number };
      expect(() => ValidationUtils.validatePokemonStats(invalidStats)).toThrow(
        'Invalid defense stat'
      );
    });

    it('should validate all stat fields', () => {
      const statsWithInvalidSpeed = { ...validStats, speed: 300 };
      expect(() => ValidationUtils.validatePokemonStats(statsWithInvalidSpeed)).toThrow(
        'Invalid speed stat'
      );

      const statsWithInvalidSpecialAttack = { ...validStats, specialAttack: -10 };
      expect(() => ValidationUtils.validatePokemonStats(statsWithInvalidSpecialAttack)).toThrow(
        'Invalid specialAttack stat'
      );
    });
  });
});
