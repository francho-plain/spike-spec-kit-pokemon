import { describe, it, expect } from 'vitest';
import {
  PokemonNotFoundError,
  PokeApiError,
  ValidationError,
  CacheError,
  handleError,
  isNetworkError,
  isRateLimitError,
} from '../../../src/utils/errors';

describe('Error Classes', () => {
  describe('PokemonNotFoundError', () => {
    it('should create error with correct message', () => {
      const error = new PokemonNotFoundError('pikachu');
      expect(error.message).toBe("Pokemon 'pikachu' not found");
      expect(error.name).toBe('PokemonNotFoundError');
    });

    it('should be instance of Error', () => {
      const error = new PokemonNotFoundError('charizard');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('PokeApiError', () => {
    it('should create error with correct message', () => {
      const error = new PokeApiError('API timeout');
      expect(error.message).toBe('PokeAPI error: API timeout');
      expect(error.name).toBe('PokeApiError');
    });

    it('should be instance of Error', () => {
      const error = new PokeApiError('Rate limit exceeded');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('ValidationError', () => {
    it('should create error with correct message', () => {
      const error = new ValidationError('Invalid name format');
      expect(error.message).toBe('Validation error: Invalid name format');
      expect(error.name).toBe('ValidationError');
    });

    it('should be instance of Error', () => {
      const error = new ValidationError('Empty string');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('CacheError', () => {
    it('should create error with correct message', () => {
      const error = new CacheError('Cache full');
      expect(error.message).toBe('Cache error: Cache full');
      expect(error.name).toBe('CacheError');
    });

    it('should be instance of Error', () => {
      const error = new CacheError('Write failed');
      expect(error).toBeInstanceOf(Error);
    });
  });
});

describe('handleError', () => {
  it('should return the error if it is already an Error instance', () => {
    const originalError = new Error('Original error');
    const handledError = handleError(originalError);
    expect(handledError).toBe(originalError);
  });

  it('should convert string to Error', () => {
    const handledError = handleError('Something went wrong');
    expect(handledError).toBeInstanceOf(Error);
    expect(handledError.message).toBe('Something went wrong');
  });

  it('should handle unknown error types', () => {
    const handledError = handleError({ code: 500 });
    expect(handledError).toBeInstanceOf(Error);
    expect(handledError.message).toBe('An unknown error occurred');
  });

  it('should handle null and undefined', () => {
    const nullError = handleError(null);
    expect(nullError).toBeInstanceOf(Error);
    expect(nullError.message).toBe('An unknown error occurred');

    const undefinedError = handleError(undefined);
    expect(undefinedError).toBeInstanceOf(Error);
    expect(undefinedError.message).toBe('An unknown error occurred');
  });

  it('should preserve custom error types', () => {
    const customError = new PokemonNotFoundError('mewtwo');
    const handledError = handleError(customError);
    expect(handledError).toBeInstanceOf(PokemonNotFoundError);
    expect(handledError.message).toBe("Pokemon 'mewtwo' not found");
  });
});

describe('isNetworkError', () => {
  it('should return true for PokeApiError', () => {
    const error = new PokeApiError('Connection timeout');
    expect(isNetworkError(error)).toBe(true);
  });

  it('should return true for Error with Network error message', () => {
    const error = new Error('Network error: Connection refused');
    expect(isNetworkError(error)).toBe(true);
  });

  it('should return false for other errors', () => {
    expect(isNetworkError(new PokemonNotFoundError('pikachu'))).toBe(false);
    expect(isNetworkError(new ValidationError('Invalid input'))).toBe(false);
    expect(isNetworkError(new Error('Something else'))).toBe(false);
  });

  it('should return false for non-Error types', () => {
    expect(isNetworkError('network error')).toBe(false);
    expect(isNetworkError(null)).toBe(false);
    expect(isNetworkError(undefined)).toBe(false);
  });
});

describe('isRateLimitError', () => {
  it('should return true for PokeApiError with rate limit message', () => {
    const error = new PokeApiError('rate limit exceeded');
    expect(isRateLimitError(error)).toBe(true);
  });

  it('should return false for PokeApiError without rate limit message', () => {
    const error = new PokeApiError('Connection timeout');
    expect(isRateLimitError(error)).toBe(false);
  });

  it('should return false for other error types', () => {
    expect(isRateLimitError(new PokemonNotFoundError('pikachu'))).toBe(false);
    expect(isRateLimitError(new Error('rate limit'))).toBe(false);
    expect(isRateLimitError(new ValidationError('Invalid input'))).toBe(false);
  });

  it('should return false for non-Error types', () => {
    expect(isRateLimitError('rate limit')).toBe(false);
    expect(isRateLimitError(null)).toBe(false);
    expect(isRateLimitError(undefined)).toBe(false);
  });
});
