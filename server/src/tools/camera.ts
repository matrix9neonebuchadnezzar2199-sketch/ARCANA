import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { unityBridge } from "../bridge/unity-bridge";

export const cameraCreate: ToolDefinition = {
  id: "camera_create",
  name: "Create Camera",
  description: "Create a new camera in the scene",
  descriptionJa: "シーンに新しいカメラを作成",
  category: "camera",
  inputSchema: z.object({
    name: z.string().describe("Camera name"),
    x: z.number().optional().describe("X position"),
    y: z.number().optional().describe("Y position"),
    z: z.number().optional().describe("Z position"),
    fov: z.number().optional().describe("Field of view, default 60")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("CameraCreate", params);
      return { success: true, message: `Created camera: ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const cameraSetFOV: ToolDefinition = {
  id: "camera_set_fov",
  name: "Set Camera FOV",
  description: "Set the field of view of a camera",
  descriptionJa: "カメラの視野角を設定",
  category: "camera",
  inputSchema: z.object({
    name: z.string().describe("Camera GameObject name"),
    fov: z.number().min(1).max(179).describe("Field of view in degrees")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("CameraSetFOV", params);
      return { success: true, message: `Set FOV of ${params.name} to ${params.fov}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const cameraSetBackground: ToolDefinition = {
  id: "camera_set_background",
  name: "Set Camera Background",
  description: "Set the background color or skybox of a camera",
  descriptionJa: "カメラの背景色またはスカイボックスを設定",
  category: "camera",
  inputSchema: z.object({
    name: z.string().describe("Camera GameObject name"),
    color: z.string().optional().describe("Background color as hex string"),
    clearFlags: z.enum(["Skybox", "SolidColor", "Depth", "Nothing"]).optional().describe("Camera clear flags")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("CameraSetBackground", params);
      return { success: true, message: `Set background of ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const cameraTools = [
  cameraCreate,
  cameraSetFOV,
  cameraSetBackground
];