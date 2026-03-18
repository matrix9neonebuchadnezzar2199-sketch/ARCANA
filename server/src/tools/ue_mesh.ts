import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unrealBridge } from "../bridge/unreal-bridge";

const ueMeshImport: ToolDefinition = {
  id: "ue_mesh_import", name: "Import Static Mesh",
  description: "Import a static mesh from FBX/OBJ file",
  descriptionJa: "FBX/OBJファイルからスタティックメッシュをインポート",
  category: "ue_mesh",
  inputSchema: z.object({ filePath: z.string(), destPath: z.string().default("/Game/Meshes") }),
  handler: async (p) => { const r = await unrealBridge.send("MeshImport", p); return r ? { success: true, message: "Mesh imported", data: r } : { success: false, message: "Failed" }; }
};

const ueMeshSetCollision: ToolDefinition = {
  id: "ue_mesh_set_collision", name: "Set Mesh Collision",
  description: "Set collision settings on a static mesh",
  descriptionJa: "スタティックメッシュのコリジョン設定を変更",
  category: "ue_mesh",
  inputSchema: z.object({ actorName: z.string(), collisionType: z.enum(["NoCollision","QueryOnly","PhysicsOnly","QueryAndPhysics"]).default("QueryAndPhysics"), complexAsSimple: z.boolean().default(false) }),
  handler: async (p) => { const r = await unrealBridge.send("MeshSetCollision", p); return r ? { success: true, message: `Collision set: ${p.collisionType}`, data: r } : { success: false, message: "Failed" }; }
};

const ueMeshSetLod: ToolDefinition = {
  id: "ue_mesh_set_lod", name: "Set Mesh LOD",
  description: "Configure LOD settings for a static mesh",
  descriptionJa: "スタティックメッシュのLOD設定を変更",
  category: "ue_mesh",
  inputSchema: z.object({ actorName: z.string(), lodCount: z.number().default(3), autoComputeLOD: z.boolean().default(true) }),
  handler: async (p) => { const r = await unrealBridge.send("MeshSetLod", p); return r ? { success: true, message: `LOD set: ${p.lodCount} levels`, data: r } : { success: false, message: "Failed" }; }
};

const ueMeshMerge: ToolDefinition = {
  id: "ue_mesh_merge", name: "Merge Meshes",
  description: "Merge multiple static mesh actors into one",
  descriptionJa: "複数のスタティックメッシュアクターを1つに結合",
  category: "ue_mesh",
  inputSchema: z.object({ actorNames: z.array(z.string()), newName: z.string().default("MergedMesh") }),
  handler: async (p) => { const r = await unrealBridge.send("MeshMerge", p); return r ? { success: true, message: `Merged ${p.actorNames.length} meshes`, data: r } : { success: false, message: "Failed" }; }
};

const ueMeshGetInfo: ToolDefinition = {
  id: "ue_mesh_get_info", name: "Get Mesh Info",
  description: "Get vertex count, triangle count, and bounds of a mesh",
  descriptionJa: "メッシュの頂点数・三角形数・バウンズを取得",
  category: "ue_mesh",
  inputSchema: z.object({ actorName: z.string() }),
  handler: async (p) => { const r = await unrealBridge.send("MeshGetInfo", p); return r ? { success: true, message: "Mesh info retrieved", data: r } : { success: false, message: "Failed" }; }
};

const ueMeshSetNanite: ToolDefinition = {
  id: "ue_mesh_set_nanite", name: "Enable Nanite",
  description: "Enable or disable Nanite on a static mesh (UE5)",
  descriptionJa: "スタティックメッシュのNaniteを有効/無効（UE5）",
  category: "ue_mesh",
  inputSchema: z.object({ actorName: z.string(), enabled: z.boolean().default(true) }),
  handler: async (p) => { const r = await unrealBridge.send("MeshSetNanite", p); return r ? { success: true, message: `Nanite ${p.enabled ? "enabled" : "disabled"}`, data: r } : { success: false, message: "Failed" }; }
};

export const ueMeshTools: ToolDefinition[] = [
  ueMeshImport, ueMeshSetCollision, ueMeshSetLod,
  ueMeshMerge, ueMeshGetInfo, ueMeshSetNanite
];