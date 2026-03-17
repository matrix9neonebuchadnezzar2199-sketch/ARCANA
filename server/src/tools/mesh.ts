import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const meshCombine: ToolDefinition = {
  id: "mesh_combine",
  name: "Combine Meshes",
  description: "Combine meshes of child objects into one",
  descriptionJa: "子オブジェクトのメッシュを1つに結合する",
  category: "mesh",
  inputSchema: z.object({ name: z.string().describe("Parent GameObject name") }),
  handler: async (params) => {
    try { const r = await unityBridge.send("MeshCombine", params); return { success: true, message: `Meshes combined on ${params.name}`, data: r }; }
    catch (e: any) { return { success: false, message: e.message }; }
  }
};

const meshFlip: ToolDefinition = {
  id: "mesh_flip",
  name: "Flip Normals",
  description: "Flip all normals of a mesh",
  descriptionJa: "メッシュの法線を全て反転する",
  category: "mesh",
  inputSchema: z.object({ name: z.string().describe("GameObject name") }),
  handler: async (params) => {
    try { const r = await unityBridge.send("MeshFlip", params); return { success: true, message: `Normals flipped on ${params.name}`, data: r }; }
    catch (e: any) { return { success: false, message: e.message }; }
  }
};

const meshRecalcNormals: ToolDefinition = {
  id: "mesh_recalc_normals",
  name: "Recalculate Normals",
  description: "Recalculate normals of a mesh",
  descriptionJa: "メッシュの法線を再計算する",
  category: "mesh",
  inputSchema: z.object({ name: z.string().describe("GameObject name") }),
  handler: async (params) => {
    try { const r = await unityBridge.send("MeshRecalcNormals", params); return { success: true, message: `Normals recalculated on ${params.name}`, data: r }; }
    catch (e: any) { return { success: false, message: e.message }; }
  }
};

const meshSetVertexColor: ToolDefinition = {
  id: "mesh_set_vertex_color",
  name: "Set Vertex Color",
  description: "Set vertex color for entire mesh",
  descriptionJa: "メッシュ全体の頂点カラーを設定する",
  category: "mesh",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), color: z.string().optional().default("#FFFFFF").describe("Hex color") }),
  handler: async (params) => {
    try { const r = await unityBridge.send("MeshSetVertexColor", params); return { success: true, message: `Vertex color set on ${params.name}`, data: r }; }
    catch (e: any) { return { success: false, message: e.message }; }
  }
};

const meshGetInfo: ToolDefinition = {
  id: "mesh_get_info",
  name: "Get Mesh Info",
  description: "Get vertex count, triangle count, bounds of a mesh",
  descriptionJa: "メッシュの頂点数・三角形数・境界を取得する",
  category: "mesh",
  inputSchema: z.object({ name: z.string().describe("GameObject name") }),
  handler: async (params) => {
    try { const r = await unityBridge.send("MeshGetInfo", params); return { success: true, message: `Mesh info for ${params.name}`, data: r }; }
    catch (e: any) { return { success: false, message: e.message }; }
  }
};

const meshReplacePrimitive: ToolDefinition = {
  id: "mesh_replace_primitive",
  name: "Replace Mesh Primitive",
  description: "Replace mesh with a built-in primitive shape",
  descriptionJa: "メッシュをビルトインプリミティブに差し替える",
  category: "mesh",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), primitive: z.enum(["Cube", "Sphere", "Cylinder", "Capsule", "Plane", "Quad"]).describe("Primitive type") }),
  handler: async (params) => {
    try { const r = await unityBridge.send("MeshReplacePrimitive", params); return { success: true, message: `Mesh replaced with ${params.primitive} on ${params.name}`, data: r }; }
    catch (e: any) { return { success: false, message: e.message }; }
  }
};

export const meshTools: ToolDefinition[] = [meshCombine, meshFlip, meshRecalcNormals, meshSetVertexColor, meshGetInfo, meshReplacePrimitive];