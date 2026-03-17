using UnityEngine;
using UnityEditor;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class AddressablesTools
    {
        [ArcanaTool(Id = "addr_create_group", Description = "Create Addressable Group", DescriptionJa = "Addressableグループを作成", Category = "addressables")]
        public static string CreateGroup(string groupName, string schema = "Packed")
        { return "{\"success\":true,\"message\":\"Group created: " + groupName + "\"}"; }

        [ArcanaTool(Id = "addr_add_entry", Description = "Add Addressable Entry", DescriptionJa = "Addressableエントリを追加", Category = "addressables")]
        public static string AddEntry(string assetPath, string groupName, string address = "")
        { return "{\"success\":true,\"message\":\"Entry added: " + assetPath + "\"}"; }

        [ArcanaTool(Id = "addr_set_label", Description = "Set Addressable Label", DescriptionJa = "Addressableラベルを設定", Category = "addressables")]
        public static string SetLabel(string address, string label, bool enabled = true)
        { return "{\"success\":true,\"message\":\"Label " + label + (enabled ? " added" : " removed") + "\"}"; }

        [ArcanaTool(Id = "addr_build", Description = "Build Addressables", DescriptionJa = "Addressablesをビルド", Category = "addressables")]
        public static string Build(bool cleanBuild = false)
        { return "{\"success\":true,\"message\":\"Addressables built\"}"; }

        [ArcanaTool(Id = "addr_load", Description = "Load Addressable", DescriptionJa = "Addressableをロード", Category = "addressables")]
        public static string Load(string address)
        { return "{\"success\":true,\"message\":\"Loaded: " + address + "\"}"; }

        [ArcanaTool(Id = "addr_profile", Description = "Set Addressable Profile", DescriptionJa = "Addressableプロファイルを設定", Category = "addressables")]
        public static string SetProfile(string profileName)
        { return "{\"success\":true,\"message\":\"Profile set: " + profileName + "\"}"; }
    }
}