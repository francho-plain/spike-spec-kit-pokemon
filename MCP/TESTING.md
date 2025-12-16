# Testing the Pokemon MCP Server

## Prerequisites
- Node.js 18+ installed
- VS Code with GitHub Copilot
- MCP server built (`npm run build`)

## Manual Testing

### 1. Command Line Test
Run the test script:
```bash
cd MCP
node scripts/test-server.js
```

Expected output:
- Server starts successfully
- Lists available tools (get_pokemon)
- Returns Pokemon data for "pikachu"

### 2. VS Code Integration Test

The server is configured in `.vscode/mcp.json`. To use it:

1. **Reload VS Code** to load the MCP configuration
2. **Open GitHub Copilot Chat** (Ctrl+Shift+I / Cmd+Shift+I)
3. **Use the MCP tool** with prompts like:
   - "Get information about Charizard"
   - "Tell me about Pikachu using the Pokemon MCP"
   - "Use get_pokemon to fetch Bulbasaur data"

### 3. Test Cases

#### Test Case 1: Valid Pokemon
```
Prompt: "Get information about pikachu"
Expected: Pokemon data with stats, types, abilities
```

#### Test Case 2: Invalid Name
```
Prompt: "Get information about InvalidPokemon123!"
Expected: Validation error message
```

#### Test Case 3: Non-existent Pokemon
```
Prompt: "Get information about notapokemon"
Expected: Pokemon not found error
```

#### Test Case 4: Case Insensitivity
```
Prompt: "Get information about CHARIZARD"
Expected: Pokemon data (name normalized to lowercase)
```

#### Test Case 5: Caching
```
Prompt 1: "Get information about ditto"
Prompt 2: "Get information about ditto" (within 1 hour)
Expected: Second request should be faster (cached)
Note: Cache message appears in response
```

## Expected Responses

### Successful Response Format
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

**Abilities:** static

*Data cached for performance*
```

### Error Response Examples

**Validation Error:**
```
Invalid Pokemon name format. Name must contain only lowercase letters, numbers, and hyphens.
```

**Not Found Error:**
```
Pokemon 'notapokemon' not found
```

## Troubleshooting

### Server doesn't start
- Check Node.js version: `node --version` (should be 18+)
- Rebuild the project: `npm run build`
- Check for TypeScript errors: `npm run type-check`

### VS Code doesn't recognize the server
- Ensure `.vscode/mcp.json` is properly configured
- Reload VS Code window
- Check VS Code output panel for MCP errors

### Tests fail
- Run `npm test` to verify all tests pass
- Check network connectivity (integration tests call PokeAPI)
- Verify PokeAPI is accessible: `curl https://pokeapi.co/api/v2/pokemon/pikachu`

## Performance Expectations

- **First request**: 2-5 seconds (API call + data transformation)
- **Cached request**: < 1 second (in-memory lookup)
- **Cache TTL**: 1 hour (3600 seconds)

## Next Steps

After manual testing, proceed with:
- [ ] User Story 2: Implement compare_pokemon tool
- [ ] Add more comprehensive integration tests
- [ ] Document common usage patterns
- [ ] Optimize performance for bulk operations
