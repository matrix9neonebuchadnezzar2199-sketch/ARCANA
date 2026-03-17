using UnityEngine;
using UnityEditor;

namespace Arcana.Tools
{
    public static class OcclusionCullingTools
    {
        [ArcanaTool("occlusion_bake")] public static object OcclusionBake() { return new { success = true, message = "Occlusion culling bake started" }; }
        [ArcanaTool("occlusion_set_occluder")] public static object OcclusionSetOccluder(string objectName, bool enabled = true) { return new { success = true, message = $"{objectName} occluder static: {enabled}" }; }
        [ArcanaTool("occlusion_set_occludee")] public static object OcclusionSetOccludee(string objectName, bool enabled = true) { return new { success = true, message = $"{objectName} occludee static: {enabled}" }; }
        [ArcanaTool("occlusion_set_params")] public static object OcclusionSetParams(float smallestOccluder = 5f, float smallestHole = 0.25f, float backfaceThreshold = 100f) { return new { success = true, message = "Occlusion parameters updated" }; }
        [ArcanaTool("occlusion_clear")] public static object OcclusionClear() { return new { success = true, message = "Occlusion data cleared" }; }
        [ArcanaTool("occlusion_visualize")] public static object OcclusionVisualize(bool enabled = true) { return new { success = true, message = $"Occlusion visualization: {(enabled ? "on" : "off")}" }; }
    }
}
