import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
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
    return bridgeSendAsToolResult("unity", "SceneListObjects", params, { successMessage: "Scene objects retrieved" });
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
    return bridgeSendAsToolResult("unity", "SceneCreateGameObject", params, { successMessage: (_, params) => `Created GameObject: ${params.name}` });
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
    return bridgeSendAsToolResult("unity", "SceneDeleteGameObject", params, { successMessage: (_, params) => `Deleted GameObject: ${params.name}` });
  }
};

export const sceneTools = [
  sceneListObjects,
  sceneCreateGameObject,
  sceneDeleteGameObject
];