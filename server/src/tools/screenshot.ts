import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const screenshotGameView: ToolDefinition = {
  id: "screenshot_game_view",
  name: "Capture Game View",
  description: "Capture a screenshot of the Game View",
  descriptionJa: "Game Viewのスクリーンショットをキャプチャ",
  category: "screenshot",
  inputSchema: z.object({ fileName: z.string().default("screenshot.png"), superSize: z.number().default(1) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "ScreenshotGameView", p);
      return r ? { success: true, message: `Game View captured: ${p.fileName}`, data: r }
               : { success: false, message: "Failed to capture Game View" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

const screenshotSceneView: ToolDefinition = {
  id: "screenshot_scene_view",
  name: "Capture Scene View",
  description: "Capture a screenshot of the Scene View",
  descriptionJa: "Scene Viewのスクリーンショットをキャプチャ",
  category: "screenshot",
  inputSchema: z.object({ fileName: z.string().default("scene_screenshot.png"), width: z.number().default(1920), height: z.number().default(1080) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "ScreenshotSceneView", p);
      return r ? { success: true, message: `Scene View captured: ${p.fileName}`, data: r }
               : { success: false, message: "Failed to capture Scene View" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

const screenshotCamera: ToolDefinition = {
  id: "screenshot_camera",
  name: "Capture From Camera",
  description: "Render and capture from a specific camera",
  descriptionJa: "特定カメラからレンダリングしてキャプチャ",
  category: "screenshot",
  inputSchema: z.object({ cameraName: z.string(), fileName: z.string().default("camera_capture.png"), width: z.number().default(1920), height: z.number().default(1080), transparent: z.boolean().default(false) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "ScreenshotCamera", p);
      return r ? { success: true, message: `Camera ${p.cameraName} captured: ${p.fileName}`, data: r }
               : { success: false, message: "Failed to capture from camera" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

const screenshot360: ToolDefinition = {
  id: "screenshot_360",
  name: "Capture 360 Panorama",
  description: "Capture a 360-degree equirectangular panorama",
  descriptionJa: "360度エクイレクタングラーパノラマをキャプチャ",
  category: "screenshot",
  inputSchema: z.object({ cameraName: z.string().optional(), fileName: z.string().default("panorama_360.png"), resolution: z.number().default(4096) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "Screenshot360", p);
      return r ? { success: true, message: `360 panorama captured: ${p.fileName}`, data: r }
               : { success: false, message: "Failed to capture 360 panorama" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

export const screenshotTools: ToolDefinition[] = [
  screenshotGameView, screenshotSceneView, screenshotCamera, screenshot360
];