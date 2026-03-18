import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const buildSetPlatform: ToolDefinition = {
  id: "build_set_platform",
  name: "Switch Platform",
  description: "Switch the active build target platform",
  descriptionJa: "ビルドターゲットプラットフォームを切り替える",
  category: "build",
  inputSchema: z.object({
    platform: z.enum(["Windows", "Mac", "Linux", "Android", "iOS", "WebGL", "PS5", "Switch"]).describe("Target platform")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "BuildSetPlatform", params);
      return { success: true, message: `Platform switched to ${params.platform}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const buildAddScene: ToolDefinition = {
  id: "build_add_scene",
  name: "Add Scene to Build",
  description: "Add a scene to the build settings",
  descriptionJa: "ビルド設定にシーンを追加する",
  category: "build",
  inputSchema: z.object({
    path: z.string().describe("Scene asset path (e.g. Assets/Scenes/Main.unity)"),
    enabled: z.boolean().optional().default(true).describe("Enable in build")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "BuildAddScene", params);
      return { success: true, message: `Scene added to build: ${params.path}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const buildSetPlayerSettings: ToolDefinition = {
  id: "build_set_player",
  name: "Set Player Settings",
  description: "Configure player settings (product name, company, version)",
  descriptionJa: "プレイヤー設定を構成する（製品名、会社名、バージョン）",
  category: "build",
  inputSchema: z.object({
    productName: z.string().optional().describe("Product name"),
    companyName: z.string().optional().describe("Company name"),
    version: z.string().optional().describe("Bundle version string"),
    defaultIcon: z.string().optional().describe("Icon asset path")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "BuildSetPlayer", params);
      return { success: true, message: "Player settings updated", data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const buildExecute: ToolDefinition = {
  id: "build_execute",
  name: "Build Project",
  description: "Execute a build with current settings",
  descriptionJa: "現在の設定でビルドを実行する",
  category: "build",
  inputSchema: z.object({
    outputPath: z.string().describe("Output folder path"),
    development: z.boolean().optional().default(false).describe("Development build")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "BuildExecute", params);
      return { success: true, message: `Build output to ${params.outputPath}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const buildGetSettings: ToolDefinition = {
  id: "build_get_settings",
  name: "Get Build Settings",
  description: "Get current build settings info",
  descriptionJa: "現在のビルド設定情報を取得する",
  category: "build",
  inputSchema: z.object({}),
  handler: async () => {
    try {
      const result = await bridge.send("unity", "BuildGetSettings", {});
      return { success: true, message: "Build settings retrieved", data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const buildClean: ToolDefinition = {
  id: "build_clean",
  name: "Clean Build Cache",
  description: "Clean the build cache and Library folder",
  descriptionJa: "ビルドキャッシュとLibraryフォルダをクリーンする",
  category: "build",
  inputSchema: z.object({}),
  handler: async () => {
    try {
      const result = await bridge.send("unity", "BuildClean", {});
      return { success: true, message: "Build cache cleaned", data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

export const buildTools: ToolDefinition[] = [buildSetPlatform, buildAddScene, buildSetPlayerSettings, buildExecute, buildGetSettings, buildClean];