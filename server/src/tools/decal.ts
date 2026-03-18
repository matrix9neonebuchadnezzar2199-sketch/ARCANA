import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const decalCreate: ToolDefinition = {
  id: "decal_create",
  name: "Create Decal",
  description: "Create a URP/HDRP decal projector in the scene",
  descriptionJa: "シーンにURP/HDRPデカールプロジェクターを作成",
  category: "decal",
  inputSchema: z.object({ name: z.string().optional(), materialPath: z.string(), x: z.number().default(0), y: z.number().default(0), z: z.number().default(0) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "DecalCreate", p);
      return r ? { success: true, message: `Decal created: ${p.name ?? "NewDecal"}`, data: r }
               : { success: false, message: "Failed to create decal" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "DecalSetSize", p);
      return r ? { success: true, message: `Decal size set on ${p.objectName}`, data: r }
               : { success: false, message: "Failed to set decal size" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "DecalSetMaterial", p);
      return r ? { success: true, message: `Material changed on ${p.objectName}`, data: r }
               : { success: false, message: "Failed to set decal material" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "DecalSetOpacity", p);
      return r ? { success: true, message: `Opacity set to ${p.opacity} on ${p.objectName}`, data: r }
               : { success: false, message: "Failed to set opacity" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "DecalRemove", p);
      return r ? { success: true, message: `Decal removed: ${p.objectName}`, data: r }
               : { success: false, message: "Failed to remove decal" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

export const decalTools: ToolDefinition[] = [
  decalCreate, decalSetSize, decalSetMaterial, decalSetOpacity, decalRemove
];