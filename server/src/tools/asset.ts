import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const assetSearch: ToolDefinition = {
  id: "asset_search",
  name: "Search Assets",
  description: "Search project assets by name, type, or label",
  descriptionJa: "名前・タイプ・ラベルでプロジェクトアセットを検索する",
  category: "asset",
  inputSchema: z.object({
    query: z.string().describe("Search query (e.g. t:Material, l:MyLabel, or name)"),
    folder: z.string().optional().default("Assets").describe("Folder to search in")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "AssetSearch", params);
      return { success: true, message: "Asset search completed", data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const assetImport: ToolDefinition = {
  id: "asset_import",
  name: "Import Asset",
  description: "Import an external file into the Unity project",
  descriptionJa: "外部ファイルをUnityプロジェクトにインポートする",
  category: "asset",
  inputSchema: z.object({
    sourcePath: z.string().describe("Full path to the source file"),
    destPath: z.string().optional().default("Assets/Imports").describe("Destination folder in project")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "AssetImport", params);
      return { success: true, message: `Asset imported to ${params.destPath}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const assetDelete: ToolDefinition = {
  id: "asset_delete",
  name: "Delete Asset",
  description: "Delete an asset from the project",
  descriptionJa: "プロジェクトからアセットを削除する",
  category: "asset",
  inputSchema: z.object({
    path: z.string().describe("Asset path relative to project (e.g. Assets/Materials/MyMat.mat)")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "AssetDelete", params);
      return { success: true, message: `Asset deleted: ${params.path}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const assetMove: ToolDefinition = {
  id: "asset_move",
  name: "Move Asset",
  description: "Move or rename an asset within the project",
  descriptionJa: "プロジェクト内でアセットを移動またはリネームする",
  category: "asset",
  inputSchema: z.object({
    oldPath: z.string().describe("Current asset path"),
    newPath: z.string().describe("New asset path")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "AssetMove", params);
      return { success: true, message: `Asset moved: ${params.oldPath} -> ${params.newPath}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

const assetDuplicate: ToolDefinition = {
  id: "asset_duplicate",
  name: "Duplicate Asset",
  description: "Duplicate an asset in the project",
  descriptionJa: "プロジェクト内のアセットを複製する",
  category: "asset",
  inputSchema: z.object({
    path: z.string().describe("Asset path to duplicate"),
    newName: z.string().optional().describe("New name for the copy (optional)")
  }),
  handler: async (params) => {
    try {
      const result = await bridge.send("unity", "AssetDuplicate", params);
      return { success: true, message: `Asset duplicated: ${params.path}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

export const assetTools: ToolDefinition[] = [assetSearch, assetImport, assetDelete, assetMove, assetDuplicate];