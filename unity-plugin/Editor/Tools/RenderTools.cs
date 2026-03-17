using UnityEngine;
using UnityEditor;
using System.IO;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class RenderTools
    {
        [ArcanaTool(Id = "render_screenshot", Description = "Take Screenshot", DescriptionJa = "スクリーンショットを撮影", Category = "render")]
        public static string TakeScreenshot(string path = "Assets/Screenshots/screenshot.png", int width = 1920, int height = 1080, int superSize = 1)
        {
            var dir = Path.GetDirectoryName(path);
            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
            ScreenCapture.CaptureScreenshot(path, superSize);
            return "{\"success\":true,\"message\":\"Screenshot saved to " + path + "\"}";
        }

        [ArcanaTool(Id = "render_set_resolution", Description = "Set Game Resolution", DescriptionJa = "ゲーム解像度を設定", Category = "render")]
        public static string SetResolution(int width, int height, bool fullscreen = false)
        {
            Screen.SetResolution(width, height, fullscreen);
            return "{\"success\":true,\"message\":\"Resolution set to " + width + "x" + height + "\"}";
        }

        [ArcanaTool(Id = "render_set_quality", Description = "Set Quality Level", DescriptionJa = "品質レベルを設定", Category = "render")]
        public static string SetQuality(string level)
        {
            var names = QualitySettings.names;
            for (int i = 0; i < names.Length; i++)
            {
                if (names[i] == level) { QualitySettings.SetQualityLevel(i, true); return "{\"success\":true,\"message\":\"Quality set to " + level + "\"}"; }
            }
            return "{\"success\":false,\"message\":\"Quality level not found: " + level + "\"}";
        }

        [ArcanaTool(Id = "render_capture_skybox", Description = "Capture Cubemap", DescriptionJa = "キューブマップをキャプチャ", Category = "render")]
        public static string CaptureCubemap(string path = "Assets/Cubemaps/cubemap.exr", float x = 0f, float y = 1f, float z = 0f, int resolution = 512)
        {
            var dir = Path.GetDirectoryName(path);
            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
            var go = new GameObject("CubemapCapture");
            go.transform.position = new Vector3(x, y, z);
            var cam = go.AddComponent<Camera>();
            var cubemap = new Cubemap(resolution, TextureFormat.RGBAFloat, false);
            cam.RenderToCubemap(cubemap);
            Object.DestroyImmediate(go);
            return "{\"success\":true,\"message\":\"Cubemap captured at (" + x + "," + y + "," + z + ")\"}";
        }
    }
}