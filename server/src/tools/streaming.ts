import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const streamingLoadScene: ToolDefinition = {
  id: "streaming_load_scene",
  name: "Load Scene Async",
  description: "Load a scene asynchronously in additive or single mode",
  descriptionJa: "シーンを非同期でロード（Additive/Single）",
  category: "streaming",
  inputSchema: z.object({ sceneName: z.string(), mode: z.enum(["Single","Additive"]).default("Additive") }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "StreamingLoadScene", p, { successMessage: (_, p) => `Scene ${p.sceneName} loading (${p.mode})` });
  }
};

const streamingUnloadScene: ToolDefinition = {
  id: "streaming_unload_scene",
  name: "Unload Scene Async",
  description: "Unload a scene asynchronously",
  descriptionJa: "シーンを非同期でアンロード",
  category: "streaming",
  inputSchema: z.object({ sceneName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "StreamingUnloadScene", p, { successMessage: (_, p) => `Scene ${p.sceneName} unloading` });
  }
};

const streamingSetActiveScene: ToolDefinition = {
  id: "streaming_set_active_scene",
  name: "Set Active Scene",
  description: "Set the active scene for new object creation",
  descriptionJa: "新規オブジェクト作成用のアクティブシーンを設定",
  category: "streaming",
  inputSchema: z.object({ sceneName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "StreamingSetActiveScene", p, { successMessage: (_, p) => `Active scene set to ${p.sceneName}` });
  }
};

const streamingGetLoadedScenes: ToolDefinition = {
  id: "streaming_get_loaded_scenes",
  name: "Get Loaded Scenes",
  description: "List all currently loaded scenes",
  descriptionJa: "現在ロードされている全シーンを一覧表示",
  category: "streaming",
  inputSchema: z.object({}),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "StreamingGetLoadedScenes", p, { successMessage: "Loaded scenes retrieved" });
  }
};

const streamingPreload: ToolDefinition = {
  id: "streaming_preload",
  name: "Preload Scene",
  description: "Preload a scene without activating it",
  descriptionJa: "シーンをアクティブ化せずにプリロード",
  category: "streaming",
  inputSchema: z.object({ sceneName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "StreamingPreload", p, { successMessage: (_, p) => `Scene ${p.sceneName} preloading` });
  }
};

const streamingGetProgress: ToolDefinition = {
  id: "streaming_get_progress",
  name: "Get Loading Progress",
  description: "Get the loading progress of an async scene operation",
  descriptionJa: "非同期シーンオペレーションのロード進捗を取得",
  category: "streaming",
  inputSchema: z.object({ sceneName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "StreamingGetProgress", p, { successMessage: "Loading progress retrieved" });
  }
};

export const streamingTools: ToolDefinition[] = [
  streamingLoadScene, streamingUnloadScene, streamingSetActiveScene,
  streamingGetLoadedScenes, streamingPreload, streamingGetProgress
];