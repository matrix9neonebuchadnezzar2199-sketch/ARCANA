using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Tools
{
    public static class TransformTools
    {
        [ArcanaTool(
            "transform_set_position",
            "Set the world position of a GameObject",
            "GameObjectのワールド座標を設定",
            "transform")]
        public static string SetPosition(string name, float x, float y, float z)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            Undo.RecordObject(go.transform, "ARCANA Set Position");
            go.transform.position = new Vector3(x, y, z);
            return $"Moved {name} to ({x}, {y}, {z})";
        }

        [ArcanaTool(
            "transform_set_rotation",
            "Set the rotation of a GameObject in euler angles",
            "GameObjectの回転をオイラー角で設定",
            "transform")]
        public static string SetRotation(string name, float x, float y, float z)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            Undo.RecordObject(go.transform, "ARCANA Set Rotation");
            go.transform.eulerAngles = new Vector3(x, y, z);
            return $"Rotated {name} to ({x}, {y}, {z})";
        }

        [ArcanaTool(
            "transform_set_scale",
            "Set the local scale of a GameObject",
            "GameObjectのローカルスケールを設定",
            "transform")]
        public static string SetScale(string name, float x, float y, float z)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            Undo.RecordObject(go.transform, "ARCANA Set Scale");
            go.transform.localScale = new Vector3(x, y, z);
            return $"Scaled {name} to ({x}, {y}, {z})";
        }

        [ArcanaTool(
            "transform_set_parent",
            "Set the parent of a GameObject",
            "GameObjectの親オブジェクトを設定",
            "transform")]
        public static string SetParent(string childName, string parentName)
        {
            var child = GameObject.Find(childName);
            if (child == null) return $"Child not found: {childName}";
            if (string.IsNullOrEmpty(parentName))
            {
                Undo.SetTransformParent(child.transform, null, "ARCANA Unparent");
                return $"Unparented {childName}";
            }
            var parent = GameObject.Find(parentName);
            if (parent == null) return $"Parent not found: {parentName}";
            Undo.SetTransformParent(child.transform, parent.transform, "ARCANA Set Parent");
            return $"Set parent of {childName} to {parentName}";
        }

        [ArcanaTool(
            "transform_look_at",
            "Make a GameObject look at a target position",
            "GameObjectを指定座標の方向に向ける",
            "transform")]
        public static string LookAt(string name, float targetX, float targetY, float targetZ)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            Undo.RecordObject(go.transform, "ARCANA Look At");
            go.transform.LookAt(new Vector3(targetX, targetY, targetZ));
            return $"{name} now looks at ({targetX}, {targetY}, {targetZ})";
        }
    }
}