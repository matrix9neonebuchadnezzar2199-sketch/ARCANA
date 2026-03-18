import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const ueTransformSetLocation: ToolDefinition = {
  id: "ue_transform_set_location",
  name: "Set Actor Location",
  description: "Set the world location of an actor",
  descriptionJa: "アクターのワールド座標を設定",
  category: "ue_transform",
  inputSchema: z.object({ actorName: z.string(), x: z.number(), y: z.number(), z: z.number() }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unreal", "TransformSetLocation", p);
      return r ? { success: true, message: `Location set on ${p.actorName}`, data: r }
               : { success: false, message: "Failed to set location" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unreal", "TransformSetRotation", p);
      return r ? { success: true, message: `Rotation set on ${p.actorName}`, data: r }
               : { success: false, message: "Failed to set rotation" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unreal", "TransformSetScale", p);
      return r ? { success: true, message: `Scale set on ${p.actorName}`, data: r }
               : { success: false, message: "Failed to set scale" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unreal", "TransformAttach", p);
      return r ? { success: true, message: `${p.actorName} attached to ${p.parentName}`, data: r }
               : { success: false, message: "Failed to attach actor" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unreal", "TransformDetach", p);
      return r ? { success: true, message: `${p.actorName} detached`, data: r }
               : { success: false, message: "Failed to detach actor" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unreal", "TransformSnapToGrid", p);
      return r ? { success: true, message: `${p.actorName} snapped to grid (${p.gridSize})`, data: r }
               : { success: false, message: "Failed to snap to grid" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

export const ueTransformTools: ToolDefinition[] = [
  ueTransformSetLocation, ueTransformSetRotation, ueTransformSetScale,
  ueTransformAttach, ueTransformDetach, ueTransformSnapToGrid
];