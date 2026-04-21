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

### Full catalog smoke (Tier A+)

- `allToolDefinitions.ts` exports `ALL_TOOL_DEFINITIONS` (same list as the MCP server registers). `index.ts` imports it so there is a single registration source.
- `smoke.allTools.test.ts` asserts: unique tool ids, required fields + Zod `safeParse`, clean registration into a fresh `ToolRegistry`, `bridge.resolveEditor` for every id, and `arcana.discover` by **each distinct category** returns at least one tool when the full catalog is loaded.
- `smoke.fakeExecuteAll.test.ts` starts the bridge on alternate ports, attaches fake editor WebSocket clients, registers the full catalog, and runs **`arcana.execute`-equivalent** `superSave.execute` with `{}` for **every tool** (no uncaught errors; each result is a `ToolResult` after coercion).

### Tier B — minimal automation

- Workflow `.github/workflows/tier-b-blender.yml` (manual `workflow_dispatch` and weekly schedule): checks out the repo, installs Blender on `ubuntu-latest`, runs `blender --version` and a one-line `bpy` smoke, then runs **`npm ci` / `npm run build` / `npm test`** in `server/` (same suite as PR CI, including fake WebSocket integration and full-catalog smoke). This still does **not** load the ARCANA Blender add-on inside Blender; it combines a real Blender install with the Node test harness.

### SuperSave `execute` / `compose` contract

- `core/supersave.ts` **coerces** handler results: if a tool returns a plain object without a `success` boolean (legacy `bridge.send` return), it is wrapped as `{ success: true, message, data }` so MCP clients always see a `ToolResult`. Recipe tools additionally use `core/bridgeToolResult.ts` for explicit wrapping where practical.