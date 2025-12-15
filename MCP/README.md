# Pokemon MCP Server

A Model Context Protocol (MCP) server for retrieving Pokemon information from PokeAPI, designed for use with VS Code and GitHub Copilot.

## Features

- **Pokemon Information Retrieval**: Get detailed data about any Pokemon by name
- **Smart Caching**: In-memory caching with 1-hour TTL for optimal performance
- **Error Handling**: Comprehensive validation and error messages
- **Type Safety**: Full TypeScript implementation with strict typing

## Installation

```bash
cd MCP
npm install
npm run build
```

## Usage

### VS Code Integration

The server is pre-configured in `.vscode/mcp.json`. After building:

1. Reload VS Code
2. Open GitHub Copilot Chat
3. Ask questions like:
   - "Get information about Charizard"
   - "Tell me about Pikachu using the Pokemon MCP"

### Command Line

```bash
# Run tests
npm test

# Type checking
npm run type-check

# Lint
npm run lint

# Format
npm run format

# Manual test
node scripts/test-server.js
```

## Available Tools

### `get_pokemon`

Retrieve detailed information about a Pokemon.

**Input:**
- `name` (string, required): Pokemon name (case-insensitive)

**Output:**
```markdown
**PIKACHU**

**Types:** electric

**Stats:**
- HP: 35
- Attack: 55
- Defense: 40
- Special Attack: 50
- Special Defense: 50
- Speed: 90

**Abilities:** static, lightning-rod

*Data cached for performance*
```

## Project Structure

```
MCP/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── types/
│   │   └── pokemon.ts        # TypeScript interfaces
│   ├── services/
│   │   ├── pokeApi.ts        # PokeAPI client
│   │   └── cache.ts          # Caching service
│   ├── tools/
│   │   └── pokemonRetriever.ts  # get_pokemon tool
│   └── utils/
│       ├── validation.ts     # Input validation
│       └── errors.ts         # Error handling
├── tests/
│   ├── unit/                 # Unit tests
│   └── integration/          # Integration tests
├── scripts/
│   └── test-server.js        # Manual testing script
└── dist/                     # Compiled JavaScript
```

## Technical Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+
- **Framework**: @modelcontextprotocol/sdk v0.4.0
- **HTTP Client**: axios v1.6.0
- **Caching**: node-cache v5.1.2
- **Testing**: Jest + ts-jest

## Performance

- **First request**: 2-5 seconds (API call)
- **Cached request**: < 1 second
- **Cache TTL**: 1 hour (3600 seconds)
- **API timeout**: 5 seconds

## Testing

See [TESTING.md](TESTING.md) for detailed testing instructions.

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- pokemonRetriever
npm test -- pokeApi

# Run with coverage
npm test -- --coverage
```

## Error Handling

The server handles:
- **Validation errors**: Invalid Pokemon names (special characters, too long)
- **Not found errors**: Pokemon doesn't exist in PokeAPI
- **Network errors**: Connection issues, timeouts
- **Rate limiting**: 429 responses from PokeAPI

## Development

```bash
# Watch mode for development
npm run build -- --watch

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## Roadmap

- [x] User Story 1: Pokemon information retrieval
- [ ] User Story 2: Compare two Pokemon
- [ ] Enhanced caching strategies
- [ ] Performance optimization
- [ ] Additional Pokemon data (moves, evolution)

## License

MIT

## Contributing

1. Follow conventional commits
2. Ensure all tests pass
3. Update documentation
4. Follow TypeScript strict mode
