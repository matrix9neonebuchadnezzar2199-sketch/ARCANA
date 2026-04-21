import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
export const lightingCreateLight: ToolDefinition = {
  id: "lighting_create_light",
  name: "Create Light",
  description: "Create a new light in the scene",
  descriptionJa: "シーンに新しいライトを作成",
  category: "lighting",
  inputSchema: z.object({
    name: z.string().describe("Light name"),
    type: z.enum(["Directional", "Point", "Spot", "Area"]).describe("Light type"),
    x: z.number().optional().describe("X position"),
    y: z.number().optional().describe("Y position"),
    z: z.number().optional().describe("Z position"),
    color: z.string().optional().describe("Light color as hex string"),
    intensity: z.number().optional().describe("Light intensity")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "LightingCreateLight", params, { successMessage: (_, params) => `Created ${params.type} light: ${params.name}` });
  }
};

export const lightingSetColor: ToolDefinition = {
  id: "lighting_set_color",
  name: "Set Light Color",
  description: "Change the color of an existing light",
  descriptionJa: "既存ライトの色を変更",
  category: "lighting",
  inputSchema: z.object({
    name: z.string().describe("Light GameObject name"),
    color: z.string().describe("Color as hex string")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "LightingSetColor", params, { successMessage: (_, params) => `Set light color of ${params.name} to ${params.color}` });
  }
};

export const lightingSetIntensity: ToolDefinition = {
  id: "lighting_set_intensity",
  name: "Set Light Intensity",
  description: "Change the intensity of an existing light",
  descriptionJa: "既存ライトの強度を変更",
  category: "lighting",
  inputSchema: z.object({
    name: z.string().describe("Light GameObject name"),
    intensity: z.number().describe("Light intensity value")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "LightingSetIntensity", params, { successMessage: (_, params) => `Set intensity of ${params.name} to ${params.intensity}` });
  }
};

export const lightingSetShadow: ToolDefinition = {
  id: "lighting_set_shadow",
  name: "Set Shadow Mode",
  description: "Enable or disable shadows on a light",
  descriptionJa: "ライトの影のオン・オフを設定",
  category: "lighting",
  inputSchema: z.object({
    name: z.string().describe("Light GameObject name"),
    mode: z.enum(["None", "Hard", "Soft"]).describe("Shadow mode")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "LightingSetShadow", params, { successMessage: (_, params) => `Set shadow mode of ${params.name} to ${params.mode}` });
  }
};

export const lightingSetAmbient: ToolDefinition = {
  id: "lighting_set_ambient",
  name: "Set Ambient Light",
  description: "Set the scene ambient light color and intensity",
  descriptionJa: "シーンの環境光の色と強度を設定",
  category: "lighting",
  inputSchema: z.object({
    color: z.string().describe("Ambient color as hex string"),
    intensity: z.number().optional().describe("Ambient intensity")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "LightingSetAmbient", params, { successMessage: (_, params) => `Set ambient light to ${params.color}` });
  }
};

export const lightingTools = [
  lightingCreateLight,
  lightingSetColor,
  lightingSetIntensity,
  lightingSetShadow,
  lightingSetAmbient
];