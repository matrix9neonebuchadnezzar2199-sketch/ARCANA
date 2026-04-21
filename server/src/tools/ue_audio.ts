import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const ueAudioAddComponent: ToolDefinition = {
  id: "ue_audio_add_component", name: "Add Audio Component",
  description: "Add an AudioComponent to an actor with a sound asset",
  descriptionJa: "アクターにサウンドアセット付きAudioComponentを追加",
  category: "ue_audio",
  inputSchema: z.object({ actorName: z.string(), soundPath: z.string(), autoPlay: z.boolean().default(false) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "AudioAddComponent", p, { successMessage: (_, p) => `Audio added to ${p.actorName}` }) }
};

const ueAudioSetVolume: ToolDefinition = {
  id: "ue_audio_set_volume", name: "Set Audio Volume",
  description: "Set the volume multiplier of an audio component",
  descriptionJa: "オーディオコンポーネントのボリューム倍率を設定",
  category: "ue_audio",
  inputSchema: z.object({ actorName: z.string(), volume: z.number().min(0).max(10).default(1) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "AudioSetVolume", p, { successMessage: (_, p) => `Volume set to ${p.volume}` }) }
};

const ueAudioSetPitch: ToolDefinition = {
  id: "ue_audio_set_pitch", name: "Set Audio Pitch",
  description: "Set the pitch multiplier of an audio component",
  descriptionJa: "オーディオコンポーネントのピッチ倍率を設定",
  category: "ue_audio",
  inputSchema: z.object({ actorName: z.string(), pitch: z.number().min(0.1).max(4).default(1) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "AudioSetPitch", p, { successMessage: (_, p) => `Pitch set to ${p.pitch}` }) }
};

const ueAudioSetSpatial: ToolDefinition = {
  id: "ue_audio_set_spatial", name: "Set Audio Spatialization",
  description: "Configure 3D spatialization and attenuation",
  descriptionJa: "3D空間化と減衰を設定",
  category: "ue_audio",
  inputSchema: z.object({ actorName: z.string(), spatialize: z.boolean().default(true), innerRadius: z.number().default(400), falloffDistance: z.number().default(3600) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "AudioSetSpatial", p, { successMessage: (_, p) => `Spatialization set on ${p.actorName}` }) }
};

const ueAudioAddAmbientSound: ToolDefinition = {
  id: "ue_audio_add_ambient", name: "Add Ambient Sound",
  description: "Spawn an AmbientSound actor in the level",
  descriptionJa: "レベルにAmbientSoundアクターをスポーン",
  category: "ue_audio",
  inputSchema: z.object({ soundPath: z.string(), x: z.number().default(0), y: z.number().default(0), z: z.number().default(0), volume: z.number().default(1) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "AudioAddAmbient", p, { successMessage: "Ambient sound added" }) }
};

const ueAudioAddReverb: ToolDefinition = {
  id: "ue_audio_add_reverb", name: "Add Reverb Volume",
  description: "Add an AudioVolume with reverb settings",
  descriptionJa: "リバーブ設定付きのAudioVolumeを追加",
  category: "ue_audio",
  inputSchema: z.object({ preset: z.enum(["Default","Bathroom","StoneRoom","Auditorium","Arena","Cave","Hangar"]).default("Default"), x: z.number().default(0), y: z.number().default(0), z: z.number().default(0), extentX: z.number().default(500), extentY: z.number().default(500), extentZ: z.number().default(500) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "AudioAddReverb", p, { successMessage: (_, p) => `Reverb added: ${p.preset}` }) }
};

export const ueAudioTools: ToolDefinition[] = [
  ueAudioAddComponent, ueAudioSetVolume, ueAudioSetPitch,
  ueAudioSetSpatial, ueAudioAddAmbientSound, ueAudioAddReverb
];