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
Layer 3: Editor Plugins (Unity C#, Unreal Engine C++, Blender Python)
```

## Layer 2: MCP Server

The server is the core of ARCANA. It handles:

- MCP protocol communication with AI clients
- Tool registry and discovery
- SuperSave meta-tool routing
- WebSocket bridges to Unity, Unreal Engine, and Blender
- Request/response matching with timeout handling

Key modules:

- `core/registry.ts` - Tool storage, search, categorization
- `core/supersave.ts` - 4 meta-tools (discover, inspect, execute, compose)
- `bridge.ts` - WebSocket servers for Unity (:9877), Unreal (:9878), Blender (:9879); routes tool calls to the connected editor
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
  -> Server sends a WebSocket message to the resolved editor (Unity / Unreal / Blender)
  -> Editor plugin executes the tool (Unity tools support Undo/Redo where applicable)
  -> Result flows back through the chain
```

## Phase 7: CI and integration tests (Tier A)

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and pull request to `main`:

1. `npm ci` in `server/`
2. `npm audit --audit-level=high`
3. `npm run lint`
4. `npm run build`
5. `npm test` (Jest with `--runInBand` so the global registry and bridge stay deterministic)

**Integration tests** (`src/__tests__/integration.bridgeTools.test.ts`) start the real `bridge` on high ports (29877–29879), attach lightweight WebSocket clients that mimic editor plugins (`register` + tool replies), register a small slice of real tool definitions, and run SuperSave chains (discover → inspect → execute, `compose`, Blender / UE / recipe samples). This validates the MCP server path without installing Unity, UE, or Blender on the runner.

**Tier B** (real editors) remains manual or a separate workflow; it is not part of this CI job.