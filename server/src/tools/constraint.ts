import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
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
    return bridgeSendAsToolResult("unity", "ConstraintPosition", params, { successMessage: (_, params) => `PositionConstraint added to ${params.name} -> ${params.sourceName}` });
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
    return bridgeSendAsToolResult("unity", "ConstraintRotation", params, { successMessage: (_, params) => `RotationConstraint added to ${params.name} -> ${params.sourceName}` });
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
    return bridgeSendAsToolResult("unity", "ConstraintScale", params, { successMessage: (_, params) => `ScaleConstraint added to ${params.name} -> ${params.sourceName}` });
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
    return bridgeSendAsToolResult("unity", "ConstraintAim", params, { successMessage: (_, params) => `AimConstraint added to ${params.name} -> ${params.sourceName}` });
  }
};

export const constraintTools: ToolDefinition[] = [constraintPosition, constraintRotation, constraintScale, constraintAim];