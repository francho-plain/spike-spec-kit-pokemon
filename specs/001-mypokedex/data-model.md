# Data Model: MyPokeDex

**Date**: 2025-12-10
**Plan**: specs/001-mypokedex/plan.md

## Overview

MyPokeDex uses a simple data model focused on Pokemon information and user favorites. All data flows from PokeAPI v2, with user preferences stored locally.

## Core Entities

### Pokemon

**Source**: PokeAPI v2 (`/api/v2/pokemon/{id}`)

```typescript
interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string; // 'fire', 'water', etc.
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string; // 'hp', 'attack', etc.
    };
  }>;
  height: number; // in decimeters
  weight: number; // in hectograms
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  species: {
    url: string; // Link to species data
  };
}
```

**Notes**:
- Supports all ~1000 Pokemon from PokeAPI
- Images prioritized: official artwork > front_default
- Types used for category browsing
- Stats displayed in detail view

### UserFavorite

**Source**: Local storage

```typescript
interface UserFavorite {
  pokemonId: number;
  pokemonName: string; // Cached for display
  addedAt: string; // ISO date string
}
```

**Storage Key**: `mypokedex-favorites`

**Format**: `Array<UserFavorite>`

**Notes**:
- Simple array stored as JSON
- No server sync required
- Cached name prevents API calls for display

## API Response Models

### Pokemon List (for search/browse)

**Endpoint**: `/api/v2/pokemon?limit=1000`

```typescript
interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}
```

### Pokemon Search (auto-complete)

**Endpoint**: `/api/v2/pokemon?limit=1000` (filtered client-side)

**Note**: Full list loaded once, filtered in memory for performance.

### Category Browse

**Type Endpoint**: `/api/v2/type/{type}`

```typescript
interface TypeResponse {
  pokemon: Array<{
    pokemon: {
      name: string;
      url: string;
    };
  }>;
}
```

**Generation Endpoint**: `/api/v2/generation/{generation}`

```typescript
interface GenerationResponse {
  pokemon_species: Array<{
    name: string;
    url: string;
  }>;
}
```

## Data Flow

1. **Initial Load**: Fetch Pokemon list for search/browse
2. **Search**: Client-side filter of loaded list
3. **Browse**: Fetch category data, then load individual Pokemon details
4. **Detail View**: Fetch full Pokemon data from cache or API
5. **Favorites**: Read/write to localStorage

## Caching Strategy

- **React Query**: Automatic caching for API responses
- **Local Storage**: User favorites persistence
- **Memory**: Pokemon list for search performance

## Validation Rules

- Pokemon IDs: 1-1010 (current PokeAPI range)
- Names: Alphanumeric, lowercase, may contain hyphens
- Images: HTTPS URLs, fallback to placeholder if missing
- Favorites: Maximum 1000 entries (reasonable limit)

## Error Handling

- API failures: Graceful degradation with cached data
- Invalid Pokemon: 404 handling with user-friendly messages
- Local storage full: Clear old favorites or notify user