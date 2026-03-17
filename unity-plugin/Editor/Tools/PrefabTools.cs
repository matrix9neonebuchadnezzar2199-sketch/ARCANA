using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Tools
{
    public static class PrefabTools
    {
        [ArcanaTool(
            "prefab_create",
            "Save a GameObject as a prefab asset",
            "GameObjectをプレハブアセットとして保存",
            "prefab")]
        public static string Create(string name, string savePath = "")
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            if (string.IsNullOrEmpty(savePath))
                savePath = $"Assets/{name}.prefab";
            PrefabUtility.SaveAsPrefabAsset(go, savePath);
            return $"Created prefab: {savePath}";
        }

        [ArcanaTool(
            "prefab_instantiate",
            "Instantiate a prefab into the scene",
            "プレハブをシーンにインスタンス化",
            "prefab")]
        public static string Instantiate(
            string prefabPath, string name = "",
            float x = 0, float y = 0, float z = 0)
        {
            var prefab = AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath);
            if (prefab == null) return $"Prefab not found: {prefabPath}";
            var instance = (GameObject)PrefabUtility.InstantiatePrefab(prefab);
            instance.transform.position = new Vector3(x, y, z);
            if (!string.IsNullOrEmpty(name))
                instance.name = name;
            Undo.RegisterCreatedObjectUndo(instance, "ARCANA Instantiate Prefab");
            return $"Instantiated: {instance.name} at ({x}, {y}, {z})";
        }

        [ArcanaTool(
            "prefab_unpack",
            "Unpack a prefab instance in the scene",
            "シーン内のプレハブインスタンスをアンパック",
            "prefab")]
        public static string Unpack(string name, bool completely = false)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            if (!PrefabUtility.IsPartOfPrefabInstance(go))
                return $"{name} is not a prefab instance";
            Undo.RegisterFullObjectHierarchyUndo(go, "ARCANA Unpack Prefab");
            if (completely)
                PrefabUtility.UnpackPrefabInstance(go, PrefabUnpackMode.Completely, InteractionMode.AutomatedAction);
            else
                PrefabUtility.UnpackPrefabInstance(go, PrefabUnpackMode.OutermostRoot, InteractionMode.AutomatedAction);
            return $"Unpacked prefab: {name}";
        }
    }
}