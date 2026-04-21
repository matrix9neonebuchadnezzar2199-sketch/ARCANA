import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const occlusionBake: ToolDefinition = {
  id: "occlusion_bake",
  name: "Bake Occlusion Culling",
  description: "Bake occlusion culling data for the scene",
  descriptionJa: "シーンのオクルージョンカリングデータをベイク",
  category: "occlusion",
  inputSchema: z.object({}),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "OcclusionBake", p, { successMessage: "Occlusion culling bake started" });
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
    return bridgeSendAsToolResult("unity", "OcclusionSetOccluder", p, { successMessage: (_, p) => `${p.objectName} occluder static: ${p.enabled}` });
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
    return bridgeSendAsToolResult("unity", "OcclusionSetOccludee", p, { successMessage: (_, p) => `${p.objectName} occludee static: ${p.enabled}` });
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
    return bridgeSendAsToolResult("unity", "OcclusionSetParams", p, { successMessage: "Occlusion parameters updated" });
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
    return bridgeSendAsToolResult("unity", "OcclusionClear", p, { successMessage: "Occlusion data cleared" });
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
    return bridgeSendAsToolResult("unity", "OcclusionVisualize", p, { successMessage: (_, p) => `Occlusion visualization: ${p.enabled ? "on" : "off"}` });
  }
};

export const occlusionTools: ToolDefinition[] = [
  occlusionBake, occlusionSetOccluder, occlusionSetOccludee,
  occlusionSetParams, occlusionClear, occlusionVisualize
];