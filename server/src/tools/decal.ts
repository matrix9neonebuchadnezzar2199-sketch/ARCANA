import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const decalCreate: ToolDefinition = {
  id: "decal_create",
  name: "Create Decal",
  description: "Create a URP/HDRP decal projector in the scene",
  descriptionJa: "シーンにURP/HDRPデカールプロジェクターを作成",
  category: "decal",
  inputSchema: z.object({ name: z.string().optional(), materialPath: z.string(), x: z.number().default(0), y: z.number().default(0), z: z.number().default(0) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "DecalCreate", p, { successMessage: (_, p) => `Decal created: ${p.name ?? "NewDecal"}` });
  }
};

const decalSetSize: ToolDefinition = {
  id: "decal_set_size",
  name: "Set Decal Size",
  description: "Set the projection size of a decal",
  descriptionJa: "デカールの投影サイズを設定",
  category: "decal",
  inputSchema: z.object({ objectName: z.string(), width: z.number().default(1), height: z.number().default(1), depth: z.number().default(1) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "DecalSetSize", p, { successMessage: (_, p) => `Decal size set on ${p.objectName}` });
  }
};

const decalSetMaterial: ToolDefinition = {
  id: "decal_set_material",
  name: "Set Decal Material",
  description: "Change the material of an existing decal projector",
  descriptionJa: "既存デカールプロジェクターのマテリアルを変更",
  category: "decal",
  inputSchema: z.object({ objectName: z.string(), materialPath: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "DecalSetMaterial", p, { successMessage: (_, p) => `Material changed on ${p.objectName}` });
  }
};

const decalSetOpacity: ToolDefinition = {
  id: "decal_set_opacity",
  name: "Set Decal Opacity",
  description: "Set the opacity (fade factor) of a decal projector",
  descriptionJa: "デカールプロジェクターの不透明度を設定",
  category: "decal",
  inputSchema: z.object({ objectName: z.string(), opacity: z.number().min(0).max(1).default(1) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "DecalSetOpacity", p, { successMessage: (_, p) => `Opacity set to ${p.opacity} on ${p.objectName}` });
  }
};

const decalRemove: ToolDefinition = {
  id: "decal_remove",
  name: "Remove Decal",
  description: "Remove a decal projector from the scene",
  descriptionJa: "シーンからデカールプロジェクターを除去",
  category: "decal",
  inputSchema: z.object({ objectName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "DecalRemove", p, { successMessage: (_, p) => `Decal removed: ${p.objectName}` });
  }
};

export const decalTools: ToolDefinition[] = [
  decalCreate, decalSetSize, decalSetMaterial, decalSetOpacity, decalRemove
];