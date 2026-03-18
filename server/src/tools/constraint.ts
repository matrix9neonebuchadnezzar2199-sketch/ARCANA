import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const constraintPosition: ToolDefinition = {
  id: "constraint_position",
  name: "Add Position Constraint",
  description: "Add a PositionConstraint to follow another object",
  descriptionJa: "PositionConstraintを追加して別オブジェクトに追従させる",
  category: "constraint",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    sourceName: z.string().describe("Source object to follow"),
    weight: z.number().min(0).max(1).optional().default(1).describe("Constraint weight")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "ConstraintPosition", params);
      return { success: true, message: `PositionConstraint added to ${params.name} -> ${params.sourceName}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const constraintRotation: ToolDefinition = {
  id: "constraint_rotation",
  name: "Add Rotation Constraint",
  description: "Add a RotationConstraint to match another object rotation",
  descriptionJa: "RotationConstraintを追加して別オブジェクトの回転に合わせる",
  category: "constraint",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    sourceName: z.string().describe("Source object to follow"),
    weight: z.number().min(0).max(1).optional().default(1).describe("Constraint weight")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "ConstraintRotation", params);
      return { success: true, message: `RotationConstraint added to ${params.name} -> ${params.sourceName}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const constraintScale: ToolDefinition = {
  id: "constraint_scale",
  name: "Add Scale Constraint",
  description: "Add a ScaleConstraint to match another object scale",
  descriptionJa: "ScaleConstraintを追加して別オブジェクトのスケールに合わせる",
  category: "constraint",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    sourceName: z.string().describe("Source object to follow"),
    weight: z.number().min(0).max(1).optional().default(1).describe("Constraint weight")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "ConstraintScale", params);
      return { success: true, message: `ScaleConstraint added to ${params.name} -> ${params.sourceName}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const constraintAim: ToolDefinition = {
  id: "constraint_aim",
  name: "Add Aim Constraint",
  description: "Add an AimConstraint to always face another object",
  descriptionJa: "AimConstraintを追加して常に別オブジェクトの方を向かせる",
  category: "constraint",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    sourceName: z.string().describe("Source object to aim at"),
    weight: z.number().min(0).max(1).optional().default(1).describe("Constraint weight"),
    aimAxis: z.enum(["X", "Y", "Z", "NegX", "NegY", "NegZ"]).optional().default("Z").describe("Aim axis")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "ConstraintAim", params);
      return { success: true, message: `AimConstraint added to ${params.name} -> ${params.sourceName}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

export const constraintTools: ToolDefinition[] = [constraintPosition, constraintRotation, constraintScale, constraintAim];