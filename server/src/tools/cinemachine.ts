import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const cmCreate: ToolDefinition = {
  id: "cm_create_vcam",
  name: "Create Virtual Camera",
  description: "Create a Cinemachine Virtual Camera",
  descriptionJa: "Cinemachineバーチャルカメラを作成する",
  category: "cinemachine",
  inputSchema: z.object({ name: z.string().optional().default("VCam1").describe("Camera name"), x: z.number().optional().default(0), y: z.number().optional().default(1), z: z.number().optional().default(-10), fov: z.number().optional().default(60).describe("Field of view") }),
  handler: async (params) => { try { const r = await unityBridge.send("CmCreateVCam", params); return { success: true, message: `VCam created: ${params.name}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const cmSetFollow: ToolDefinition = {
  id: "cm_set_follow",
  name: "Set Follow Target",
  description: "Set the Follow target for a Virtual Camera",
  descriptionJa: "バーチャルカメラのFollow対象を設定する",
  category: "cinemachine",
  inputSchema: z.object({ vcamName: z.string().describe("Virtual Camera name"), targetName: z.string().describe("Follow target name") }),
  handler: async (params) => { try { const r = await unityBridge.send("CmSetFollow", params); return { success: true, message: `Follow set: ${params.targetName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const cmSetLookAt: ToolDefinition = {
  id: "cm_set_lookat",
  name: "Set LookAt Target",
  description: "Set the LookAt target for a Virtual Camera",
  descriptionJa: "バーチャルカメラのLookAt対象を設定する",
  category: "cinemachine",
  inputSchema: z.object({ vcamName: z.string().describe("Virtual Camera name"), targetName: z.string().describe("LookAt target name") }),
  handler: async (params) => { try { const r = await unityBridge.send("CmSetLookAt", params); return { success: true, message: `LookAt set: ${params.targetName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const cmSetBlend: ToolDefinition = {
  id: "cm_set_blend",
  name: "Set Camera Blend",
  description: "Set default blend time between virtual cameras",
  descriptionJa: "バーチャルカメラ間のブレンド時間を設定する",
  category: "cinemachine",
  inputSchema: z.object({ blendTime: z.number().optional().default(2).describe("Blend duration in seconds"), style: z.enum(["Cut", "EaseInOut", "EaseIn", "EaseOut", "HardIn", "HardOut", "Linear"]).optional().default("EaseInOut").describe("Blend style") }),
  handler: async (params) => { try { const r = await unityBridge.send("CmSetBlend", params); return { success: true, message: `Blend set: ${params.blendTime}s ${params.style}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const cmSetNoise: ToolDefinition = {
  id: "cm_set_noise",
  name: "Set Camera Noise",
  description: "Add procedural noise (handheld shake) to a Virtual Camera",
  descriptionJa: "バーチャルカメラに手ブレノイズを追加する",
  category: "cinemachine",
  inputSchema: z.object({ vcamName: z.string().describe("Virtual Camera name"), amplitudeGain: z.number().optional().default(0.5).describe("Amplitude"), frequencyGain: z.number().optional().default(0.5).describe("Frequency") }),
  handler: async (params) => { try { const r = await unityBridge.send("CmSetNoise", params); return { success: true, message: `Noise set on ${params.vcamName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const cmCreateFreeLook: ToolDefinition = {
  id: "cm_create_freelook",
  name: "Create FreeLook Camera",
  description: "Create a Cinemachine FreeLook camera for orbit control",
  descriptionJa: "軌道制御用のCinemachine FreeLookカメラを作成する",
  category: "cinemachine",
  inputSchema: z.object({ name: z.string().optional().default("FreeLook1").describe("Camera name"), targetName: z.string().describe("Target to orbit around") }),
  handler: async (params) => { try { const r = await unityBridge.send("CmCreateFreeLook", params); return { success: true, message: `FreeLook created: ${params.name}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

export const cinemachineTools: ToolDefinition[] = [cmCreate, cmSetFollow, cmSetLookAt, cmSetBlend, cmSetNoise, cmCreateFreeLook];