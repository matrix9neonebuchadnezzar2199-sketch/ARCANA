import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
export const cinemachineTools: ToolDefinition[] = [
  {
    id: "cinemachine_create_virtual_camera",
    name: "Create Virtual Camera",
    description: "Create a Cinemachine virtual camera with specified settings",
    descriptionJa: "指定設定でCinemachineバーチャルカメラを作成",
    category: "Cinemachine",
    inputSchema: z.object({
      name: z.string().describe("Camera name"),
      follow: z.string().optional().describe("Target object to follow"),
      lookAt: z.string().optional().describe("Target object to look at"),
      lens: z.number().optional().describe("Field of view"),
      bodyType: z.enum(["Transposer", "FramingTransposer", "OrbitalTransposer", "TrackedDolly", "HardLockToTarget"]).optional().describe("Body type"),
      priority: z.number().optional().describe("Camera priority"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "CinemachineCreateVirtualCamera", params, { successMessage: (_, params) => `Virtual camera "${params.name}" created` });
    },
  },
  {
    id: "cinemachine_create_free_look",
    name: "Create FreeLook Camera",
    description: "Create a Cinemachine FreeLook camera with 3-rig orbital setup",
    descriptionJa: "3リグ軌道設定のCinemachine FreeLookカメラを作成",
    category: "Cinemachine",
    inputSchema: z.object({
      name: z.string().describe("Camera name"),
      follow: z.string().optional().describe("Target to follow"),
      lookAt: z.string().optional().describe("Target to look at"),
      topRigHeight: z.number().optional().describe("Top rig height"),
      topRigRadius: z.number().optional().describe("Top rig radius"),
      middleRigHeight: z.number().optional().describe("Middle rig height"),
      middleRigRadius: z.number().optional().describe("Middle rig radius"),
      bottomRigHeight: z.number().optional().describe("Bottom rig height"),
      bottomRigRadius: z.number().optional().describe("Bottom rig radius"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "CinemachineCreateFreeLook", params, { successMessage: (_, params) => `FreeLook camera "${params.name}" created` });
    },
  },
  {
    id: "cinemachine_set_blend",
    name: "Set Camera Blend",
    description: "Configure blend settings between two virtual cameras",
    descriptionJa: "2つのバーチャルカメラ間のブレンド設定を構成",
    category: "Cinemachine",
    inputSchema: z.object({
      fromCamera: z.string().describe("Source camera name"),
      toCamera: z.string().describe("Target camera name"),
      blendTime: z.number().describe("Blend duration in seconds"),
      style: z.enum(["EaseInOut", "EaseIn", "EaseOut", "HardIn", "HardOut", "Linear", "Cut"]).optional().describe("Blend curve style"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "CinemachineSetBlend", params, { successMessage: (_, params) => `Blend set: ${params.fromCamera} -> ${params.toCamera} (${params.blendTime}s)` });
    },
  },
  {
    id: "cinemachine_create_dolly_track",
    name: "Create Dolly Track",
    description: "Create a Cinemachine dolly track with waypoints",
    descriptionJa: "ウェイポイント付きのCinemachineドリートラックを作成",
    category: "Cinemachine",
    inputSchema: z.object({
      name: z.string().describe("Track name"),
      waypoints: z.array(z.object({
        x: z.number(), y: z.number(), z: z.number(),
        roll: z.number().optional(),
      })).describe("Array of waypoint positions"),
      looped: z.boolean().optional().describe("Whether the track loops"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "CinemachineCreateDollyTrack", params, { successMessage: (_, params) => `Dolly track "${params.name}" created with ${params.waypoints.length} waypoints` });
    },
  },
  {
    id: "cinemachine_set_noise",
    name: "Set Camera Noise",
    description: "Apply procedural noise profile to a virtual camera for handheld effect",
    descriptionJa: "バーチャルカメラに手持ちエフェクト用のプロシージャルノイズを適用",
    category: "Cinemachine",
    inputSchema: z.object({
      cameraName: z.string().describe("Target virtual camera name"),
      profile: z.enum(["HandheldNormal", "HandheldTele", "HandheldWide", "6DShake", "Gentle"]).describe("Noise profile preset"),
      amplitudeGain: z.number().optional().describe("Amplitude multiplier"),
      frequencyGain: z.number().optional().describe("Frequency multiplier"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "CinemachineSetNoise", params, { successMessage: (_, params) => `Noise "${params.profile}" applied to "${params.cameraName}"` });
    },
  },
  {
    id: "cinemachine_set_confiner",
    name: "Set Camera Confiner",
    description: "Add confiner extension to keep camera within a bounding volume",
    descriptionJa: "カメラをバウンディングボリューム内に制限するコンファイナーを追加",
    category: "Cinemachine",
    inputSchema: z.object({
      cameraName: z.string().describe("Target virtual camera name"),
      boundsObjectName: z.string().describe("Object with Collider/Collider2D to use as bounds"),
      damping: z.number().optional().describe("Damping when pushing camera back"),
      is2D: z.boolean().optional().describe("Use 2D confiner mode"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "CinemachineSetConfiner", params, { successMessage: (_, params) => `Confiner set on "${params.cameraName}" bounded by "${params.boundsObjectName}"` });
    },
  },
  {
    id: "cinemachine_set_priority",
    name: "Set Camera Priority",
    description: "Change the priority of a virtual camera to control which is active",
    descriptionJa: "バーチャルカメラの優先度を変更してアクティブカメラを制御",
    category: "Cinemachine",
    inputSchema: z.object({
      cameraName: z.string().describe("Virtual camera name"),
      priority: z.number().describe("New priority value (higher = more likely active)"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "CinemachineSetPriority", params, { successMessage: (_, params) => `Priority of "${params.cameraName}" set to ${params.priority}` });
    },
  },
  {
    id: "cinemachine_create_camera_trigger",
    name: "Create Camera Trigger Zone",
    description: "Create a trigger volume that activates a virtual camera when player enters",
    descriptionJa: "プレイヤー進入時にバーチャルカメラを有効化するトリガーゾーンを作成",
    category: "Cinemachine",
    inputSchema: z.object({
      name: z.string().describe("Trigger zone name"),
      cameraName: z.string().describe("Virtual camera to activate"),
      position: z.object({ x: z.number(), y: z.number(), z: z.number() }).describe("Trigger position"),
      size: z.object({ x: z.number(), y: z.number(), z: z.number() }).describe("Trigger box size"),
      activationPriority: z.number().optional().describe("Priority when activated"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "CinemachineCreateCameraTrigger", params, { successMessage: (_, params) => `Camera trigger "${params.name}" created for "${params.cameraName}"` });
    },
  },
];