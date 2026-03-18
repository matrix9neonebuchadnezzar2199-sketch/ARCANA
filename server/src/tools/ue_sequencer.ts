import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
export const ueSequencerTools: ToolDefinition[] = [
  {
    id: "ue_sequencer_create_sequence",
    name: "Create Level Sequence",
    description: "Create a new Level Sequence asset for cinematics",
    descriptionJa: "シネマティクス用の新しいLevel Sequenceアセットを作成",
    category: "UE_Sequencer",
    inputSchema: z.object({
      name: z.string().describe("Sequence asset name"),
      path: z.string().optional().describe("Content path (e.g. /Game/Cinematics/)"),
      frameRate: z.number().optional().describe("Frame rate (default: 30)"),
      durationSeconds: z.number().optional().describe("Initial duration in seconds"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "SequencerCreateSequence", params);
      return { success: true, message: `Level Sequence "${params.name}" created`, data: result };
    },
  },
  {
    id: "ue_sequencer_add_actor_track",
    name: "Add Actor Track",
    description: "Add an actor binding track to a Level Sequence",
    descriptionJa: "Level Sequenceにアクターバインディングトラックを追加",
    category: "UE_Sequencer",
    inputSchema: z.object({
      sequenceName: z.string().describe("Target Level Sequence name"),
      actorName: z.string().describe("Actor to bind from the level"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "SequencerAddActorTrack", params);
      return { success: true, message: `Actor track for "${params.actorName}" added to "${params.sequenceName}"`, data: result };
    },
  },
  {
    id: "ue_sequencer_add_transform_key",
    name: "Add Transform Keyframe",
    description: "Add a transform keyframe (location, rotation, scale) at a specific time",
    descriptionJa: "指定時間にトランスフォームキーフレーム（位置、回転、スケール）を追加",
    category: "UE_Sequencer",
    inputSchema: z.object({
      sequenceName: z.string().describe("Target Level Sequence"),
      actorName: z.string().describe("Target actor"),
      timeSeconds: z.number().describe("Time in seconds"),
      location: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional().describe("Location"),
      rotation: z.object({ pitch: z.number(), yaw: z.number(), roll: z.number() }).optional().describe("Rotation"),
      scale: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional().describe("Scale"),
      interpolation: z.enum(["Linear", "Cubic", "Constant"]).optional().describe("Interpolation mode"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "SequencerAddTransformKey", params);
      return { success: true, message: `Transform key added at ${params.timeSeconds}s for "${params.actorName}"`, data: result };
    },
  },
  {
    id: "ue_sequencer_add_camera_cut",
    name: "Add Camera Cut Track",
    description: "Add a camera cut track to switch between cameras over time",
    descriptionJa: "時間経過でカメラ間を切り替えるカメラカットトラックを追加",
    category: "UE_Sequencer",
    inputSchema: z.object({
      sequenceName: z.string().describe("Target Level Sequence"),
      cuts: z.array(z.object({
        cameraName: z.string().describe("Camera actor name"),
        startTime: z.number().describe("Start time in seconds"),
      })).describe("Camera cut entries"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "SequencerAddCameraCut", params);
      return { success: true, message: `${params.cuts.length} camera cut(s) added to "${params.sequenceName}"`, data: result };
    },
  },
  {
    id: "ue_sequencer_add_audio_track",
    name: "Add Audio Track",
    description: "Add an audio track with a sound asset to the sequence",
    descriptionJa: "シーケンスにサウンドアセット付きオーディオトラックを追加",
    category: "UE_Sequencer",
    inputSchema: z.object({
      sequenceName: z.string().describe("Target Level Sequence"),
      soundAssetPath: z.string().describe("Sound asset path"),
      startTime: z.number().optional().describe("Start time in seconds (default: 0)"),
      volume: z.number().optional().describe("Volume multiplier (default: 1.0)"),
      rowIndex: z.number().optional().describe("Audio track row index"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "SequencerAddAudioTrack", params);
      return { success: true, message: `Audio track added to "${params.sequenceName}"`, data: result };
    },
  },
  {
    id: "ue_sequencer_add_animation_track",
    name: "Add Skeletal Animation Track",
    description: "Add a skeletal animation clip to an actor track in the sequence",
    descriptionJa: "シーケンスのアクタートラックにスケルタルアニメーションクリップを追加",
    category: "UE_Sequencer",
    inputSchema: z.object({
      sequenceName: z.string().describe("Target Level Sequence"),
      actorName: z.string().describe("Skeletal mesh actor name"),
      animationPath: z.string().describe("Animation sequence asset path"),
      startTime: z.number().optional().describe("Start time in seconds"),
      endTime: z.number().optional().describe("End time in seconds"),
      playRate: z.number().optional().describe("Playback rate (default: 1.0)"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "SequencerAddAnimationTrack", params);
      return { success: true, message: `Animation added for "${params.actorName}" in "${params.sequenceName}"`, data: result };
    },
  },
  {
    id: "ue_sequencer_add_fade_track",
    name: "Add Fade Track",
    description: "Add a fade track to create fade-in and fade-out effects",
    descriptionJa: "フェードイン・フェードアウト効果を作成するフェードトラックを追加",
    category: "UE_Sequencer",
    inputSchema: z.object({
      sequenceName: z.string().describe("Target Level Sequence"),
      keyframes: z.array(z.object({
        time: z.number().describe("Time in seconds"),
        value: z.number().describe("Fade value (0 = no fade, 1 = fully black)"),
      })).describe("Fade keyframes"),
      fadeColor: z.object({ r: z.number(), g: z.number(), b: z.number() }).optional().describe("Fade color (default: black)"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "SequencerAddFadeTrack", params);
      return { success: true, message: `Fade track with ${params.keyframes.length} keyframes added to "${params.sequenceName}"`, data: result };
    },
  },
  {
    id: "ue_sequencer_play_preview",
    name: "Play Sequence Preview",
    description: "Play, pause, or stop a Level Sequence preview in the editor",
    descriptionJa: "エディタでLevel Sequenceプレビューを再生・一時停止・停止",
    category: "UE_Sequencer",
    inputSchema: z.object({
      sequenceName: z.string().describe("Target Level Sequence"),
      action: z.enum(["Play", "Pause", "Stop", "PlayFromStart"]).describe("Playback action"),
      playRate: z.number().optional().describe("Playback rate"),
      looping: z.boolean().optional().describe("Loop playback"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "SequencerPlayPreview", params);
      return { success: true, message: `Sequence "${params.sequenceName}": ${params.action}`, data: result };
    },
  },
];