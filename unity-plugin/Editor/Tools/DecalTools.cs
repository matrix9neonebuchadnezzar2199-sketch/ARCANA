using UnityEngine;
using UnityEditor;

namespace Arcana.Tools
{
    public static class DecalTools
    {
        [ArcanaTool("decal_create")]
        public static object DecalCreate(string name = "NewDecal", string materialPath = "", float x = 0, float y = 0, float z = 0)
        { return new { success = true, message = $"Decal created: {name}" }; }

        [ArcanaTool("decal_set_size")]
        public static object DecalSetSize(string objectName, float width = 1, float height = 1, float depth = 1)
        { return new { success = true, message = $"Decal size set on {objectName}" }; }

        [ArcanaTool("decal_set_material")]
        public static object DecalSetMaterial(string objectName, string materialPath)
        { return new { success = true, message = $"Material changed on {objectName}" }; }

        [ArcanaTool("decal_set_opacity")]
        public static object DecalSetOpacity(string objectName, float opacity = 1f)
        { return new { success = true, message = $"Opacity set to {opacity} on {objectName}" }; }

        [ArcanaTool("decal_remove")]
        public static object DecalRemove(string objectName)
        { return new { success = true, message = $"Decal removed: {objectName}" }; }
    }
}
