import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const lodCreateGroup: ToolDefinition = {
  id: "lod_create_group",
  name: "Create LOD Group",
  description: "Create a LOD Group component on a GameObject",
  descriptionJa: "GameObjectにLOD Groupコンポーネントを作成",
  category: "lod",
  inputSchema: z.object({ objectName: z.string(), levels: z.number().default(3) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "LodCreateGroup", p, { successMessage: (_, p) => `LOD Group created on ${p.objectName}` });
  }
};

const lodSetTransitions: ToolDefinition = {
  id: "lod_set_transitions",
  name: "Set LOD Transitions",
  description: "Set transition distances for LOD levels",
  descriptionJa: "LODレベルの遷移距離を設定",
  category: "lod",
  inputSchema: z.object({ objectName: z.string(), transitions: z.array(z.number()) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "LodSetTransitions", p, { successMessage: (_, p) => `LOD transitions set on ${p.objectName}` });
  }
};

const lodAssignRenderer: ToolDefinition = {
  id: "lod_assign_renderer",
  name: "Assign LOD Renderer",
  description: "Assign a renderer to a specific LOD level",
  descriptionJa: "特定LODレベルにレンダラーを割り当て",
  category: "lod",
  inputSchema: z.object({ objectName: z.string(), lodLevel: z.number(), rendererName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "LodAssignRenderer", p, { successMessage: (_, p) => `Renderer assigned to LOD ${p.lodLevel}` });
  }
};

const lodSetFadeMode: ToolDefinition = {
  id: "lod_set_fade_mode",
  name: "Set LOD Fade Mode",
  description: "Set fade transition mode (None, CrossFade, SpeedTree)",
  descriptionJa: "LODフェードモードを設定（None/CrossFade/SpeedTree）",
  category: "lod",
  inputSchema: z.object({ objectName: z.string(), fadeMode: z.enum(["None","CrossFade","SpeedTree"]).default("CrossFade") }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "LodSetFadeMode", p, { successMessage: (_, p) => `Fade mode set to ${p.fadeMode}` });
  }
};

const lodGetInfo: ToolDefinition = {
  id: "lod_get_info",
  name: "Get LOD Info",
  description: "Get LOD Group information for a GameObject",
  descriptionJa: "GameObjectのLOD Group情報を取得",
  category: "lod",
  inputSchema: z.object({ objectName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "LodGetInfo", p, { successMessage: "LOD info retrieved" });
  }
};

const lodRemove: ToolDefinition = {
  id: "lod_remove",
  name: "Remove LOD Group",
  description: "Remove LOD Group from a GameObject",
  descriptionJa: "GameObjectからLOD Groupを除去",
  category: "lod",
  inputSchema: z.object({ objectName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "LodRemove", p, { successMessage: (_, p) => `LOD Group removed from ${p.objectName}` });
  }
};

export const lodTools: ToolDefinition[] = [
  lodCreateGroup, lodSetTransitions, lodAssignRenderer,
  lodSetFadeMode, lodGetInfo, lodRemove
];