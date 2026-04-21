import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const editorPlayMode: ToolDefinition = {
  id: "editor_play_mode",
  name: "Toggle Play Mode",
  description: "Enter, exit, or pause Unity Play mode",
  descriptionJa: "UnityのPlayモードを開始・停止・一時停止する",
  category: "editor",
  inputSchema: z.object({
    action: z.enum(["play", "stop", "pause"]).describe("Play mode action")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "EditorPlayMode", params, { successMessage: (_, params) => `Play mode: ${params.action}` });
  }
};

const editorSaveScene: ToolDefinition = {
  id: "editor_save_scene",
  name: "Save Scene",
  description: "Save the current scene",
  descriptionJa: "現在のシーンを保存する",
  category: "editor",
  inputSchema: z.object({
    path: z.string().optional().describe("Save path (omit to save current)")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "EditorSaveScene", params, { successMessage: "Scene saved" });
  }
};

const editorLoadScene: ToolDefinition = {
  id: "editor_load_scene",
  name: "Load Scene",
  description: "Open a scene by path",
  descriptionJa: "パスを指定してシーンを開く",
  category: "editor",
  inputSchema: z.object({
    path: z.string().describe("Scene asset path (e.g. Assets/Scenes/Main.unity)")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "EditorLoadScene", params, { successMessage: (_, params) => `Scene loaded: ${params.path}` });
  }
};

const editorUndoRedo: ToolDefinition = {
  id: "editor_undo_redo",
  name: "Undo / Redo",
  description: "Perform Undo or Redo in the editor",
  descriptionJa: "エディタでUndo/Redoを実行する",
  category: "editor",
  inputSchema: z.object({
    action: z.enum(["undo", "redo"]).describe("Undo or Redo")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "EditorUndoRedo", params, { successMessage: (_, params) => `${params.action} executed` });
  }
};

const editorClearConsole: ToolDefinition = {
  id: "editor_clear_console",
  name: "Clear Console",
  description: "Clear the Unity console log",
  descriptionJa: "Unityコンソールログをクリアする",
  category: "editor",
  inputSchema: z.object({}),
  handler: async () => {
    return bridgeSendAsToolResult("unity", "EditorClearConsole", {}, { successMessage: "Console cleared" });
  }
};

export const editorTools: ToolDefinition[] = [editorPlayMode, editorSaveScene, editorLoadScene, editorUndoRedo, editorClearConsole];