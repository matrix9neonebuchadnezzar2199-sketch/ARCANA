import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const vrWorldSetup: ToolDefinition = { id: "vrc_world_setup", name: "Setup VRChat World", description: "Add VRC_SceneDescriptor and configure world settings", descriptionJa: "VRC_SceneDescriptorを追加してワールド設定を行う", category: "vrchat",
  inputSchema: z.object({ spawnX: z.number().optional().default(0), spawnY: z.number().optional().default(0), spawnZ: z.number().optional().default(0), maxPlayers: z.number().optional().default(32) }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "VrcWorldSetup", params, { successMessage: "VRChat world configured" }) } };

const vrAvatarSetup: ToolDefinition = { id: "vrc_avatar_setup", name: "Setup VRChat Avatar", description: "Add VRC_AvatarDescriptor and configure viewpoint", descriptionJa: "VRC_AvatarDescriptorを追加してビューポイントを設定する", category: "vrchat",
  inputSchema: z.object({ name: z.string().describe("Avatar root object"), viewX: z.number().optional().default(0), viewY: z.number().optional().default(1.6), viewZ: z.number().optional().default(0.1) }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "VrcAvatarSetup", params, { successMessage: (_, params) => `Avatar configured: ${params.name}` }) } };

const vrTrigger: ToolDefinition = { id: "vrc_trigger", name: "Add VRChat Trigger", description: "Add an Udon trigger zone to a GameObject", descriptionJa: "GameObjectにUdonトリガーゾーンを追加する", category: "vrchat",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), event: z.string().optional().default("OnPlayerEnter").describe("Trigger event type") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "VrcTrigger", params, { successMessage: (_, params) => `Trigger added: ${params.event}` }) } };

const vrMirror: ToolDefinition = { id: "vrc_mirror", name: "Add VRChat Mirror", description: "Create a VRC mirror in the scene", descriptionJa: "シーンにVRCミラーを作成する", category: "vrchat",
  inputSchema: z.object({ name: z.string().optional().default("Mirror"), width: z.number().optional().default(2), height: z.number().optional().default(3), x: z.number().optional().default(0), y: z.number().optional().default(1.5), z: z.number().optional().default(0) }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "VrcMirror", params, { successMessage: (_, params) => `Mirror created: ${params.name}` }) } };

const vrPickup: ToolDefinition = { id: "vrc_pickup", name: "Add VRChat Pickup", description: "Make a GameObject pickupable in VRChat", descriptionJa: "GameObjectをVRChatで持てるようにする", category: "vrchat",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), useGravity: z.boolean().optional().default(true), throwable: z.boolean().optional().default(true) }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "VrcPickup", params, { successMessage: (_, params) => `Pickup added to ${params.name}` }) } };

const vrSync: ToolDefinition = { id: "vrc_sync", name: "Add Object Sync", description: "Add VRC ObjectSync for network synchronization", descriptionJa: "ネットワーク同期用のVRC ObjectSyncを追加する", category: "vrchat",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), syncType: z.enum(["Continuous", "Manual"]).optional().default("Continuous") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "VrcSync", params, { successMessage: (_, params) => `ObjectSync added to ${params.name}` }) } };

const vrTeleport: ToolDefinition = { id: "vrc_teleport", name: "Add Teleport Point", description: "Create a teleport destination point", descriptionJa: "テレポート先ポイントを作成する", category: "vrchat",
  inputSchema: z.object({ name: z.string().optional().default("TeleportPoint"), x: z.number().optional().default(0), y: z.number().optional().default(0), z: z.number().optional().default(0) }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "VrcTeleport", params, { successMessage: (_, params) => `Teleport point created: ${params.name}` }) } };

const vrVideoPlayer: ToolDefinition = { id: "vrc_video_player", name: "Add Video Player", description: "Add a synced VRChat video player", descriptionJa: "同期VRChat動画プレイヤーを追加する", category: "vrchat",
  inputSchema: z.object({ name: z.string().optional().default("VideoPlayer"), screenWidth: z.number().optional().default(16), screenHeight: z.number().optional().default(9) }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "VrcVideoPlayer", params, { successMessage: (_, params) => `Video player created: ${params.name}` }) } };

const vrChair: ToolDefinition = { id: "vrc_chair", name: "Add VRChat Chair", description: "Add a sittable station/chair", descriptionJa: "座れるステーション/椅子を追加する", category: "vrchat",
  inputSchema: z.object({ name: z.string().optional().default("Chair"), x: z.number().optional().default(0), y: z.number().optional().default(0), z: z.number().optional().default(0) }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "VrcChair", params, { successMessage: (_, params) => `Chair created: ${params.name}` }) } };

const vrLightmap: ToolDefinition = { id: "vrc_lightmap", name: "Bake VRChat Lightmap", description: "Bake lightmaps optimized for VRChat", descriptionJa: "VRChat向けに最適化されたライトマップをベイクする", category: "vrchat",
  inputSchema: z.object({ resolution: z.number().optional().default(40).describe("Texels per unit"), quality: z.enum(["Low", "Medium", "High"]).optional().default("Medium") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "VrcLightmap", params, { successMessage: (_, params) => `Lightmap baked: ${params.quality}` }) } };

export const vrchatTools: ToolDefinition[] = [vrWorldSetup, vrAvatarSetup, vrTrigger, vrMirror, vrPickup, vrSync, vrTeleport, vrVideoPlayer, vrChair, vrLightmap];