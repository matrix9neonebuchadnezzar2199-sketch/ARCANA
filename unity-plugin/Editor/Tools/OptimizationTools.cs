using Arcana.Runtime;
using UnityEditor;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace Arcana.Editor.Tools
{
    public static class OptimizationTools
    {
        [ArcanaTool(
            "opt_get_scene_stats",
            "Get scene statistics",
            "シーン統計情報を取得",
            "optimization")]
        public static string GetSceneStats()
        {
            var scene = SceneManager.GetActiveScene();
            var roots = scene.GetRootGameObjects();
            int totalObjects = 0;
            int totalMeshes = 0;
            int totalTris = 0;
            int totalMaterials = 0;
            var allObjects = Object.FindObjectsByType<GameObject>(
                FindObjectsInactive.Include, FindObjectsSortMode.None);
            totalObjects = allObjects.Length;
            foreach (var go in allObjects)
            {
                var mf = go.GetComponent<MeshFilter>();
                if (mf != null && mf.sharedMesh != null)
                {
                    totalMeshes++;
                    totalTris += mf.sharedMesh.triangles.Length / 3;
                }
                var r = go.GetComponent<Renderer>();
                if (r != null)
                    totalMaterials += r.sharedMaterials.Length;
            }
            return $"Scene: {scene.name} | Objects: {totalObjects} | Meshes: {totalMeshes} | Triangles: {totalTris} | Materials: {totalMaterials}";
        }

        [ArcanaTool(
            "opt_set_static",
            "Set static flags on a GameObject",
            "GameObjectのStaticフラグを設定",
            "optimization")]
        public static string SetStatic(string name, bool isStatic, bool includeChildren = true)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            Undo.RecordObject(go, "ARCANA Set Static");
            go.isStatic = isStatic;
            int count = 1;
            if (includeChildren)
            {
                foreach (Transform child in go.GetComponentsInChildren<Transform>())
                {
                    Undo.RecordObject(child.gameObject, "ARCANA Set Static Child");
                    child.gameObject.isStatic = isStatic;
                    count++;
                }
            }
            return $"Set static={isStatic} on {count} objects";
        }

        [ArcanaTool(
            "opt_add_lod_group",
            "Add a LOD Group component to a GameObject",
            "GameObjectにLOD Groupコンポーネントを追加",
            "optimization")]
        public static string AddLODGroup(
            string name, int lodLevels = 3, string fadeMode = "None")
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var lod = Undo.AddComponent<LODGroup>(go);
            switch (fadeMode)
            {
                case "CrossFade": lod.fadeMode = LODFadeMode.CrossFade; break;
                case "SpeedTree": lod.fadeMode = LODFadeMode.SpeedTree; break;
                default: lod.fadeMode = LODFadeMode.None; break;
            }
            return $"Added LOD Group to {name} with {lodLevels} levels";
        }

        [ArcanaTool(
            "opt_remove_missing_scripts",
            "Remove all missing script components from the scene",
            "シーンからMissing Scriptを全て削除",
            "optimization")]
        public static string RemoveMissingScripts()
        {
            int removed = 0;
            var allObjects = Object.FindObjectsByType<GameObject>(
                FindObjectsInactive.Include, FindObjectsSortMode.None);
            foreach (var go in allObjects)
            {
                int count = GameObjectUtility.GetMonoBehavioursWithMissingScriptCount(go);
                if (count > 0)
                {
                    Undo.RegisterCompleteObjectUndo(go, "ARCANA Remove Missing Scripts");
                    GameObjectUtility.RemoveMonoBehavioursWithMissingScript(go);
                    removed += count;
                }
            }
            return $"Removed {removed} missing script(s)";
        }
    }
}