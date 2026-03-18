import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const ragdollCreate: ToolDefinition = {
  id: "ragdoll_create",
  name: "Create Ragdoll",
  description: "Generate a ragdoll setup on a humanoid character",
  descriptionJa: "ヒューマノイドキャラクターにラグドールを生成",
  category: "ragdoll",
  inputSchema: z.object({ objectName: z.string(), totalMass: z.number().default(70) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "RagdollCreate", p);
      return r ? { success: true, message: `Ragdoll created on ${p.objectName}`, data: r }
               : { success: false, message: "Failed to create ragdoll" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "RagdollEnable", p);
      return r ? { success: true, message: `Ragdoll ${p.enabled ? "enabled" : "disabled"} on ${p.objectName}`, data: r }
               : { success: false, message: "Failed to toggle ragdoll" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "RagdollSetJointLimits", p);
      return r ? { success: true, message: `Joint limits set on ${p.boneName}`, data: r }
               : { success: false, message: "Failed to set joint limits" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "RagdollAddForce", p);
      return r ? { success: true, message: `Force applied to ${p.boneName}`, data: r }
               : { success: false, message: "Failed to add force" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "RagdollSetCollision", p);
      return r ? { success: true, message: `Collision mode set to ${p.mode}`, data: r }
               : { success: false, message: "Failed to set collision mode" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "RagdollRemove", p);
      return r ? { success: true, message: `Ragdoll removed from ${p.objectName}`, data: r }
               : { success: false, message: "Failed to remove ragdoll" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

export const ragdollTools: ToolDefinition[] = [
  ragdollCreate, ragdollEnable, ragdollSetJointLimits,
  ragdollAddForce, ragdollSetCollision, ragdollRemove
];