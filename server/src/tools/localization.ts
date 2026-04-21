import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
export const localizationTools: ToolDefinition[] = [
  {
    id: "localization_add_locale",
    name: "Add Locale",
    description: "Add a new locale (language) to the Localization Settings",
    descriptionJa: "Localization Settingsに新しいロケール（言語）を追加",
    category: "Localization",
    inputSchema: z.object({
      localeCode: z.string().describe("Locale code (e.g. en, ja, fr, de, zh-Hans, ko, es, pt-BR)"),
      setAsDefault: z.boolean().optional().describe("Set as project default locale"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "LocalizationAddLocale", params, { successMessage: (_, params) => `Locale "${params.localeCode}" added${params.setAsDefault ? " (default)" : ""}` });
    },
  },
  {
    id: "localization_create_string_table",
    name: "Create String Table",
    description: "Create a new String Table Collection for localized text",
    descriptionJa: "ローカライズテキスト用の新しいString Tableコレクションを作成",
    category: "Localization",
    inputSchema: z.object({
      tableName: z.string().describe("String table collection name (e.g. UI_Texts, Dialogue, Items)"),
      path: z.string().optional().describe("Asset path relative to Assets/ (default: Assets/Localization)"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "LocalizationCreateStringTable", params, { successMessage: (_, params) => `String table "${params.tableName}" created` });
    },
  },
  {
    id: "localization_add_entry",
    name: "Add Localization Entry",
    description: "Add a key-value entry to a String Table for one or more locales",
    descriptionJa: "1つ以上のロケール向けにString Tableにキー・値エントリを追加",
    category: "Localization",
    inputSchema: z.object({
      tableName: z.string().describe("Target string table collection name"),
      key: z.string().describe("Entry key (e.g. MENU_START, DIALOG_GREETING_01)"),
      values: z.record(z.string()).describe("Locale-to-value map, e.g. { en: 'Start', ja: 'スタート' }"),
    }),
    handler: async (params) =>
      bridgeSendAsToolResult("unity", "LocalizationAddEntry", params, {
        successMessage: (_, p) =>
          `Entry "${p.key}" added to "${p.tableName}" for ${Object.keys(p.values).length} locale(s)`,
      }),
  },
  {
    id: "localization_batch_import",
    name: "Batch Import Localization",
    description: "Import multiple localization entries at once from a structured data array",
    descriptionJa: "構造化データ配列から複数のローカライズエントリを一括インポート",
    category: "Localization",
    inputSchema: z.object({
      tableName: z.string().describe("Target string table collection name"),
      entries: z.array(z.object({
        key: z.string().describe("Entry key"),
      values: z.record(z.string()).describe("Locale-to-value map, e.g. { en: 'Start', ja: 'スタート' }"),
      })).describe("Array of entries to import"),
      overwrite: z.boolean().optional().describe("Overwrite existing keys (default: false)"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "LocalizationBatchImport", params, { successMessage: (_, params) => `${params.entries.length} entries imported to "${params.tableName}"` });
    },
  },
  {
    id: "localization_bind_ui",
    name: "Bind Localization to UI",
    description: "Attach a LocalizeStringEvent component to a UI text object to auto-update on locale change",
    descriptionJa: "UIテキストオブジェクトにLocalizeStringEventを付与しロケール変更時に自動更新",
    category: "Localization",
    inputSchema: z.object({
      objectName: z.string().describe("Target UI text object name"),
      tableName: z.string().describe("String table collection name"),
      entryKey: z.string().describe("Entry key to bind"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "LocalizationBindUI", params, { successMessage: (_, params) => `"${params.objectName}" bound to "${params.tableName}/${params.entryKey}"` });
    },
  },
];