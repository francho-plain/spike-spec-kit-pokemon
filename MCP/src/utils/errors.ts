export class PokemonNotFoundError extends Error {
  constructor(pokemonName: string) {
    super(`Pokemon '${pokemonName}' not found`);
    this.name = 'PokemonNotFoundError';
  }
}

export class PokeApiError extends Error {
  constructor(message: string) {
    super(`PokeAPI error: ${message}`);
    this.name = 'PokeApiError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(`Validation error: ${message}`);
    this.name = 'ValidationError';
  }
}

export class CacheError extends Error {
  constructor(message: string) {
    super(`Cache error: ${message}`);
    this.name = 'CacheError';
  }
}

export function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error('An unknown error occurred');
}

export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof PokeApiError ||
    (error instanceof Error && error.message.includes('Network error'))
  );
}

export function isRateLimitError(error: unknown): boolean {
  return error instanceof PokeApiError && error.message.includes('rate limit');
}
