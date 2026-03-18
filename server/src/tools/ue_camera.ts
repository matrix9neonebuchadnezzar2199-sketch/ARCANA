import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const ueCameraCreate: ToolDefinition = {
  id: "ue_camera_create", name: "Create Camera",
  description: "Spawn a CameraActor in the level",
  descriptionJa: "レベルにCameraActorをスポーン",
  category: "ue_camera",
  inputSchema: z.object({ name: z.string().optional(), x: z.number().default(0), y: z.number().default(0), z: z.number().default(200), fov: z.number().default(90) }),
  handler: async (p) => { const r = await bridge.send("unreal", "CameraCreate", p); return r ? { success: true, message: "Camera created", data: r } : { success: false, message: "Failed" }; }
};

const ueCameraSetFov: ToolDefinition = {
  id: "ue_camera_set_fov", name: "Set Camera FOV",
  description: "Set the field of view of a camera",
  descriptionJa: "カメラの視野角を設定",
  category: "ue_camera",
  inputSchema: z.object({ actorName: z.string(), fov: z.number().default(90) }),
  handler: async (p) => { const r = await bridge.send("unreal", "CameraSetFov", p); return r ? { success: true, message: `FOV set to ${p.fov}`, data: r } : { success: false, message: "Failed" }; }
};

const ueCameraSetActive: ToolDefinition = {
  id: "ue_camera_set_active", name: "Set Active Camera",
  description: "Set a camera as the active viewport camera",
  descriptionJa: "カメラをアクティブビューポートカメラに設定",
  category: "ue_camera",
  inputSchema: z.object({ actorName: z.string() }),
  handler: async (p) => { const r = await bridge.send("unreal", "CameraSetActive", p); return r ? { success: true, message: `Active camera: ${p.actorName}`, data: r } : { success: false, message: "Failed" }; }
};

const ueCameraSetPostProcess: ToolDefinition = {
  id: "ue_camera_set_postprocess", name: "Set Camera Post Process",
  description: "Configure post-process settings on a camera",
  descriptionJa: "カメラのポストプロセス設定を変更",
  category: "ue_camera",
  inputSchema: z.object({ actorName: z.string(), bloom: z.number().default(0.675), exposure: z.number().default(1), motionBlur: z.number().default(0.5), dofFocalDistance: z.number().optional() }),
  handler: async (p) => { const r = await bridge.send("unreal", "CameraSetPostProcess", p); return r ? { success: true, message: `Post-process set on ${p.actorName}`, data: r } : { success: false, message: "Failed" }; }
};

const ueCameraSetAspectRatio: ToolDefinition = {
  id: "ue_camera_set_aspect", name: "Set Camera Aspect Ratio",
  description: "Set the aspect ratio constraint of a camera",
  descriptionJa: "カメラのアスペクト比制約を設定",
  category: "ue_camera",
  inputSchema: z.object({ actorName: z.string(), aspectRatio: z.number().default(1.777), constrainAspect: z.boolean().default(true) }),
  handler: async (p) => { const r = await bridge.send("unreal", "CameraSetAspect", p); return r ? { success: true, message: `Aspect ratio set to ${p.aspectRatio}`, data: r } : { success: false, message: "Failed" }; }
};

const ueCameraLookAt: ToolDefinition = {
  id: "ue_camera_look_at", name: "Camera Look At",
  description: "Point a camera to look at a target position",
  descriptionJa: "カメラをターゲット位置に向ける",
  category: "ue_camera",
  inputSchema: z.object({ actorName: z.string(), targetX: z.number(), targetY: z.number(), targetZ: z.number() }),
  handler: async (p) => { const r = await bridge.send("unreal", "CameraLookAt", p); return r ? { success: true, message: `Camera looking at (${p.targetX},${p.targetY},${p.targetZ})`, data: r } : { success: false, message: "Failed" }; }
};

export const ueCameraTools: ToolDefinition[] = [
  ueCameraCreate, ueCameraSetFov, ueCameraSetActive,
  ueCameraSetPostProcess, ueCameraSetAspectRatio, ueCameraLookAt
];