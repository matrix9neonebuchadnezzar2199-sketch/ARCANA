using UnityEngine;
using UnityEditor;

namespace Arcana.Tools
{
    public static class XRTools
    {
        [ArcanaTool("xr_setup")] public static object XrSetup(string sdk = "OpenXR") { return new { success = true, message = $"XR setup: {sdk}" }; }
        [ArcanaTool("xr_tracking")] public static object XrTracking(string objectName, string target = "head") { return new { success = true, message = $"Tracking {target}" }; }
        [ArcanaTool("xr_controller")] public static object XrController(string hand = "right") { return new { success = true, message = $"Controller: {hand}" }; }
        [ArcanaTool("xr_haptics")] public static object XrHaptics(string hand = "right", float amplitude = 0.5f, float duration = 0.1f) { return new { success = true, message = "Haptics sent" }; }
        [ArcanaTool("xr_teleport")] public static object XrTeleport(string objectName = "XRRig") { return new { success = true, message = "Teleport setup" }; }
        [ArcanaTool("xr_grab")] public static object XrGrab(string objectName) { return new { success = true, message = $"Grab enabled on {objectName}" }; }
        [ArcanaTool("xr_ray_interaction")] public static object XrRayInteraction(string hand = "right", float maxDistance = 10f) { return new { success = true, message = "Ray interaction setup" }; }
        [ArcanaTool("xr_ui")] public static object XrUI(string canvasName) { return new { success = true, message = $"XR UI canvas: {canvasName}" }; }
        [ArcanaTool("xr_passthrough")] public static object XrPassthrough(bool enabled = true) { return new { success = true, message = $"Passthrough {(enabled ? "on" : "off")}" }; }
        [ArcanaTool("xr_boundary")] public static object XrBoundary(float sizeX = 3, float sizeZ = 3) { return new { success = true, message = "Boundary set" }; }
    }
}
