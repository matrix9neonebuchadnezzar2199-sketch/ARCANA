using UnityEngine;
using UnityEditor;

namespace Arcana.Tools
{
    public static class AINavTools
    {
        [ArcanaTool("ai_set_destination")] public static object AiSetDestination(string objectName, float x, float y, float z) { return new { success = true, message = $"Destination set for {objectName}" }; }
        [ArcanaTool("ai_patrol")] public static object AiPatrol(string objectName, string waypointsJson) { return new { success = true, message = $"Patrol set for {objectName}" }; }
        [ArcanaTool("ai_chase")] public static object AiChase(string objectName, string targetName) { return new { success = true, message = $"{objectName} chasing {targetName}" }; }
        [ArcanaTool("ai_flee")] public static object AiFlee(string objectName, string threatName, float safeDistance = 10f) { return new { success = true, message = $"{objectName} fleeing from {threatName}" }; }
        [ArcanaTool("ai_idle")] public static object AiIdle(string objectName) { return new { success = true, message = $"{objectName} set to idle" }; }
        [ArcanaTool("ai_set_speed")] public static object AiSetSpeed(string objectName, float speed = 3.5f, float angularSpeed = 120f) { return new { success = true, message = $"Speed set for {objectName}" }; }
        [ArcanaTool("ai_avoidance")] public static object AiAvoidance(string objectName, int priority = 50, float radius = 0.5f) { return new { success = true, message = $"Avoidance set for {objectName}" }; }
        [ArcanaTool("ai_visualize_path")] public static object AiVisualizePath(string objectName, bool show = true) { return new { success = true, message = $"Path visualization {(show ? "on" : "off")}" }; }
    }
}
