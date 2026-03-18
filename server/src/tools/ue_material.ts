import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unrealBridge } from "../bridge/unreal-bridge";

const ueMaterialCreate: ToolDefinition = {
  id: "ue_material_create", name: "Create Material",
  description: "Create a new material asset",
  descriptionJa: "新しいマテリアルアセットを作成",
  category: "ue_material",
  inputSchema: z.object({ name: z.string(), path: z.string().default("/Game/Materials") }),
  handler: async (p) => { const r = await unrealBridge.send("MaterialCreate", p); return r ? { success: true, message: `Material created: ${p.name}`, data: r } : { success: false, message: "Failed" }; }
};

const ueMaterialSetColor: ToolDefinition = {
  id: "ue_material_set_color", name: "Set Material Color",
  description: "Set base color of a material",
  descriptionJa: "マテリアルのベースカラーを設定",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), r: z.number().default(1), g: z.number().default(1), b: z.number().default(1), a: z.number().default(1) }),
  handler: async (p) => { const r = await unrealBridge.send("MaterialSetColor", p); return r ? { success: true, message: `Color set on ${p.actorName}`, data: r } : { success: false, message: "Failed" }; }
};

const ueMaterialSetMetallic: ToolDefinition = {
  id: "ue_material_set_metallic", name: "Set Metallic",
  description: "Set metallic value of a material",
  descriptionJa: "マテリアルのメタリック値を設定",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), value: z.number().min(0).max(1).default(0) }),
  handler: async (p) => { const r = await unrealBridge.send("MaterialSetMetallic", p); return r ? { success: true, message: `Metallic set to ${p.value}`, data: r } : { success: false, message: "Failed" }; }
};

const ueMaterialSetRoughness: ToolDefinition = {
  id: "ue_material_set_roughness", name: "Set Roughness",
  description: "Set roughness value of a material",
  descriptionJa: "マテリアルのラフネス値を設定",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), value: z.number().min(0).max(1).default(0.5) }),
  handler: async (p) => { const r = await unrealBridge.send("MaterialSetRoughness", p); return r ? { success: true, message: `Roughness set to ${p.value}`, data: r } : { success: false, message: "Failed" }; }
};

const ueMaterialSetEmissive: ToolDefinition = {
  id: "ue_material_set_emissive", name: "Set Emissive",
  description: "Set emissive color and intensity",
  descriptionJa: "エミッシブカラーと強度を設定",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), r: z.number().default(1), g: z.number().default(1), b: z.number().default(1), intensity: z.number().default(1) }),
  handler: async (p) => { const r = await unrealBridge.send("MaterialSetEmissive", p); return r ? { success: true, message: `Emissive set on ${p.actorName}`, data: r } : { success: false, message: "Failed" }; }
};

const ueMaterialSetTexture: ToolDefinition = {
  id: "ue_material_set_texture", name: "Set Texture",
  description: "Set a texture on a material parameter",
  descriptionJa: "マテリアルパラメータにテクスチャを設定",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), texturePath: z.string(), parameter: z.string().default("BaseColor") }),
  handler: async (p) => { const r = await unrealBridge.send("MaterialSetTexture", p); return r ? { success: true, message: `Texture set: ${p.parameter}`, data: r } : { success: false, message: "Failed" }; }
};

const ueMaterialSetOpacity: ToolDefinition = {
  id: "ue_material_set_opacity", name: "Set Opacity",
  description: "Set opacity and blend mode of a material",
  descriptionJa: "マテリアルの不透明度とブレンドモードを設定",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), opacity: z.number().min(0).max(1).default(1), blendMode: z.enum(["Opaque","Translucent","Masked","Additive"]).default("Opaque") }),
  handler: async (p) => { const r = await unrealBridge.send("MaterialSetOpacity", p); return r ? { success: true, message: `Opacity set to ${p.opacity}`, data: r } : { success: false, message: "Failed" }; }
};

const ueMaterialAssign: ToolDefinition = {
  id: "ue_material_assign", name: "Assign Material",
  description: "Assign a material to an actor by asset path",
  descriptionJa: "アセットパスでアクターにマテリアルを割り当て",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), materialPath: z.string(), slotIndex: z.number().default(0) }),
  handler: async (p) => { const r = await unrealBridge.send("MaterialAssign", p); return r ? { success: true, message: `Material assigned to ${p.actorName}`, data: r } : { success: false, message: "Failed" }; }
};

export const ueMaterialTools: ToolDefinition[] = [
  ueMaterialCreate, ueMaterialSetColor, ueMaterialSetMetallic, ueMaterialSetRoughness,
  ueMaterialSetEmissive, ueMaterialSetTexture, ueMaterialSetOpacity, ueMaterialAssign
];