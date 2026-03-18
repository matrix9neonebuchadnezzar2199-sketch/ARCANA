import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { blenderBridge } from "../bridge/blender-bridge";

const blObjCreate: ToolDefinition = {
  id: "bl_object_create", name: "Create Object",
  description: "Create a mesh primitive in Blender",
  descriptionJa: "Blenderでメッシュプリミティブを作成",
  category: "bl_object",
  inputSchema: z.object({ type: z.enum(["Cube","Sphere","Cylinder","Plane","Cone","Torus","Monkey"]).default("Cube"), x: z.number().default(0), y: z.number().default(0), z: z.number().default(0) }),
  handler: async (p) => { const r = await blenderBridge.send("ObjectCreate", p); return r ? { success: true, message: `Created ${p.type}`, data: r } : { success: false, message: "Failed" }; }
};

const blObjDelete: ToolDefinition = {
  id: "bl_object_delete", name: "Delete Object",
  description: "Delete an object by name",
  descriptionJa: "名前でオブジェクトを削除",
  category: "bl_object",
  inputSchema: z.object({ name: z.string() }),
  handler: async (p) => { const r = await blenderBridge.send("ObjectDelete", p); return r ? { success: true, message: `Deleted ${p.name}`, data: r } : { success: false, message: "Failed" }; }
};

const blObjDuplicate: ToolDefinition = {
  id: "bl_object_duplicate", name: "Duplicate Object",
  description: "Duplicate an object",
  descriptionJa: "オブジェクトを複製",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), linked: z.boolean().default(false) }),
  handler: async (p) => { const r = await blenderBridge.send("ObjectDuplicate", p); return r ? { success: true, message: `Duplicated ${p.name}`, data: r } : { success: false, message: "Failed" }; }
};

const blObjJoin: ToolDefinition = {
  id: "bl_object_join", name: "Join Objects",
  description: "Join selected objects into one",
  descriptionJa: "選択オブジェクトを結合",
  category: "bl_object",
  inputSchema: z.object({ names: z.array(z.string()) }),
  handler: async (p) => { const r = await blenderBridge.send("ObjectJoin", p); return r ? { success: true, message: "Objects joined", data: r } : { success: false, message: "Failed" }; }
};

const blObjSeparate: ToolDefinition = {
  id: "bl_object_separate", name: "Separate Object",
  description: "Separate object by loose parts or material",
  descriptionJa: "ルーズパーツまたはマテリアルで分離",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), mode: z.enum(["LOOSE","MATERIAL"]).default("LOOSE") }),
  handler: async (p) => { const r = await blenderBridge.send("ObjectSeparate", p); return r ? { success: true, message: `Separated by ${p.mode}`, data: r } : { success: false, message: "Failed" }; }
};

const blObjRename: ToolDefinition = {
  id: "bl_object_rename", name: "Rename Object",
  description: "Rename an object",
  descriptionJa: "オブジェクト名を変更",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), newName: z.string() }),
  handler: async (p) => { const r = await blenderBridge.send("ObjectRename", p); return r ? { success: true, message: `Renamed to ${p.newName}`, data: r } : { success: false, message: "Failed" }; }
};

const blObjVisibility: ToolDefinition = {
  id: "bl_object_visibility", name: "Set Object Visibility",
  description: "Show or hide an object",
  descriptionJa: "オブジェクトの表示/非表示を切替",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), visible: z.boolean() }),
  handler: async (p) => { const r = await blenderBridge.send("ObjectVisibility", p); return r ? { success: true, message: `Visibility: ${p.visible}`, data: r } : { success: false, message: "Failed" }; }
};

const blObjSetOrigin: ToolDefinition = {
  id: "bl_object_set_origin", name: "Set Object Origin",
  description: "Set origin to geometry center, 3D cursor, etc.",
  descriptionJa: "原点をジオメトリ中心・3Dカーソル等に設定",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), type: z.enum(["GEOMETRY_ORIGIN","ORIGIN_GEOMETRY","ORIGIN_CURSOR","ORIGIN_CENTER_OF_MASS"]).default("ORIGIN_GEOMETRY") }),
  handler: async (p) => { const r = await blenderBridge.send("ObjectSetOrigin", p); return r ? { success: true, message: `Origin set: ${p.type}`, data: r } : { success: false, message: "Failed" }; }
};

const blObjSetParent: ToolDefinition = {
  id: "bl_object_set_parent", name: "Set Parent",
  description: "Set parent-child relationship",
  descriptionJa: "親子関係を設定",
  category: "bl_object",
  inputSchema: z.object({ child: z.string(), parent: z.string() }),
  handler: async (p) => { const r = await blenderBridge.send("ObjectSetParent", p); return r ? { success: true, message: `${p.child} parented to ${p.parent}`, data: r } : { success: false, message: "Failed" }; }
};

const blObjGetInfo: ToolDefinition = {
  id: "bl_object_get_info", name: "Get Object Info",
  description: "Get object details (location, rotation, scale, type)",
  descriptionJa: "オブジェクト情報を取得（位置・回転・スケール・タイプ）",
  category: "bl_object",
  inputSchema: z.object({ name: z.string() }),
  handler: async (p) => { const r = await blenderBridge.send("ObjectGetInfo", p); return r ? { success: true, message: "Info retrieved", data: r } : { success: false, message: "Failed" }; }
};

export const blObjectTools: ToolDefinition[] = [
  blObjCreate, blObjDelete, blObjDuplicate, blObjJoin, blObjSeparate,
  blObjRename, blObjVisibility, blObjSetOrigin, blObjSetParent, blObjGetInfo
];