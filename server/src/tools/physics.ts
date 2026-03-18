import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
export const physicsAddRigidbody: ToolDefinition = {
  id: "physics_add_rigidbody",
  name: "Add Rigidbody",
  description: "Add a Rigidbody component to a GameObject",
  descriptionJa: "GameObjectにRigidbodyコンポーネントを追加",
  category: "physics",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    mass: z.number().optional().describe("Mass in kg, default 1"),
    useGravity: z.boolean().optional().describe("Use gravity, default true"),
    isKinematic: z.boolean().optional().describe("Is kinematic, default false")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "PhysicsAddRigidbody", params);
      return { success: true, message: `Added Rigidbody to ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const physicsAddCollider: ToolDefinition = {
  id: "physics_add_collider",
  name: "Add Collider",
  description: "Add a collider component to a GameObject",
  descriptionJa: "GameObjectにコライダーコンポーネントを追加",
  category: "physics",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    type: z.enum(["Box", "Sphere", "Capsule", "Mesh"]).describe("Collider type"),
    isTrigger: z.boolean().optional().describe("Is trigger, default false")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "PhysicsAddCollider", params);
      return { success: true, message: `Added ${params.type} collider to ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const physicsSetGravity: ToolDefinition = {
  id: "physics_set_gravity",
  name: "Set Scene Gravity",
  description: "Set the global gravity for the physics simulation",
  descriptionJa: "物理シミュレーションのグローバル重力を設定",
  category: "physics",
  inputSchema: z.object({
    x: z.number().optional().describe("Gravity X, default 0"),
    y: z.number().describe("Gravity Y, default -9.81"),
    z: z.number().optional().describe("Gravity Z, default 0")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "PhysicsSetGravity", params);
      return { success: true, message: `Set gravity to (${params.x || 0}, ${params.y}, ${params.z || 0})`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const physicsTools = [
  physicsAddRigidbody,
  physicsAddCollider,
  physicsSetGravity
];