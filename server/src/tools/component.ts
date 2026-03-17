import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { unityBridge } from "../bridge/unity-bridge";

export const componentAdd: ToolDefinition = {
  id: "component_add",
  name: "Add Component",
  description: "Add a component to a GameObject by type name",
  descriptionJa: "型名を指定してGameObjectにコンポーネントを追加",
  category: "component",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    componentType: z.string().describe("Component type name, e.g. Rigidbody, BoxCollider, AudioSource")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("ComponentAdd", params);
      return { success: true, message: `Added ${params.componentType} to ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const componentRemove: ToolDefinition = {
  id: "component_remove",
  name: "Remove Component",
  description: "Remove a component from a GameObject by type name",
  descriptionJa: "型名を指定してGameObjectからコンポーネントを削除",
  category: "component",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    componentType: z.string().describe("Component type name to remove")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("ComponentRemove", params);
      return { success: true, message: `Removed ${params.componentType} from ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const componentSetEnabled: ToolDefinition = {
  id: "component_set_enabled",
  name: "Set Component Enabled",
  description: "Enable or disable a component on a GameObject",
  descriptionJa: "GameObjectのコンポーネントの有効/無効を設定",
  category: "component",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    componentType: z.string().describe("Component type name"),
    enabled: z.boolean().describe("Enable or disable")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("ComponentSetEnabled", params);
      return { success: true, message: `Set ${params.componentType} enabled=${params.enabled} on ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const componentList: ToolDefinition = {
  id: "component_list",
  name: "List Components",
  description: "List all components on a GameObject",
  descriptionJa: "GameObjectの全コンポーネントをリスト表示",
  category: "component",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("ComponentList", params);
      return { success: true, message: `Components on ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const componentTools = [
  componentAdd,
  componentRemove,
  componentSetEnabled,
  componentList
];