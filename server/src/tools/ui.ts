import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
export const uiCreateCanvas: ToolDefinition = {
  id: "ui_create_canvas",
  name: "Create Canvas",
  description: "Create a new UI Canvas in the scene",
  descriptionJa: "シーンに新しいUI Canvasを作成",
  category: "ui",
  inputSchema: z.object({
    name: z.string().optional().describe("Canvas name, default Canvas"),
    renderMode: z.enum(["ScreenSpaceOverlay", "ScreenSpaceCamera", "WorldSpace"]).optional().describe("Render mode, default ScreenSpaceOverlay")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "UICreateCanvas", params, { successMessage: (_, params) => `Created canvas: ${params.name || "Canvas"}` });
  }
};

export const uiCreateText: ToolDefinition = {
  id: "ui_create_text",
  name: "Create UI Text",
  description: "Create a text element on a Canvas",
  descriptionJa: "Canvasにテキスト要素を作成",
  category: "ui",
  inputSchema: z.object({
    name: z.string().describe("Text element name"),
    text: z.string().describe("Display text content"),
    fontSize: z.number().optional().describe("Font size, default 24"),
    color: z.string().optional().describe("Text color as hex string"),
    x: z.number().optional().describe("Anchored X position"),
    y: z.number().optional().describe("Anchored Y position")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "UICreateText", params, { successMessage: (_, params) => `Created text: ${params.name}` });
  }
};

export const uiCreateButton: ToolDefinition = {
  id: "ui_create_button",
  name: "Create UI Button",
  description: "Create a button element on a Canvas",
  descriptionJa: "Canvasにボタン要素を作成",
  category: "ui",
  inputSchema: z.object({
    name: z.string().describe("Button name"),
    label: z.string().describe("Button label text"),
    width: z.number().optional().describe("Button width, default 160"),
    height: z.number().optional().describe("Button height, default 40"),
    x: z.number().optional().describe("Anchored X position"),
    y: z.number().optional().describe("Anchored Y position"),
    color: z.string().optional().describe("Button color as hex string")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "UICreateButton", params, { successMessage: (_, params) => `Created button: ${params.name}` });
  }
};

export const uiCreateImage: ToolDefinition = {
  id: "ui_create_image",
  name: "Create UI Image",
  description: "Create an image element on a Canvas",
  descriptionJa: "Canvasに画像要素を作成",
  category: "ui",
  inputSchema: z.object({
    name: z.string().describe("Image element name"),
    spritePath: z.string().optional().describe("Sprite path relative to Assets"),
    color: z.string().optional().describe("Image tint color as hex string"),
    width: z.number().optional().describe("Image width, default 100"),
    height: z.number().optional().describe("Image height, default 100"),
    x: z.number().optional().describe("Anchored X position"),
    y: z.number().optional().describe("Anchored Y position")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "UICreateImage", params, { successMessage: (_, params) => `Created image: ${params.name}` });
  }
};

export const uiTools = [
  uiCreateCanvas,
  uiCreateText,
  uiCreateButton,
  uiCreateImage
];