import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
export const animAddAnimator: ToolDefinition = {
  id: "anim_add_animator",
  name: "Add Animator",
  description: "Add an Animator component with a controller to a GameObject",
  descriptionJa: "GameObjectにAnimatorコンポーネントとコントローラーを追加",
  category: "animation",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    controllerPath: z.string().optional().describe("Animator controller path relative to Assets")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "AnimAddAnimator", params, { successMessage: (_, params) => `Added Animator to ${params.name}` });
  }
};

export const animSetParameter: ToolDefinition = {
  id: "anim_set_parameter",
  name: "Set Animator Parameter",
  description: "Set a parameter value on an Animator",
  descriptionJa: "Animatorのパラメータ値を設定",
  category: "animation",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    paramName: z.string().describe("Parameter name"),
    paramType: z.enum(["float", "int", "bool", "trigger"]).describe("Parameter type"),
    value: z.any().optional().describe("Parameter value")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "AnimSetParameter", params, { successMessage: (_, params) => `Set ${params.paramName} on ${params.name}` });
  }
};

export const animPlay: ToolDefinition = {
  id: "anim_play",
  name: "Play Animation",
  description: "Play an animation state on an Animator",
  descriptionJa: "Animatorのアニメーションステートを再生",
  category: "animation",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    stateName: z.string().describe("Animation state name to play"),
    layer: z.number().optional().describe("Animator layer, default 0")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "AnimPlay", params, { successMessage: (_, params) => `Playing ${params.stateName} on ${params.name}` });
  }
};

export const animCreateClip: ToolDefinition = {
  id: "anim_create_clip",
  name: "Create Animation Clip",
  description: "Create a simple animation clip with position keyframes",
  descriptionJa: "位置キーフレーム付きのアニメーションクリップを作成",
  category: "animation",
  inputSchema: z.object({
    clipName: z.string().describe("Animation clip name"),
    targetName: z.string().describe("Target GameObject name"),
    duration: z.number().describe("Clip duration in seconds"),
    endX: z.number().describe("End X position"),
    endY: z.number().describe("End Y position"),
    endZ: z.number().describe("End Z position"),
    loop: z.boolean().optional().describe("Loop the animation, default false")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "AnimCreateClip", params, { successMessage: (_, params) => `Created animation clip: ${params.clipName}` });
  }
};

export const animationTools = [
  animAddAnimator,
  animSetParameter,
  animPlay,
  animCreateClip
];