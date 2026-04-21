import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const blMeshEditVerts: ToolDefinition = { id: "bl_mesh_edit_vertices", name: "Edit Vertices", description: "Move vertices by index", descriptionJa: "インデックスで頂点を移動", category: "bl_mesh", inputSchema: z.object({ name: z.string(), indices: z.array(z.number()), offset: z.object({ x: z.number(), y: z.number(), z: z.number() }) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_mesh_edit_vertices", p, { successMessage: "Vertices edited" }) } };

const blMeshExtrude: ToolDefinition = { id: "bl_mesh_extrude_faces", name: "Extrude Faces", description: "Extrude selected faces", descriptionJa: "選択面を押し出し", category: "bl_mesh", inputSchema: z.object({ name: z.string(), amount: z.number().default(1) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_mesh_extrude_faces", p, { successMessage: "Faces extruded" }) } };

const blMeshLoopCut: ToolDefinition = { id: "bl_mesh_loop_cut", name: "Loop Cut", description: "Add loop cut to mesh", descriptionJa: "ループカットを追加", category: "bl_mesh", inputSchema: z.object({ name: z.string(), cuts: z.number().default(1), edgeIndex: z.number().default(0) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_mesh_loop_cut", p, { successMessage: (_, p) => `${p.cuts} loop cuts added` }) } };

const blMeshBevel: ToolDefinition = { id: "bl_mesh_bevel", name: "Bevel", description: "Bevel edges or vertices", descriptionJa: "辺または頂点をベベル", category: "bl_mesh", inputSchema: z.object({ name: z.string(), width: z.number().default(0.1), segments: z.number().default(1) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_mesh_bevel", p, { successMessage: "Bevel applied" }) } };

const blMeshMerge: ToolDefinition = { id: "bl_mesh_merge", name: "Merge Vertices", description: "Merge vertices by distance", descriptionJa: "距離で頂点をマージ", category: "bl_mesh", inputSchema: z.object({ name: z.string(), threshold: z.number().default(0.0001) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_mesh_merge", p, { successMessage: "Vertices merged" }) } };

const blMeshRecalcNormals: ToolDefinition = { id: "bl_mesh_recalc_normals", name: "Recalculate Normals", description: "Recalculate normals outside", descriptionJa: "法線を外側に再計算", category: "bl_mesh", inputSchema: z.object({ name: z.string() }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_mesh_recalc_normals", p, { successMessage: "Normals recalculated" }) } };

const blMeshSmooth: ToolDefinition = { id: "bl_mesh_smooth", name: "Smooth Shading", description: "Set smooth or flat shading", descriptionJa: "スムーズ/フラットシェーディングを設定", category: "bl_mesh", inputSchema: z.object({ name: z.string(), smooth: z.boolean().default(true) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_mesh_smooth", p, { successMessage: (_, p) => (p.smooth ? "Smooth shading" : "Flat shading") }) } };

const blMeshStats: ToolDefinition = { id: "bl_mesh_get_stats", name: "Get Mesh Stats", description: "Get vertex, edge, face counts", descriptionJa: "頂点・辺・面の数を取得", category: "bl_mesh", inputSchema: z.object({ name: z.string() }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_mesh_get_stats", p, { successMessage: "Stats retrieved" }) } };

const blMeshUVUnwrap: ToolDefinition = { id: "bl_mesh_uv_unwrap", name: "UV Unwrap", description: "Unwrap UVs with smart project or standard", descriptionJa: "スマートUV投影または標準でUV展開", category: "bl_mesh", inputSchema: z.object({ name: z.string(), method: z.enum(["SMART","STANDARD"]).default("SMART") }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_mesh_uv_unwrap", p, { successMessage: (_, p) => `UV unwrapped (${p.method})` }) } };

const blMeshExport: ToolDefinition = { id: "bl_mesh_export", name: "Export Mesh", description: "Export mesh to OBJ/FBX/GLB", descriptionJa: "メッシュをOBJ/FBX/GLBにエクスポート", category: "bl_mesh", inputSchema: z.object({ name: z.string(), format: z.enum(["OBJ","FBX","GLB"]).default("FBX"), path: z.string() }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_mesh_export", p, { successMessage: (_, p) => `Exported as ${p.format}` }) } };

export const blMeshTools: ToolDefinition[] = [ blMeshEditVerts, blMeshExtrude, blMeshLoopCut, blMeshBevel, blMeshMerge, blMeshRecalcNormals, blMeshSmooth, blMeshStats, blMeshUVUnwrap, blMeshExport ];