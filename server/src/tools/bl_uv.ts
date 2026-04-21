import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const blUVUnwrap: ToolDefinition = { id: "bl_uv_unwrap", name: "UV Unwrap", description: "Unwrap UVs using standard method", descriptionJa: "標準方式でUV展開", category: "bl_uv", inputSchema: z.object({ name: z.string(), method: z.enum(["ANGLE_BASED","CONFORMAL"]).default("ANGLE_BASED") }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_uv_unwrap", p, { successMessage: (_, p) => `Unwrapped (${p.method})` }) } };

const blUVProject: ToolDefinition = { id: "bl_uv_smart_project", name: "Smart UV Project", description: "Smart UV projection with angle limit", descriptionJa: "角度制限付きスマートUV投影", category: "bl_uv", inputSchema: z.object({ name: z.string(), angleLimit: z.number().default(66), islandMargin: z.number().default(0.02) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_uv_smart_project", p, { successMessage: "Smart UV projected" }) } };

const blUVMarkSeam: ToolDefinition = { id: "bl_uv_mark_seam", name: "Mark Seam", description: "Mark edges as UV seams", descriptionJa: "辺をUVシームとしてマーク", category: "bl_uv", inputSchema: z.object({ name: z.string(), edgeIndices: z.array(z.number()) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_uv_mark_seam", p, { successMessage: "Seams marked" }) } };

const blUVClearSeam: ToolDefinition = { id: "bl_uv_clear_seam", name: "Clear Seam", description: "Clear UV seams from edges", descriptionJa: "辺のUVシームをクリア", category: "bl_uv", inputSchema: z.object({ name: z.string() }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_uv_clear_seam", p, { successMessage: "Seams cleared" }) } };

const blUVPack: ToolDefinition = { id: "bl_uv_pack_islands", name: "Pack UV Islands", description: "Pack UV islands to fit in 0-1 space", descriptionJa: "UVアイランドを0-1空間にパック", category: "bl_uv", inputSchema: z.object({ name: z.string(), margin: z.number().default(0.01) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_uv_pack_islands", p, { successMessage: "Islands packed" }) } };

const blUVAverage: ToolDefinition = { id: "bl_uv_average_scale", name: "Average Island Scale", description: "Equalize UV island sizes", descriptionJa: "UVアイランドのスケールを均等化", category: "bl_uv", inputSchema: z.object({ name: z.string() }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_uv_average_scale", p, { successMessage: "Scales averaged" }) } };

const blUVRotate: ToolDefinition = { id: "bl_uv_rotate", name: "Rotate UVs", description: "Rotate UV coordinates by degrees", descriptionJa: "UV座標を度単位で回転", category: "bl_uv", inputSchema: z.object({ name: z.string(), angle: z.number().default(90) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_uv_rotate", p, { successMessage: (_, p) => `UVs rotated ${p.angle} deg` }) } };

const blUVScale: ToolDefinition = { id: "bl_uv_scale", name: "Scale UVs", description: "Scale UV coordinates", descriptionJa: "UV座標をスケール", category: "bl_uv", inputSchema: z.object({ name: z.string(), scaleX: z.number().default(1), scaleY: z.number().default(1) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_uv_scale", p, { successMessage: (_, p) => `UVs scaled (${p.scaleX}, ${p.scaleY})` }) } };

export const blUVTools: ToolDefinition[] = [ blUVUnwrap, blUVProject, blUVMarkSeam, blUVClearSeam, blUVPack, blUVAverage, blUVRotate, blUVScale ];