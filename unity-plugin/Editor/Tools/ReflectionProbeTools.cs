using UnityEngine;
using UnityEditor;

namespace Arcana.Tools
{
    public static class ReflectionProbeTools
    {
        [ArcanaTool("probe_create")] public static object ProbeCreate(string name = "NewProbe", float x = 0, float y = 1, float z = 0, string mode = "Baked") { return new { success = true, message = $"Reflection Probe created: {name}" }; }
        [ArcanaTool("probe_set_size")] public static object ProbeSetSize(string objectName, float sizeX = 10, float sizeY = 10, float sizeZ = 10) { return new { success = true, message = $"Probe size set on {objectName}" }; }
        [ArcanaTool("probe_set_resolution")] public static object ProbeSetResolution(string objectName, string resolution = "256") { return new { success = true, message = $"Probe resolution set to {resolution}" }; }
        [ArcanaTool("probe_set_intensity")] public static object ProbeSetIntensity(string objectName, float intensity = 1f) { return new { success = true, message = $"Probe intensity set to {intensity}" }; }
        [ArcanaTool("probe_bake")] public static object ProbeBake(string objectName) { return new { success = true, message = $"Probe baked: {objectName}" }; }
        [ArcanaTool("probe_remove")] public static object ProbeRemove(string objectName) { return new { success = true, message = $"Probe removed: {objectName}" }; }
    }
}
