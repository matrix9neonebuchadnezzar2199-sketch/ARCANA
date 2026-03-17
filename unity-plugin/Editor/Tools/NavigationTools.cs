using UnityEngine;
using UnityEditor;
using UnityEngine.AI;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class NavigationTools
    {
        [ArcanaTool(Id = "nav_bake", Description = "Bake NavMesh", DescriptionJa = "NavMeshをベイクする", Category = "navigation")]
        public static string NavBake()
        {
            UnityEditor.AI.NavMeshBuilder.BuildNavMesh();
            return "{\"success\":true,\"message\":\"NavMesh baked\"}";
        }

        [ArcanaTool(Id = "nav_add_agent", Description = "Add NavMeshAgent", DescriptionJa = "NavMeshAgentを追加", Category = "navigation")]
        public static string NavAddAgent(string name, float speed = 3.5f, float radius = 0.5f, float height = 2f)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            Undo.AddComponent<NavMeshAgent>(go);
            var agent = go.GetComponent<NavMeshAgent>();
            agent.speed = speed;
            agent.radius = radius;
            agent.height = height;
            return "{\"success\":true,\"message\":\"NavMeshAgent added to " + name + "\"}";
        }

        [ArcanaTool(Id = "nav_add_obstacle", Description = "Add NavMeshObstacle", DescriptionJa = "NavMeshObstacleを追加", Category = "navigation")]
        public static string NavAddObstacle(string name, bool carve = true, float sizeX = 1f, float sizeY = 1f, float sizeZ = 1f)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            Undo.AddComponent<NavMeshObstacle>(go);
            var obs = go.GetComponent<NavMeshObstacle>();
            obs.carving = carve;
            obs.size = new Vector3(sizeX, sizeY, sizeZ);
            return "{\"success\":true,\"message\":\"NavMeshObstacle added to " + name + "\"}";
        }

        [ArcanaTool(Id = "nav_add_link", Description = "Add OffMeshLink", DescriptionJa = "OffMeshLinkを追加", Category = "navigation")]
        public static string NavAddLink(string name, float startX, float startY, float startZ, float endX, float endY, float endZ, bool bidirectional = true)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            var link = Undo.AddComponent<OffMeshLink>(go);
            var startObj = new GameObject("OffMeshLink_Start");
            startObj.transform.position = new Vector3(startX, startY, startZ);
            startObj.transform.SetParent(go.transform);
            var endObj = new GameObject("OffMeshLink_End");
            endObj.transform.position = new Vector3(endX, endY, endZ);
            endObj.transform.SetParent(go.transform);
            link.startTransform = startObj.transform;
            link.endTransform = endObj.transform;
            link.biDirectional = bidirectional;
            return "{\"success\":true,\"message\":\"OffMeshLink added to " + name + "\"}";
        }
    }
}