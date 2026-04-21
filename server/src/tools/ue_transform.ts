import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const ueTransformSetLocation: ToolDefinition = {
  id: "ue_transform_set_location",
  name: "Set Actor Location",
  description: "Set the world location of an actor",
  descriptionJa: "アクターのワールド座標を設定",
  category: "ue_transform",
  inputSchema: z.object({ actorName: z.string(), x: z.number(), y: z.number(), z: z.number() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unreal", "TransformSetLocation", p, { successMessage: (_, p) => `Location set on ${p.actorName}` });
  }
};

const ueTransformSetRotation: ToolDefinition = {
  id: "ue_transform_set_rotation",
  name: "Set Actor Rotation",
  description: "Set the rotation of an actor in degrees (pitch, yaw, roll)",
  descriptionJa: "アクターの回転を度数で設定（Pitch, Yaw, Roll）",
  category: "ue_transform",
  inputSchema: z.object({ actorName: z.string(), pitch: z.number().default(0), yaw: z.number().default(0), roll: z.number().default(0) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unreal", "TransformSetRotation", p, { successMessage: (_, p) => `Rotation set on ${p.actorName}` });
  }
};

const ueTransformSetScale: ToolDefinition = {
  id: "ue_transform_set_scale",
  name: "Set Actor Scale",
  description: "Set the 3D scale of an actor",
  descriptionJa: "アクターの3Dスケールを設定",
  category: "ue_transform",
  inputSchema: z.object({ actorName: z.string(), x: z.number().default(1), y: z.number().default(1), z: z.number().default(1) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unreal", "TransformSetScale", p, { successMessage: (_, p) => `Scale set on ${p.actorName}` });
  }
};

const ueTransformAttach: ToolDefinition = {
  id: "ue_transform_attach",
  name: "Attach Actor",
  description: "Attach an actor to a parent actor",
  descriptionJa: "アクターを親アクターにアタッチ",
  category: "ue_transform",
  inputSchema: z.object({ actorName: z.string(), parentName: z.string(), socketName: z.string().optional() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unreal", "TransformAttach", p, { successMessage: (_, p) => `${p.actorName} attached to ${p.parentName}` });
  }
};

const ueTransformDetach: ToolDefinition = {
  id: "ue_transform_detach",
  name: "Detach Actor",
  description: "Detach an actor from its parent",
  descriptionJa: "アクターを親からデタッチ",
  category: "ue_transform",
  inputSchema: z.object({ actorName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unreal", "TransformDetach", p, { successMessage: (_, p) => `${p.actorName} detached` });
  }
};

const ueTransformSnapToGrid: ToolDefinition = {
  id: "ue_transform_snap_to_grid",
  name: "Snap to Grid",
  description: "Snap an actor position to the grid",
  descriptionJa: "アクターの位置をグリッドにスナップ",
  category: "ue_transform",
  inputSchema: z.object({ actorName: z.string(), gridSize: z.number().default(10) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unreal", "TransformSnapToGrid", p, { successMessage: (_, p) => `${p.actorName} snapped to grid (${p.gridSize})` });
  }
};

export const ueTransformTools: ToolDefinition[] = [
  ueTransformSetLocation, ueTransformSetRotation, ueTransformSetScale,
  ueTransformAttach, ueTransformDetach, ueTransformSnapToGrid
];