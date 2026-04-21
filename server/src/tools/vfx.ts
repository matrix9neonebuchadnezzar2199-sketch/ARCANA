import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
export const vfxCreateParticle: ToolDefinition = {
  id: "vfx_create_particle",
  name: "Create Particle System",
  description: "Create a new particle system in the scene",
  descriptionJa: "シーンに新しいパーティクルシステムを作成",
  category: "vfx",
  inputSchema: z.object({
    name: z.string().describe("Particle system name"),
    x: z.number().optional().describe("X position"),
    y: z.number().optional().describe("Y position"),
    z: z.number().optional().describe("Z position"),
    maxParticles: z.number().optional().describe("Max particles, default 1000")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "VFXCreateParticle", params, { successMessage: (_, params) => `Created particle system: ${params.name}` });
  }
};

export const vfxSetColor: ToolDefinition = {
  id: "vfx_set_color",
  name: "Set Particle Color",
  description: "Set the start color of a particle system",
  descriptionJa: "パーティクルシステムの開始色を設定",
  category: "vfx",
  inputSchema: z.object({
    name: z.string().describe("Particle system GameObject name"),
    color: z.string().describe("Color as hex string")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "VFXSetColor", params, { successMessage: (_, params) => `Set particle color of ${params.name} to ${params.color}` });
  }
};

export const vfxSetSpeed: ToolDefinition = {
  id: "vfx_set_speed",
  name: "Set Particle Speed",
  description: "Set the start speed and lifetime of a particle system",
  descriptionJa: "パーティクルの初速と寿命を設定",
  category: "vfx",
  inputSchema: z.object({
    name: z.string().describe("Particle system GameObject name"),
    startSpeed: z.number().describe("Start speed"),
    startLifetime: z.number().optional().describe("Start lifetime in seconds, default 5")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "VFXSetSpeed", params, { successMessage: (_, params) => `Set particle speed of ${params.name} to ${params.startSpeed}` });
  }
};

export const vfxSetShape: ToolDefinition = {
  id: "vfx_set_shape",
  name: "Set Particle Shape",
  description: "Set the emission shape of a particle system",
  descriptionJa: "パーティクルの放出形状を設定",
  category: "vfx",
  inputSchema: z.object({
    name: z.string().describe("Particle system GameObject name"),
    shape: z.enum(["Sphere", "Hemisphere", "Cone", "Box", "Circle", "Edge"]).describe("Emission shape"),
    radius: z.number().optional().describe("Shape radius, default 1")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "VFXSetShape", params, { successMessage: (_, params) => `Set particle shape of ${params.name} to ${params.shape}` });
  }
};

export const vfxTools = [
  vfxCreateParticle,
  vfxSetColor,
  vfxSetSpeed,
  vfxSetShape
];