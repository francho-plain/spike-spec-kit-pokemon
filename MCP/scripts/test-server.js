#!/usr/bin/env node

// Simple test script to verify the MCP server works
const { spawn } = require('child_process');
const path = require('path');

console.log('Testing Pokemon MCP Server...\n');

const serverPath = path.join(__dirname, '..', 'dist', 'index.js');
const server = spawn('node', [serverPath]);

let output = '';

server.stdout.on('data', (data) => {
  output += data.toString();
  console.log('Server response:', data.toString());
});

server.stderr.on('data', (data) => {
  console.error('Server log:', data.toString());
});

// Send a tools/list request
setTimeout(() => {
  const listToolsRequest = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  }) + '\n';
  
  console.log('Sending tools/list request...');
  server.stdin.write(listToolsRequest);
}, 1000);

// Send a tools/call request for pikachu
setTimeout(() => {
  const callToolRequest = JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'get_pokemon',
      arguments: {
        name: 'pikachu'
      }
    }
  }) + '\n';
  
  console.log('\nSending get_pokemon request for "pikachu"...');
  server.stdin.write(callToolRequest);
}, 3000);

// Clean up after 6 seconds
setTimeout(() => {
  console.log('\n\nTest completed!');
  server.kill();
  process.exit(0);
}, 6000);

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
