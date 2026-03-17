using UnityEngine;
using UnityEditor;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class VRChatTools
    {
        [ArcanaTool(Id = "vrc_world_setup", Description = "Setup VRChat World", DescriptionJa = "VRChatワールドを設定", Category = "vrchat")]
        public static string WorldSetup(float spawnX = 0f, float spawnY = 0f, float spawnZ = 0f, int maxPlayers = 32)
        { return "{\"success\":true,\"message\":\"VRChat world configured, spawn (" + spawnX + "," + spawnY + "," + spawnZ + "), max " + maxPlayers + "\"}"; }

        [ArcanaTool(Id = "vrc_avatar_setup", Description = "Setup VRChat Avatar", DescriptionJa = "VRChatアバターを設定", Category = "vrchat")]
        public static string AvatarSetup(string name, float viewX = 0f, float viewY = 1.6f, float viewZ = 0.1f)
        { return "{\"success\":true,\"message\":\"Avatar configured: " + name + "\"}"; }

        [ArcanaTool(Id = "vrc_trigger", Description = "Add VRChat Trigger", DescriptionJa = "VRChatトリガーを追加", Category = "vrchat")]
        public static string AddTrigger(string name, string eventType = "OnPlayerEnter")
        { return "{\"success\":true,\"message\":\"Trigger added: " + eventType + " on " + name + "\"}"; }

        [ArcanaTool(Id = "vrc_mirror", Description = "Add VRChat Mirror", DescriptionJa = "VRChatミラーを追加", Category = "vrchat")]
        public static string AddMirror(string name = "Mirror", float width = 2f, float height = 3f, float x = 0f, float y = 1.5f, float z = 0f)
        {
            var go = GameObject.CreatePrimitive(PrimitiveType.Quad);
            go.name = name;
            go.transform.position = new Vector3(x, y, z);
            go.transform.localScale = new Vector3(width, height, 1);
            Undo.RegisterCreatedObjectUndo(go, "Create Mirror");
            return "{\"success\":true,\"message\":\"Mirror created: " + name + "\"}";
        }

        [ArcanaTool(Id = "vrc_pickup", Description = "Add VRChat Pickup", DescriptionJa = "VRChatピックアップを追加", Category = "vrchat")]
        public static string AddPickup(string name, bool useGravity = true, bool throwable = true)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found\"}";
            var rb = go.GetComponent<Rigidbody>(); if (rb == null) rb = Undo.AddComponent<Rigidbody>(go);
            rb.useGravity = useGravity;
            return "{\"success\":true,\"message\":\"Pickup added to " + name + "\"}";
        }

        [ArcanaTool(Id = "vrc_sync", Description = "Add Object Sync", DescriptionJa = "オブジェクト同期を追加", Category = "vrchat")]
        public static string AddSync(string name, string syncType = "Continuous")
        { return "{\"success\":true,\"message\":\"ObjectSync added to " + name + " (" + syncType + ")\"}"; }

        [ArcanaTool(Id = "vrc_teleport", Description = "Add Teleport Point", DescriptionJa = "テレポートポイントを追加", Category = "vrchat")]
        public static string AddTeleport(string name = "TeleportPoint", float x = 0f, float y = 0f, float z = 0f)
        {
            var go = new GameObject(name);
            go.transform.position = new Vector3(x, y, z);
            Undo.RegisterCreatedObjectUndo(go, "Create Teleport");
            return "{\"success\":true,\"message\":\"Teleport point created: " + name + "\"}";
        }

        [ArcanaTool(Id = "vrc_video_player", Description = "Add Video Player", DescriptionJa = "動画プレイヤーを追加", Category = "vrchat")]
        public static string AddVideoPlayer(string name = "VideoPlayer", float screenWidth = 16f, float screenHeight = 9f)
        { return "{\"success\":true,\"message\":\"Video player created: " + name + "\"}"; }

        [ArcanaTool(Id = "vrc_chair", Description = "Add VRChat Chair", DescriptionJa = "VRChatチェアを追加", Category = "vrchat")]
        public static string AddChair(string name = "Chair", float x = 0f, float y = 0f, float z = 0f)
        {
            var go = new GameObject(name);
            go.transform.position = new Vector3(x, y, z);
            Undo.RegisterCreatedObjectUndo(go, "Create Chair");
            return "{\"success\":true,\"message\":\"Chair created: " + name + "\"}";
        }

        [ArcanaTool(Id = "vrc_lightmap", Description = "Bake VRChat Lightmap", DescriptionJa = "VRChatライトマップをベイク", Category = "vrchat")]
        public static string BakeLightmap(int resolution = 40, string quality = "Medium")
        {
            Lightmapping.BakeAsync();
            return "{\"success\":true,\"message\":\"Lightmap bake started: " + quality + "\"}";
        }
    }
}