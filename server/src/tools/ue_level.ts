import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const ueLevelCreate: ToolDefinition = { id: "ue_level_create", name: "Create Level", description: "Create a new empty level", descriptionJa: "新しい空のレベルを作成", category: "ue_level", inputSchema: z.object({ name: z.string(), path: z.string().default("/Game/Maps"), template: z.enum(["Empty","Default","TimeOfDay","VR"]).default("Default") }), handler: async (p) => { return bridgeSendAsToolResult("unreal", "LevelCreate", p, { successMessage: (_, p) => `Level created: ${p.name}` }) } };

const ueLevelOpen: ToolDefinition = { id: "ue_level_open", name: "Open Level", description: "Open an existing level in the editor", descriptionJa: "既存のレベルをエディタで開く", category: "ue_level", inputSchema: z.object({ levelPath: z.string() }), handler: async (p) => { return bridgeSendAsToolResult("unreal", "LevelOpen", p, { successMessage: (_, p) => `Level opened: ${p.levelPath}` }) } };

const ueLevelSave: ToolDefinition = { id: "ue_level_save", name: "Save Level", description: "Save the current level", descriptionJa: "現在のレベルを保存", category: "ue_level", inputSchema: z.object({}), handler: async (p) => { return bridgeSendAsToolResult("unreal", "LevelSave", p, { successMessage: "Level saved" }) } };

const ueLevelAddSublevel: ToolDefinition = { id: "ue_level_add_sublevel", name: "Add Streaming Sublevel", description: "Add a streaming sublevel to the persistent level", descriptionJa: "パーシスタントレベルにストリーミングサブレベルを追加", category: "ue_level", inputSchema: z.object({ sublevelPath: z.string(), streamingMethod: z.enum(["AlwaysLoaded","Blueprint","LevelStreamingDynamic"]).default("Blueprint") }), handler: async (p) => { return bridgeSendAsToolResult("unreal", "LevelAddSublevel", p, { successMessage: (_, p) => `Sublevel added: ${p.sublevelPath}` }) } };

const ueLevelSetGameMode: ToolDefinition = { id: "ue_level_set_gamemode", name: "Set Level Game Mode", description: "Override the GameMode for this level", descriptionJa: "このレベルのGameModeをオーバーライド", category: "ue_level", inputSchema: z.object({ gameModePath: z.string() }), handler: async (p) => { return bridgeSendAsToolResult("unreal", "LevelSetGameMode", p, { successMessage: "GameMode set" }) } };

const ueLevelGetInfo: ToolDefinition = { id: "ue_level_get_info", name: "Get Level Info", description: "Get actor count, sublevels, and world settings", descriptionJa: "アクター数・サブレベル・ワールド設定情報を取得", category: "ue_level", inputSchema: z.object({}), handler: async (p) => { return bridgeSendAsToolResult("unreal", "LevelGetInfo", p, { successMessage: "Level info retrieved" }) } };

export const ueLevelTools: ToolDefinition[] = [ ueLevelCreate, ueLevelOpen, ueLevelSave, ueLevelAddSublevel, ueLevelSetGameMode, ueLevelGetInfo ];