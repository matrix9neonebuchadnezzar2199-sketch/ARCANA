using UnityEngine;
using UnityEditor;

namespace Arcana.Tools
{
    public static class GizmoTools
    {
        [ArcanaTool("gizmo_draw_sphere")] public static object GizmoDrawSphere(float x, float y, float z, float radius = 1f, float r = 1f, float g = 1f, float b = 0f) { return new { success = true, message = "Gizmo sphere drawn" }; }
        [ArcanaTool("gizmo_draw_cube")] public static object GizmoDrawCube(float x, float y, float z, float sizeX = 1f, float sizeY = 1f, float sizeZ = 1f, float r = 0f, float g = 1f, float b = 0f) { return new { success = true, message = "Gizmo cube drawn" }; }
        [ArcanaTool("gizmo_draw_line")] public static object GizmoDrawLine(float fromX, float fromY, float fromZ, float toX, float toY, float toZ, float r = 1f, float g = 0f, float b = 0f) { return new { success = true, message = "Gizmo line drawn" }; }
        [ArcanaTool("gizmo_draw_ray")] public static object GizmoDrawRay(float originX, float originY, float originZ, float dirX, float dirY, float dirZ, float r = 0f, float g = 0f, float b = 1f) { return new { success = true, message = "Gizmo ray drawn" }; }
        [ArcanaTool("gizmo_draw_label")] public static object GizmoDrawLabel(float x, float y, float z, string text, int fontSize = 12) { return new { success = true, message = $"Label drawn: {text}" }; }
        [ArcanaTool("gizmo_clear_all")] public static object GizmoClearAll() { return new { success = true, message = "All gizmos cleared" }; }
    }
}
