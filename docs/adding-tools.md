# Adding New Tools to ARCANA

## Overview

Each ARCANA tool has two parts:

1. **Server side** (TypeScript) - tool definition, schema, and handler
2. **Unity side** (C#) - actual Unity API calls with Undo support

## Step 1: Create Server Tool

Copy `server/src/tools/_template.ts` to a new file:

```typescript
import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { unityBridge } from "../bridge/unity-bridge";

export const terrainCreate: ToolDefinition = {
  id: "terrain_create",
  name: "Create Terrain",
  description: "Create a new terrain in the scene",
  descriptionJa: "シーンに新しいテレインを作成",
  category: "terrain",
  inputSchema: z.object({
    width: z.number().default(500),
    length: z.number().default(500),
    height: z.number().default(100)
  }),
  handler: async (params) => {
    const result = await unityBridge.send("TerrainCreate", params);
    return { success: true, message: "Terrain created", data: result };
  }
};
```

## Step 2: Create Unity Tool

Add a method with the `[ArcanaTool]` attribute:

```csharp
using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

public static class TerrainTools
{
    [ArcanaTool("terrain_create", "Create terrain", "テレイン作成", "terrain")]
    public static string CreateTerrain(float width = 500, float length = 500, float height = 100)
    {
        var data = new TerrainData();
        data.size = new Vector3(width, height, length);
        var go = Terrain.CreateTerrainGameObject(data);
        Undo.RegisterCreatedObjectUndo(go, "ARCANA Create Terrain");
        return "Terrain created";
    }
}
```

## Step 3: Register in index.ts

Import and add to the registration loop in `server/src/index.ts`.

## Step 4: Test

Rebuild the server and tell your AI:

```
"Create a 1000x1000 terrain with max height 200"
```