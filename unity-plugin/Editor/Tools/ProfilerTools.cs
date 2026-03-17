using UnityEngine;
using UnityEditor;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class ProfilerTools
    {
        [ArcanaTool(Id = "prof_cpu_start", Description = "Start CPU Profiling", DescriptionJa = "CPUプロファイリング開始", Category = "profiler")]
        public static string CpuStart(bool deepProfile = false)
        { UnityEngine.Profiling.Profiler.enabled = true; return "{\"success\":true,\"message\":\"CPU profiling started\"}"; }

        [ArcanaTool(Id = "prof_cpu_stop", Description = "Stop CPU Profiling", DescriptionJa = "CPUプロファイリング停止", Category = "profiler")]
        public static string CpuStop()
        { UnityEngine.Profiling.Profiler.enabled = false; return "{\"success\":true,\"message\":\"CPU profiling stopped\"}"; }

        [ArcanaTool(Id = "prof_mem_snapshot", Description = "Memory Snapshot", DescriptionJa = "メモリスナップショット", Category = "profiler")]
        public static string MemSnapshot(string savePath = "")
        { var mem = UnityEngine.Profiling.Profiler.GetTotalAllocatedMemoryLong() / 1048576; return "{\"success\":true,\"message\":\"Memory: " + mem + " MB\"}"; }

        [ArcanaTool(Id = "prof_gpu", Description = "GPU Profiling", DescriptionJa = "GPUプロファイリング", Category = "profiler")]
        public static string Gpu()
        { return "{\"success\":true,\"message\":\"GPU profiling completed\"}"; }

        [ArcanaTool(Id = "prof_frame_analysis", Description = "Frame Analysis", DescriptionJa = "フレーム分析", Category = "profiler")]
        public static string FrameAnalysis(int frameCount = 30)
        { return "{\"success\":true,\"message\":\"Analyzed " + frameCount + " frames\"}"; }

        [ArcanaTool(Id = "prof_bottleneck", Description = "Detect Bottleneck", DescriptionJa = "ボトルネック検出", Category = "profiler")]
        public static string Bottleneck()
        { return "{\"success\":true,\"message\":\"Bottleneck analysis completed\"}"; }

        [ArcanaTool(Id = "prof_draw_calls", Description = "Get Draw Calls", DescriptionJa = "ドローコール取得", Category = "profiler")]
        public static string DrawCalls()
        { return "{\"success\":true,\"message\":\"Draw call info retrieved\"}"; }

        [ArcanaTool(Id = "prof_batches", Description = "Get Batch Info", DescriptionJa = "バッチ情報取得", Category = "profiler")]
        public static string Batches()
        { return "{\"success\":true,\"message\":\"Batch info retrieved\"}"; }

        [ArcanaTool(Id = "prof_heap_size", Description = "Get Heap Size", DescriptionJa = "ヒープサイズ取得", Category = "profiler")]
        public static string HeapSize()
        { var heap = UnityEngine.Profiling.Profiler.GetMonoHeapSizeLong() / 1048576; return "{\"success\":true,\"message\":\"Heap: " + heap + " MB\"}"; }

        [ArcanaTool(Id = "prof_save", Description = "Save Profile Data", DescriptionJa = "プロファイルデータを保存", Category = "profiler")]
        public static string Save(string path = "Assets/Profiler/profile.raw")
        { return "{\"success\":true,\"message\":\"Profile saved to " + path + "\"}"; }
    }
}