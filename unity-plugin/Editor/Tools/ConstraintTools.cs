using UnityEngine;
using UnityEditor;
using UnityEngine.Animations;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class ConstraintTools
    {
        [ArcanaTool(Id = "constraint_position", Description = "Add Position Constraint", DescriptionJa = "PositionConstraintを追加", Category = "constraint")]
        public static string AddPositionConstraint(string name, string sourceName, float weight = 1f)
        {
            var go = GameObject.Find(name);
            var src = GameObject.Find(sourceName);
            if (go == null || src == null) return "{\"success\":false,\"message\":\"Object not found\"}";
            var c = Undo.AddComponent<PositionConstraint>(go);
            var s = new ConstraintSource { sourceTransform = src.transform, weight = weight };
            c.AddSource(s);
            c.constraintActive = true;
            return "{\"success\":true,\"message\":\"PositionConstraint added\"}";
        }

        [ArcanaTool(Id = "constraint_rotation", Description = "Add Rotation Constraint", DescriptionJa = "RotationConstraintを追加", Category = "constraint")]
        public static string AddRotationConstraint(string name, string sourceName, float weight = 1f)
        {
            var go = GameObject.Find(name);
            var src = GameObject.Find(sourceName);
            if (go == null || src == null) return "{\"success\":false,\"message\":\"Object not found\"}";
            var c = Undo.AddComponent<RotationConstraint>(go);
            var s = new ConstraintSource { sourceTransform = src.transform, weight = weight };
            c.AddSource(s);
            c.constraintActive = true;
            return "{\"success\":true,\"message\":\"RotationConstraint added\"}";
        }

        [ArcanaTool(Id = "constraint_scale", Description = "Add Scale Constraint", DescriptionJa = "ScaleConstraintを追加", Category = "constraint")]
        public static string AddScaleConstraint(string name, string sourceName, float weight = 1f)
        {
            var go = GameObject.Find(name);
            var src = GameObject.Find(sourceName);
            if (go == null || src == null) return "{\"success\":false,\"message\":\"Object not found\"}";
            var c = Undo.AddComponent<ScaleConstraint>(go);
            var s = new ConstraintSource { sourceTransform = src.transform, weight = weight };
            c.AddSource(s);
            c.constraintActive = true;
            return "{\"success\":true,\"message\":\"ScaleConstraint added\"}";
        }

        [ArcanaTool(Id = "constraint_aim", Description = "Add Aim Constraint", DescriptionJa = "AimConstraintを追加", Category = "constraint")]
        public static string AddAimConstraint(string name, string sourceName, float weight = 1f, string aimAxis = "Z")
        {
            var go = GameObject.Find(name);
            var src = GameObject.Find(sourceName);
            if (go == null || src == null) return "{\"success\":false,\"message\":\"Object not found\"}";
            var c = Undo.AddComponent<AimConstraint>(go);
            var s = new ConstraintSource { sourceTransform = src.transform, weight = weight };
            c.AddSource(s);
            c.constraintActive = true;
            return "{\"success\":true,\"message\":\"AimConstraint added\"}";
        }
    }
}