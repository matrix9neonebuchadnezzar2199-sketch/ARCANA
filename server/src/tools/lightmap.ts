import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const lightmapBake: ToolDefinition = {
  id: "lightmap_bake",
  name: "Bake Lightmaps",
  description: "Bake lightmaps for the current scene",
  descriptionJa: "現在のシーンのライトマップをベイク",
  category: "lightmap",
  inputSchema: z.object({ mode: z.enum(["Baked","Realtime","Mixed"]).default("Baked") }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "LightmapBake", p, { successMessage: (_, p) => `Lightmap bake started: ${p.mode}` });
  }
};

const lightmapSetResolution: ToolDefinition = {
  id: "lightmap_set_resolution",
  name: "Set Lightmap Resolution",
  description: "Set the texels per unit for lightmap baking",
  descriptionJa: "ライトマップベイクのテクセル/ユニットを設定",
  category: "lightmap",
  inputSchema: z.object({ texelsPerUnit: z.number().default(40) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "LightmapSetResolution", p, { successMessage: (_, p) => `Resolution set to ${p.texelsPerUnit} texels/unit` });
  }
};

const lightmapSetMaxSize: ToolDefinition = {
  id: "lightmap_set_max_size",
  name: "Set Lightmap Max Size",
  description: "Set the maximum lightmap atlas size",
  descriptionJa: "ライトマップアトラスの最大サイズを設定",
  category: "lightmap",
  inputSchema: z.object({ maxSize: z.enum(["256","512","1024","2048","4096"]).default("1024") }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "LightmapSetMaxSize", p, { successMessage: (_, p) => `Max lightmap size set to ${p.maxSize}` });
  }
};

const lightmapSetObjectScale: ToolDefinition = {
  id: "lightmap_set_object_scale",
  name: "Set Object Lightmap Scale",
  description: "Set lightmap scale in UV for a specific object",
  descriptionJa: "特定オブジェクトのライトマップUVスケールを設定",
  category: "lightmap",
  inputSchema: z.object({ objectName: z.string(), scaleInLightmap: z.number().default(1) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "LightmapSetObjectScale", p, { successMessage: (_, p) => `Lightmap scale set on ${p.objectName}` });
  }
};

const lightmapClear: ToolDefinition = {
  id: "lightmap_clear",
  name: "Clear Lightmaps",
  description: "Clear all baked lightmap data from the scene",
  descriptionJa: "シーンからすべてのベイク済みライトマップデータをクリア",
  category: "lightmap",
  inputSchema: z.object({}),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "LightmapClear", p, { successMessage: "Lightmaps cleared" });
  }
};

const lightmapGetInfo: ToolDefinition = {
  id: "lightmap_get_info",
  name: "Get Lightmap Info",
  description: "Get current lightmap baking settings and status",
  descriptionJa: "現在のライトマップベイク設定と状態を取得",
  category: "lightmap",
  inputSchema: z.object({}),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "LightmapGetInfo", p, { successMessage: "Lightmap info retrieved" });
  }
};

export const lightmapTools: ToolDefinition[] = [
  lightmapBake, lightmapSetResolution, lightmapSetMaxSize,
  lightmapSetObjectScale, lightmapClear, lightmapGetInfo
];