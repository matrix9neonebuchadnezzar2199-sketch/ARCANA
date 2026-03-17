import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const tlCreate: ToolDefinition = {
  id: "timeline_create",
  name: "Create Timeline",
  description: "Create a new Timeline asset and bind to object",
  descriptionJa: "新しいTimelineアセットを作成しオブジェクトにバインドする",
  category: "timeline",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), assetPath: z.string().optional().default("Assets/Timelines/New.playable").describe("Timeline asset path") }),
  handler: async (params) => {
    try { const r = await unityBridge.send("TimelineCreate", params); return { success: true, message: `Timeline created on ${params.name}`, data: r }; }
    catch (e: any) { return { success: false, message: e.message }; }
  }
};

const tlAddTrack: ToolDefinition = {
  id: "timeline_add_track",
  name: "Add Timeline Track",
  description: "Add a track to a Timeline (Animation, Audio, Activation, Signal)",
  descriptionJa: "Timelineにトラックを追加する",
  category: "timeline",
  inputSchema: z.object({ name: z.string().describe("GameObject with PlayableDirector"), trackType: z.enum(["Animation", "Audio", "Activation", "Signal"]).describe("Track type"), trackName: z.string().optional().default("New Track").describe("Track name") }),
  handler: async (params) => {
    try { const r = await unityBridge.send("TimelineAddTrack", params); return { success: true, message: `${params.trackType} track added`, data: r }; }
    catch (e: any) { return { success: false, message: e.message }; }
  }
};

const tlAddClip: ToolDefinition = {
  id: "timeline_add_clip",
  name: "Add Timeline Clip",
  description: "Add a clip to an existing track",
  descriptionJa: "既存のトラックにクリップを追加する",
  category: "timeline",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), trackIndex: z.number().describe("Track index"), startTime: z.number().optional().default(0).describe("Start time in seconds"), duration: z.number().optional().default(1).describe("Duration in seconds") }),
  handler: async (params) => {
    try { const r = await unityBridge.send("TimelineAddClip", params); return { success: true, message: `Clip added at ${params.startTime}s`, data: r }; }
    catch (e: any) { return { success: false, message: e.message }; }
  }
};

const tlPlay: ToolDefinition = {
  id: "timeline_play",
  name: "Play Timeline",
  description: "Play the Timeline on a GameObject",
  descriptionJa: "GameObjectのTimelineを再生する",
  category: "timeline",
  inputSchema: z.object({ name: z.string().describe("GameObject name") }),
  handler: async (params) => {
    try { const r = await unityBridge.send("TimelinePlay", params); return { success: true, message: `Timeline playing on ${params.name}`, data: r }; }
    catch (e: any) { return { success: false, message: e.message }; }
  }
};

const tlStop: ToolDefinition = {
  id: "timeline_stop",
  name: "Stop Timeline",
  description: "Stop the Timeline on a GameObject",
  descriptionJa: "GameObjectのTimelineを停止する",
  category: "timeline",
  inputSchema: z.object({ name: z.string().describe("GameObject name") }),
  handler: async (params) => {
    try { const r = await unityBridge.send("TimelineStop", params); return { success: true, message: `Timeline stopped on ${params.name}`, data: r }; }
    catch (e: any) { return { success: false, message: e.message }; }
  }
};

const tlSetTime: ToolDefinition = {
  id: "timeline_set_time",
  name: "Set Timeline Time",
  description: "Set the playback time of a Timeline",
  descriptionJa: "Timelineの再生時間を設定する",
  category: "timeline",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), time: z.number().min(0).describe("Time in seconds") }),
  handler: async (params) => {
    try { const r = await unityBridge.send("TimelineSetTime", params); return { success: true, message: `Timeline time set to ${params.time}s`, data: r }; }
    catch (e: any) { return { success: false, message: e.message }; }
  }
};

export const timelineTools: ToolDefinition[] = [tlCreate, tlAddTrack, tlAddClip, tlPlay, tlStop, tlSetTime];