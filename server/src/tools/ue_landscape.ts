import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const ueLandscapeCreate: ToolDefinition = {
  id: "ue_landscape_create", name: "Create Landscape",
  description: "Create a new landscape actor with custom size",
  descriptionJa: "カスタムサイズの新しいランドスケープアクターを作成",
  category: "ue_landscape",
  inputSchema: z.object({ sizeX: z.number().default(505), sizeY: z.number().default(505), sections: z.number().default(1), quadsPerSection: z.number().default(63) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LandscapeCreate", p, { successMessage: "Landscape created" }) }
};

const ueLandscapeSculpt: ToolDefinition = {
  id: "ue_landscape_sculpt", name: "Sculpt Landscape",
  description: "Sculpt landscape height at a position",
  descriptionJa: "指定位置のランドスケープ高さをスカルプト",
  category: "ue_landscape",
  inputSchema: z.object({ x: z.number(), y: z.number(), radius: z.number().default(500), strength: z.number().default(0.5), mode: z.enum(["Raise","Lower","Flatten","Smooth"]).default("Raise") }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LandscapeSculpt", p, { successMessage: (_, p) => `Sculpt: ${p.mode}` }) }
};

const ueLandscapePaint: ToolDefinition = {
  id: "ue_landscape_paint", name: "Paint Landscape Layer",
  description: "Paint a material layer on the landscape",
  descriptionJa: "ランドスケープにマテリアルレイヤーをペイント",
  category: "ue_landscape",
  inputSchema: z.object({ layerName: z.string(), x: z.number(), y: z.number(), radius: z.number().default(500), strength: z.number().default(1) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LandscapePaint", p, { successMessage: (_, p) => `Painted layer: ${p.layerName}` }) }
};

const ueLandscapeAddLayer: ToolDefinition = {
  id: "ue_landscape_add_layer", name: "Add Landscape Layer",
  description: "Add a new paint layer to the landscape material",
  descriptionJa: "ランドスケープマテリアルに新しいペイントレイヤーを追加",
  category: "ue_landscape",
  inputSchema: z.object({ layerName: z.string(), materialPath: z.string().optional() }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LandscapeAddLayer", p, { successMessage: (_, p) => `Layer added: ${p.layerName}` }) }
};

const ueLandscapeImportHeightmap: ToolDefinition = {
  id: "ue_landscape_import_heightmap", name: "Import Heightmap",
  description: "Import a heightmap from a PNG/RAW file",
  descriptionJa: "PNG/RAWファイルからハイトマップをインポート",
  category: "ue_landscape",
  inputSchema: z.object({ filePath: z.string() }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LandscapeImportHeightmap", p, { successMessage: "Heightmap imported" }) }
};

const ueLandscapeExportHeightmap: ToolDefinition = {
  id: "ue_landscape_export_heightmap", name: "Export Heightmap",
  description: "Export the landscape heightmap to a file",
  descriptionJa: "ランドスケープのハイトマップをファイルにエクスポート",
  category: "ue_landscape",
  inputSchema: z.object({ filePath: z.string(), format: z.enum(["PNG","RAW"]).default("PNG") }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LandscapeExportHeightmap", p, { successMessage: (_, p) => `Heightmap exported: ${p.format}` }) }
};

const ueLandscapeSetMaterial: ToolDefinition = {
  id: "ue_landscape_set_material", name: "Set Landscape Material",
  description: "Assign a landscape material to the landscape actor",
  descriptionJa: "ランドスケープアクターにランドスケープマテリアルを割り当て",
  category: "ue_landscape",
  inputSchema: z.object({ materialPath: z.string() }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LandscapeSetMaterial", p, { successMessage: "Landscape material set" }) }
};

const ueLandscapeGetInfo: ToolDefinition = {
  id: "ue_landscape_get_info", name: "Get Landscape Info",
  description: "Get landscape size, resolution, and layer information",
  descriptionJa: "ランドスケープのサイズ・解像度・レイヤー情報を取得",
  category: "ue_landscape",
  inputSchema: z.object({}),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "LandscapeGetInfo", p, { successMessage: "Landscape info retrieved" }) }
};

export const ueLandscapeTools: ToolDefinition[] = [
  ueLandscapeCreate, ueLandscapeSculpt, ueLandscapePaint, ueLandscapeAddLayer,
  ueLandscapeImportHeightmap, ueLandscapeExportHeightmap, ueLandscapeSetMaterial, ueLandscapeGetInfo
];