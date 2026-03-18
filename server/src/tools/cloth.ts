import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const clothAdd: ToolDefinition = {
  id: "cloth_add",
  name: "Add Cloth Component",
  description: "Add a Cloth component to a skinned mesh",
  descriptionJa: "スキンメッシュにClothコンポーネントを追加",
  category: "cloth",
  inputSchema: z.object({ objectName: z.string() }),
  handler: async (p) => {
    const r = await bridge.send("unity", "ClothAdd", p);
    return r ? { success: true, message: `Cloth added to ${p.objectName}`, data: r }
             : { success: false, message: "Failed to add cloth" };
  }
};

const clothSetParams: ToolDefinition = {
  id: "cloth_set_params",
  name: "Set Cloth Parameters",
  description: "Configure cloth simulation parameters (damping, stiffness, etc.)",
  descriptionJa: "クロスシミュレーションのパラメータを設定（減衰・剛性等）",
  category: "cloth",
  inputSchema: z.object({ objectName: z.string(), damping: z.number().min(0).max(1).default(0.1), stiffness: z.number().min(0).max(1).default(0.5), stretchLimit: z.number().default(0.1), friction: z.number().min(0).max(1).default(0.5) }),
  handler: async (p) => {
    const r = await bridge.send("unity", "ClothSetParams", p);
    return r ? { success: true, message: `Cloth params updated on ${p.objectName}`, data: r }
             : { success: false, message: "Failed to set cloth params" };
  }
};

const clothSetGravity: ToolDefinition = {
  id: "cloth_set_gravity",
  name: "Set Cloth Gravity",
  description: "Set external and world gravity acceleration for cloth",
  descriptionJa: "クロスの外部重力とワールド重力加速度を設定",
  category: "cloth",
  inputSchema: z.object({ objectName: z.string(), useGravity: z.boolean().default(true), externalX: z.number().default(0), externalY: z.number().default(0), externalZ: z.number().default(0) }),
  handler: async (p) => {
    const r = await bridge.send("unity", "ClothSetGravity", p);
    return r ? { success: true, message: `Cloth gravity set on ${p.objectName}`, data: r }
             : { success: false, message: "Failed to set cloth gravity" };
  }
};

const clothAddCollider: ToolDefinition = {
  id: "cloth_add_collider",
  name: "Add Cloth Collider",
  description: "Add a sphere or capsule collider pair for cloth collision",
  descriptionJa: "クロス衝突用のスフィア/カプセルコライダーペアを追加",
  category: "cloth",
  inputSchema: z.object({ objectName: z.string(), colliderObject: z.string(), colliderType: z.enum(["sphere","capsule"]).default("sphere") }),
  handler: async (p) => {
    const r = await bridge.send("unity", "ClothAddCollider", p);
    return r ? { success: true, message: `Cloth collider added from ${p.colliderObject}`, data: r }
             : { success: false, message: "Failed to add cloth collider" };
  }
};

const clothRemove: ToolDefinition = {
  id: "cloth_remove",
  name: "Remove Cloth",
  description: "Remove the Cloth component from a GameObject",
  descriptionJa: "GameObjectからClothコンポーネントを除去",
  category: "cloth",
  inputSchema: z.object({ objectName: z.string() }),
  handler: async (p) => {
    const r = await bridge.send("unity", "ClothRemove", p);
    return r ? { success: true, message: `Cloth removed from ${p.objectName}`, data: r }
             : { success: false, message: "Failed to remove cloth" };
  }
};

export const clothTools: ToolDefinition[] = [
  clothAdd, clothSetParams, clothSetGravity, clothAddCollider, clothRemove
];