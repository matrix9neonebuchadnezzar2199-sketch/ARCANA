import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const blObjCreate: ToolDefinition = {
  id: "bl_object_create", name: "Create Object",
  description: "Create a mesh primitive in Blender",
  descriptionJa: "Blenderでメッシュプリミティブを作成",
  category: "bl_object",
  inputSchema: z.object({ type: z.enum(["Cube","Sphere","Cylinder","Plane","Cone","Torus","Monkey"]).default("Cube"), x: z.number().default(0), y: z.number().default(0), z: z.number().default(0) }),
  handler: async (p) => { try { const r = await bridge.send("blender", "bl_object_create", p); return r ? { success: true, message: `Created ${p.type}`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const blObjDelete: ToolDefinition = {
  id: "bl_object_delete", name: "Delete Object",
  description: "Delete an object by name",
  descriptionJa: "名前でオブジェクトを削除",
  category: "bl_object",
  inputSchema: z.object({ name: z.string() }),
  handler: async (p) => { try { const r = await bridge.send("blender", "bl_object_delete", p); return r ? { success: true, message: `Deleted ${p.name}`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const blObjDuplicate: ToolDefinition = {
  id: "bl_object_duplicate", name: "Duplicate Object",
  description: "Duplicate an object",
  descriptionJa: "オブジェクトを複製",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), linked: z.boolean().default(false) }),
  handler: async (p) => { try { const r = await bridge.send("blender", "bl_object_duplicate", p); return r ? { success: true, message: `Duplicated ${p.name}`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const blObjJoin: ToolDefinition = {
  id: "bl_object_join", name: "Join Objects",
  description: "Join selected objects into one",
  descriptionJa: "選択オブジェクトを結合",
  category: "bl_object",
  inputSchema: z.object({ names: z.array(z.string()) }),
  handler: async (p) => { try { const r = await bridge.send("blender", "bl_object_join", p); return r ? { success: true, message: "Objects joined", data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const blObjSeparate: ToolDefinition = {
  id: "bl_object_separate", name: "Separate Object",
  description: "Separate object by loose parts or material",
  descriptionJa: "ルーズパーツまたはマテリアルで分離",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), mode: z.enum(["LOOSE","MATERIAL"]).default("LOOSE") }),
  handler: async (p) => { try { const r = await bridge.send("blender", "bl_object_separate", p); return r ? { success: true, message: `Separated by ${p.mode}`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const blObjRename: ToolDefinition = {
  id: "bl_object_rename", name: "Rename Object",
  description: "Rename an object",
  descriptionJa: "オブジェクト名を変更",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), newName: z.string() }),
  handler: async (p) => { try { const r = await bridge.send("blender", "bl_object_rename", p); return r ? { success: true, message: `Renamed to ${p.newName}`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const blObjVisibility: ToolDefinition = {
  id: "bl_object_visibility", name: "Set Object Visibility",
  description: "Show or hide an object",
  descriptionJa: "オブジェクトの表示/非表示を切替",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), visible: z.boolean() }),
  handler: async (p) => { try { const r = await bridge.send("blender", "bl_object_visibility", p); return r ? { success: true, message: `Visibility: ${p.visible}`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const blObjSetOrigin: ToolDefinition = {
  id: "bl_object_set_origin", name: "Set Object Origin",
  description: "Set origin to geometry center, 3D cursor, etc.",
  descriptionJa: "原点をジオメトリ中心・3Dカーソル等に設定",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), type: z.enum(["GEOMETRY_ORIGIN","ORIGIN_GEOMETRY","ORIGIN_CURSOR","ORIGIN_CENTER_OF_MASS"]).default("ORIGIN_GEOMETRY") }),
  handler: async (p) => { try { const r = await bridge.send("blender", "bl_object_set_origin", p); return r ? { success: true, message: `Origin set: ${p.type}`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const blObjSetParent: ToolDefinition = {
  id: "bl_object_set_parent", name: "Set Parent",
  description: "Set parent-child relationship",
  descriptionJa: "親子関係を設定",
  category: "bl_object",
  inputSchema: z.object({ child: z.string(), parent: z.string() }),
  handler: async (p) => { try { const r = await bridge.send("blender", "bl_object_set_parent", p); return r ? { success: true, message: `${p.child} parented to ${p.parent}`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const blObjGetInfo: ToolDefinition = {
  id: "bl_object_get_info", name: "Get Object Info",
  description: "Get object details (location, rotation, scale, type)",
  descriptionJa: "オブジェクト情報を取得（位置・回転・スケール・タイプ）",
  category: "bl_object",
  inputSchema: z.object({ name: z.string() }),
  handler: async (p) => { try { const r = await bridge.send("blender", "bl_object_get_info", p); return r ? { success: true, message: "Info retrieved", data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

export const blObjectTools: ToolDefinition[] = [
  blObjCreate, blObjDelete, blObjDuplicate, blObjJoin, blObjSeparate,
  blObjRename, blObjVisibility, blObjSetOrigin, blObjSetParent, blObjGetInfo
];