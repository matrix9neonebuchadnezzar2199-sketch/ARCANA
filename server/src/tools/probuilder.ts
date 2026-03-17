import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const pbCreateShape: ToolDefinition = {
  id: "pb_create_shape",
  name: "Create ProBuilder Shape",
  description: "Create a ProBuilder editable mesh shape",
  descriptionJa: "ProBuilder編集可能メッシュを作成する",
  category: "probuilder",
  inputSchema: z.object({ shape: z.enum(["Cube", "Cylinder", "Sphere", "Plane", "Stairs", "Arch", "Pipe", "Cone", "Torus"]).describe("Shape type"), name: z.string().optional().default("PBShape").describe("Object name"), x: z.number().optional().default(0), y: z.number().optional().default(0), z: z.number().optional().default(0) }),
  handler: async (params) => { try { const r = await unityBridge.send("PbCreateShape", params); return { success: true, message: `ProBuilder ${params.shape} created`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const pbExtrude: ToolDefinition = {
  id: "pb_extrude",
  name: "Extrude Faces",
  description: "Extrude selected faces of a ProBuilder mesh",
  descriptionJa: "ProBuilderメッシュの選択面を押し出す",
  category: "probuilder",
  inputSchema: z.object({ name: z.string().describe("ProBuilder object name"), distance: z.number().optional().default(1).describe("Extrude distance") }),
  handler: async (params) => { try { const r = await unityBridge.send("PbExtrude", params); return { success: true, message: `Faces extruded by ${params.distance}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const pbBoolean: ToolDefinition = {
  id: "pb_boolean",
  name: "Boolean Operation",
  description: "Perform CSG boolean operation between two ProBuilder meshes",
  descriptionJa: "2つのProBuilderメッシュ間でブーリアン演算を行う",
  category: "probuilder",
  inputSchema: z.object({ nameA: z.string().describe("First mesh name"), nameB: z.string().describe("Second mesh name"), operation: z.enum(["Union", "Subtract", "Intersect"]).describe("Boolean operation type") }),
  handler: async (params) => { try { const r = await unityBridge.send("PbBoolean", params); return { success: true, message: `Boolean ${params.operation} completed`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const pbMoveVertex: ToolDefinition = {
  id: "pb_move_vertex",
  name: "Move Vertices",
  description: "Move vertices of a ProBuilder mesh by offset",
  descriptionJa: "ProBuilderメッシュの頂点をオフセット移動する",
  category: "probuilder",
  inputSchema: z.object({ name: z.string().describe("ProBuilder object name"), vertexIndices: z.string().describe("Comma-separated vertex indices"), offsetX: z.number().optional().default(0), offsetY: z.number().optional().default(0), offsetZ: z.number().optional().default(0) }),
  handler: async (params) => { try { const r = await unityBridge.send("PbMoveVertex", params); return { success: true, message: `Vertices moved on ${params.name}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const pbSetUV: ToolDefinition = {
  id: "pb_set_uv",
  name: "Set UV Mapping",
  description: "Auto-unwrap or set UV projection for a ProBuilder mesh",
  descriptionJa: "ProBuilderメッシュのUVマッピングを設定する",
  category: "probuilder",
  inputSchema: z.object({ name: z.string().describe("ProBuilder object name"), mode: z.enum(["Auto", "Box", "Planar"]).optional().default("Auto").describe("UV projection mode") }),
  handler: async (params) => { try { const r = await unityBridge.send("PbSetUV", params); return { success: true, message: `UV set to ${params.mode} on ${params.name}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const pbProBuilderize: ToolDefinition = {
  id: "pb_probuilderize",
  name: "ProBuilderize Mesh",
  description: "Convert a regular mesh to a ProBuilder editable mesh",
  descriptionJa: "通常メッシュをProBuilder編集可能メッシュに変換する",
  category: "probuilder",
  inputSchema: z.object({ name: z.string().describe("GameObject name to convert") }),
  handler: async (params) => { try { const r = await unityBridge.send("PbProBuilderize", params); return { success: true, message: `${params.name} converted to ProBuilder mesh`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

export const probuilderTools: ToolDefinition[] = [pbCreateShape, pbExtrude, pbBoolean, pbMoveVertex, pbSetUV, pbProBuilderize];