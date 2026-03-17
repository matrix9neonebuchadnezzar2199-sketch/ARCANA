# ARCANA Architecture

## Three-Layer Design

```
Layer 1: AI Client (Claude, ChatGPT, Gemini, Copilot, etc.)
  |
  | MCP Protocol (JSON-RPC over stdio or HTTP)
  |
Layer 2: ARCANA MCP Server (Node.js + TypeScript)
  |
  | WebSocket (bidirectional, JSON messages)
  |
Layer 3: Editor Plugins (Unity C# / Blender Python)
```

## Layer 2: MCP Server

The server is the core of ARCANA. It handles:

- MCP protocol communication with AI clients
- Tool registry and discovery
- SuperSave meta-tool routing
- WebSocket bridges to Unity and Blender
- Request/response matching with timeout handling

Key modules:

- `core/registry.ts` - Tool storage, search, categorization
- `core/supersave.ts` - 4 meta-tools (discover, inspect, execute, compose)
- `bridge/unity-bridge.ts` - WebSocket client to Unity plugin
- `bridge/blender-bridge.ts` - WebSocket client to Blender addon
- `tools/*.ts` - Individual tool definitions
- `index.ts` - MCP server entry point

## SuperSave Mode

Instead of exposing all 400+ tools to the AI context (expensive in tokens),
ARCANA exposes only 4 meta-tools:

1. `arcana.discover` - find tools by keyword or category
2. `arcana.inspect` - get full schema for one tool
3. `arcana.execute` - run a tool with parameters
4. `arcana.compose` - run multiple tools as a pipeline

This reduces token usage by approximately 98%.

## Communication Flow

```
User: "Create a red cube at (0, 5, 0)"
  -> AI calls arcana_discover({ query: "create gameobject" })
  -> AI calls arcana_inspect({ toolId: "scene_create_gameobject" })
  -> AI calls arcana_execute({
       toolId: "scene_create_gameobject",
       params: { name: "Cube", primitive: "Cube",
                 position: {x:0, y:5, z:0}, color: "#FF0000" }
     })
  -> Server sends WebSocket message to Unity plugin
  -> Unity plugin creates the cube with Undo support
  -> Result flows back through the chain
```