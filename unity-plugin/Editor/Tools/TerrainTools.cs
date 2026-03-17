using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Tools
{
    public static class TerrainTools
    {
        [ArcanaTool(
            "terrain_create",
            "Create a new terrain in the scene",
            "シーンに新しいテレインを作成",
            "terrain")]
        public static string CreateTerrain(
            float width = 500, float length = 500, float height = 100)
        {
            var data = new TerrainData();
            data.size = new Vector3(width, height, length);
            data.heightmapResolution = 513;
            var go = Terrain.CreateTerrainGameObject(data);
            Undo.RegisterCreatedObjectUndo(go, "ARCANA Create Terrain");
            return $"Created terrain {width}x{length}, max height {height}";
        }

        [ArcanaTool(
            "terrain_set_height",
            "Set terrain height at a normalized position",
            "正規化座標でテレインの高さを設定",
            "terrain")]
        public static string SetHeight(
            float normalizedX, float normalizedZ, float height, int radius = 5)
        {
            var terrain = Terrain.activeTerrain;
            if (terrain == null) return "No active terrain found";
            var data = terrain.terrainData;
            int res = data.heightmapResolution;
            int cx = Mathf.RoundToInt(normalizedX * (res - 1));
            int cz = Mathf.RoundToInt(normalizedZ * (res - 1));
            int startX = Mathf.Max(0, cx - radius);
            int startZ = Mathf.Max(0, cz - radius);
            int endX = Mathf.Min(res - 1, cx + radius);
            int endZ = Mathf.Min(res - 1, cz + radius);
            int w = endX - startX + 1;
            int h = endZ - startZ + 1;
            Undo.RegisterCompleteObjectUndo(data, "ARCANA Set Terrain Height");
            float[,] heights = data.GetHeights(startX, startZ, w, h);
            for (int i = 0; i < h; i++)
                for (int j = 0; j < w; j++)
                    heights[i, j] = height;
            data.SetHeights(startX, startZ, heights);
            return $"Set terrain height at ({normalizedX}, {normalizedZ}) to {height}";
        }

        [ArcanaTool(
            "terrain_add_texture",
            "Add a texture layer to the terrain",
            "テレインにテクスチャレイヤーを追加",
            "terrain")]
        public static string AddTexture(string texturePath, float tileSize = 10f)
        {
            var terrain = Terrain.activeTerrain;
            if (terrain == null) return "No active terrain found";
            var tex = AssetDatabase.LoadAssetAtPath<Texture2D>(texturePath);
            if (tex == null) return $"Texture not found: {texturePath}";
            var data = terrain.terrainData;
            Undo.RegisterCompleteObjectUndo(data, "ARCANA Add Terrain Texture");
            var layers = new TerrainLayer[data.terrainLayers.Length + 1];
            for (int i = 0; i < data.terrainLayers.Length; i++)
                layers[i] = data.terrainLayers[i];
            var newLayer = new TerrainLayer();
            newLayer.diffuseTexture = tex;
            newLayer.tileSize = new Vector2(tileSize, tileSize);
            layers[layers.Length - 1] = newLayer;
            data.terrainLayers = layers;
            return $"Added terrain texture: {texturePath}";
        }

        [ArcanaTool(
            "terrain_add_trees",
            "Add tree instances to the terrain",
            "テレインに木を配置",
            "terrain")]
        public static string AddTrees(
            string prefabPath, int count = 100,
            float minScale = 0.8f, float maxScale = 1.2f)
        {
            var terrain = Terrain.activeTerrain;
            if (terrain == null) return "No active terrain found";
            var prefab = AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath);
            if (prefab == null) return $"Prefab not found: {prefabPath}";
            var data = terrain.terrainData;
            Undo.RegisterCompleteObjectUndo(data, "ARCANA Add Trees");
            var proto = new TreePrototype { prefab = prefab };
            var protos = new TreePrototype[data.treePrototypes.Length + 1];
            for (int i = 0; i < data.treePrototypes.Length; i++)
                protos[i] = data.treePrototypes[i];
            protos[protos.Length - 1] = proto;
            data.treePrototypes = protos;
            int protoIndex = protos.Length - 1;
            var instances = new TreeInstance[count];
            for (int i = 0; i < count; i++)
            {
                float s = Random.Range(minScale, maxScale);
                instances[i] = new TreeInstance
                {
                    position = new Vector3(Random.value, 0, Random.value),
                    widthScale = s,
                    heightScale = s,
                    prototypeIndex = protoIndex,
                    color = Color.white,
                    lightmapColor = Color.white
                };
            }
            data.SetTreeInstances(instances, false);
            return $"Added {count} trees";
        }
    }
}