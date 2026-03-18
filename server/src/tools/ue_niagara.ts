import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unrealBridge } from "../bridge/unreal-bridge";

const ueNiagaraCreate: ToolDefinition = {
  id: "ue_niagara_create", name: "Create Niagara System",
  description: "Create a new Niagara particle system in the level",
  descriptionJa: "レベルに新しいNiagaraパーティクルシステムを作成",
  category: "ue_niagara",
  inputSchema: z.object({ name: z.string().optional(), template: z.string().optional(), x: z.number().default(0), y: z.number().default(0), z: z.number().default(0) }),
  handler: async (p) => { const r = await unrealBridge.send("NiagaraCreate", p); return r ? { success: true, message: "Niagara system created", data: r } : { success: false, message: "Failed" }; }
};

const ueNiagaraSetParam: ToolDefinition = {
  id: "ue_niagara_set_param", name: "Set Niagara Parameter",
  description: "Set a user parameter on a Niagara system",
  descriptionJa: "Niagaraシステムのユーザーパラメータを設定",
  category: "ue_niagara",
  inputSchema: z.object({ actorName: z.string(), paramName: z.string(), value: z.any() }),
  handler: async (p) => { const r = await unrealBridge.send("NiagaraSetParam", p); return r ? { success: true, message: `Param ${p.paramName} set`, data: r } : { success: false, message: "Failed" }; }
};

const ueNiagaraSetSpawnRate: ToolDefinition = {
  id: "ue_niagara_set_spawn_rate", name: "Set Spawn Rate",
  description: "Set the particle spawn rate",
  descriptionJa: "パーティクルのスポーンレートを設定",
  category: "ue_niagara",
  inputSchema: z.object({ actorName: z.string(), rate: z.number().default(100) }),
  handler: async (p) => { const r = await unrealBridge.send("NiagaraSetSpawnRate", p); return r ? { success: true, message: `Spawn rate set to ${p.rate}`, data: r } : { success: false, message: "Failed" }; }
};

const ueNiagaraSetLifetime: ToolDefinition = {
  id: "ue_niagara_set_lifetime", name: "Set Particle Lifetime",
  description: "Set the lifetime of particles",
  descriptionJa: "パーティクルの寿命を設定",
  category: "ue_niagara",
  inputSchema: z.object({ actorName: z.string(), min: z.number().default(1), max: z.number().default(3) }),
  handler: async (p) => { const r = await unrealBridge.send("NiagaraSetLifetime", p); return r ? { success: true, message: `Lifetime: ${p.min}-${p.max}s`, data: r } : { success: false, message: "Failed" }; }
};

const ueNiagaraSetColor: ToolDefinition = {
  id: "ue_niagara_set_color", name: "Set Particle Color",
  description: "Set the color of Niagara particles",
  descriptionJa: "Niagaraパーティクルの色を設定",
  category: "ue_niagara",
  inputSchema: z.object({ actorName: z.string(), r: z.number().default(1), g: z.number().default(1), b: z.number().default(1), a: z.number().default(1) }),
  handler: async (p) => { const r = await unrealBridge.send("NiagaraSetColor", p); return r ? { success: true, message: "Particle color set", data: r } : { success: false, message: "Failed" }; }
};

const ueNiagaraActivate: ToolDefinition = {
  id: "ue_niagara_activate", name: "Activate/Deactivate Niagara",
  description: "Activate or deactivate a Niagara system",
  descriptionJa: "Niagaraシステムを有効化/無効化",
  category: "ue_niagara",
  inputSchema: z.object({ actorName: z.string(), active: z.boolean().default(true) }),
  handler: async (p) => { const r = await unrealBridge.send("NiagaraActivate", p); return r ? { success: true, message: `Niagara ${p.active ? "activated" : "deactivated"}`, data: r } : { success: false, message: "Failed" }; }
};

export const ueNiagaraTools: ToolDefinition[] = [
  ueNiagaraCreate, ueNiagaraSetParam, ueNiagaraSetSpawnRate,
  ueNiagaraSetLifetime, ueNiagaraSetColor, ueNiagaraActivate
];