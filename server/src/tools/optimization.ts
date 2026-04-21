import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
export const optGetSceneStats: ToolDefinition = {
  id: "opt_get_scene_stats",
  name: "Get Scene Statistics",
  description: "Get scene statistics including object count, triangle count, and material count",
  descriptionJa: "オブジェクト数、三角形数、マテリアル数などのシーン統計を取得",
  category: "optimization",
  inputSchema: z.object({}),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "OptGetSceneStats", params, { successMessage: "Scene statistics retrieved" });
  }
};

export const optSetStatic: ToolDefinition = {
  id: "opt_set_static",
  name: "Set Static Flags",
  description: "Set static flags on a GameObject for batching and lightmapping",
  descriptionJa: "バッチングとライトマッピング用にGameObjectのStaticフラグを設定",
  category: "optimization",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    isStatic: z.boolean().describe("Enable or disable static flag"),
    includeChildren: z.boolean().optional().describe("Apply to children, default true")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "OptSetStatic", params, { successMessage: (_, params) => `Set static on ${params.name} to ${params.isStatic}` });
  }
};

export const optAddLODGroup: ToolDefinition = {
  id: "opt_add_lod_group",
  name: "Add LOD Group",
  description: "Add a LOD Group component to a GameObject for level-of-detail optimization",
  descriptionJa: "LOD最適化のためにGameObjectにLOD Groupコンポーネントを追加",
  category: "optimization",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    lodLevels: z.number().optional().describe("Number of LOD levels, default 3"),
    fadeMode: z.enum(["None", "CrossFade", "SpeedTree"]).optional().describe("LOD fade mode, default None")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "OptAddLODGroup", params, { successMessage: (_, params) => `Added LOD Group to ${params.name}` });
  }
};

export const optRemoveMissingScripts: ToolDefinition = {
  id: "opt_remove_missing_scripts",
  name: "Remove Missing Scripts",
  description: "Remove all missing script components from the scene",
  descriptionJa: "シーンからMissing Scriptコンポーネントを全て削除",
  category: "optimization",
  inputSchema: z.object({}),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "OptRemoveMissingScripts", params, { successMessage: "Removed missing scripts" });
  }
};

export const optimizationTools = [
  optGetSceneStats,
  optSetStatic,
  optAddLODGroup,
  optRemoveMissingScripts
];