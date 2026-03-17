using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class EditorUtilityTools
    {
        [ArcanaTool(Id = "editor_play_mode", Description = "Toggle Play Mode", DescriptionJa = "Playモードを切替", Category = "editor")]
        public static string PlayMode(string action)
        {
            switch (action)
            {
                case "play": EditorApplication.isPlaying = true; break;
                case "stop": EditorApplication.isPlaying = false; break;
                case "pause": EditorApplication.isPaused = !EditorApplication.isPaused; break;
            }
            return "{\"success\":true,\"message\":\"Play mode: " + action + "\"}";
        }

        [ArcanaTool(Id = "editor_save_scene", Description = "Save Scene", DescriptionJa = "シーンを保存", Category = "editor")]
        public static string SaveScene(string path = "")
        {
            if (string.IsNullOrEmpty(path))
                EditorSceneManager.SaveOpenScenes();
            else
                EditorSceneManager.SaveScene(EditorSceneManager.GetActiveScene(), path);
            return "{\"success\":true,\"message\":\"Scene saved\"}";
        }

        [ArcanaTool(Id = "editor_load_scene", Description = "Load Scene", DescriptionJa = "シーンを開く", Category = "editor")]
        public static string LoadScene(string path)
        {
            EditorSceneManager.OpenScene(path);
            return "{\"success\":true,\"message\":\"Scene loaded: " + path + "\"}";
        }

        [ArcanaTool(Id = "editor_undo_redo", Description = "Undo / Redo", DescriptionJa = "Undo/Redoを実行", Category = "editor")]
        public static string UndoRedo(string action)
        {
            if (action == "undo") Undo.PerformUndo();
            else if (action == "redo") Undo.PerformRedo();
            return "{\"success\":true,\"message\":\"" + action + " executed\"}";
        }

        [ArcanaTool(Id = "editor_clear_console", Description = "Clear Console", DescriptionJa = "コンソールをクリア", Category = "editor")]
        public static string ClearConsole()
        {
            var logEntries = System.Type.GetType("UnityEditor.LogEntries,UnityEditor.dll");
            if (logEntries != null)
            {
                var method = logEntries.GetMethod("Clear", System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.Public);
                if (method != null) method.Invoke(null, null);
            }
            return "{\"success\":true,\"message\":\"Console cleared\"}";
        }
    }
}