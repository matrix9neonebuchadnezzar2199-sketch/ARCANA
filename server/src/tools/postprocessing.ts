import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const ppBloom: ToolDefinition = {
  id: "pp_bloom",
  name: "Set Bloom",
  description: "Configure Bloom post-processing effect",
  descriptionJa: "Bloomポストプロセス効果を設定する",
  category: "postprocessing",
  inputSchema: z.object({
    intensity: z.number().min(0).max(10).optional().default(1).describe("Bloom intensity"),
    threshold: z.number().min(0).optional().default(0.9).describe("Brightness threshold"),
    scatter: z.number().min(0).max(1).optional().default(0.7).describe("Scatter amount")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "PPBloom", params, { successMessage: "Bloom configured" });
  }
};

const ppColorAdjust: ToolDefinition = {
  id: "pp_color_adjust",
  name: "Set Color Adjustments",
  description: "Configure color adjustments (exposure, contrast, saturation)",
  descriptionJa: "色調補正を設定する（露出、コントラスト、彩度）",
  category: "postprocessing",
  inputSchema: z.object({
    exposure: z.number().optional().default(0).describe("Post exposure"),
    contrast: z.number().min(-100).max(100).optional().default(0).describe("Contrast"),
    saturation: z.number().min(-100).max(100).optional().default(0).describe("Saturation"),
    hueShift: z.number().min(-180).max(180).optional().default(0).describe("Hue shift")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "PPColorAdjust", params, { successMessage: "Color adjustments configured" });
  }
};

const ppDepthOfField: ToolDefinition = {
  id: "pp_depth_of_field",
  name: "Set Depth of Field",
  description: "Configure depth of field effect",
  descriptionJa: "被写界深度エフェクトを設定する",
  category: "postprocessing",
  inputSchema: z.object({
    mode: z.enum(["Gaussian", "Bokeh"]).optional().default("Gaussian").describe("DoF mode"),
    focusDistance: z.number().min(0.1).optional().default(10).describe("Focus distance"),
    aperture: z.number().min(0.05).max(32).optional().default(5.6).describe("Aperture (Bokeh only)"),
    focalLength: z.number().min(1).max(300).optional().default(50).describe("Focal length (Bokeh only)")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "PPDepthOfField", params, { successMessage: "Depth of Field configured" });
  }
};

const ppVignette: ToolDefinition = {
  id: "pp_vignette",
  name: "Set Vignette",
  description: "Configure vignette effect",
  descriptionJa: "ビネット効果を設定する",
  category: "postprocessing",
  inputSchema: z.object({
    intensity: z.number().min(0).max(1).optional().default(0.3).describe("Vignette intensity"),
    smoothness: z.number().min(0.01).max(1).optional().default(0.5).describe("Smoothness"),
    color: z.string().optional().default("#000000").describe("Vignette color hex")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "PPVignette", params, { successMessage: "Vignette configured" });
  }
};

const ppMotionBlur: ToolDefinition = {
  id: "pp_motion_blur",
  name: "Set Motion Blur",
  description: "Configure motion blur effect",
  descriptionJa: "モーションブラー効果を設定する",
  category: "postprocessing",
  inputSchema: z.object({
    intensity: z.number().min(0).max(1).optional().default(0.5).describe("Motion blur intensity"),
    quality: z.enum(["Low", "Medium", "High"]).optional().default("Medium").describe("Quality level")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "PPMotionBlur", params, { successMessage: "Motion Blur configured" });
  }
};

export const postProcessingTools: ToolDefinition[] = [ppBloom, ppColorAdjust, ppDepthOfField, ppVignette, ppMotionBlur];