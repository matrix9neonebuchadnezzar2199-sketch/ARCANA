import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const clothAdd: ToolDefinition = {
  id: "cloth_add",
  name: "Add Cloth Component",
  description: "Add a Cloth component to a skinned mesh",
  descriptionJa: "スキンメッシュにClothコンポーネントを追加",
  category: "cloth",
  inputSchema: z.object({ objectName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "ClothAdd", p, { successMessage: (_, p) => `Cloth added to ${p.objectName}` });
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
    return bridgeSendAsToolResult("unity", "ClothSetParams", p, { successMessage: (_, p) => `Cloth params updated on ${p.objectName}` });
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
    return bridgeSendAsToolResult("unity", "ClothSetGravity", p, { successMessage: (_, p) => `Cloth gravity set on ${p.objectName}` });
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
    return bridgeSendAsToolResult("unity", "ClothAddCollider", p, { successMessage: (_, p) => `Cloth collider added from ${p.colliderObject}` });
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
    return bridgeSendAsToolResult("unity", "ClothRemove", p, { successMessage: (_, p) => `Cloth removed from ${p.objectName}` });
  }
};

export const clothTools: ToolDefinition[] = [
  clothAdd, clothSetParams, clothSetGravity, clothAddCollider, clothRemove
];