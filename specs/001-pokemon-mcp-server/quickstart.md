# Quickstart: Pokemon MCP Server

**Date**: 2025-12-12
**Plan**: specs/001-pokemon-mcp-server/plan.md

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- VS Code with MCP extension configured

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pokemon-mcp-server
   ```

2. Navigate to the MCP project folder:
   ```bash
   cd MCP
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the project:
   ```bash
   npm run build
   ```

## Running the Server

Start the MCP server:
```bash
npm start
```

The server will listen on the configured MCP port (default: 3000).

## VS Code Integration

1. Open VS Code settings
2. Configure MCP server in the MCP extension settings:
   ```json
   {
     "mcp": {
       "servers": {
         "pokemon-server": {
           "command": "node",
           "args": ["dist/index.js"],
           "cwd": "${workspaceFolder}/MCP",
           "env": {}
         }
       }
     }
   }
   ```

3. Restart VS Code or reload the MCP extension

## Usage

Once configured, the Pokemon tools will be available in Copilot:

- **Get Pokemon Info**: Ask Copilot "Get information about Pikachu"
- **Compare Pokemon**: Ask Copilot "Compare Charizard and Blastoise"

## Development

For development with hot reload:
```bash
npm run dev
```

Run tests:
```bash
npm test
```