import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
export const transformSetPosition: ToolDefinition = {
  id: "transform_set_position",
  name: "Set Position",
  description: "Set the world position of a GameObject",
  descriptionJa: "GameObjectのワールド座標を設定",
  category: "transform",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    x: z.number().describe("X position"),
    y: z.number().describe("Y position"),
    z: z.number().describe("Z position")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "TransformSetPosition", params, { successMessage: (_, params) => `Moved ${params.name} to (${params.x}, ${params.y}, ${params.z})` });
  }
};

export const transformSetRotation: ToolDefinition = {
  id: "transform_set_rotation",
  name: "Set Rotation",
  description: "Set the rotation of a GameObject in euler angles",
  descriptionJa: "GameObjectの回転をオイラー角で設定",
  category: "transform",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    x: z.number().describe("X rotation in degrees"),
    y: z.number().describe("Y rotation in degrees"),
    z: z.number().describe("Z rotation in degrees")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "TransformSetRotation", params, { successMessage: (_, params) => `Rotated ${params.name} to (${params.x}, ${params.y}, ${params.z})` });
  }
};

export const transformSetScale: ToolDefinition = {
  id: "transform_set_scale",
  name: "Set Scale",
  description: "Set the local scale of a GameObject",
  descriptionJa: "GameObjectのローカルスケールを設定",
  category: "transform",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    x: z.number().describe("X scale"),
    y: z.number().describe("Y scale"),
    z: z.number().describe("Z scale")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "TransformSetScale", params, { successMessage: (_, params) => `Scaled ${params.name} to (${params.x}, ${params.y}, ${params.z})` });
  }
};

export const transformSetParent: ToolDefinition = {
  id: "transform_set_parent",
  name: "Set Parent",
  description: "Set the parent of a GameObject",
  descriptionJa: "GameObjectの親オブジェクトを設定",
  category: "transform",
  inputSchema: z.object({
    childName: z.string().describe("Child GameObject name"),
    parentName: z.string().describe("Parent GameObject name, or empty to unparent")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "TransformSetParent", params, { successMessage: (_, params) => `Set parent of ${params.childName} to ${params.parentName}` });
  }
};

export const transformLookAt: ToolDefinition = {
  id: "transform_look_at",
  name: "Look At",
  description: "Make a GameObject look at a target position",
  descriptionJa: "GameObjectを指定座標の方向に向ける",
  category: "transform",
  inputSchema: z.object({
    name: z.string().describe("GameObject name"),
    targetX: z.number().describe("Target X position"),
    targetY: z.number().describe("Target Y position"),
    targetZ: z.number().describe("Target Z position")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "TransformLookAt", params, { successMessage: (_, params) => `${params.name} now looks at (${params.targetX}, ${params.targetY}, ${params.targetZ})` });
  }
};

export const transformTools = [
  transformSetPosition,
  transformSetRotation,
  transformSetScale,
  transformSetParent,
  transformLookAt
];