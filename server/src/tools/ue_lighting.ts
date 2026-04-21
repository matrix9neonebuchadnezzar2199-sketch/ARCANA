import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const ueLightCreate: ToolDefinition = {
  id: "ue_light_create", name: "Create Light",
  description: "Create a light actor (Point, Spot, Directional, Rect)",
  descriptionJa: "ライトアクターを作成（Point, Spot, Directional, Rect）",
  category: "ue_lighting",
  inputSchema: z.object({ type: z.enum(["Point","Spot","Directional","Rect"]).default("Point"), name: z.string().optional(), x: z.number().default(0), y: z.number().default(300), z: z.number().default(0) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LightCreate", p, { successMessage: (_, p) => `${p.type} light created` }) }
};

const ueLightSetColor: ToolDefinition = {
  id: "ue_light_set_color", name: "Set Light Color",
  description: "Set the color of a light actor",
  descriptionJa: "ライトアクターの色を設定",
  category: "ue_lighting",
  inputSchema: z.object({ actorName: z.string(), r: z.number().default(255), g: z.number().default(255), b: z.number().default(255) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LightSetColor", p, { successMessage: (_, p) => `Light color set on ${p.actorName}` }) }
};

const ueLightSetIntensity: ToolDefinition = {
  id: "ue_light_set_intensity", name: "Set Light Intensity",
  description: "Set the intensity of a light in lumens/candela",
  descriptionJa: "ルーメン/カンデラでライトの強度を設定",
  category: "ue_lighting",
  inputSchema: z.object({ actorName: z.string(), intensity: z.number().default(5000), unit: z.enum(["Lumens","Candelas","Unitless"]).default("Lumens") }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LightSetIntensity", p, { successMessage: (_, p) => `Intensity set to ${p.intensity} ${p.unit}` }) }
};

const ueLightSetShadow: ToolDefinition = {
  id: "ue_light_set_shadow", name: "Set Light Shadow",
  description: "Enable/disable shadows and set shadow settings",
  descriptionJa: "シャドウの有効/無効と設定を変更",
  category: "ue_lighting",
  inputSchema: z.object({ actorName: z.string(), castShadows: z.boolean().default(true), shadowResolution: z.number().default(1024) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LightSetShadow", p, { successMessage: (_, p) => `Shadow set on ${p.actorName}` }) }
};

const ueLightSetAttenuation: ToolDefinition = {
  id: "ue_light_set_attenuation", name: "Set Light Attenuation",
  description: "Set the attenuation radius of a point/spot light",
  descriptionJa: "ポイント/スポットライトの減衰半径を設定",
  category: "ue_lighting",
  inputSchema: z.object({ actorName: z.string(), radius: z.number().default(1000) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LightSetAttenuation", p, { successMessage: (_, p) => `Attenuation radius set to ${p.radius}` }) }
};

const ueLightSetTemperature: ToolDefinition = {
  id: "ue_light_set_temperature", name: "Set Light Temperature",
  description: "Set color temperature in Kelvin",
  descriptionJa: "色温度をケルビンで設定",
  category: "ue_lighting",
  inputSchema: z.object({ actorName: z.string(), temperature: z.number().default(6500), useTemperature: z.boolean().default(true) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LightSetTemperature", p, { successMessage: (_, p) => `Temperature set to ${p.temperature}K` }) }
};

export const ueLightingTools: ToolDefinition[] = [
  ueLightCreate, ueLightSetColor, ueLightSetIntensity,
  ueLightSetShadow, ueLightSetAttenuation, ueLightSetTemperature
];