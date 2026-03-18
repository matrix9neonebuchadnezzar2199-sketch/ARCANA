import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const ueLandscapeCreate: ToolDefinition = {
  id: "ue_landscape_create", name: "Create Landscape",
  description: "Create a new landscape actor with custom size",
  descriptionJa: "カスタムサイズの新しいランドスケープアクターを作成",
  category: "ue_landscape",
  inputSchema: z.object({ sizeX: z.number().default(505), sizeY: z.number().default(505), sections: z.number().default(1), quadsPerSection: z.number().default(63) }),
  handler: async (p) => { const r = await bridge.send("unreal", "LandscapeCreate", p); return r ? { success: true, message: "Landscape created", data: r } : { success: false, message: "Failed" }; }
};

const ueLandscapeSculpt: ToolDefinition = {
  id: "ue_landscape_sculpt", name: "Sculpt Landscape",
  description: "Sculpt landscape height at a position",
  descriptionJa: "指定位置のランドスケープ高さをスカルプト",
  category: "ue_landscape",
  inputSchema: z.object({ x: z.number(), y: z.number(), radius: z.number().default(500), strength: z.number().default(0.5), mode: z.enum(["Raise","Lower","Flatten","Smooth"]).default("Raise") }),
  handler: async (p) => { const r = await bridge.send("unreal", "LandscapeSculpt", p); return r ? { success: true, message: `Sculpt: ${p.mode}`, data: r } : { success: false, message: "Failed" }; }
};

const ueLandscapePaint: ToolDefinition = {
  id: "ue_landscape_paint", name: "Paint Landscape Layer",
  description: "Paint a material layer on the landscape",
  descriptionJa: "ランドスケープにマテリアルレイヤーをペイント",
  category: "ue_landscape",
  inputSchema: z.object({ layerName: z.string(), x: z.number(), y: z.number(), radius: z.number().default(500), strength: z.number().default(1) }),
  handler: async (p) => { const r = await bridge.send("unreal", "LandscapePaint", p); return r ? { success: true, message: `Painted layer: ${p.layerName}`, data: r } : { success: false, message: "Failed" }; }
};

const ueLandscapeAddLayer: ToolDefinition = {
  id: "ue_landscape_add_layer", name: "Add Landscape Layer",
  description: "Add a new paint layer to the landscape material",
  descriptionJa: "ランドスケープマテリアルに新しいペイントレイヤーを追加",
  category: "ue_landscape",
  inputSchema: z.object({ layerName: z.string(), materialPath: z.string().optional() }),
  handler: async (p) => { const r = await bridge.send("unreal", "LandscapeAddLayer", p); return r ? { success: true, message: `Layer added: ${p.layerName}`, data: r } : { success: false, message: "Failed" }; }
};

const ueLandscapeImportHeightmap: ToolDefinition = {
  id: "ue_landscape_import_heightmap", name: "Import Heightmap",
  description: "Import a heightmap from a PNG/RAW file",
  descriptionJa: "PNG/RAWファイルからハイトマップをインポート",
  category: "ue_landscape",
  inputSchema: z.object({ filePath: z.string() }),
  handler: async (p) => { const r = await bridge.send("unreal", "LandscapeImportHeightmap", p); return r ? { success: true, message: "Heightmap imported", data: r } : { success: false, message: "Failed" }; }
};

const ueLandscapeExportHeightmap: ToolDefinition = {
  id: "ue_landscape_export_heightmap", name: "Export Heightmap",
  description: "Export the landscape heightmap to a file",
  descriptionJa: "ランドスケープのハイトマップをファイルにエクスポート",
  category: "ue_landscape",
  inputSchema: z.object({ filePath: z.string(), format: z.enum(["PNG","RAW"]).default("PNG") }),
  handler: async (p) => { const r = await bridge.send("unreal", "LandscapeExportHeightmap", p); return r ? { success: true, message: `Heightmap exported: ${p.format}`, data: r } : { success: false, message: "Failed" }; }
};

const ueLandscapeSetMaterial: ToolDefinition = {
  id: "ue_landscape_set_material", name: "Set Landscape Material",
  description: "Assign a landscape material to the landscape actor",
  descriptionJa: "ランドスケープアクターにランドスケープマテリアルを割り当て",
  category: "ue_landscape",
  inputSchema: z.object({ materialPath: z.string() }),
  handler: async (p) => { const r = await bridge.send("unreal", "LandscapeSetMaterial", p); return r ? { success: true, message: "Landscape material set", data: r } : { success: false, message: "Failed" }; }
};

const ueLandscapeGetInfo: ToolDefinition = {
  id: "ue_landscape_get_info", name: "Get Landscape Info",
  description: "Get landscape size, resolution, and layer information",
  descriptionJa: "ランドスケープのサイズ・解像度・レイヤー情報を取得",
  category: "ue_landscape",
  inputSchema: z.object({}),
  handler: async (p) => { const r = await bridge.send("unreal", "LandscapeGetInfo", p); return r ? { success: true, message: "Landscape info retrieved", data: r } : { success: false, message: "Failed" }; }
};

export const ueLandscapeTools: ToolDefinition[] = [
  ueLandscapeCreate, ueLandscapeSculpt, ueLandscapePaint, ueLandscapeAddLayer,
  ueLandscapeImportHeightmap, ueLandscapeExportHeightmap, ueLandscapeSetMaterial, ueLandscapeGetInfo
];