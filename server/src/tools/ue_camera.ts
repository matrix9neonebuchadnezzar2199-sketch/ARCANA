import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const ueCameraCreate: ToolDefinition = {
  id: "ue_camera_create", name: "Create Camera",
  description: "Spawn a CameraActor in the level",
  descriptionJa: "レベルにCameraActorをスポーン",
  category: "ue_camera",
  inputSchema: z.object({ name: z.string().optional(), x: z.number().default(0), y: z.number().default(0), z: z.number().default(200), fov: z.number().default(90) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "CameraCreate", p, { successMessage: "Camera created" }) }
};

const ueCameraSetFov: ToolDefinition = {
  id: "ue_camera_set_fov", name: "Set Camera FOV",
  description: "Set the field of view of a camera",
  descriptionJa: "カメラの視野角を設定",
  category: "ue_camera",
  inputSchema: z.object({ actorName: z.string(), fov: z.number().default(90) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "CameraSetFov", p, { successMessage: (_, p) => `FOV set to ${p.fov}` }) }
};

const ueCameraSetActive: ToolDefinition = {
  id: "ue_camera_set_active", name: "Set Active Camera",
  description: "Set a camera as the active viewport camera",
  descriptionJa: "カメラをアクティブビューポートカメラに設定",
  category: "ue_camera",
  inputSchema: z.object({ actorName: z.string() }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "CameraSetActive", p, { successMessage: (_, p) => `Active camera: ${p.actorName}` }) }
};

const ueCameraSetPostProcess: ToolDefinition = {
  id: "ue_camera_set_postprocess", name: "Set Camera Post Process",
  description: "Configure post-process settings on a camera",
  descriptionJa: "カメラのポストプロセス設定を変更",
  category: "ue_camera",
  inputSchema: z.object({ actorName: z.string(), bloom: z.number().default(0.675), exposure: z.number().default(1), motionBlur: z.number().default(0.5), dofFocalDistance: z.number().optional() }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "CameraSetPostProcess", p, { successMessage: (_, p) => `Post-process set on ${p.actorName}` }) }
};

const ueCameraSetAspectRatio: ToolDefinition = {
  id: "ue_camera_set_aspect", name: "Set Camera Aspect Ratio",
  description: "Set the aspect ratio constraint of a camera",
  descriptionJa: "カメラのアスペクト比制約を設定",
  category: "ue_camera",
  inputSchema: z.object({ actorName: z.string(), aspectRatio: z.number().default(1.777), constrainAspect: z.boolean().default(true) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "CameraSetAspect", p, { successMessage: (_, p) => `Aspect ratio set to ${p.aspectRatio}` }) }
};

const ueCameraLookAt: ToolDefinition = {
  id: "ue_camera_look_at", name: "Camera Look At",
  description: "Point a camera to look at a target position",
  descriptionJa: "カメラをターゲット位置に向ける",
  category: "ue_camera",
  inputSchema: z.object({ actorName: z.string(), targetX: z.number(), targetY: z.number(), targetZ: z.number() }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "CameraLookAt", p, { successMessage: (_, p) => `Camera looking at (${p.targetX},${p.targetY},${p.targetZ})` }) }
};

export const ueCameraTools: ToolDefinition[] = [
  ueCameraCreate, ueCameraSetFov, ueCameraSetActive,
  ueCameraSetPostProcess, ueCameraSetAspectRatio, ueCameraLookAt
];