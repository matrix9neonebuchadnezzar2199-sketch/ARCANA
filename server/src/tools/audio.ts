import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
export const audioAddSource: ToolDefinition = {
  id: "audio_add_source",
  name: "Add Audio Source",
  description: "Add an AudioSource component to a GameObject",
  descriptionJa: "GameObjectにAudioSourceコンポーネントを追加",
  category: "audio",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    clipPath: z.string().describe("Audio clip path relative to Assets"),
    loop: z.boolean().optional().describe("Loop playback, default false"),
    volume: z.number().optional().describe("Volume 0-1, default 1"),
    playOnAwake: z.boolean().optional().describe("Play on awake, default true")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "AudioAddSource", params, { successMessage: (_, params) => `Added audio source to ${params.name}` });
  }
};

export const audioSetVolume: ToolDefinition = {
  id: "audio_set_volume",
  name: "Set Volume",
  description: "Set the volume of an AudioSource on a GameObject",
  descriptionJa: "GameObjectのAudioSourceの音量を設定",
  category: "audio",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    volume: z.number().min(0).max(1).describe("Volume 0-1")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "AudioSetVolume", params, { successMessage: (_, params) => `Set volume of ${params.name} to ${params.volume}` });
  }
};

export const audioSetSpatial: ToolDefinition = {
  id: "audio_set_spatial",
  name: "Set Spatial Audio",
  description: "Configure 3D spatial audio settings on an AudioSource",
  descriptionJa: "AudioSourceの3D空間オーディオ設定を構成",
  category: "audio",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    spatialBlend: z.number().min(0).max(1).describe("0 = 2D, 1 = 3D"),
    minDistance: z.number().optional().describe("Min hearing distance, default 1"),
    maxDistance: z.number().optional().describe("Max hearing distance, default 500")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "AudioSetSpatial", params, { successMessage: (_, params) => `Set spatial audio on ${params.name}` });
  }
};

export const audioTools = [
  audioAddSource,
  audioSetVolume,
  audioSetSpatial
];