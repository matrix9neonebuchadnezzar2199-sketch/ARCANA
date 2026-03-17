using UnityEngine;
using UnityEditor;
using System.IO;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class ScriptTools
    {
        [ArcanaTool(Id = "script_create", Description = "Create C# Script", DescriptionJa = "C#スクリプトを作成", Category = "script")]
        public static string ScriptCreate(string className, string code, string folder = "Assets/Scripts")
        {
            if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
            var path = Path.Combine(folder, className + ".cs");
            File.WriteAllText(path, code);
            AssetDatabase.Refresh();
            return "{\"success\":true,\"message\":\"Script created: " + path + "\"}";
        }

        [ArcanaTool(Id = "script_attach", Description = "Attach Script", DescriptionJa = "スクリプトをアタッチ", Category = "script")]
        public static string ScriptAttach(string objectName, string scriptName)
        {
            var go = GameObject.Find(objectName);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + objectName + "\"}";
            var type = System.Type.GetType(scriptName);
            if (type == null) type = System.Type.GetType(scriptName + ",Assembly-CSharp");
            if (type == null) return "{\"success\":false,\"message\":\"Script not found: " + scriptName + "\"}";
            Undo.AddComponent(go, type);
            return "{\"success\":true,\"message\":\"" + scriptName + " attached to " + objectName + "\"}";
        }

        [ArcanaTool(Id = "script_set_variable", Description = "Set Script Variable", DescriptionJa = "スクリプト変数を設定", Category = "script")]
        public static string ScriptSetVariable(string objectName, string scriptName, string variableName, string value)
        {
            var go = GameObject.Find(objectName);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + objectName + "\"}";
            var comp = go.GetComponent(scriptName);
            if (comp == null) return "{\"success\":false,\"message\":\"Script not found on object\"}";
            var field = comp.GetType().GetField(variableName);
            if (field != null) { Undo.RecordObject(comp, "Set " + variableName); field.SetValue(comp, System.Convert.ChangeType(value, field.FieldType)); }
            return "{\"success\":true,\"message\":\"" + variableName + " set to " + value + "\"}";
        }

        [ArcanaTool(Id = "script_invoke_method", Description = "Invoke Script Method", DescriptionJa = "スクリプトメソッドを呼び出す", Category = "script")]
        public static string ScriptInvokeMethod(string objectName, string scriptName, string methodName, string args = "")
        {
            var go = GameObject.Find(objectName);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + objectName + "\"}";
            var comp = go.GetComponent(scriptName);
            if (comp == null) return "{\"success\":false,\"message\":\"Script not found on object\"}";
            var method = comp.GetType().GetMethod(methodName);
            if (method == null) return "{\"success\":false,\"message\":\"Method not found: " + methodName + "\"}";
            method.Invoke(comp, string.IsNullOrEmpty(args) ? null : new object[] { args });
            return "{\"success\":true,\"message\":\"" + methodName + " invoked\"}";
        }
    }
}