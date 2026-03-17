import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { unityBridge } from "../bridge/unity-bridge";

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
    try {
      const result = await unityBridge.send("AnimAddAnimator", params);
      return { success: true, message: `Added Animator to ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
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
    try {
      const result = await unityBridge.send("AnimSetParameter", params);
      return { success: true, message: `Set ${params.paramName} on ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
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
    try {
      const result = await unityBridge.send("AnimPlay", params);
      return { success: true, message: `Playing ${params.stateName} on ${params.name}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
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
    try {
      const result = await unityBridge.send("AnimCreateClip", params);
      return { success: true, message: `Created animation clip: ${params.clipName}`, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed: ${error.message}` };
    }
  }
};

export const animationTools = [
  animAddAnimator,
  animSetParameter,
  animPlay,
  animCreateClip
];