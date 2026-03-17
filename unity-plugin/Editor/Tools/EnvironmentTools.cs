using Arcana.Runtime;
using UnityEditor;
using UnityEngine;
using UnityEngine.Rendering;

namespace Arcana.Editor.Tools
{
    public static class EnvironmentTools
    {
        [ArcanaTool(
            "env_set_skybox",
            "Set the scene skybox material",
            "シーンのスカイボックスマテリアルを設定",
            "environment")]
        public static string SetSkybox(string materialPath)
        {
            var mat = AssetDatabase.LoadAssetAtPath<Material>(materialPath);
            if (mat == null) return $"Material not found: {materialPath}";
            RenderSettings.skybox = mat;
            return $"Set skybox to {materialPath}";
        }

        [ArcanaTool(
            "env_set_fog",
            "Configure scene fog settings",
            "シーンのフォグ設定を構成",
            "environment")]
        public static string SetFog(
            bool enabled, string color = "", string mode = "",
            float density = 0.01f, float startDistance = 0, float endDistance = 300)
        {
            RenderSettings.fog = enabled;
            if (!string.IsNullOrEmpty(color) && ColorUtility.TryParseHtmlString(color, out Color c))
                RenderSettings.fogColor = c;
            if (!string.IsNullOrEmpty(mode))
            {
                switch (mode)
                {
                    case "Linear":
                        RenderSettings.fogMode = FogMode.Linear;
                        RenderSettings.fogStartDistance = startDistance;
                        RenderSettings.fogEndDistance = endDistance;
                        break;
                    case "Exponential":
                        RenderSettings.fogMode = FogMode.Exponential;
                        RenderSettings.fogDensity = density;
                        break;
                    case "ExponentialSquared":
                        RenderSettings.fogMode = FogMode.ExponentialSquared;
                        RenderSettings.fogDensity = density;
                        break;
                }
            }
            return $"Fog {(enabled ? "enabled" : "disabled")}";
        }

        [ArcanaTool(
            "env_set_reflection",
            "Configure environment reflection settings",
            "環境リフレクション設定を構成",
            "environment")]
        public static string SetReflection(
            string source = "Skybox", float intensity = 1f, int bounces = 1)
        {
            switch (source)
            {
                case "Skybox":
                    RenderSettings.defaultReflectionMode = DefaultReflectionMode.Skybox;
                    break;
                case "Custom":
                    RenderSettings.defaultReflectionMode = DefaultReflectionMode.Custom;
                    break;
            }
            RenderSettings.reflectionIntensity = intensity;
            RenderSettings.reflectionBounces = bounces;
            return $"Set reflection: source={source}, intensity={intensity}, bounces={bounces}";
        }
    }
}