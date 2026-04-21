import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
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
    return bridgeSendAsToolResult("unity", "MaterialSetColor", params, { successMessage: (_, params) => `Set color of ${params.name} to ${params.color}` });
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
    return bridgeSendAsToolResult("unity", "MaterialSetTransparency", params, { successMessage: (_, params) => `Set transparency of ${params.name} to ${params.alpha}` });
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
    return bridgeSendAsToolResult("unity", "MaterialSetEmission", params, { successMessage: (_, params) => `Set emission of ${params.name} to ${params.color}` });
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
    return bridgeSendAsToolResult("unity", "MaterialSetShader", params, { successMessage: (_, params) => `Set shader of ${params.name} to ${params.shader}` });
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
    return bridgeSendAsToolResult("unity", "MaterialSetTexture", params, { successMessage: (_, params) => `Set texture of ${params.name} to ${params.texturePath}` });
  }
};

export const materialTools = [
  materialSetColor,
  materialSetTransparency,
  materialSetEmission,
  materialSetShader,
  materialSetTexture
];