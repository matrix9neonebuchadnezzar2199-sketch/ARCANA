import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
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
    try {
      const result = await bridge.send("unity", "LightingCreateLight", params);
      return { success: true, message: `Created ${params.type} light: ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
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
    try {
      const result = await bridge.send("unity", "LightingSetColor", params);
      return { success: true, message: `Set light color of ${params.name} to ${params.color}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
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
    try {
      const result = await bridge.send("unity", "LightingSetIntensity", params);
      return { success: true, message: `Set intensity of ${params.name} to ${params.intensity}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
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
    try {
      const result = await bridge.send("unity", "LightingSetShadow", params);
      return { success: true, message: `Set shadow mode of ${params.name} to ${params.mode}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
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
    try {
      const result = await bridge.send("unity", "LightingSetAmbient", params);
      return { success: true, message: `Set ambient light to ${params.color}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const lightingTools = [
  lightingCreateLight,
  lightingSetColor,
  lightingSetIntensity,
  lightingSetShadow,
  lightingSetAmbient
];