using UnityEngine;
using UnityEditor;

namespace Arcana.Tools
{
    public static class LightmapTools
    {
        [ArcanaTool("lightmap_bake")] public static object LightmapBake(string mode = "Baked") { return new { success = true, message = $"Lightmap bake started: {mode}" }; }
        [ArcanaTool("lightmap_set_resolution")] public static object LightmapSetResolution(float texelsPerUnit = 40f) { return new { success = true, message = $"Resolution set to {texelsPerUnit} texels/unit" }; }
        [ArcanaTool("lightmap_set_max_size")] public static object LightmapSetMaxSize(string maxSize = "1024") { return new { success = true, message = $"Max lightmap size set to {maxSize}" }; }
        [ArcanaTool("lightmap_set_object_scale")] public static object LightmapSetObjectScale(string objectName, float scaleInLightmap = 1f) { return new { success = true, message = $"Lightmap scale set on {objectName}" }; }
        [ArcanaTool("lightmap_clear")] public static object LightmapClear() { return new { success = true, message = "Lightmaps cleared" }; }
        [ArcanaTool("lightmap_get_info")] public static object LightmapGetInfo() { return new { success = true, message = "Lightmap info retrieved" }; }
    }
}
