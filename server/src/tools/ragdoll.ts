import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const ragdollCreate: ToolDefinition = {
  id: "ragdoll_create",
  name: "Create Ragdoll",
  description: "Generate a ragdoll setup on a humanoid character",
  descriptionJa: "ヒューマノイドキャラクターにラグドールを生成",
  category: "ragdoll",
  inputSchema: z.object({ objectName: z.string(), totalMass: z.number().default(70) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "RagdollCreate", p, { successMessage: (_, p) => `Ragdoll created on ${p.objectName}` });
  }
};

const ragdollEnable: ToolDefinition = {
  id: "ragdoll_enable",
  name: "Enable Ragdoll",
  description: "Enable or disable ragdoll physics on a character",
  descriptionJa: "キャラクターのラグドール物理を有効/無効にする",
  category: "ragdoll",
  inputSchema: z.object({ objectName: z.string(), enabled: z.boolean().default(true) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "RagdollEnable", p, { successMessage: (_, p) => `Ragdoll ${p.enabled ? "enabled" : "disabled"} on ${p.objectName}` });
  }
};

const ragdollSetJointLimits: ToolDefinition = {
  id: "ragdoll_set_joint_limits",
  name: "Set Ragdoll Joint Limits",
  description: "Adjust joint limits on a ragdoll bone",
  descriptionJa: "ラグドールボーンのジョイント制限を調整",
  category: "ragdoll",
  inputSchema: z.object({ objectName: z.string(), boneName: z.string(), lowTwist: z.number().default(-20), highTwist: z.number().default(20), swing1: z.number().default(30), swing2: z.number().default(30) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "RagdollSetJointLimits", p, { successMessage: (_, p) => `Joint limits set on ${p.boneName}` });
  }
};

const ragdollAddForce: ToolDefinition = {
  id: "ragdoll_add_force",
  name: "Add Force to Ragdoll",
  description: "Apply a force to a specific ragdoll bone",
  descriptionJa: "特定のラグドールボーンに力を加える",
  category: "ragdoll",
  inputSchema: z.object({ objectName: z.string(), boneName: z.string(), forceX: z.number(), forceY: z.number(), forceZ: z.number(), mode: z.enum(["Force","Impulse","VelocityChange"]).default("Impulse") }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "RagdollAddForce", p, { successMessage: (_, p) => `Force applied to ${p.boneName}` });
  }
};

const ragdollSetCollision: ToolDefinition = {
  id: "ragdoll_set_collision",
  name: "Set Ragdoll Collision",
  description: "Configure collision detection mode for ragdoll rigidbodies",
  descriptionJa: "ラグドールRigidbodyの衝突検出モードを設定",
  category: "ragdoll",
  inputSchema: z.object({ objectName: z.string(), mode: z.enum(["Discrete","Continuous","ContinuousDynamic","ContinuousSpeculative"]).default("Continuous") }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "RagdollSetCollision", p, { successMessage: (_, p) => `Collision mode set to ${p.mode}` });
  }
};

const ragdollRemove: ToolDefinition = {
  id: "ragdoll_remove",
  name: "Remove Ragdoll",
  description: "Remove all ragdoll components from a character",
  descriptionJa: "キャラクターから全てのラグドールコンポーネントを除去",
  category: "ragdoll",
  inputSchema: z.object({ objectName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "RagdollRemove", p, { successMessage: (_, p) => `Ragdoll removed from ${p.objectName}` });
  }
};

export const ragdollTools: ToolDefinition[] = [
  ragdollCreate, ragdollEnable, ragdollSetJointLimits,
  ragdollAddForce, ragdollSetCollision, ragdollRemove
];