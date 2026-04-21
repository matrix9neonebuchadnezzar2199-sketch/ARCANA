import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const ueSceneListActors: ToolDefinition = {
  id: "ue_scene_list_actors",
  name: "List Actors",
  description: "List all actors in the current UE level",
  descriptionJa: "現在のUEレベル内の全アクターを一覧表示",
  category: "ue_scene",
  inputSchema: z.object({ filter: z.string().optional() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unreal", "SceneListActors", p, { successMessage: "Actors listed" });
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
    return bridgeSendAsToolResult("unreal", "SceneSpawnActor", p, { successMessage: (_, p) => `Actor spawned: ${p.type}` });
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
    return bridgeSendAsToolResult("unreal", "SceneDeleteActor", p, { successMessage: (_, p) => `Actor deleted: ${p.actorName}` });
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
    return bridgeSendAsToolResult("unreal", "SceneDuplicateActor", p, { successMessage: (_, p) => `Actor duplicated: ${p.actorName}` });
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
    return bridgeSendAsToolResult("unreal", "SceneRenameActor", p, { successMessage: (_, p) => `Renamed to ${p.newName}` });
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
    return bridgeSendAsToolResult("unreal", "SceneGetActorInfo", p, { successMessage: (_, p) => `Info for ${p.actorName}` });
  }
};

export const ueSceneTools: ToolDefinition[] = [
  ueSceneListActors, ueSceneSpawnActor, ueSceneDeleteActor,
  ueSceneDuplicateActor, ueSceneRenameActor, ueSceneGetActorInfo
];