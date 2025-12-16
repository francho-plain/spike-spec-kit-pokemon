# Data Model: Pokemon MCP Server

**Date**: 2025-12-12
**Spec**: specs/001-pokemon-mcp-server/spec.md

## Entities

### Pokemon

Represents a Pokemon with its core attributes and characteristics.

**Fields:**
- `name` (string, required): The Pokemon's name (e.g., "pikachu")
- `types` (array of strings, 1-2 items): Pokemon types (e.g., ["electric"])
- `stats` (object): Base stats including HP, Attack, Defense, Special Attack, Special Defense, Speed (all numbers, 0-255)
- `abilities` (array of strings): Pokemon abilities (e.g., ["static", "lightning-rod"])
- `evolution_chain` (object, optional): Evolution information including previous/next evolutions

**Relationships:**
- None (standalone entity)

**Validation Rules:**
- `name`: Must be non-empty string, lowercase, no special characters except hyphens
- `types`: Must contain 1-2 valid Pokemon types
- `stats`: All values must be integers between 0-255
- `abilities`: Array of valid ability names

**State Transitions:**
- None (static data entity)