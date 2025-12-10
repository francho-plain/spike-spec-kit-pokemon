# API Contracts: PokeAPI v2

**Date**: 2025-12-10
**Plan**: specs/001-mypokedex/plan.md

## Overview

MyPokeDex consumes data from PokeAPI v2 (https://pokeapi.co/). All endpoints are RESTful GET requests returning JSON.

## Core Endpoints

### 1. Pokemon List

**Endpoint**: `GET /api/v2/pokemon`

**Purpose**: Retrieve paginated list of all Pokemon for search and browse

**Parameters**:
- `limit` (optional): Number of results (default 20, max 1000)
- `offset` (optional): Pagination offset

**Response**: `PokemonListResponse`

**Usage**: Initial load for search/browse functionality

**Caching**: Cache for 24 hours (Pokemon data stable)

### 2. Pokemon Details

**Endpoint**: `GET /api/v2/pokemon/{id or name}`

**Purpose**: Retrieve complete Pokemon information

**Parameters**:
- `id or name`: Pokemon identifier (1-1010 or name)

**Response**: `Pokemon`

**Usage**: Detail view display

**Caching**: Cache for 1 hour (stats may change rarely)

### 3. Type Category

**Endpoint**: `GET /api/v2/type/{type}`

**Purpose**: Get Pokemon belonging to a specific type

**Parameters**:
- `type`: Type name (fire, water, grass, etc.)

**Response**: `TypeResponse`

**Usage**: Browse by type category

**Caching**: Cache for 24 hours

### 4. Generation Category

**Endpoint**: `GET /api/v2/generation/{generation}`

**Purpose**: Get Pokemon from a specific generation

**Parameters**:
- `generation`: Generation number (1-9)

**Response**: `GenerationResponse`

**Usage**: Browse by generation category

**Caching**: Cache for 24 hours

## Error Responses

All endpoints may return:

**400 Bad Request**: Invalid parameters

**404 Not Found**: Pokemon/type/generation not found

**429 Too Many Requests**: Rate limited

**500 Internal Server Error**: PokeAPI server error

## Rate Limiting

- 100 requests per minute per IP
- No authentication required
- Implement exponential backoff on 429 errors

## Data Contracts

See `data-model.md` for detailed response schemas.

## Implementation Notes

- Use Axios with interceptors for error handling
- Implement React Query for caching and state management
- Handle network errors gracefully with offline fallbacks
- Validate response data against TypeScript interfaces