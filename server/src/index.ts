import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

import { globalRegistry } from "./core/registry";
import { superSave } from "./core/supersave";
import { sceneTools } from "./tools/scene";
import { transformTools } from "./tools/transform";
import { materialTools } from "./tools/material";
import { lightingTools } from "./tools/lighting";
import { terrainTools } from "./tools/terrain";
import { audioTools } from "./tools/audio";
import { cameraTools } from "./tools/camera";
import { physicsTools } from "./tools/physics";
import { vfxTools } from "./tools/vfx";
import { animationTools } from "./tools/animation";
import { uiTools } from "./tools/ui";
import { optimizationTools } from "./tools/optimization";
import { unityBridge } from "./bridge/unity-bridge";

// Register all tools
const allTools = [
  ...sceneTools,
  ...transformTools,
  ...materialTools,
  ...lightingTools,
  ...terrainTools,
  ...audioTools,
  ...cameraTools,
  ...physicsTools,
  ...vfxTools,
  ...animationTools,
  ...uiTools,
  ...optimizationTools
];

for (const tool of allTools) {
  globalRegistry.register(tool);
}

console.log(`[ARCANA] ${globalRegistry.count()} tools registered`);

// Create MCP server
const server = new Server(
  { name: "arcana", version: "0.2.0" },
  { capabilities: { tools: {} } }
);

// List tools handler (SuperSave: only 4 meta-tools exposed)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "arcana_discover",
        description: "Search available ARCANA tools by keyword or category. Use this first to find what tools exist.",
        inputSchema: {
          type: "object" as const,
          properties: {
            query: { type: "string", description: "Search keyword" },
            category: { type: "string", description: "Filter by category" }
          }
        }
      },
      {
        name: "arcana_inspect",
        description: "Get the full parameter schema for a specific ARCANA tool. Use after discover to see details.",
        inputSchema: {
          type: "object" as const,
          properties: {
            toolId: { type: "string", description: "Tool ID from discover results" }
          },
          required: ["toolId"]
        }
      },
      {
        name: "arcana_execute",
        description: "Execute an ARCANA tool with parameters. Use after inspect to know the correct params.",
        inputSchema: {
          type: "object" as const,
          properties: {
            toolId: { type: "string", description: "Tool ID to execute" },
            params: { type: "object", description: "Tool parameters" }
          },
          required: ["toolId", "params"]
        }
      },
      {
        name: "arcana_compose",
        description: "Execute multiple ARCANA tools in sequence as a pipeline.",
        inputSchema: {
          type: "object" as const,
          properties: {
            steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  toolId: { type: "string" },
                  params: { type: "object" }
                },
                required: ["toolId", "params"]
              },
              description: "Array of tool steps to execute in order"
            }
          },
          required: ["steps"]
        }
      }
    ]
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  let result;
  switch (name) {
    case "arcana_discover":
      result = await superSave.discover(args || {});
      break;
    case "arcana_inspect":
      result = await superSave.inspect(args as any);
      break;
    case "arcana_execute":
      result = await superSave.execute(args as any);
      break;
    case "arcana_compose":
      result = await superSave.compose(args as any);
      break;
    default:
      result = { success: false, message: `Unknown tool: ${name}` };
  }

  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify(result, null, 2)
    }]
  };
});

// Start server
async function main() {
  console.log("[ARCANA] Starting MCP server v0.2.0...");

  // Try connecting to Unity (non-blocking)
  unityBridge.connect().catch(() => {
    console.log("[ARCANA] Unity not running, will retry on demand");
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("[ARCANA] MCP server running on stdio - 44 tools available");
}

main().catch(console.error);