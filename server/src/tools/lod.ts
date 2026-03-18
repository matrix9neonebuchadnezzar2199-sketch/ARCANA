import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const lodCreateGroup: ToolDefinition = {
  id: "lod_create_group",
  name: "Create LOD Group",
  description: "Create a LOD Group component on a GameObject",
  descriptionJa: "GameObjectにLOD Groupコンポーネントを作成",
  category: "lod",
  inputSchema: z.object({ objectName: z.string(), levels: z.number().default(3) }),
  handler: async (p) => {
    const r = await bridge.send("unity", "LodCreateGroup", p);
    return r ? { success: true, message: `LOD Group created on ${p.objectName}`, data: r }
             : { success: false, message: "Failed to create LOD Group" };
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
    const r = await bridge.send("unity", "LodSetTransitions", p);
    return r ? { success: true, message: `LOD transitions set on ${p.objectName}`, data: r }
             : { success: false, message: "Failed to set transitions" };
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
    const r = await bridge.send("unity", "LodAssignRenderer", p);
    return r ? { success: true, message: `Renderer assigned to LOD ${p.lodLevel}`, data: r }
             : { success: false, message: "Failed to assign renderer" };
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
    const r = await bridge.send("unity", "LodSetFadeMode", p);
    return r ? { success: true, message: `Fade mode set to ${p.fadeMode}`, data: r }
             : { success: false, message: "Failed to set fade mode" };
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
    const r = await bridge.send("unity", "LodGetInfo", p);
    return r ? { success: true, message: "LOD info retrieved", data: r }
             : { success: false, message: "Failed to get LOD info" };
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
    const r = await bridge.send("unity", "LodRemove", p);
    return r ? { success: true, message: `LOD Group removed from ${p.objectName}`, data: r }
             : { success: false, message: "Failed to remove LOD Group" };
  }
};

export const lodTools: ToolDefinition[] = [
  lodCreateGroup, lodSetTransitions, lodAssignRenderer,
  lodSetFadeMode, lodGetInfo, lodRemove
];