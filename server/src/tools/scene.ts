import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
export const sceneListObjects: ToolDefinition = {
  id: "scene_list_objects",
  name: "List Scene Objects",
  description: "List all GameObjects in the current Unity scene",
  descriptionJa: "現在のUnityシーンの全GameObjectをリスト表示",
  category: "scene",
  inputSchema: z.object({
    includeInactive: z.boolean().optional().describe("Include inactive objects")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "SceneListObjects", params);
      return {
        success: true,
        message: "Scene objects retrieved",
        data: result
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to list scene objects: ${error.message}`
      };
    }
  }
};

export const sceneCreateGameObject: ToolDefinition = {
  id: "scene_create_gameobject",
  name: "Create GameObject",
  description: "Create a new GameObject in the Unity scene",
  descriptionJa: "Unityシーンに新しいGameObjectを作成",
  category: "scene",
  inputSchema: z.object({
    name: z.string().describe("Name of the GameObject"),
    primitive: z.enum(["Cube", "Sphere", "Cylinder", "Plane", "Capsule", "Empty"]).optional().describe("Primitive type"),
    position: z.object({
      x: z.number(),
      y: z.number(),
      z: z.number()
    }).optional().describe("World position"),
    color: z.string().optional().describe("Color as hex string, e.g. #FF0000")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "SceneCreateGameObject", params);
      return {
        success: true,
        message: `Created GameObject: ${params.name}`,
        data: result
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to create GameObject: ${error.message}`
      };
    }
  }
};

export const sceneDeleteGameObject: ToolDefinition = {
  id: "scene_delete_gameobject",
  name: "Delete GameObject",
  description: "Delete a GameObject from the Unity scene by name",
  descriptionJa: "名前を指定してUnityシーンからGameObjectを削除",
  category: "scene",
  inputSchema: z.object({
    name: z.string().describe("Name of the GameObject to delete")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "SceneDeleteGameObject", params);
      return {
        success: true,
        message: `Deleted GameObject: ${params.name}`,
        data: result
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to delete GameObject: ${error.message}`
      };
    }
  }
};

export const sceneTools = [
  sceneListObjects,
  sceneCreateGameObject,
  sceneDeleteGameObject
];