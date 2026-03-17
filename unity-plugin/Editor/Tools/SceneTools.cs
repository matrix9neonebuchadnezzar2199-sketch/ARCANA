using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Tools
{
    public static class SceneTools
    {
        [ArcanaTool(
            "scene_list_objects",
            "List all GameObjects in the current scene",
            "現在のシーンの全GameObjectをリスト表示",
            "scene")]
        public static string ListObjects(bool includeInactive = false)
        {
            var objects = Object.FindObjectsByType<GameObject>(
                includeInactive ? FindObjectsInactive.Include : FindObjectsInactive.Exclude,
                FindObjectsSortMode.None);

            var names = new string[objects.Length];
            for (int i = 0; i < objects.Length; i++)
            {
                names[i] = objects[i].name;
            }
            return string.Join(", ", names);
        }

        [ArcanaTool(
            "scene_create_gameobject",
            "Create a new GameObject in the scene",
            "シーンに新しいGameObjectを作成",
            "scene")]
        public static string CreateGameObject(
            string name, string primitive = "Empty",
            float x = 0, float y = 0, float z = 0,
            string color = "")
        {
            GameObject go;
            switch (primitive)
            {
                case "Cube": go = GameObject.CreatePrimitive(PrimitiveType.Cube); break;
                case "Sphere": go = GameObject.CreatePrimitive(PrimitiveType.Sphere); break;
                case "Cylinder": go = GameObject.CreatePrimitive(PrimitiveType.Cylinder); break;
                case "Plane": go = GameObject.CreatePrimitive(PrimitiveType.Plane); break;
                case "Capsule": go = GameObject.CreatePrimitive(PrimitiveType.Capsule); break;
                default: go = new GameObject(); break;
            }

            go.name = name;
            go.transform.position = new Vector3(x, y, z);
            Undo.RegisterCreatedObjectUndo(go, $"ARCANA Create {name}");

            if (!string.IsNullOrEmpty(color))
            {
                var renderer = go.GetComponent<Renderer>();
                if (renderer != null && ColorUtility.TryParseHtmlString(color, out Color c))
                {
                    var mat = new Material(Shader.Find("Standard"));
                    mat.color = c;
                    renderer.sharedMaterial = mat;
                }
            }

            return $"Created {primitive}: {name} at ({x}, {y}, {z})";
        }

        [ArcanaTool(
            "scene_delete_gameobject",
            "Delete a GameObject by name",
            "名前を指定してGameObjectを削除",
            "scene")]
        public static string DeleteGameObject(string name)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            Undo.DestroyObjectImmediate(go);
            return $"Deleted: {name}";
        }
    }
}