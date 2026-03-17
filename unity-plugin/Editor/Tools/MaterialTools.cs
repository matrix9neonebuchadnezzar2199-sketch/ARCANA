using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Tools
{
    public static class MaterialTools
    {
        [ArcanaTool(
            "material_set_color",
            "Set the main color of a GameObjects material",
            "GameObjectのマテリアルのメインカラーを設定",
            "material")]
        public static string SetColor(string name, string color)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var renderer = go.GetComponent<Renderer>();
            if (renderer == null) return $"No Renderer on {name}";
            if (!ColorUtility.TryParseHtmlString(color, out Color c))
                return $"Invalid color: {color}";
            Undo.RecordObject(renderer.sharedMaterial, "ARCANA Set Color");
            renderer.sharedMaterial.color = c;
            return $"Set color of {name} to {color}";
        }

        [ArcanaTool(
            "material_set_transparency",
            "Set the transparency of a GameObjects material",
            "GameObjectのマテリアルの透明度を設定",
            "material")]
        public static string SetTransparency(string name, float alpha)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var renderer = go.GetComponent<Renderer>();
            if (renderer == null) return $"No Renderer on {name}";
            var mat = renderer.sharedMaterial;
            Undo.RecordObject(mat, "ARCANA Set Transparency");
            var c = mat.color;
            c.a = alpha;
            mat.color = c;
            if (alpha < 1f)
            {
                mat.SetFloat("_Mode", 3);
                mat.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.SrcAlpha);
                mat.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
                mat.SetInt("_ZWrite", 0);
                mat.DisableKeyword("_ALPHATEST_ON");
                mat.EnableKeyword("_ALPHABLEND_ON");
                mat.DisableKeyword("_ALPHAPREMULTIPLY_ON");
                mat.renderQueue = 3000;
            }
            return $"Set transparency of {name} to {alpha}";
        }

        [ArcanaTool(
            "material_set_emission",
            "Enable emission and set emission color",
            "発光を有効にし発光色を設定",
            "material")]
        public static string SetEmission(string name, string color, float intensity = 1f)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var renderer = go.GetComponent<Renderer>();
            if (renderer == null) return $"No Renderer on {name}";
            if (!ColorUtility.TryParseHtmlString(color, out Color c))
                return $"Invalid color: {color}";
            var mat = renderer.sharedMaterial;
            Undo.RecordObject(mat, "ARCANA Set Emission");
            mat.EnableKeyword("_EMISSION");
            mat.SetColor("_EmissionColor", c * intensity);
            return $"Set emission of {name} to {color} x {intensity}";
        }

        [ArcanaTool(
            "material_set_shader",
            "Change the shader of a GameObjects material",
            "GameObjectのマテリアルのシェーダーを変更",
            "material")]
        public static string SetShader(string name, string shader)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var renderer = go.GetComponent<Renderer>();
            if (renderer == null) return $"No Renderer on {name}";
            var s = Shader.Find(shader);
            if (s == null) return $"Shader not found: {shader}";
            Undo.RecordObject(renderer.sharedMaterial, "ARCANA Set Shader");
            renderer.sharedMaterial.shader = s;
            return $"Set shader of {name} to {shader}";
        }

        [ArcanaTool(
            "material_set_texture",
            "Set the main texture from a file path",
            "ファイルパスからメインテクスチャを設定",
            "material")]
        public static string SetTexture(string name, string texturePath)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var renderer = go.GetComponent<Renderer>();
            if (renderer == null) return $"No Renderer on {name}";
            var tex = AssetDatabase.LoadAssetAtPath<Texture2D>(texturePath);
            if (tex == null) return $"Texture not found: {texturePath}";
            Undo.RecordObject(renderer.sharedMaterial, "ARCANA Set Texture");
            renderer.sharedMaterial.mainTexture = tex;
            return $"Set texture of {name} to {texturePath}";
        }
    }
}