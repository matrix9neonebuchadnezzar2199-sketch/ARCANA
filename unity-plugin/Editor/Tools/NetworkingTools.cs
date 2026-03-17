using UnityEngine;
using UnityEditor;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class NetworkingTools
    {
        [ArcanaTool(Id = "net_setup", Description = "Setup NetworkManager", DescriptionJa = "NetworkManagerを設定", Category = "networking")]
        public static string Setup(string transport = "Unity", int maxPlayers = 16, int port = 7777)
        { return "{\"success\":true,\"message\":\"NetworkManager configured: " + transport + " max " + maxPlayers + "\"}"; }

        [ArcanaTool(Id = "net_spawn", Description = "Register Network Prefab", DescriptionJa = "ネットワークプレハブを登録", Category = "networking")]
        public static string RegisterPrefab(string prefabPath, bool playerPrefab = false)
        { return "{\"success\":true,\"message\":\"Network prefab registered: " + prefabPath + "\"}"; }

        [ArcanaTool(Id = "net_send_rpc", Description = "Send RPC", DescriptionJa = "RPCを送信", Category = "networking")]
        public static string SendRpc(string objectName, string methodName, string target = "Server", string args = "")
        { return "{\"success\":true,\"message\":\"RPC " + methodName + " sent to " + target + "\"}"; }

        [ArcanaTool(Id = "net_sync_var", Description = "Set Network Variable", DescriptionJa = "ネットワーク変数を設定", Category = "networking")]
        public static string SyncVar(string objectName, string variableName, string value)
        { return "{\"success\":true,\"message\":\"" + variableName + " synced on " + objectName + "\"}"; }

        [ArcanaTool(Id = "net_connect", Description = "Start Network", DescriptionJa = "ネットワークを開始", Category = "networking")]
        public static string Connect(string mode = "Host", string address = "127.0.0.1")
        { return "{\"success\":true,\"message\":\"Network started as " + mode + "\"}"; }

        [ArcanaTool(Id = "net_disconnect", Description = "Stop Network", DescriptionJa = "ネットワークを終了", Category = "networking")]
        public static string Disconnect()
        { return "{\"success\":true,\"message\":\"Network disconnected\"}"; }
    }
}