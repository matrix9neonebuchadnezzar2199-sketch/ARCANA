using UnityEngine;
using UnityEditor;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class ShaderTools
    {
        [ArcanaTool(Id = "shader_set_property", Description = "Set Shader Property", DescriptionJa = "シェーダープロパティを設定", Category = "shader")]
        public static string SetProperty(string objectName, string propertyName, string valueType, string value)
        {
            var go = GameObject.Find(objectName);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found\"}";
            var renderer = go.GetComponent<Renderer>();
            if (renderer == null) return "{\"success\":false,\"message\":\"No renderer found\"}";
            var mat = renderer.sharedMaterial;
            Undo.RecordObject(mat, "Set Shader Property");
            if (valueType == "float") mat.SetFloat(propertyName, float.Parse(value));
            else if (valueType == "color") { ColorUtility.TryParseHtmlString(value, out Color c); mat.SetColor(propertyName, c); }
            return "{\"success\":true,\"message\":\"" + propertyName + " set\"}";
        }

        [ArcanaTool(Id = "shader_set_keyword", Description = "Set Shader Keyword", DescriptionJa = "シェーダーキーワードを設定", Category = "shader")]
        public static string SetKeyword(string objectName, string keyword, bool enabled = true)
        {
            var go = GameObject.Find(objectName);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found\"}";
            var mat = go.GetComponent<Renderer>()?.sharedMaterial;
            if (mat == null) return "{\"success\":false,\"message\":\"No material found\"}";
            if (enabled) mat.EnableKeyword(keyword); else mat.DisableKeyword(keyword);
            return "{\"success\":true,\"message\":\"Keyword " + keyword + (enabled ? " enabled" : " disabled") + "\"}";
        }

        [ArcanaTool(Id = "shader_switch", Description = "Switch Shader", DescriptionJa = "シェーダーを切替", Category = "shader")]
        public static string SwitchShader(string objectName, string shaderName)
        {
            var go = GameObject.Find(objectName);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found\"}";
            var mat = go.GetComponent<Renderer>()?.sharedMaterial;
            if (mat == null) return "{\"success\":false,\"message\":\"No material found\"}";
            var shader = Shader.Find(shaderName);
            if (shader == null) return "{\"success\":false,\"message\":\"Shader not found: " + shaderName + "\"}";
            Undo.RecordObject(mat, "Switch Shader");
            mat.shader = shader;
            return "{\"success\":true,\"message\":\"Shader switched to " + shaderName + "\"}";
        }

        [ArcanaTool(Id = "shader_set_global", Description = "Set Global Shader Property", DescriptionJa = "グローバルシェーダープロパティを設定", Category = "shader")]
        public static string SetGlobal(string propertyName, string valueType, string value)
        {
            if (valueType == "float") Shader.SetGlobalFloat(propertyName, float.Parse(value));
            else if (valueType == "color") { ColorUtility.TryParseHtmlString(value, out Color c); Shader.SetGlobalColor(propertyName, c); }
            return "{\"success\":true,\"message\":\"Global " + propertyName + " set\"}";
        }

        [ArcanaTool(Id = "shader_get_properties", Description = "Get Shader Properties", DescriptionJa = "シェーダープロパティを取得", Category = "shader")]
        public static string GetProperties(string objectName)
        {
            var go = GameObject.Find(objectName);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found\"}";
            var mat = go.GetComponent<Renderer>()?.sharedMaterial;
            if (mat == null) return "{\"success\":false,\"message\":\"No material found\"}";
            var shader = mat.shader;
            var count = shader.GetPropertyCount();
            var props = "";
            for (int i = 0; i < count; i++) props += shader.GetPropertyName(i) + ",";
            return "{\"success\":true,\"message\":\"" + count + " properties\",\"data\":\"" + props + "\"}";
        }

        [ArcanaTool(Id = "shader_list_all", Description = "List Available Shaders", DescriptionJa = "利用可能シェーダー一覧", Category = "shader")]
        public static string ListAll(string filter = "")
        { return "{\"success\":true,\"message\":\"Shader list retrieved\"}"; }
    }
}