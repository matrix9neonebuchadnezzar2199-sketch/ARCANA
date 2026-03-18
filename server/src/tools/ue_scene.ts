import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const ueSceneListActors: ToolDefinition = {
  id: "ue_scene_list_actors",
  name: "List Actors",
  description: "List all actors in the current UE level",
  descriptionJa: "現在のUEレベル内の全アクターを一覧表示",
  category: "ue_scene",
  inputSchema: z.object({ filter: z.string().optional() }),
  handler: async (p) => {
    const r = await bridge.send("unreal", "SceneListActors", p);
    return r ? { success: true, message: "Actors listed", data: r }
             : { success: false, message: "Failed to list actors" };
  }
};

const ueSceneSpawnActor: ToolDefinition = {
  id: "ue_scene_spawn_actor",
  name: "Spawn Actor",
  description: "Spawn an actor (Cube, Sphere, Empty, etc.) in the level",
  descriptionJa: "レベルにアクター（Cube, Sphere, Empty等）をスポーン",
  category: "ue_scene",
  inputSchema: z.object({ type: z.enum(["Cube","Sphere","Cylinder","Cone","Plane","Empty","PointLight","SpotLight"]).default("Cube"), name: z.string().optional(), x: z.number().default(0), y: z.number().default(0), z: z.number().default(0) }),
  handler: async (p) => {
    const r = await bridge.send("unreal", "SceneSpawnActor", p);
    return r ? { success: true, message: `Actor spawned: ${p.type}`, data: r }
             : { success: false, message: "Failed to spawn actor" };
  }
};

const ueSceneDeleteActor: ToolDefinition = {
  id: "ue_scene_delete_actor",
  name: "Delete Actor",
  description: "Delete an actor by name from the level",
  descriptionJa: "名前を指定してレベルからアクターを削除",
  category: "ue_scene",
  inputSchema: z.object({ actorName: z.string() }),
  handler: async (p) => {
    const r = await bridge.send("unreal", "SceneDeleteActor", p);
    return r ? { success: true, message: `Actor deleted: ${p.actorName}`, data: r }
             : { success: false, message: "Failed to delete actor" };
  }
};

const ueSceneDuplicateActor: ToolDefinition = {
  id: "ue_scene_duplicate_actor",
  name: "Duplicate Actor",
  description: "Duplicate an existing actor in the level",
  descriptionJa: "レベル内の既存アクターを複製",
  category: "ue_scene",
  inputSchema: z.object({ actorName: z.string(), newName: z.string().optional() }),
  handler: async (p) => {
    const r = await bridge.send("unreal", "SceneDuplicateActor", p);
    return r ? { success: true, message: `Actor duplicated: ${p.actorName}`, data: r }
             : { success: false, message: "Failed to duplicate actor" };
  }
};

const ueSceneRenameActor: ToolDefinition = {
  id: "ue_scene_rename_actor",
  name: "Rename Actor",
  description: "Rename an actor in the level",
  descriptionJa: "レベル内のアクター名を変更",
  category: "ue_scene",
  inputSchema: z.object({ actorName: z.string(), newName: z.string() }),
  handler: async (p) => {
    const r = await bridge.send("unreal", "SceneRenameActor", p);
    return r ? { success: true, message: `Renamed to ${p.newName}`, data: r }
             : { success: false, message: "Failed to rename actor" };
  }
};

const ueSceneGetActorInfo: ToolDefinition = {
  id: "ue_scene_get_actor_info",
  name: "Get Actor Info",
  description: "Get detailed information about an actor",
  descriptionJa: "アクターの詳細情報を取得",
  category: "ue_scene",
  inputSchema: z.object({ actorName: z.string() }),
  handler: async (p) => {
    const r = await bridge.send("unreal", "SceneGetActorInfo", p);
    return r ? { success: true, message: `Info for ${p.actorName}`, data: r }
             : { success: false, message: "Failed to get actor info" };
  }
};

export const ueSceneTools: ToolDefinition[] = [
  ueSceneListActors, ueSceneSpawnActor, ueSceneDeleteActor,
  ueSceneDuplicateActor, ueSceneRenameActor, ueSceneGetActorInfo
];