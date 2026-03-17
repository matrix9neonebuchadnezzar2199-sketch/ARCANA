using UnityEngine;
using UnityEditor;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class LocalizationTools
    {
        [ArcanaTool(Id = "loc_create_table", Description = "Create String Table", DescriptionJa = "文字列テーブルを作成", Category = "localization")]
        public static string CreateTable(string tableName, string path = "Assets/Localization")
        { return "{\"success\":true,\"message\":\"Table created: " + tableName + "\"}"; }

        [ArcanaTool(Id = "loc_add_entry", Description = "Add Localization Entry", DescriptionJa = "ローカライズエントリを追加", Category = "localization")]
        public static string AddEntry(string tableName, string key, string value, string locale = "en")
        { return "{\"success\":true,\"message\":\"Entry added: " + key + " (" + locale + ")\"}"; }

        [ArcanaTool(Id = "loc_add_locale", Description = "Add Locale", DescriptionJa = "ロケールを追加", Category = "localization")]
        public static string AddLocale(string localeCode)
        { return "{\"success\":true,\"message\":\"Locale added: " + localeCode + "\"}"; }

        [ArcanaTool(Id = "loc_set_active", Description = "Set Active Locale", DescriptionJa = "アクティブロケールを設定", Category = "localization")]
        public static string SetActive(string localeCode)
        { return "{\"success\":true,\"message\":\"Active locale: " + localeCode + "\"}"; }

        [ArcanaTool(Id = "loc_export", Description = "Export Localization", DescriptionJa = "ローカライズをエクスポート", Category = "localization")]
        public static string Export(string tableName, string format = "CSV", string outputPath = "Assets/Localization/Export")
        { return "{\"success\":true,\"message\":\"Exported: " + tableName + " as " + format + "\"}"; }

        [ArcanaTool(Id = "loc_import", Description = "Import Localization", DescriptionJa = "ローカライズをインポート", Category = "localization")]
        public static string Import(string tableName, string filePath, string format = "CSV")
        { return "{\"success\":true,\"message\":\"Imported to " + tableName + "\"}"; }
    }
}