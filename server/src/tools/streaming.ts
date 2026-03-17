import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const streamingLoadScene: ToolDefinition = {
  id: "streaming_load_scene",
  name: "Load Scene Async",
  description: "Load a scene asynchronously in additive or single mode",
  descriptionJa: "シーンを非同期でロード（Additive/Single）",
  category: "streaming",
  inputSchema: z.object({ sceneName: z.string(), mode: z.enum(["Single","Additive"]).default("Additive") }),
  handler: async (p) => {
    const r = await unityBridge.send("StreamingLoadScene", p);
    return r ? { success: true, message: `Scene ${p.sceneName} loading (${p.mode})`, data: r }
             : { success: false, message: "Failed to load scene" };
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
    const r = await unityBridge.send("StreamingUnloadScene", p);
    return r ? { success: true, message: `Scene ${p.sceneName} unloading`, data: r }
             : { success: false, message: "Failed to unload scene" };
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
    const r = await unityBridge.send("StreamingSetActiveScene", p);
    return r ? { success: true, message: `Active scene set to ${p.sceneName}`, data: r }
             : { success: false, message: "Failed to set active scene" };
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
    const r = await unityBridge.send("StreamingGetLoadedScenes", p);
    return r ? { success: true, message: "Loaded scenes retrieved", data: r }
             : { success: false, message: "Failed to get loaded scenes" };
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
    const r = await unityBridge.send("StreamingPreload", p);
    return r ? { success: true, message: `Scene ${p.sceneName} preloading`, data: r }
             : { success: false, message: "Failed to preload scene" };
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
    const r = await unityBridge.send("StreamingGetProgress", p);
    return r ? { success: true, message: "Loading progress retrieved", data: r }
             : { success: false, message: "Failed to get progress" };
  }
};

export const streamingTools: ToolDefinition[] = [
  streamingLoadScene, streamingUnloadScene, streamingSetActiveScene,
  streamingGetLoadedScenes, streamingPreload, streamingGetProgress
];