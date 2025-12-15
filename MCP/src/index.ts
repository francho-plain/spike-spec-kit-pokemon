#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { pokemonRetrieverTool } from './tools/pokemonRetriever';

const server = new Server({
  name: 'pokemon-mcp-server',
  version: '1.0.0',
  capabilities: {
    tools: {},
  },
});

// Register the Pokemon retrieval tool
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: pokemonRetrieverTool.name,
        description: pokemonRetrieverTool.description,
        inputSchema: pokemonRetrieverTool.inputSchema,
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === pokemonRetrieverTool.name) {
    const result = await pokemonRetrieverTool.execute(request.params.arguments as any);
    return {
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Pokemon MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
