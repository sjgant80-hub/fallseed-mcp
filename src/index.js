#!/usr/bin/env node
// fallseed-mcp · MCP stdio server wrapping fallseed-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'fallseed-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'fallseed_toast',
    description: 'toast · from fallseed-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { toast } = await import('@ai-native-solutions/fallseed-sdk');
      return typeof toast === 'function' ? await toast(args) : { error: 'toast not callable' };
    }
  },
  {
    name: 'fallseed_prime_for',
    description: 'primeFor · from fallseed-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { primeFor } = await import('@ai-native-solutions/fallseed-sdk');
      return typeof primeFor === 'function' ? await primeFor(args) : { error: 'primeFor not callable' };
    }
  },
  {
    name: 'fallseed_render_generate',
    description: 'renderGenerate · from fallseed-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { renderGenerate } = await import('@ai-native-solutions/fallseed-sdk');
      return typeof renderGenerate === 'function' ? await renderGenerate(args) : { error: 'renderGenerate not callable' };
    }
  },
  {
    name: 'fallseed_render_stepper',
    description: 'renderStepper · from fallseed-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { renderStepper } = await import('@ai-native-solutions/fallseed-sdk');
      return typeof renderStepper === 'function' ? await renderStepper(args) : { error: 'renderStepper not callable' };
    }
  },
  {
    name: 'fallseed_step_go',
    description: 'stepGo · from fallseed-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { stepGo } = await import('@ai-native-solutions/fallseed-sdk');
      return typeof stepGo === 'function' ? await stepGo(args) : { error: 'stepGo not callable' };
    }
  },
  {
    name: 'fallseed_step_jump',
    description: 'stepJump · from fallseed-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { stepJump } = await import('@ai-native-solutions/fallseed-sdk');
      return typeof stepJump === 'function' ? await stepJump(args) : { error: 'stepJump not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('fallseed-mcp v1.0.0 · stdio ready');
