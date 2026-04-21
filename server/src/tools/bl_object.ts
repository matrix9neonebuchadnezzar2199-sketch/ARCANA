import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const blObjCreate: ToolDefinition = {
  id: "bl_object_create", name: "Create Object",
  description: "Create a mesh primitive in Blender",
  descriptionJa: "Blenderでメッシュプリミティブを作成",
  category: "bl_object",
  inputSchema: z.object({ type: z.enum(["Cube","Sphere","Cylinder","Plane","Cone","Torus","Monkey"]).default("Cube"), x: z.number().default(0), y: z.number().default(0), z: z.number().default(0) }),
  handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_object_create", p, { successMessage: (_, p) => `Created ${p.type}` }) }
};

const blObjDelete: ToolDefinition = {
  id: "bl_object_delete", name: "Delete Object",
  description: "Delete an object by name",
  descriptionJa: "名前でオブジェクトを削除",
  category: "bl_object",
  inputSchema: z.object({ name: z.string() }),
  handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_object_delete", p, { successMessage: (_, p) => `Deleted ${p.name}` }) }
};

const blObjDuplicate: ToolDefinition = {
  id: "bl_object_duplicate", name: "Duplicate Object",
  description: "Duplicate an object",
  descriptionJa: "オブジェクトを複製",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), linked: z.boolean().default(false) }),
  handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_object_duplicate", p, { successMessage: (_, p) => `Duplicated ${p.name}` }) }
};

const blObjJoin: ToolDefinition = {
  id: "bl_object_join", name: "Join Objects",
  description: "Join selected objects into one",
  descriptionJa: "選択オブジェクトを結合",
  category: "bl_object",
  inputSchema: z.object({ names: z.array(z.string()) }),
  handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_object_join", p, { successMessage: "Objects joined" }) }
};

const blObjSeparate: ToolDefinition = {
  id: "bl_object_separate", name: "Separate Object",
  description: "Separate object by loose parts or material",
  descriptionJa: "ルーズパーツまたはマテリアルで分離",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), mode: z.enum(["LOOSE","MATERIAL"]).default("LOOSE") }),
  handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_object_separate", p, { successMessage: (_, p) => `Separated by ${p.mode}` }) }
};

const blObjRename: ToolDefinition = {
  id: "bl_object_rename", name: "Rename Object",
  description: "Rename an object",
  descriptionJa: "オブジェクト名を変更",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), newName: z.string() }),
  handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_object_rename", p, { successMessage: (_, p) => `Renamed to ${p.newName}` }) }
};

const blObjVisibility: ToolDefinition = {
  id: "bl_object_visibility", name: "Set Object Visibility",
  description: "Show or hide an object",
  descriptionJa: "オブジェクトの表示/非表示を切替",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), visible: z.boolean() }),
  handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_object_visibility", p, { successMessage: (_, p) => `Visibility: ${p.visible}` }) }
};

const blObjSetOrigin: ToolDefinition = {
  id: "bl_object_set_origin", name: "Set Object Origin",
  description: "Set origin to geometry center, 3D cursor, etc.",
  descriptionJa: "原点をジオメトリ中心・3Dカーソル等に設定",
  category: "bl_object",
  inputSchema: z.object({ name: z.string(), type: z.enum(["GEOMETRY_ORIGIN","ORIGIN_GEOMETRY","ORIGIN_CURSOR","ORIGIN_CENTER_OF_MASS"]).default("ORIGIN_GEOMETRY") }),
  handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_object_set_origin", p, { successMessage: (_, p) => `Origin set: ${p.type}` }) }
};

const blObjSetParent: ToolDefinition = {
  id: "bl_object_set_parent", name: "Set Parent",
  description: "Set parent-child relationship",
  descriptionJa: "親子関係を設定",
  category: "bl_object",
  inputSchema: z.object({ child: z.string(), parent: z.string() }),
  handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_object_set_parent", p, { successMessage: (_, p) => `${p.child} parented to ${p.parent}` }) }
};

const blObjGetInfo: ToolDefinition = {
  id: "bl_object_get_info", name: "Get Object Info",
  description: "Get object details (location, rotation, scale, type)",
  descriptionJa: "オブジェクト情報を取得（位置・回転・スケール・タイプ）",
  category: "bl_object",
  inputSchema: z.object({ name: z.string() }),
  handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_object_get_info", p, { successMessage: "Info retrieved" }) }
};

export const blObjectTools: ToolDefinition[] = [
  blObjCreate, blObjDelete, blObjDuplicate, blObjJoin, blObjSeparate,
  blObjRename, blObjVisibility, blObjSetOrigin, blObjSetParent, blObjGetInfo
];