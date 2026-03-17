import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { unityBridge } from "../bridge/unity-bridge";

export const materialSetColor: ToolDefinition = {
  id: "material_set_color",
  name: "Set Material Color",
  description: "Set the main color of a GameObjects material",
  descriptionJa: "GameObjectのマテリアルのメインカラーを設定",
  category: "material",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    color: z.string().describe("Color as hex string, e.g. #FF0000")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("MaterialSetColor", params);
      return { success: true, message: `Set color of ${params.name} to ${params.color}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const materialSetTransparency: ToolDefinition = {
  id: "material_set_transparency",
  name: "Set Transparency",
  description: "Set the transparency (alpha) of a GameObjects material",
  descriptionJa: "GameObjectのマテリアルの透明度を設定",
  category: "material",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    alpha: z.number().min(0).max(1).describe("Alpha value 0 (transparent) to 1 (opaque)")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("MaterialSetTransparency", params);
      return { success: true, message: `Set transparency of ${params.name} to ${params.alpha}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const materialSetEmission: ToolDefinition = {
  id: "material_set_emission",
  name: "Set Emission",
  description: "Enable emission and set emission color on a GameObjects material",
  descriptionJa: "GameObjectのマテリアルの発光を有効にし発光色を設定",
  category: "material",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    color: z.string().describe("Emission color as hex string"),
    intensity: z.number().optional().describe("Emission intensity, default 1.0")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("MaterialSetEmission", params);
      return { success: true, message: `Set emission of ${params.name} to ${params.color}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const materialSetShader: ToolDefinition = {
  id: "material_set_shader",
  name: "Set Shader",
  description: "Change the shader of a GameObjects material",
  descriptionJa: "GameObjectのマテリアルのシェーダーを変更",
  category: "material",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    shader: z.string().describe("Shader name, e.g. Standard, Unlit/Color, Universal Render Pipeline/Lit")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("MaterialSetShader", params);
      return { success: true, message: `Set shader of ${params.name} to ${params.shader}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const materialSetTexture: ToolDefinition = {
  id: "material_set_texture",
  name: "Set Texture",
  description: "Set the main texture of a GameObjects material from a file path",
  descriptionJa: "ファイルパスからGameObjectのメインテクスチャを設定",
  category: "material",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    texturePath: z.string().describe("Path to texture file relative to Assets folder")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("MaterialSetTexture", params);
      return { success: true, message: `Set texture of ${params.name} to ${params.texturePath}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const materialTools = [
  materialSetColor,
  materialSetTransparency,
  materialSetEmission,
  materialSetShader,
  materialSetTexture
];