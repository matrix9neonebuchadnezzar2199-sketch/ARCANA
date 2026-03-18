import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unrealBridge } from "../bridge/unreal-bridge";

export const ueNiagaraTools: ToolDefinition[] = [
  {
    id: "ue_niagara_create_system",
    name: "Create Niagara System",
    description: "Create a new Niagara particle system from a template or empty",
    descriptionJa: "テンプレートまたは空のNiagaraパーティクルシステムを作成",
    category: "UE_Niagara",
    inputSchema: z.object({
      name: z.string().describe("System asset name"),
      template: z.enum(["Empty", "Fountain", "Beam", "MeshRenderer", "SpriteRenderer", "RibbonRenderer", "GPUCompute"]).optional().describe("Starting template"),
      path: z.string().optional().describe("Content path (e.g. /Game/VFX/)"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("NiagaraCreateSystem", params);
      return { success: true, message: `Niagara system "${params.name}" created`, data: result };
    },
  },
  {
    id: "ue_niagara_add_emitter",
    name: "Add Niagara Emitter",
    description: "Add an emitter to an existing Niagara system",
    descriptionJa: "既存のNiagaraシステムにエミッターを追加",
    category: "UE_Niagara",
    inputSchema: z.object({
      systemName: z.string().describe("Target Niagara system name"),
      emitterName: z.string().describe("New emitter name"),
      emitterTemplate: z.string().optional().describe("Emitter template to base from"),
      simulationSpace: z.enum(["Local", "World"]).optional().describe("Simulation space"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("NiagaraAddEmitter", params);
      return { success: true, message: `Emitter "${params.emitterName}" added to "${params.systemName}"`, data: result };
    },
  },
  {
    id: "ue_niagara_set_spawn_rate",
    name: "Set Spawn Rate",
    description: "Set the particle spawn rate for a Niagara emitter",
    descriptionJa: "Niagaraエミッターのパーティクルスポーンレートを設定",
    category: "UE_Niagara",
    inputSchema: z.object({
      systemName: z.string().describe("Target Niagara system"),
      emitterName: z.string().describe("Target emitter"),
      spawnRate: z.number().describe("Particles per second"),
      burstCount: z.number().optional().describe("Burst spawn count (0 = continuous)"),
      burstDelay: z.number().optional().describe("Delay before burst in seconds"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("NiagaraSetSpawnRate", params);
      return { success: true, message: `Spawn rate set to ${params.spawnRate}/s on "${params.emitterName}"`, data: result };
    },
  },
  {
    id: "ue_niagara_set_lifetime",
    name: "Set Particle Lifetime",
    description: "Set particle lifetime range for a Niagara emitter",
    descriptionJa: "Niagaraエミッターのパーティクル寿命範囲を設定",
    category: "UE_Niagara",
    inputSchema: z.object({
      systemName: z.string().describe("Target Niagara system"),
      emitterName: z.string().describe("Target emitter"),
      lifetimeMin: z.number().describe("Minimum lifetime in seconds"),
      lifetimeMax: z.number().describe("Maximum lifetime in seconds"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("NiagaraSetLifetime", params);
      return { success: true, message: `Lifetime set to ${params.lifetimeMin}-${params.lifetimeMax}s on "${params.emitterName}"`, data: result };
    },
  },
  {
    id: "ue_niagara_set_velocity",
    name: "Set Initial Velocity",
    description: "Set initial velocity range for particles in a Niagara emitter",
    descriptionJa: "Niagaraエミッターのパーティクル初速範囲を設定",
    category: "UE_Niagara",
    inputSchema: z.object({
      systemName: z.string().describe("Target Niagara system"),
      emitterName: z.string().describe("Target emitter"),
      velocityMin: z.object({ x: z.number(), y: z.number(), z: z.number() }).describe("Minimum velocity"),
      velocityMax: z.object({ x: z.number(), y: z.number(), z: z.number() }).describe("Maximum velocity"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("NiagaraSetVelocity", params);
      return { success: true, message: `Velocity set on "${params.emitterName}"`, data: result };
    },
  },
  {
    id: "ue_niagara_set_size",
    name: "Set Particle Size",
    description: "Set particle size or size curve over lifetime",
    descriptionJa: "パーティクルサイズまたはライフタイムに沿ったサイズカーブを設定",
    category: "UE_Niagara",
    inputSchema: z.object({
      systemName: z.string().describe("Target Niagara system"),
      emitterName: z.string().describe("Target emitter"),
      sizeMin: z.number().optional().describe("Minimum size (uniform)"),
      sizeMax: z.number().optional().describe("Maximum size (uniform)"),
      sizeOverLife: z.array(z.object({ time: z.number(), value: z.number() })).optional().describe("Size curve over normalized lifetime"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("NiagaraSetSize", params);
      return { success: true, message: `Size configured on "${params.emitterName}"`, data: result };
    },
  },
  {
    id: "ue_niagara_set_color",
    name: "Set Particle Color",
    description: "Set particle color or color gradient over lifetime",
    descriptionJa: "パーティクルカラーまたはライフタイムに沿ったカラーグラデーションを設定",
    category: "UE_Niagara",
    inputSchema: z.object({
      systemName: z.string().describe("Target Niagara system"),
      emitterName: z.string().describe("Target emitter"),
      color: z.object({ r: z.number(), g: z.number(), b: z.number(), a: z.number().optional() }).optional().describe("Static color"),
      colorOverLife: z.array(z.object({
        time: z.number(),
        r: z.number(), g: z.number(), b: z.number(), a: z.number().optional(),
      })).optional().describe("Color gradient keyframes over normalized lifetime"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("NiagaraSetColor", params);
      return { success: true, message: `Color configured on "${params.emitterName}"`, data: result };
    },
  },
  {
    id: "ue_niagara_add_force",
    name: "Add Force Module",
    description: "Add a force module (gravity, drag, wind, curl noise) to a Niagara emitter",
    descriptionJa: "Niagaraエミッターにフォースモジュール（重力、ドラッグ、風、カールノイズ）を追加",
    category: "UE_Niagara",
    inputSchema: z.object({
      systemName: z.string().describe("Target Niagara system"),
      emitterName: z.string().describe("Target emitter"),
      forceType: z.enum(["Gravity", "Drag", "Wind", "CurlNoise", "PointAttraction", "Vortex"]).describe("Force module type"),
      strength: z.number().optional().describe("Force strength"),
      direction: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional().describe("Force direction (for Gravity, Wind)"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("NiagaraAddForce", params);
      return { success: true, message: `${params.forceType} force added to "${params.emitterName}"`, data: result };
    },
  },
  {
    id: "ue_niagara_set_renderer",
    name: "Set Renderer",
    description: "Configure the renderer type and settings for a Niagara emitter",
    descriptionJa: "Niagaraエミッターのレンダラータイプと設定を構成",
    category: "UE_Niagara",
    inputSchema: z.object({
      systemName: z.string().describe("Target Niagara system"),
      emitterName: z.string().describe("Target emitter"),
      rendererType: z.enum(["Sprite", "Mesh", "Ribbon", "Light", "Component"]).describe("Renderer type"),
      materialPath: z.string().optional().describe("Material asset path"),
      meshPath: z.string().optional().describe("Static mesh asset path (for Mesh renderer)"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("NiagaraSetRenderer", params);
      return { success: true, message: `${params.rendererType} renderer set on "${params.emitterName}"`, data: result };
    },
  },
  {
    id: "ue_niagara_spawn_system_at_location",
    name: "Spawn System at Location",
    description: "Spawn a Niagara system instance at a world location in the level",
    descriptionJa: "レベル内のワールド位置にNiagaraシステムインスタンスをスポーン",
    category: "UE_Niagara",
    inputSchema: z.object({
      systemPath: z.string().describe("Niagara system asset path"),
      location: z.object({ x: z.number(), y: z.number(), z: z.number() }).describe("World location"),
      rotation: z.object({ pitch: z.number(), yaw: z.number(), roll: z.number() }).optional().describe("Rotation"),
      scale: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional().describe("Scale"),
      autoDestroy: z.boolean().optional().describe("Auto destroy when complete"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("NiagaraSpawnAtLocation", params);
      return { success: true, message: `Niagara system spawned at (${params.location.x}, ${params.location.y}, ${params.location.z})`, data: result };
    },
  },
];