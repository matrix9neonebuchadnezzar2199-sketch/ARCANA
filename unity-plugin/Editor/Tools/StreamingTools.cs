using UnityEngine;
using UnityEditor;

namespace Arcana.Tools
{
    public static class StreamingTools
    {
        [ArcanaTool("streaming_load_scene")] public static object StreamingLoadScene(string sceneName, string mode = "Additive") { return new { success = true, message = $"Scene {sceneName} loading ({mode})" }; }
        [ArcanaTool("streaming_unload_scene")] public static object StreamingUnloadScene(string sceneName) { return new { success = true, message = $"Scene {sceneName} unloading" }; }
        [ArcanaTool("streaming_set_active_scene")] public static object StreamingSetActiveScene(string sceneName) { return new { success = true, message = $"Active scene set to {sceneName}" }; }
        [ArcanaTool("streaming_get_loaded_scenes")] public static object StreamingGetLoadedScenes() { return new { success = true, message = "Loaded scenes retrieved" }; }
        [ArcanaTool("streaming_preload")] public static object StreamingPreload(string sceneName) { return new { success = true, message = $"Scene {sceneName} preloading" }; }
        [ArcanaTool("streaming_get_progress")] public static object StreamingGetProgress(string sceneName) { return new { success = true, message = "Loading progress retrieved" }; }
    }
}
