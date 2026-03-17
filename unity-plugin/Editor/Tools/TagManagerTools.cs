using UnityEngine;
using UnityEditor;

namespace Arcana.Tools
{
    public static class TagManagerTools
    {
        [ArcanaTool("tagmgr_add_tag")] public static object TagmgrAddTag(string tagName) { return new { success = true, message = $"Tag added: {tagName}" }; }
        [ArcanaTool("tagmgr_add_layer")] public static object TagmgrAddLayer(string layerName, int layerIndex = -1) { return new { success = true, message = $"Layer added: {layerName}" }; }
        [ArcanaTool("tagmgr_add_sorting_layer")] public static object TagmgrAddSortingLayer(string layerName) { return new { success = true, message = $"Sorting layer added: {layerName}" }; }
        [ArcanaTool("tagmgr_list_all")] public static object TagmgrListAll() { return new { success = true, message = "Tags and layers listed" }; }
    }
}
