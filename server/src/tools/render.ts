import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const renderScreenshot: ToolDefinition = {
  id: "render_screenshot",
  name: "Take Screenshot",
  description: "Capture a screenshot of the current scene view",
  descriptionJa: "現在のシーンビューのスクリーンショットを撮影する",
  category: "render",
  inputSchema: z.object({
    path: z.string().optional().default("Assets/Screenshots/screenshot.png").describe("Save path"),
    width: z.number().optional().default(1920).describe("Image width"),
    height: z.number().optional().default(1080).describe("Image height"),
    superSize: z.number().optional().default(1).describe("Super sampling multiplier 1-4")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "RenderScreenshot", params);
      return { success: true, message: `Screenshot saved to ${params.path}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const renderSetResolution: ToolDefinition = {
  id: "render_set_resolution",
  name: "Set Game Resolution",
  description: "Set the game view resolution",
  descriptionJa: "ゲームビューの解像度を設定する",
  category: "render",
  inputSchema: z.object({
    width: z.number().describe("Width in pixels"),
    height: z.number().describe("Height in pixels"),
    fullscreen: z.boolean().optional().default(false).describe("Fullscreen mode")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "RenderSetResolution", params);
      return { success: true, message: `Resolution set to ${params.width}x${params.height}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const renderSetQuality: ToolDefinition = {
  id: "render_set_quality",
  name: "Set Quality Level",
  description: "Set the rendering quality level",
  descriptionJa: "レンダリング品質レベルを設定する",
  category: "render",
  inputSchema: z.object({
    level: z.enum(["Very Low", "Low", "Medium", "High", "Very High", "Ultra"]).describe("Quality level name")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "RenderSetQuality", params);
      return { success: true, message: `Quality set to ${params.level}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const renderCaptureSkybox: ToolDefinition = {
  id: "render_capture_skybox",
  name: "Capture Cubemap",
  description: "Capture a cubemap from a position in the scene",
  descriptionJa: "シーン内の位置からキューブマップをキャプチャする",
  category: "render",
  inputSchema: z.object({
    path: z.string().optional().default("Assets/Cubemaps/cubemap.exr").describe("Save path"),
    x: z.number().optional().default(0).describe("Capture position X"),
    y: z.number().optional().default(1).describe("Capture position Y"),
    z: z.number().optional().default(0).describe("Capture position Z"),
    resolution: z.number().optional().default(512).describe("Cubemap face resolution")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "RenderCaptureSkybox", params);
      return { success: true, message: `Cubemap saved to ${params.path}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

export const renderTools: ToolDefinition[] = [renderScreenshot, renderSetResolution, renderSetQuality, renderCaptureSkybox];