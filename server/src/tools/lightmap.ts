import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const lightmapBake: ToolDefinition = {
  id: "lightmap_bake",
  name: "Bake Lightmaps",
  description: "Bake lightmaps for the current scene",
  descriptionJa: "現在のシーンのライトマップをベイク",
  category: "lightmap",
  inputSchema: z.object({ mode: z.enum(["Baked","Realtime","Mixed"]).default("Baked") }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "LightmapBake", p);
      return r ? { success: true, message: `Lightmap bake started: ${p.mode}`, data: r }
               : { success: false, message: "Failed to bake lightmaps" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "LightmapSetResolution", p);
      return r ? { success: true, message: `Resolution set to ${p.texelsPerUnit} texels/unit`, data: r }
               : { success: false, message: "Failed to set resolution" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "LightmapSetMaxSize", p);
      return r ? { success: true, message: `Max lightmap size set to ${p.maxSize}`, data: r }
               : { success: false, message: "Failed to set max size" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "LightmapSetObjectScale", p);
      return r ? { success: true, message: `Lightmap scale set on ${p.objectName}`, data: r }
               : { success: false, message: "Failed to set object scale" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "LightmapClear", p);
      return r ? { success: true, message: "Lightmaps cleared", data: r }
               : { success: false, message: "Failed to clear lightmaps" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "LightmapGetInfo", p);
      return r ? { success: true, message: "Lightmap info retrieved", data: r }
               : { success: false, message: "Failed to get lightmap info" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

export const lightmapTools: ToolDefinition[] = [
  lightmapBake, lightmapSetResolution, lightmapSetMaxSize,
  lightmapSetObjectScale, lightmapClear, lightmapGetInfo
];