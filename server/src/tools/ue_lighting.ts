import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unrealBridge } from "../bridge/unreal-bridge";

const ueLightCreate: ToolDefinition = {
  id: "ue_light_create", name: "Create Light",
  description: "Create a light actor (Point, Spot, Directional, Rect)",
  descriptionJa: "ライトアクターを作成（Point, Spot, Directional, Rect）",
  category: "ue_lighting",
  inputSchema: z.object({ type: z.enum(["Point","Spot","Directional","Rect"]).default("Point"), name: z.string().optional(), x: z.number().default(0), y: z.number().default(300), z: z.number().default(0) }),
  handler: async (p) => { const r = await unrealBridge.send("LightCreate", p); return r ? { success: true, message: `${p.type} light created`, data: r } : { success: false, message: "Failed" }; }
};

const ueLightSetColor: ToolDefinition = {
  id: "ue_light_set_color", name: "Set Light Color",
  description: "Set the color of a light actor",
  descriptionJa: "ライトアクターの色を設定",
  category: "ue_lighting",
  inputSchema: z.object({ actorName: z.string(), r: z.number().default(255), g: z.number().default(255), b: z.number().default(255) }),
  handler: async (p) => { const r = await unrealBridge.send("LightSetColor", p); return r ? { success: true, message: `Light color set on ${p.actorName}`, data: r } : { success: false, message: "Failed" }; }
};

const ueLightSetIntensity: ToolDefinition = {
  id: "ue_light_set_intensity", name: "Set Light Intensity",
  description: "Set the intensity of a light in lumens/candela",
  descriptionJa: "ルーメン/カンデラでライトの強度を設定",
  category: "ue_lighting",
  inputSchema: z.object({ actorName: z.string(), intensity: z.number().default(5000), unit: z.enum(["Lumens","Candelas","Unitless"]).default("Lumens") }),
  handler: async (p) => { const r = await unrealBridge.send("LightSetIntensity", p); return r ? { success: true, message: `Intensity set to ${p.intensity} ${p.unit}`, data: r } : { success: false, message: "Failed" }; }
};

const ueLightSetShadow: ToolDefinition = {
  id: "ue_light_set_shadow", name: "Set Light Shadow",
  description: "Enable/disable shadows and set shadow settings",
  descriptionJa: "シャドウの有効/無効と設定を変更",
  category: "ue_lighting",
  inputSchema: z.object({ actorName: z.string(), castShadows: z.boolean().default(true), shadowResolution: z.number().default(1024) }),
  handler: async (p) => { const r = await unrealBridge.send("LightSetShadow", p); return r ? { success: true, message: `Shadow set on ${p.actorName}`, data: r } : { success: false, message: "Failed" }; }
};

const ueLightSetAttenuation: ToolDefinition = {
  id: "ue_light_set_attenuation", name: "Set Light Attenuation",
  description: "Set the attenuation radius of a point/spot light",
  descriptionJa: "ポイント/スポットライトの減衰半径を設定",
  category: "ue_lighting",
  inputSchema: z.object({ actorName: z.string(), radius: z.number().default(1000) }),
  handler: async (p) => { const r = await unrealBridge.send("LightSetAttenuation", p); return r ? { success: true, message: `Attenuation radius set to ${p.radius}`, data: r } : { success: false, message: "Failed" }; }
};

const ueLightSetTemperature: ToolDefinition = {
  id: "ue_light_set_temperature", name: "Set Light Temperature",
  description: "Set color temperature in Kelvin",
  descriptionJa: "色温度をケルビンで設定",
  category: "ue_lighting",
  inputSchema: z.object({ actorName: z.string(), temperature: z.number().default(6500), useTemperature: z.boolean().default(true) }),
  handler: async (p) => { const r = await unrealBridge.send("LightSetTemperature", p); return r ? { success: true, message: `Temperature set to ${p.temperature}K`, data: r } : { success: false, message: "Failed" }; }
};

export const ueLightingTools: ToolDefinition[] = [
  ueLightCreate, ueLightSetColor, ueLightSetIntensity,
  ueLightSetShadow, ueLightSetAttenuation, ueLightSetTemperature
];