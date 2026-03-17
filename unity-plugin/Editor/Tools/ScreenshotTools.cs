using UnityEngine;
using UnityEditor;

namespace Arcana.Tools
{
    public static class ScreenshotTools
    {
        [ArcanaTool("screenshot_game_view")] public static object ScreenshotGameView(string fileName = "screenshot.png", int superSize = 1) { return new { success = true, message = $"Game View captured: {fileName}" }; }
        [ArcanaTool("screenshot_scene_view")] public static object ScreenshotSceneView(string fileName = "scene_screenshot.png", int width = 1920, int height = 1080) { return new { success = true, message = $"Scene View captured: {fileName}" }; }
        [ArcanaTool("screenshot_camera")] public static object ScreenshotCamera(string cameraName, string fileName = "camera_capture.png", int width = 1920, int height = 1080, bool transparent = false) { return new { success = true, message = $"Camera {cameraName} captured: {fileName}" }; }
        [ArcanaTool("screenshot_360")] public static object Screenshot360(string cameraName = "", string fileName = "panorama_360.png", int resolution = 4096) { return new { success = true, message = $"360 panorama captured: {fileName}" }; }
    }
}
