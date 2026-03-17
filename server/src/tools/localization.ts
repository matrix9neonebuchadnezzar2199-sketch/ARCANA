import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const locCreateTable: ToolDefinition = { id: "loc_create_table", name: "Create String Table", description: "Create a new localization string table", descriptionJa: "新しいローカライズ文字列テーブルを作成する", category: "localization",
  inputSchema: z.object({ tableName: z.string().describe("Table name"), path: z.string().optional().default("Assets/Localization").describe("Save folder") }),
  handler: async (params) => { try { const r = await unityBridge.send("LocCreateTable", params); return { success: true, message: `Table created: ${params.tableName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const locAddEntry: ToolDefinition = { id: "loc_add_entry", name: "Add Localization Entry", description: "Add a key-value entry to a string table for a locale", descriptionJa: "ロケールの文字列テーブルにキー・値エントリを追加する", category: "localization",
  inputSchema: z.object({ tableName: z.string().describe("Table name"), key: z.string().describe("Entry key"), value: z.string().describe("Translated text"), locale: z.string().optional().default("en").describe("Locale code (e.g. en, ja, ko)") }),
  handler: async (params) => { try { const r = await unityBridge.send("LocAddEntry", params); return { success: true, message: `Entry added: ${params.key} (${params.locale})`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const locAddLocale: ToolDefinition = { id: "loc_add_locale", name: "Add Locale", description: "Add a new locale to the project", descriptionJa: "プロジェクトに新しいロケールを追加する", category: "localization",
  inputSchema: z.object({ localeCode: z.string().describe("Locale code (e.g. en, ja, ko, zh, fr, de)") }),
  handler: async (params) => { try { const r = await unityBridge.send("LocAddLocale", params); return { success: true, message: `Locale added: ${params.localeCode}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const locSetActive: ToolDefinition = { id: "loc_set_active", name: "Set Active Locale", description: "Switch the active locale at runtime", descriptionJa: "ランタイムでアクティブロケールを切り替える", category: "localization",
  inputSchema: z.object({ localeCode: z.string().describe("Locale code to activate") }),
  handler: async (params) => { try { const r = await unityBridge.send("LocSetActive", params); return { success: true, message: `Active locale: ${params.localeCode}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const locExport: ToolDefinition = { id: "loc_export", name: "Export Localization", description: "Export string table to CSV or JSON", descriptionJa: "文字列テーブルをCSV/JSONにエクスポートする", category: "localization",
  inputSchema: z.object({ tableName: z.string().describe("Table name"), format: z.enum(["CSV", "JSON"]).optional().default("CSV").describe("Export format"), outputPath: z.string().optional().default("Assets/Localization/Export").describe("Output path") }),
  handler: async (params) => { try { const r = await unityBridge.send("LocExport", params); return { success: true, message: `Exported: ${params.tableName} as ${params.format}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const locImport: ToolDefinition = { id: "loc_import", name: "Import Localization", description: "Import translations from CSV or JSON file", descriptionJa: "CSV/JSONファイルから翻訳をインポートする", category: "localization",
  inputSchema: z.object({ tableName: z.string().describe("Target table name"), filePath: z.string().describe("Import file path"), format: z.enum(["CSV", "JSON"]).optional().default("CSV").describe("File format") }),
  handler: async (params) => { try { const r = await unityBridge.send("LocImport", params); return { success: true, message: `Imported to ${params.tableName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

export const localizationTools: ToolDefinition[] = [locCreateTable, locAddEntry, locAddLocale, locSetActive, locExport, locImport];