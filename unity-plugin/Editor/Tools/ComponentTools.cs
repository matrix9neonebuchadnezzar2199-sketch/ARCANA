using System;
using System.Linq;
using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Tools
{
    public static class ComponentTools
    {
        [ArcanaTool(
            "component_add",
            "Add a component to a GameObject by type name",
            "型名を指定してGameObjectにコンポーネントを追加",
            "component")]
        public static string Add(string name, string componentType)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var type = AppDomain.CurrentDomain.GetAssemblies()
                .SelectMany(a => { try { return a.GetTypes(); } catch { return new Type[0]; } })
                .FirstOrDefault(t => t.Name == componentType && typeof(Component).IsAssignableFrom(t));
            if (type == null) return $"Component type not found: {componentType}";
            Undo.AddComponent(go, type);
            return $"Added {componentType} to {name}";
        }

        [ArcanaTool(
            "component_remove",
            "Remove a component from a GameObject by type name",
            "型名を指定してGameObjectからコンポーネントを削除",
            "component")]
        public static string Remove(string name, string componentType)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var comp = go.GetComponents<Component>()
                .FirstOrDefault(c => c != null && c.GetType().Name == componentType);
            if (comp == null) return $"No {componentType} on {name}";
            Undo.DestroyObjectImmediate(comp);
            return $"Removed {componentType} from {name}";
        }

        [ArcanaTool(
            "component_set_enabled",
            "Enable or disable a component on a GameObject",
            "GameObjectのコンポーネントの有効/無効を設定",
            "component")]
        public static string SetEnabled(string name, string componentType, bool enabled)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var comp = go.GetComponents<Component>()
                .FirstOrDefault(c => c != null && c.GetType().Name == componentType);
            if (comp == null) return $"No {componentType} on {name}";
            if (comp is Behaviour b)
            {
                Undo.RecordObject(b, "ARCANA Set Enabled");
                b.enabled = enabled;
            }
            else if (comp is Renderer r)
            {
                Undo.RecordObject(r, "ARCANA Set Enabled");
                r.enabled = enabled;
            }
            else if (comp is Collider c2)
            {
                Undo.RecordObject(c2, "ARCANA Set Enabled");
                c2.enabled = enabled;
            }
            else return $"Cannot toggle enabled on {componentType}";
            return $"Set {componentType} enabled={enabled} on {name}";
        }

        [ArcanaTool(
            "component_list",
            "List all components on a GameObject",
            "GameObjectの全コンポーネントをリスト表示",
            "component")]
        public static string List(string name)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var comps = go.GetComponents<Component>();
            var names = comps
                .Where(c => c != null)
                .Select(c => c.GetType().Name)
                .ToArray();
            return $"Components on {name}: {string.Join(", ", names)}";
        }
    }
}