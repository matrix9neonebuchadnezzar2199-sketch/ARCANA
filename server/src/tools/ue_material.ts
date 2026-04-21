import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const ueMaterialCreate: ToolDefinition = {
  id: "ue_material_create", name: "Create Material",
  description: "Create a new material asset",
  descriptionJa: "新しいマテリアルアセットを作成",
  category: "ue_material",
  inputSchema: z.object({ name: z.string(), path: z.string().default("/Game/Materials") }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "MaterialCreate", p, { successMessage: (_, p) => `Material created: ${p.name}` }) }
};

const ueMaterialSetColor: ToolDefinition = {
  id: "ue_material_set_color", name: "Set Material Color",
  description: "Set base color of a material",
  descriptionJa: "マテリアルのベースカラーを設定",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), r: z.number().default(1), g: z.number().default(1), b: z.number().default(1), a: z.number().default(1) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "MaterialSetColor", p, { successMessage: (_, p) => `Color set on ${p.actorName}` }) }
};

const ueMaterialSetMetallic: ToolDefinition = {
  id: "ue_material_set_metallic", name: "Set Metallic",
  description: "Set metallic value of a material",
  descriptionJa: "マテリアルのメタリック値を設定",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), value: z.number().min(0).max(1).default(0) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "MaterialSetMetallic", p, { successMessage: (_, p) => `Metallic set to ${p.value}` }) }
};

const ueMaterialSetRoughness: ToolDefinition = {
  id: "ue_material_set_roughness", name: "Set Roughness",
  description: "Set roughness value of a material",
  descriptionJa: "マテリアルのラフネス値を設定",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), value: z.number().min(0).max(1).default(0.5) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "MaterialSetRoughness", p, { successMessage: (_, p) => `Roughness set to ${p.value}` }) }
};

const ueMaterialSetEmissive: ToolDefinition = {
  id: "ue_material_set_emissive", name: "Set Emissive",
  description: "Set emissive color and intensity",
  descriptionJa: "エミッシブカラーと強度を設定",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), r: z.number().default(1), g: z.number().default(1), b: z.number().default(1), intensity: z.number().default(1) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "MaterialSetEmissive", p, { successMessage: (_, p) => `Emissive set on ${p.actorName}` }) }
};

const ueMaterialSetTexture: ToolDefinition = {
  id: "ue_material_set_texture", name: "Set Texture",
  description: "Set a texture on a material parameter",
  descriptionJa: "マテリアルパラメータにテクスチャを設定",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), texturePath: z.string(), parameter: z.string().default("BaseColor") }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "MaterialSetTexture", p, { successMessage: (_, p) => `Texture set: ${p.parameter}` }) }
};

const ueMaterialSetOpacity: ToolDefinition = {
  id: "ue_material_set_opacity", name: "Set Opacity",
  description: "Set opacity and blend mode of a material",
  descriptionJa: "マテリアルの不透明度とブレンドモードを設定",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), opacity: z.number().min(0).max(1).default(1), blendMode: z.enum(["Opaque","Translucent","Masked","Additive"]).default("Opaque") }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "MaterialSetOpacity", p, { successMessage: (_, p) => `Opacity set to ${p.opacity}` }) }
};

const ueMaterialAssign: ToolDefinition = {
  id: "ue_material_assign", name: "Assign Material",
  description: "Assign a material to an actor by asset path",
  descriptionJa: "アセットパスでアクターにマテリアルを割り当て",
  category: "ue_material",
  inputSchema: z.object({ actorName: z.string(), materialPath: z.string(), slotIndex: z.number().default(0) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "MaterialAssign", p, { successMessage: (_, p) => `Material assigned to ${p.actorName}` }) }
};

export const ueMaterialTools: ToolDefinition[] = [
  ueMaterialCreate, ueMaterialSetColor, ueMaterialSetMetallic, ueMaterialSetRoughness,
  ueMaterialSetEmissive, ueMaterialSetTexture, ueMaterialSetOpacity, ueMaterialAssign
];