using UnityEngine;
using UnityEditor;
using System.Linq;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class SelectionTools
    {
        [ArcanaTool(Id = "select_object", Description = "Select Object", DescriptionJa = "オブジェクトを選択", Category = "selection")]
        public static string SelectObject(string name)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            Selection.activeGameObject = go;
            return "{\"success\":true,\"message\":\"Selected: " + name + "\"}";
        }

        [ArcanaTool(Id = "select_all", Description = "Select All", DescriptionJa = "全オブジェクトを選択", Category = "selection")]
        public static string SelectAll()
        {
            Selection.objects = Object.FindObjectsOfType<GameObject>();
            return "{\"success\":true,\"message\":\"All objects selected: " + Selection.objects.Length + "\"}";
        }

        [ArcanaTool(Id = "select_none", Description = "Deselect All", DescriptionJa = "選択を解除", Category = "selection")]
        public static string SelectNone()
        {
            Selection.activeGameObject = null;
            Selection.objects = new Object[0];
            return "{\"success\":true,\"message\":\"Selection cleared\"}";
        }

        [ArcanaTool(Id = "select_invert", Description = "Invert Selection", DescriptionJa = "選択を反転", Category = "selection")]
        public static string SelectInvert()
        {
            var all = Object.FindObjectsOfType<GameObject>();
            var current = Selection.gameObjects;
            Selection.objects = all.Where(g => !current.Contains(g)).ToArray();
            return "{\"success\":true,\"message\":\"Selection inverted: " + Selection.objects.Length + " objects\"}";
        }
    }
}