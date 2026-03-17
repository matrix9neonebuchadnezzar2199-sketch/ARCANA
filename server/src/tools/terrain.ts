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
    width: z.number().optional().describe("Terrain width, default 500"),
    length: z.number().optional().describe("Terrain length, default 500"),
    height: z.number().optional().describe("Max terrain height, default 100")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("TerrainCreate", params);
      return { success: true, message: "Terrain created", data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const terrainSetHeight: ToolDefinition = {
  id: "terrain_set_height",
  name: "Set Terrain Height",
  description: "Set terrain height at a normalized position",
  descriptionJa: "正規化座標でテレインの高さを設定",
  category: "terrain",
  inputSchema: z.object({
    normalizedX: z.number().min(0).max(1).describe("X position 0-1"),
    normalizedZ: z.number().min(0).max(1).describe("Z position 0-1"),
    height: z.number().min(0).max(1).describe("Height value 0-1"),
    radius: z.number().optional().describe("Brush radius in samples, default 5")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("TerrainSetHeight", params);
      return { success: true, message: "Terrain height set", data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const terrainAddTexture: ToolDefinition = {
  id: "terrain_add_texture",
  name: "Add Terrain Texture",
  description: "Add a texture layer to the terrain",
  descriptionJa: "テレインにテクスチャレイヤーを追加",
  category: "terrain",
  inputSchema: z.object({
    texturePath: z.string().describe("Path to texture relative to Assets"),
    tileSize: z.number().optional().describe("Texture tile size, default 10")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("TerrainAddTexture", params);
      return { success: true, message: "Terrain texture added", data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const terrainAddTrees: ToolDefinition = {
  id: "terrain_add_trees",
  name: "Add Trees to Terrain",
  description: "Add tree instances to the terrain",
  descriptionJa: "テレインに木を配置",
  category: "terrain",
  inputSchema: z.object({
    prefabPath: z.string().describe("Tree prefab path relative to Assets"),
    count: z.number().optional().describe("Number of trees, default 100"),
    minScale: z.number().optional().describe("Minimum tree scale, default 0.8"),
    maxScale: z.number().optional().describe("Maximum tree scale, default 1.2")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("TerrainAddTrees", params);
      return { success: true, message: `Added ${params.count || 100} trees`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const terrainTools = [
  terrainCreate,
  terrainSetHeight,
  terrainAddTexture,
  terrainAddTrees
];