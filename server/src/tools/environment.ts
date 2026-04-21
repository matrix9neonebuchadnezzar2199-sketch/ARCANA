import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
export const envSetSkybox: ToolDefinition = {
  id: "env_set_skybox",
  name: "Set Skybox",
  description: "Set the scene skybox material",
  descriptionJa: "シーンのスカイボックスマテリアルを設定",
  category: "environment",
  inputSchema: z.object({
    materialPath: z.string().describe("Skybox material path relative to Assets")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "EnvSetSkybox", params, { successMessage: (_, params) => `Set skybox to ${params.materialPath}` });
  }
};

export const envSetFog: ToolDefinition = {
  id: "env_set_fog",
  name: "Set Fog",
  description: "Configure scene fog settings",
  descriptionJa: "シーンのフォグ設定を構成",
  category: "environment",
  inputSchema: z.object({
    enabled: z.boolean().describe("Enable or disable fog"),
    color: z.string().optional().describe("Fog color as hex string"),
    mode: z.enum(["Linear", "Exponential", "ExponentialSquared"]).optional().describe("Fog mode"),
    density: z.number().optional().describe("Fog density for exponential modes"),
    startDistance: z.number().optional().describe("Start distance for linear fog"),
    endDistance: z.number().optional().describe("End distance for linear fog")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "EnvSetFog", params, { successMessage: (_, params) => `Fog ${params.enabled ? "enabled" : "disabled"}` });
  }
};

export const envSetReflection: ToolDefinition = {
  id: "env_set_reflection",
  name: "Set Environment Reflection",
  description: "Configure environment reflection settings",
  descriptionJa: "環境リフレクション設定を構成",
  category: "environment",
  inputSchema: z.object({
    source: z.enum(["Skybox", "Custom"]).optional().describe("Reflection source"),
    intensity: z.number().optional().describe("Reflection intensity 0-1"),
    bounces: z.number().optional().describe("Reflection bounces 1-5")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "EnvSetReflection", params, { successMessage: "Environment reflection updated" });
  }
};

export const environmentTools = [
  envSetSkybox,
  envSetFog,
  envSetReflection
];