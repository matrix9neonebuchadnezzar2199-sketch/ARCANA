import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const blSceneList: ToolDefinition = { id: "bl_scene_list", name: "List Scenes", description: "List all scenes in the file", descriptionJa: "ファイル内の全シーンを一覧", category: "bl_scene", inputSchema: z.object({}), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_scene_list", p, { successMessage: "Scenes listed" }) } };

const blSceneCreate: ToolDefinition = { id: "bl_scene_create", name: "Create Scene", description: "Create a new scene", descriptionJa: "新しいシーンを作成", category: "bl_scene", inputSchema: z.object({ name: z.string().default("Scene") }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_scene_create", p, { successMessage: (_, p) => `Scene created: ${p.name}` }) } };

const blSceneDelete: ToolDefinition = { id: "bl_scene_delete", name: "Delete Scene", description: "Delete a scene by name", descriptionJa: "名前でシーンを削除", category: "bl_scene", inputSchema: z.object({ name: z.string() }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_scene_delete", p, { successMessage: (_, p) => `Scene deleted: ${p.name}` }) } };

const blSceneSetWorld: ToolDefinition = { id: "bl_scene_set_world", name: "Set World", description: "Set world background (HDRI or color)", descriptionJa: "ワールド背景を設定（HDRIまたは色）", category: "bl_scene", inputSchema: z.object({ hdriPath: z.string().optional(), r: z.number().default(0.05), g: z.number().default(0.05), b: z.number().default(0.05), strength: z.number().default(1) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_scene_set_world", p, { successMessage: "World set" }) } };

const blSceneSetUnits: ToolDefinition = { id: "bl_scene_set_units", name: "Set Units", description: "Set scene unit system and scale", descriptionJa: "シーンの単位系とスケールを設定", category: "bl_scene", inputSchema: z.object({ system: z.enum(["METRIC","IMPERIAL","NONE"]).default("METRIC"), scale: z.number().default(1) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_scene_set_units", p, { successMessage: (_, p) => `Units: ${p.system}` }) } };

const blSceneSetFrameRange: ToolDefinition = { id: "bl_scene_set_frame_range", name: "Set Frame Range", description: "Set start and end frame", descriptionJa: "開始・終了フレームを設定", category: "bl_scene", inputSchema: z.object({ start: z.number().default(1), end: z.number().default(250) }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_scene_set_frame_range", p, { successMessage: (_, p) => `Frames: ${p.start}-${p.end}` }) } };

const blSceneCreateCollection: ToolDefinition = { id: "bl_scene_create_collection", name: "Create Collection", description: "Create a new collection", descriptionJa: "新しいコレクションを作成", category: "bl_scene", inputSchema: z.object({ name: z.string() }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_scene_create_collection", p, { successMessage: (_, p) => `Collection: ${p.name}` }) } };

const blSceneMoveToCollection: ToolDefinition = { id: "bl_scene_move_to_collection", name: "Move to Collection", description: "Move object to a collection", descriptionJa: "オブジェクトをコレクションに移動", category: "bl_scene", inputSchema: z.object({ objectName: z.string(), collectionName: z.string() }), handler: async (p) => { return bridgeSendAsToolResult("blender", "bl_scene_move_to_collection", p, { successMessage: (_, p) => `${p.objectName} moved to ${p.collectionName}` }) } };

export const blSceneTools: ToolDefinition[] = [ blSceneList, blSceneCreate, blSceneDelete, blSceneSetWorld, blSceneSetUnits, blSceneSetFrameRange, blSceneCreateCollection, blSceneMoveToCollection ];