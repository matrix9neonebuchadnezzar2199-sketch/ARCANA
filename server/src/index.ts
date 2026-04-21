import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ALL_TOOL_DEFINITIONS } from "./allToolDefinitions";
import { bridge } from "./bridge";
import { globalRegistry } from "./core/registry";
import { superSave } from "./core/supersave";
import { ARCANA_SERVER_VERSION } from "./version";

ALL_TOOL_DEFINITIONS.forEach((tool) => {
  if (tool) globalRegistry.register(tool);
});
console.error(
  `[ARCANA] ${ALL_TOOL_DEFINITIONS.length} tools registered across ${new Set(ALL_TOOL_DEFINITIONS.filter(Boolean).map((t) => t!.category)).size} categories`
);

bridge.start();

const server = new Server({ name: "arcana-mcp-server", version: ARCANA_SERVER_VERSION }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: "arcana_discover", description: "Search available ARCANA tools by keyword or category", inputSchema: { type: "object", properties: { query: { type: "string", description: "Search keyword or category name" } }, required: ["query"] } },
    { name: "arcana_inspect", description: "Get full schema and details for a specific tool", inputSchema: { type: "object", properties: { toolId: { type: "string", description: "Tool ID to inspect" } }, required: ["toolId"] } },
    { name: "arcana_execute", description: "Execute any ARCANA tool with parameters", inputSchema: { type: "object", properties: { toolId: { type: "string", description: "Tool ID to execute" }, params: { type: "object", description: "Tool parameters" } }, required: ["toolId"] } },
    { name: "arcana_status", description: "Check which editors (Unity/UE/Blender) are currently connected", inputSchema: { type: "object", properties: {} } },
    {
      name: "arcana_compose", description: "Execute multiple tools in sequence", inputSchema: { type: "object", properties: { steps: { type: "array", items: { type: "object", properties: { toolId: { type: "string" }, params: { type: "object" } }, required: ["toolId"] } } }, required: ["steps"] } },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  let result: any;
  switch (name) {
    case "arcana_discover":
      result = await superSave.discover({ query: args?.query as string, category: args?.category as string });
      break;
    case "arcana_inspect":
      result = await superSave.inspect({ toolId: args?.toolId as string });
      break;
    case "arcana_execute":
      result = await superSave.execute({ toolId: args?.toolId as string, params: (args?.params as Record<string, any>) || {} });
      break;
    case "arcana_status":
      result = { success: true, message: "Editor status", data: bridge.getStatus() };
      break;
    case "arcana_compose":
      result = await superSave.compose({ steps: args?.steps as any[] });
      break;
    default:
      result = { success: false, message: `Unknown tool: ${name}` };
  }
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[ARCANA] MCP Server running (v${ARCANA_SERVER_VERSION}, ${globalRegistry.count()} tools)`);
}

main().catch(console.error);
