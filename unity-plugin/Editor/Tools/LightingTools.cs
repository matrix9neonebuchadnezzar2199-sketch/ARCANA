using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Tools
{
    public static class LightingTools
    {
        [ArcanaTool(
            "lighting_create_light",
            "Create a new light in the scene",
            "シーンに新しいライトを作成",
            "lighting")]
        public static string CreateLight(
            string name, string type,
            float x = 0, float y = 3, float z = 0,
            string color = "", float intensity = 1f)
        {
            var go = new GameObject(name);
            var light = go.AddComponent<Light>();
            switch (type)
            {
                case "Directional": light.type = LightType.Directional; break;
                case "Point": light.type = LightType.Point; break;
                case "Spot": light.type = LightType.Spot; break;
                case "Area": light.type = LightType.Area; break;
            }
            go.transform.position = new Vector3(x, y, z);
            light.intensity = intensity;
            if (!string.IsNullOrEmpty(color) && ColorUtility.TryParseHtmlString(color, out Color c))
                light.color = c;
            Undo.RegisterCreatedObjectUndo(go, $"ARCANA Create Light {name}");
            return $"Created {type} light: {name}";
        }

        [ArcanaTool(
            "lighting_set_color",
            "Change the color of an existing light",
            "既存ライトの色を変更",
            "lighting")]
        public static string SetColor(string name, string color)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var light = go.GetComponent<Light>();
            if (light == null) return $"No Light on {name}";
            if (!ColorUtility.TryParseHtmlString(color, out Color c))
                return $"Invalid color: {color}";
            Undo.RecordObject(light, "ARCANA Set Light Color");
            light.color = c;
            return $"Set light color of {name} to {color}";
        }

        [ArcanaTool(
            "lighting_set_intensity",
            "Change the intensity of an existing light",
            "既存ライトの強度を変更",
            "lighting")]
        public static string SetIntensity(string name, float intensity)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var light = go.GetComponent<Light>();
            if (light == null) return $"No Light on {name}";
            Undo.RecordObject(light, "ARCANA Set Light Intensity");
            light.intensity = intensity;
            return $"Set intensity of {name} to {intensity}";
        }

        [ArcanaTool(
            "lighting_set_shadow",
            "Enable or disable shadows on a light",
            "ライトの影のオン・オフを設定",
            "lighting")]
        public static string SetShadow(string name, string mode)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var light = go.GetComponent<Light>();
            if (light == null) return $"No Light on {name}";
            Undo.RecordObject(light, "ARCANA Set Shadow");
            switch (mode)
            {
                case "None": light.shadows = LightShadows.None; break;
                case "Hard": light.shadows = LightShadows.Hard; break;
                case "Soft": light.shadows = LightShadows.Soft; break;
            }
            return $"Set shadow mode of {name} to {mode}";
        }

        [ArcanaTool(
            "lighting_set_ambient",
            "Set the scene ambient light color and intensity",
            "シーンの環境光の色と強度を設定",
            "lighting")]
        public static string SetAmbient(string color, float intensity = 1f)
        {
            if (!ColorUtility.TryParseHtmlString(color, out Color c))
                return $"Invalid color: {color}";
            Undo.RecordObject(RenderSettings.defaultReflectionMode.GetType() != null
                ? RenderSettings.defaultReflectionMode.GetType() as Object : null,
                "ARCANA Set Ambient");
            RenderSettings.ambientLight = c;
            RenderSettings.ambientIntensity = intensity;
            return $"Set ambient light to {color} x {intensity}";
        }
    }
}