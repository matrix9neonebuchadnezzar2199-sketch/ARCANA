import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const probeCreate: ToolDefinition = {
  id: "probe_create",
  name: "Create Reflection Probe",
  description: "Create a Reflection Probe in the scene",
  descriptionJa: "シーンにReflection Probeを作成",
  category: "reflectionprobe",
  inputSchema: z.object({ name: z.string().optional(), x: z.number().default(0), y: z.number().default(1), z: z.number().default(0), mode: z.enum(["Baked","Realtime","Custom"]).default("Baked") }),
  handler: async (p) => {
    const r = await unityBridge.send("ProbeCreate", p);
    return r ? { success: true, message: `Reflection Probe created: ${p.name ?? "NewProbe"}`, data: r }
             : { success: false, message: "Failed to create probe" };
  }
};

const probeSetSize: ToolDefinition = {
  id: "probe_set_size",
  name: "Set Probe Size",
  description: "Set the bounding box size of a Reflection Probe",
  descriptionJa: "Reflection Probeのバウンディングボックスサイズを設定",
  category: "reflectionprobe",
  inputSchema: z.object({ objectName: z.string(), sizeX: z.number().default(10), sizeY: z.number().default(10), sizeZ: z.number().default(10) }),
  handler: async (p) => {
    const r = await unityBridge.send("ProbeSetSize", p);
    return r ? { success: true, message: `Probe size set on ${p.objectName}`, data: r }
             : { success: false, message: "Failed to set probe size" };
  }
};

const probeSetResolution: ToolDefinition = {
  id: "probe_set_resolution",
  name: "Set Probe Resolution",
  description: "Set the cubemap resolution of a Reflection Probe",
  descriptionJa: "Reflection Probeのキューブマップ解像度を設定",
  category: "reflectionprobe",
  inputSchema: z.object({ objectName: z.string(), resolution: z.enum(["16","32","64","128","256","512","1024","2048"]).default("256") }),
  handler: async (p) => {
    const r = await unityBridge.send("ProbeSetResolution", p);
    return r ? { success: true, message: `Probe resolution set to ${p.resolution}`, data: r }
             : { success: false, message: "Failed to set probe resolution" };
  }
};

const probeSetIntensity: ToolDefinition = {
  id: "probe_set_intensity",
  name: "Set Probe Intensity",
  description: "Set the reflection intensity of a Reflection Probe",
  descriptionJa: "Reflection Probeの反射強度を設定",
  category: "reflectionprobe",
  inputSchema: z.object({ objectName: z.string(), intensity: z.number().default(1) }),
  handler: async (p) => {
    const r = await unityBridge.send("ProbeSetIntensity", p);
    return r ? { success: true, message: `Probe intensity set to ${p.intensity}`, data: r }
             : { success: false, message: "Failed to set probe intensity" };
  }
};

const probeBake: ToolDefinition = {
  id: "probe_bake",
  name: "Bake Reflection Probe",
  description: "Bake a Reflection Probe to generate cubemap",
  descriptionJa: "Reflection Probeをベイクしてキューブマップを生成",
  category: "reflectionprobe",
  inputSchema: z.object({ objectName: z.string() }),
  handler: async (p) => {
    const r = await unityBridge.send("ProbeBake", p);
    return r ? { success: true, message: `Probe baked: ${p.objectName}`, data: r }
             : { success: false, message: "Failed to bake probe" };
  }
};

const probeRemove: ToolDefinition = {
  id: "probe_remove",
  name: "Remove Reflection Probe",
  description: "Remove a Reflection Probe from the scene",
  descriptionJa: "シーンからReflection Probeを除去",
  category: "reflectionprobe",
  inputSchema: z.object({ objectName: z.string() }),
  handler: async (p) => {
    const r = await unityBridge.send("ProbeRemove", p);
    return r ? { success: true, message: `Probe removed: ${p.objectName}`, data: r }
             : { success: false, message: "Failed to remove probe" };
  }
};

export const reflectionProbeTools: ToolDefinition[] = [
  probeCreate, probeSetSize, probeSetResolution,
  probeSetIntensity, probeBake, probeRemove
];