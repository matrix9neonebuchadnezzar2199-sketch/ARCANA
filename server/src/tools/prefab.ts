import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { unityBridge } from "../bridge/unity-bridge";

export const prefabCreate: ToolDefinition = {
  id: "prefab_create",
  name: "Create Prefab",
  description: "Save a GameObject as a prefab asset",
  descriptionJa: "GameObjectをプレハブアセットとして保存",
  category: "prefab",
  inputSchema: z.object({
    name: z.string().describe("Source GameObject name"),
    savePath: z.string().optional().describe("Save path relative to Assets, default Assets/<name>.prefab")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("PrefabCreate", params);
      return { success: true, message: `Created prefab from ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const prefabInstantiate: ToolDefinition = {
  id: "prefab_instantiate",
  name: "Instantiate Prefab",
  description: "Instantiate a prefab into the scene",
  descriptionJa: "プレハブをシーンにインスタンス化",
  category: "prefab",
  inputSchema: z.object({
    prefabPath: z.string().describe("Prefab asset path relative to Assets"),
    name: z.string().optional().describe("Instance name"),
    x: z.number().optional().describe("X position"),
    y: z.number().optional().describe("Y position"),
    z: z.number().optional().describe("Z position")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("PrefabInstantiate", params);
      return { success: true, message: `Instantiated prefab: ${params.prefabPath}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const prefabUnpack: ToolDefinition = {
  id: "prefab_unpack",
  name: "Unpack Prefab",
  description: "Unpack a prefab instance in the scene",
  descriptionJa: "シーン内のプレハブインスタンスをアンパック",
  category: "prefab",
  inputSchema: z.object({
    name: z.string().describe("Prefab instance GameObject name"),
    completely: z.boolean().optional().describe("Unpack completely including nested, default false")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("PrefabUnpack", params);
      return { success: true, message: `Unpacked prefab: ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const prefabTools = [
  prefabCreate,
  prefabInstantiate,
  prefabUnpack
];