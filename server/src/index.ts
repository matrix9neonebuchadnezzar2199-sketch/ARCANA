import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { globalRegistry } from "./core/registry";
import { superSave } from "./core/supersave";
import { unityBridge } from "./bridge/unity-bridge";

// Import all tool modules
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
import { componentTools } from "./tools/component";
import { prefabTools } from "./tools/prefab";
import { layertagTools } from "./tools/layertag";
import { environmentTools } from "./tools/environment";
import { navigationTools } from "./tools/navigation";
import { postProcessingTools } from "./tools/postprocessing";
import { scriptTools } from "./tools/script";
import { renderTools } from "./tools/render";
import { assetTools } from "./tools/asset";
import { editorTools } from "./tools/editor";
import { selectionTools } from "./tools/selection";
import { constraintTools } from "./tools/constraint";
import { buildTools } from "./tools/build";
import { meshTools } from "./tools/mesh";
import { timelineTools } from "./tools/timeline";
import { cinemachineTools } from "./tools/cinemachine";
import { probuilderTools } from "./tools/probuilder";
import { inputTools } from "./tools/input";
import { shaderTools } from "./tools/shader";
import { networkingTools } from "./tools/networking";
import { twodTools } from "./tools/twod";
import { splineTools } from "./tools/spline";
import { visualScriptingTools } from "./tools/visualscripting";
import { ragdollTools } from "./tools/ragdoll";
import { clothTools } from "./tools/cloth";
import { decalTools } from "./tools/decal";
import { xrTools } from "./tools/xr";
import { aiTools } from "./tools/ai";
import { vrchatTools } from "./tools/vrchat";
import { addressablesTools } from "./tools/addressables";
import { localizationTools } from "./tools/localization";
import { debugTools } from "./tools/debug";
import { testingTools } from "./tools/testing";
import { profilerTools } from "./tools/profiler";

// Register all tools
const allTools = [
  ...sceneTools, ...transformTools, ...materialTools, ...lightingTools,
  ...terrainTools, ...audioTools, ...cameraTools, ...physicsTools,
  ...vfxTools, ...animationTools, ...uiTools, ...optimizationTools,
  ...componentTools, ...prefabTools, ...layertagTools, ...environmentTools,
  ...navigationTools, ...postProcessingTools, ...scriptTools,
  ...renderTools, ...assetTools, ...editorTools,
  ...selectionTools, ...constraintTools, ...buildTools,
  ...meshTools, ...timelineTools,
  ...cinemachineTools, ...probuilderTools, ...inputTools, ...shaderTools, ...networkingTools, ...twodTools,
  ...splineTools,
  ...visualScriptingTools,
  ...ragdollTools,
  ...clothTools,
  ...decalTools,
  ...xrTools,
  ...aiTools,
  ...vrchatTools, ...addressablesTools, ...localizationTools, ...debugTools, ...testingTools, ...profilerTools
];

allTools.forEach(tool => globalRegistry.register(tool));
console.log(`[ARCANA] ${allTools.length} tools registered across ${new Set(allTools.map(t => t.category)).size} categories`);

const server = new Server({ name: "arcana-mcp-server", version: "2.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: "arcana_discover", description: "Search available ARCANA tools by keyword or category", inputSchema: { type: "object", properties: { query: { type: "string", description: "Search keyword or category name" } }, required: ["query"] } },
    { name: "arcana_inspect", description: "Get full schema and details for a specific tool", inputSchema: { type: "object", properties: { toolId: { type: "string", description: "Tool ID to inspect" } }, required: ["toolId"] } },
    { name: "arcana_execute", description: "Execute any ARCANA tool with parameters", inputSchema: { type: "object", properties: { toolId: { type: "string", description: "Tool ID to execute" }, params: { type: "object", description: "Tool parameters" } }, required: ["toolId"] } },
    { name: "arcana_compose", description: "Execute multiple tools in sequence", inputSchema: { type: "object", properties: { steps: { type: "array", items: { type: "object", properties: { toolId: { type: "string" }, params: { type: "object" } }, required: ["toolId"] } } }, required: ["steps"] } }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  let result: any;
  switch (name) {
    case "arcana_discover": result = await superSave.discover({ query: args?.query as string, category: args?.category as string }); break;
    case "arcana_inspect": result = await superSave.inspect({ toolId: args?.toolId as string }); break;
    case "arcana_execute": result = await superSave.execute({ toolId: args?.toolId as string, params: (args?.params as Record<string, any>) || {} }); break;
    case "arcana_compose": result = await superSave.compose({ steps: args?.steps as any[] }); break;
    default: result = { success: false, message: `Unknown tool: ${name}` };
  }
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

async function main() {
  unityBridge.connect().catch(() => console.log("[ARCANA] Unity not connected yet - will retry on first tool call"));
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("[ARCANA] MCP Server running (v3.0.0 - 252 tools)");
}

main().catch(console.error);