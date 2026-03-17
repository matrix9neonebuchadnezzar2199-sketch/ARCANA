using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Tools
{
    public static class PhysicsTools
    {
        [ArcanaTool(
            "physics_add_rigidbody",
            "Add a Rigidbody component to a GameObject",
            "GameObjectにRigidbodyコンポーネントを追加",
            "physics")]
        public static string AddRigidbody(
            string name, float mass = 1f,
            bool useGravity = true, bool isKinematic = false)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            Undo.AddComponent<Rigidbody>(go);
            var rb = go.GetComponent<Rigidbody>();
            rb.mass = mass;
            rb.useGravity = useGravity;
            rb.isKinematic = isKinematic;
            return $"Added Rigidbody to {name}: mass={mass}";
        }

        [ArcanaTool(
            "physics_add_collider",
            "Add a collider component to a GameObject",
            "GameObjectにコライダーコンポーネントを追加",
            "physics")]
        public static string AddCollider(string name, string type, bool isTrigger = false)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            Collider col = null;
            switch (type)
            {
                case "Box": col = Undo.AddComponent<BoxCollider>(go); break;
                case "Sphere": col = Undo.AddComponent<SphereCollider>(go); break;
                case "Capsule": col = Undo.AddComponent<CapsuleCollider>(go); break;
                case "Mesh": col = Undo.AddComponent<MeshCollider>(go); break;
                default: return $"Unknown collider type: {type}";
            }
            if (col != null) col.isTrigger = isTrigger;
            return $"Added {type} collider to {name}";
        }

        [ArcanaTool(
            "physics_set_gravity",
            "Set the global gravity for physics simulation",
            "物理シミュレーションのグローバル重力を設定",
            "physics")]
        public static string SetGravity(float x = 0, float y = -9.81f, float z = 0)
        {
            Physics.gravity = new Vector3(x, y, z);
            return $"Set gravity to ({x}, {y}, {z})";
        }
    }
}