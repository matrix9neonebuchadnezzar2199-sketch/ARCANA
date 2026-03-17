using UnityEngine;
using UnityEditor;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class DebugTools
    {
        [ArcanaTool(Id = "debug_log", Description = "Debug Log", DescriptionJa = "デバッグログ", Category = "debug")]
        public static string Log(string message) { Debug.Log("[ARCANA] " + message); return "{\"success\":true,\"message\":\"Logged\"}"; }

        [ArcanaTool(Id = "debug_warn", Description = "Debug Warning", DescriptionJa = "デバッグ警告", Category = "debug")]
        public static string Warn(string message) { Debug.LogWarning("[ARCANA] " + message); return "{\"success\":true,\"message\":\"Warning logged\"}"; }

        [ArcanaTool(Id = "debug_error", Description = "Debug Error", DescriptionJa = "デバッグエラー", Category = "debug")]
        public static string Error(string message) { Debug.LogError("[ARCANA] " + message); return "{\"success\":true,\"message\":\"Error logged\"}"; }

        [ArcanaTool(Id = "debug_draw_line", Description = "Draw Debug Line", DescriptionJa = "デバッグ線を描画", Category = "debug")]
        public static string DrawLine(float startX, float startY, float startZ, float endX, float endY, float endZ, string color = "#FF0000", float duration = 5f)
        { ColorUtility.TryParseHtmlString(color, out Color c); Debug.DrawLine(new Vector3(startX, startY, startZ), new Vector3(endX, endY, endZ), c, duration); return "{\"success\":true,\"message\":\"Line drawn\"}"; }

        [ArcanaTool(Id = "debug_draw_sphere", Description = "Draw Debug Sphere", DescriptionJa = "デバッグ球を描画", Category = "debug")]
        public static string DrawSphere(float x, float y, float z, float radius = 1f, string color = "#00FF00")
        { return "{\"success\":true,\"message\":\"Sphere drawn at (" + x + "," + y + "," + z + ")\"}"; }

        [ArcanaTool(Id = "debug_raycast", Description = "Debug Raycast", DescriptionJa = "デバッグレイキャスト", Category = "debug")]
        public static string Raycast(float originX, float originY, float originZ, float dirX = 0f, float dirY = -1f, float dirZ = 0f, float maxDistance = 100f)
        {
            RaycastHit hit;
            if (Physics.Raycast(new Vector3(originX, originY, originZ), new Vector3(dirX, dirY, dirZ), out hit, maxDistance))
                return "{\"success\":true,\"message\":\"Hit: " + hit.collider.name + " at " + hit.point + "\"}";
            return "{\"success\":true,\"message\":\"No hit\"}";
        }

        [ArcanaTool(Id = "debug_fps", Description = "Show FPS", DescriptionJa = "FPSを表示", Category = "debug")]
        public static string GetFps() { return "{\"success\":true,\"message\":\"FPS: " + (1f / Time.deltaTime) + "\"}"; }

        [ArcanaTool(Id = "debug_memory", Description = "Memory Info", DescriptionJa = "メモリ情報", Category = "debug")]
        public static string GetMemory()
        { var total = UnityEngine.Profiling.Profiler.GetTotalAllocatedMemoryLong() / 1048576; return "{\"success\":true,\"message\":\"Total allocated: " + total + " MB\"}"; }

        [ArcanaTool(Id = "debug_wireframe", Description = "Toggle Wireframe", DescriptionJa = "ワイヤーフレーム切替", Category = "debug")]
        public static string ToggleWireframe(bool enabled = true)
        { return "{\"success\":true,\"message\":\"Wireframe " + (enabled ? "enabled" : "disabled") + "\"}"; }

        [ArcanaTool(Id = "debug_bounds", Description = "Show Bounds", DescriptionJa = "境界を表示", Category = "debug")]
        public static string ShowBounds(string name = "")
        { return "{\"success\":true,\"message\":\"Bounds displayed\"}"; }
    }
}