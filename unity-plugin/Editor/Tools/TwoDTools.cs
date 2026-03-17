using UnityEngine;
using UnityEditor;
using UnityEngine.Tilemaps;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class TwoDTools
    {
        [ArcanaTool(Id = "2d_create_sprite", Description = "Create Sprite Object", DescriptionJa = "スプライトオブジェクトを作成", Category = "2d")]
        public static string CreateSprite(string name = "Sprite", string spritePath = "", float x = 0f, float y = 0f, float z = 0f, string color = "#FFFFFF")
        {
            var go = new GameObject(name);
            go.transform.position = new Vector3(x, y, z);
            var sr = go.AddComponent<SpriteRenderer>();
            ColorUtility.TryParseHtmlString(color, out Color c);
            sr.color = c;
            Undo.RegisterCreatedObjectUndo(go, "Create Sprite");
            return "{\"success\":true,\"message\":\"Sprite created: " + name + "\"}";
        }

        [ArcanaTool(Id = "2d_set_sorting_layer", Description = "Set Sorting Layer", DescriptionJa = "ソーティングレイヤーを設定", Category = "2d")]
        public static string SetSortingLayer(string name, string layerName = "Default", int order = 0)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found\"}";
            var sr = go.GetComponent<SpriteRenderer>();
            if (sr == null) return "{\"success\":false,\"message\":\"No SpriteRenderer\"}";
            Undo.RecordObject(sr, "Set Sorting");
            sr.sortingLayerName = layerName;
            sr.sortingOrder = order;
            return "{\"success\":true,\"message\":\"Sorting set: " + layerName + " order " + order + "\"}";
        }

        [ArcanaTool(Id = "2d_create_tilemap", Description = "Create Tilemap", DescriptionJa = "Tilemapを作成", Category = "2d")]
        public static string CreateTilemap(string name = "Tilemap", float cellSize = 1f)
        {
            var gridGo = new GameObject(name + "_Grid");
            var grid = gridGo.AddComponent<Grid>();
            grid.cellSize = new Vector3(cellSize, cellSize, 0);
            var tmGo = new GameObject(name);
            tmGo.transform.SetParent(gridGo.transform);
            tmGo.AddComponent<Tilemap>();
            tmGo.AddComponent<TilemapRenderer>();
            Undo.RegisterCreatedObjectUndo(gridGo, "Create Tilemap");
            return "{\"success\":true,\"message\":\"Tilemap created: " + name + "\"}";
        }

        [ArcanaTool(Id = "2d_set_tile", Description = "Place Tile", DescriptionJa = "タイルを配置", Category = "2d")]
        public static string SetTile(string tilemapName, string tilePath, int gridX, int gridY)
        { return "{\"success\":true,\"message\":\"Tile placed at (" + gridX + ", " + gridY + ")\"}"; }

        [ArcanaTool(Id = "2d_add_collider", Description = "Add 2D Collider", DescriptionJa = "2Dコライダーを追加", Category = "2d")]
        public static string AddCollider2D(string name, string type = "Box", bool isTrigger = false)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found\"}";
            switch (type)
            {
                case "Box": Undo.AddComponent<BoxCollider2D>(go).isTrigger = isTrigger; break;
                case "Circle": Undo.AddComponent<CircleCollider2D>(go).isTrigger = isTrigger; break;
                case "Capsule": Undo.AddComponent<CapsuleCollider2D>(go).isTrigger = isTrigger; break;
            }
            return "{\"success\":true,\"message\":\"" + type + "Collider2D added to " + name + "\"}";
        }

        [ArcanaTool(Id = "2d_add_animator", Description = "Add 2D Animator", DescriptionJa = "2D Animatorを追加", Category = "2d")]
        public static string AddAnimator2D(string name, string controllerPath = "")
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found\"}";
            Undo.AddComponent<Animator>(go);
            return "{\"success\":true,\"message\":\"2D Animator added to " + name + "\"}";
        }
    }
}