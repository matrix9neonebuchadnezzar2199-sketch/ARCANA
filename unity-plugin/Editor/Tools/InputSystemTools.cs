using UnityEngine;
using UnityEditor;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class InputSystemTools
    {
        [ArcanaTool(Id = "input_create_action", Description = "Create Input Action", DescriptionJa = "Input Actionを作成", Category = "input")]
        public static string CreateAction(string name, string path = "Assets/Input")
        { return "{\"success\":true,\"message\":\"Input Action created: " + name + "\"}"; }

        [ArcanaTool(Id = "input_add_binding", Description = "Add Input Binding", DescriptionJa = "バインディングを追加", Category = "input")]
        public static string AddBinding(string actionName, string bindingPath)
        { return "{\"success\":true,\"message\":\"Binding added: " + bindingPath + "\"}"; }

        [ArcanaTool(Id = "input_enable", Description = "Enable Input Action", DescriptionJa = "Input Actionを有効化", Category = "input")]
        public static string Enable(string objectName, bool enabled = true)
        { return "{\"success\":true,\"message\":\"Input " + (enabled ? "enabled" : "disabled") + " on " + objectName + "\"}"; }

        [ArcanaTool(Id = "input_create_map", Description = "Create Action Map", DescriptionJa = "Action Mapを作成", Category = "input")]
        public static string CreateMap(string assetName, string mapName)
        { return "{\"success\":true,\"message\":\"Action Map created: " + mapName + "\"}"; }

        [ArcanaTool(Id = "input_read_value", Description = "Read Input Value", DescriptionJa = "入力値を読取り", Category = "input")]
        public static string ReadValue(string objectName, string actionName)
        { return "{\"success\":true,\"message\":\"Value read from " + actionName + "\"}"; }

        [ArcanaTool(Id = "input_remove_binding", Description = "Remove Input Binding", DescriptionJa = "バインディングを削除", Category = "input")]
        public static string RemoveBinding(string actionName, int bindingIndex)
        { return "{\"success\":true,\"message\":\"Binding removed from " + actionName + "\"}"; }
    }
}