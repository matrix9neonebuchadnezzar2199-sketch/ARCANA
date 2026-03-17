using UnityEngine;
using UnityEditor;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class AssetTools
    {
        [ArcanaTool(Id = "asset_search", Description = "Search Assets", DescriptionJa = "アセットを検索", Category = "asset")]
        public static string SearchAssets(string query, string folder = "Assets")
        {
            var guids = AssetDatabase.FindAssets(query, new[] { folder });
            var paths = new string[guids.Length];
            for (int i = 0; i < guids.Length; i++) paths[i] = AssetDatabase.GUIDToAssetPath(guids[i]);
            return "{\"success\":true,\"message\":\"Found " + guids.Length + " assets\",\"data\":" + JsonUtility.ToJson(new Wrapper { items = paths }) + "}";
        }

        [ArcanaTool(Id = "asset_import", Description = "Import Asset", DescriptionJa = "アセットをインポート", Category = "asset")]
        public static string ImportAsset(string sourcePath, string destPath = "Assets/Imports")
        {
            if (!System.IO.Directory.Exists(destPath)) System.IO.Directory.CreateDirectory(destPath);
            var fileName = System.IO.Path.GetFileName(sourcePath);
            var dest = System.IO.Path.Combine(destPath, fileName);
            System.IO.File.Copy(sourcePath, dest, true);
            AssetDatabase.Refresh();
            return "{\"success\":true,\"message\":\"Imported to " + dest + "\"}";
        }

        [ArcanaTool(Id = "asset_delete", Description = "Delete Asset", DescriptionJa = "アセットを削除", Category = "asset")]
        public static string DeleteAsset(string path)
        {
            var ok = AssetDatabase.DeleteAsset(path);
            if (ok) return "{\"success\":true,\"message\":\"Deleted: " + path + "\"}";
            return "{\"success\":false,\"message\":\"Failed to delete: " + path + "\"}";
        }

        [ArcanaTool(Id = "asset_move", Description = "Move Asset", DescriptionJa = "アセットを移動", Category = "asset")]
        public static string MoveAsset(string oldPath, string newPath)
        {
            var err = AssetDatabase.MoveAsset(oldPath, newPath);
            if (string.IsNullOrEmpty(err)) return "{\"success\":true,\"message\":\"Moved: " + oldPath + " -> " + newPath + "\"}";
            return "{\"success\":false,\"message\":\"" + err + "\"}";
        }

        [ArcanaTool(Id = "asset_duplicate", Description = "Duplicate Asset", DescriptionJa = "アセットを複製", Category = "asset")]
        public static string DuplicateAsset(string path, string newName = "")
        {
            var newPath = string.IsNullOrEmpty(newName) ? AssetDatabase.GenerateUniqueAssetPath(path) : System.IO.Path.Combine(System.IO.Path.GetDirectoryName(path), newName);
            AssetDatabase.CopyAsset(path, newPath);
            return "{\"success\":true,\"message\":\"Duplicated to " + newPath + "\"}";
        }

        [System.Serializable]
        private class Wrapper { public string[] items; }
    }
}