import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const screenshotGameView: ToolDefinition = {
  id: "screenshot_game_view",
  name: "Capture Game View",
  description: "Capture a screenshot of the Game View",
  descriptionJa: "Game Viewのスクリーンショットをキャプチャ",
  category: "screenshot",
  inputSchema: z.object({ fileName: z.string().default("screenshot.png"), superSize: z.number().default(1) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "ScreenshotGameView", p, { successMessage: (_, p) => `Game View captured: ${p.fileName}` });
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
    return bridgeSendAsToolResult("unity", "ScreenshotSceneView", p, { successMessage: (_, p) => `Scene View captured: ${p.fileName}` });
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
    return bridgeSendAsToolResult("unity", "ScreenshotCamera", p, { successMessage: (_, p) => `Camera ${p.cameraName} captured: ${p.fileName}` });
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
    return bridgeSendAsToolResult("unity", "Screenshot360", p, { successMessage: (_, p) => `360 panorama captured: ${p.fileName}` });
  }
};

export const screenshotTools: ToolDefinition[] = [
  screenshotGameView, screenshotSceneView, screenshotCamera, screenshot360
];