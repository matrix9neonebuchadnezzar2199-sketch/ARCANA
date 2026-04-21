import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const probeCreate: ToolDefinition = {
  id: "probe_create",
  name: "Create Reflection Probe",
  description: "Create a Reflection Probe in the scene",
  descriptionJa: "シーンにReflection Probeを作成",
  category: "reflectionprobe",
  inputSchema: z.object({ name: z.string().optional(), x: z.number().default(0), y: z.number().default(1), z: z.number().default(0), mode: z.enum(["Baked","Realtime","Custom"]).default("Baked") }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "ProbeCreate", p, { successMessage: (_, p) => `Reflection Probe created: ${p.name ?? "NewProbe"}` });
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
    return bridgeSendAsToolResult("unity", "ProbeSetSize", p, { successMessage: (_, p) => `Probe size set on ${p.objectName}` });
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
    return bridgeSendAsToolResult("unity", "ProbeSetResolution", p, { successMessage: (_, p) => `Probe resolution set to ${p.resolution}` });
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
    return bridgeSendAsToolResult("unity", "ProbeSetIntensity", p, { successMessage: (_, p) => `Probe intensity set to ${p.intensity}` });
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
    return bridgeSendAsToolResult("unity", "ProbeBake", p, { successMessage: (_, p) => `Probe baked: ${p.objectName}` });
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
    return bridgeSendAsToolResult("unity", "ProbeRemove", p, { successMessage: (_, p) => `Probe removed: ${p.objectName}` });
  }
};

export const reflectionProbeTools: ToolDefinition[] = [
  probeCreate, probeSetSize, probeSetResolution,
  probeSetIntensity, probeBake, probeRemove
];