using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Tools
{
    public static class CameraTools
    {
        [ArcanaTool(
            "camera_create",
            "Create a new camera in the scene",
            "シーンに新しいカメラを作成",
            "camera")]
        public static string CreateCamera(
            string name, float x = 0, float y = 1, float z = -10, float fov = 60f)
        {
            var go = new GameObject(name);
            var cam = go.AddComponent<Camera>();
            go.transform.position = new Vector3(x, y, z);
            cam.fieldOfView = fov;
            Undo.RegisterCreatedObjectUndo(go, $"ARCANA Create Camera {name}");
            return $"Created camera: {name} at ({x}, {y}, {z}) FOV={fov}";
        }

        [ArcanaTool(
            "camera_set_fov",
            "Set the field of view of a camera",
            "カメラの視野角を設定",
            "camera")]
        public static string SetFOV(string name, float fov)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var cam = go.GetComponent<Camera>();
            if (cam == null) return $"No Camera on {name}";
            Undo.RecordObject(cam, "ARCANA Set FOV");
            cam.fieldOfView = fov;
            return $"Set FOV of {name} to {fov}";
        }

        [ArcanaTool(
            "camera_set_background",
            "Set the background color or skybox of a camera",
            "カメラの背景色またはスカイボックスを設定",
            "camera")]
        public static string SetBackground(
            string name, string color = "", string clearFlags = "")
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var cam = go.GetComponent<Camera>();
            if (cam == null) return $"No Camera on {name}";
            Undo.RecordObject(cam, "ARCANA Set Camera Background");
            if (!string.IsNullOrEmpty(clearFlags))
            {
                switch (clearFlags)
                {
                    case "Skybox": cam.clearFlags = CameraClearFlags.Skybox; break;
                    case "SolidColor": cam.clearFlags = CameraClearFlags.SolidColor; break;
                    case "Depth": cam.clearFlags = CameraClearFlags.Depth; break;
                    case "Nothing": cam.clearFlags = CameraClearFlags.Nothing; break;
                }
            }
            if (!string.IsNullOrEmpty(color) && ColorUtility.TryParseHtmlString(color, out Color c))
                cam.backgroundColor = c;
            return $"Set background of {name}";
        }
    }
}