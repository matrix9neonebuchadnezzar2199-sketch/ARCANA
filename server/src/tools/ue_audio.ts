import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unrealBridge } from "../bridge/unreal-bridge";

const ueAudioAddComponent: ToolDefinition = {
  id: "ue_audio_add_component", name: "Add Audio Component",
  description: "Add an AudioComponent to an actor with a sound asset",
  descriptionJa: "アクターにサウンドアセット付きAudioComponentを追加",
  category: "ue_audio",
  inputSchema: z.object({ actorName: z.string(), soundPath: z.string(), autoPlay: z.boolean().default(false) }),
  handler: async (p) => { const r = await unrealBridge.send("AudioAddComponent", p); return r ? { success: true, message: `Audio added to ${p.actorName}`, data: r } : { success: false, message: "Failed" }; }
};

const ueAudioSetVolume: ToolDefinition = {
  id: "ue_audio_set_volume", name: "Set Audio Volume",
  description: "Set the volume multiplier of an audio component",
  descriptionJa: "オーディオコンポーネントのボリューム倍率を設定",
  category: "ue_audio",
  inputSchema: z.object({ actorName: z.string(), volume: z.number().min(0).max(10).default(1) }),
  handler: async (p) => { const r = await unrealBridge.send("AudioSetVolume", p); return r ? { success: true, message: `Volume set to ${p.volume}`, data: r } : { success: false, message: "Failed" }; }
};

const ueAudioSetPitch: ToolDefinition = {
  id: "ue_audio_set_pitch", name: "Set Audio Pitch",
  description: "Set the pitch multiplier of an audio component",
  descriptionJa: "オーディオコンポーネントのピッチ倍率を設定",
  category: "ue_audio",
  inputSchema: z.object({ actorName: z.string(), pitch: z.number().min(0.1).max(4).default(1) }),
  handler: async (p) => { const r = await unrealBridge.send("AudioSetPitch", p); return r ? { success: true, message: `Pitch set to ${p.pitch}`, data: r } : { success: false, message: "Failed" }; }
};

const ueAudioSetSpatial: ToolDefinition = {
  id: "ue_audio_set_spatial", name: "Set Audio Spatialization",
  description: "Configure 3D spatialization and attenuation",
  descriptionJa: "3D空間化と減衰を設定",
  category: "ue_audio",
  inputSchema: z.object({ actorName: z.string(), spatialize: z.boolean().default(true), innerRadius: z.number().default(400), falloffDistance: z.number().default(3600) }),
  handler: async (p) => { const r = await unrealBridge.send("AudioSetSpatial", p); return r ? { success: true, message: `Spatialization set on ${p.actorName}`, data: r } : { success: false, message: "Failed" }; }
};

const ueAudioAddAmbientSound: ToolDefinition = {
  id: "ue_audio_add_ambient", name: "Add Ambient Sound",
  description: "Spawn an AmbientSound actor in the level",
  descriptionJa: "レベルにAmbientSoundアクターをスポーン",
  category: "ue_audio",
  inputSchema: z.object({ soundPath: z.string(), x: z.number().default(0), y: z.number().default(0), z: z.number().default(0), volume: z.number().default(1) }),
  handler: async (p) => { const r = await unrealBridge.send("AudioAddAmbient", p); return r ? { success: true, message: "Ambient sound added", data: r } : { success: false, message: "Failed" }; }
};

const ueAudioAddReverb: ToolDefinition = {
  id: "ue_audio_add_reverb", name: "Add Reverb Volume",
  description: "Add an AudioVolume with reverb settings",
  descriptionJa: "リバーブ設定付きのAudioVolumeを追加",
  category: "ue_audio",
  inputSchema: z.object({ preset: z.enum(["Default","Bathroom","StoneRoom","Auditorium","Arena","Cave","Hangar"]).default("Default"), x: z.number().default(0), y: z.number().default(0), z: z.number().default(0), extentX: z.number().default(500), extentY: z.number().default(500), extentZ: z.number().default(500) }),
  handler: async (p) => { const r = await unrealBridge.send("AudioAddReverb", p); return r ? { success: true, message: `Reverb added: ${p.preset}`, data: r } : { success: false, message: "Failed" }; }
};

export const ueAudioTools: ToolDefinition[] = [
  ueAudioAddComponent, ueAudioSetVolume, ueAudioSetPitch,
  ueAudioSetSpatial, ueAudioAddAmbientSound, ueAudioAddReverb
];