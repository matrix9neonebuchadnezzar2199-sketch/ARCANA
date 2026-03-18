import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const occlusionBake: ToolDefinition = {
  id: "occlusion_bake",
  name: "Bake Occlusion Culling",
  description: "Bake occlusion culling data for the scene",
  descriptionJa: "シーンのオクルージョンカリングデータをベイク",
  category: "occlusion",
  inputSchema: z.object({}),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "OcclusionBake", p);
      return r ? { success: true, message: "Occlusion culling bake started", data: r }
               : { success: false, message: "Failed to bake occlusion" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

const occlusionSetOccluder: ToolDefinition = {
  id: "occlusion_set_occluder",
  name: "Set Occluder Static",
  description: "Mark a GameObject as Occluder Static",
  descriptionJa: "GameObjectをOccluder Staticに設定",
  category: "occlusion",
  inputSchema: z.object({ objectName: z.string(), enabled: z.boolean().default(true) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "OcclusionSetOccluder", p);
      return r ? { success: true, message: `${p.objectName} occluder static: ${p.enabled}`, data: r }
               : { success: false, message: "Failed to set occluder" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

const occlusionSetOccludee: ToolDefinition = {
  id: "occlusion_set_occludee",
  name: "Set Occludee Static",
  description: "Mark a GameObject as Occludee Static",
  descriptionJa: "GameObjectをOccludee Staticに設定",
  category: "occlusion",
  inputSchema: z.object({ objectName: z.string(), enabled: z.boolean().default(true) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "OcclusionSetOccludee", p);
      return r ? { success: true, message: `${p.objectName} occludee static: ${p.enabled}`, data: r }
               : { success: false, message: "Failed to set occludee" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

const occlusionSetParams: ToolDefinition = {
  id: "occlusion_set_params",
  name: "Set Occlusion Parameters",
  description: "Set smallest occluder/hole and backface threshold",
  descriptionJa: "最小オクルーダー/ホールとバックフェース閾値を設定",
  category: "occlusion",
  inputSchema: z.object({ smallestOccluder: z.number().default(5), smallestHole: z.number().default(0.25), backfaceThreshold: z.number().default(100) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "OcclusionSetParams", p);
      return r ? { success: true, message: "Occlusion parameters updated", data: r }
               : { success: false, message: "Failed to set occlusion params" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

const occlusionClear: ToolDefinition = {
  id: "occlusion_clear",
  name: "Clear Occlusion Data",
  description: "Clear all baked occlusion culling data",
  descriptionJa: "すべてのベイク済みオクルージョンカリングデータをクリア",
  category: "occlusion",
  inputSchema: z.object({}),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "OcclusionClear", p);
      return r ? { success: true, message: "Occlusion data cleared", data: r }
               : { success: false, message: "Failed to clear occlusion data" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

const occlusionVisualize: ToolDefinition = {
  id: "occlusion_visualize",
  name: "Visualize Occlusion",
  description: "Toggle occlusion culling visualization in scene view",
  descriptionJa: "シーンビューでオクルージョンカリングの可視化を切り替え",
  category: "occlusion",
  inputSchema: z.object({ enabled: z.boolean().default(true) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "OcclusionVisualize", p);
      return r ? { success: true, message: `Occlusion visualization: ${p.enabled ? "on" : "off"}`, data: r }
               : { success: false, message: "Failed to toggle visualization" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

export const occlusionTools: ToolDefinition[] = [
  occlusionBake, occlusionSetOccluder, occlusionSetOccludee,
  occlusionSetParams, occlusionClear, occlusionVisualize
];