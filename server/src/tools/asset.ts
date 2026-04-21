import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
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
    return bridgeSendAsToolResult("unity", "AssetSearch", params, { successMessage: "Asset search completed" });
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
    return bridgeSendAsToolResult("unity", "AssetImport", params, { successMessage: (_, params) => `Asset imported to ${params.destPath}` });
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
    return bridgeSendAsToolResult("unity", "AssetDelete", params, { successMessage: (_, params) => `Asset deleted: ${params.path}` });
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
    return bridgeSendAsToolResult("unity", "AssetMove", params, { successMessage: (_, params) => `Asset moved: ${params.oldPath} -> ${params.newPath}` });
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
    return bridgeSendAsToolResult("unity", "AssetDuplicate", params, { successMessage: (_, params) => `Asset duplicated: ${params.path}` });
  }
};

export const assetTools: ToolDefinition[] = [assetSearch, assetImport, assetDelete, assetMove, assetDuplicate];