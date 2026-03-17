using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Tools
{
    public static class LayerTagTools
    {
        [ArcanaTool(
            "layertag_set_layer",
            "Set the layer of a GameObject",
            "GameObjectのレイヤーを設定",
            "layertag")]
        public static string SetLayer(string name, int layer, bool includeChildren = true)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            Undo.RecordObject(go, "ARCANA Set Layer");
            go.layer = layer;
            int count = 1;
            if (includeChildren)
            {
                foreach (Transform child in go.GetComponentsInChildren<Transform>())
                {
                    Undo.RecordObject(child.gameObject, "ARCANA Set Layer Child");
                    child.gameObject.layer = layer;
                    count++;
                }
            }
            return $"Set layer={layer} on {count} objects";
        }

        [ArcanaTool(
            "layertag_set_tag",
            "Set the tag of a GameObject",
            "GameObjectのタグを設定",
            "layertag")]
        public static string SetTag(string name, string tag)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            Undo.RecordObject(go, "ARCANA Set Tag");
            go.tag = tag;
            return $"Set tag of {name} to {tag}";
        }

        [ArcanaTool(
            "layertag_rename",
            "Rename a GameObject",
            "GameObjectの名前を変更",
            "layertag")]
        public static string Rename(string name, string newName)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            Undo.RecordObject(go, "ARCANA Rename");
            go.name = newName;
            return $"Renamed {name} to {newName}";
        }
    }
}