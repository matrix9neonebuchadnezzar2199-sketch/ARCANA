import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const profCpuStart: ToolDefinition = { id: "prof_cpu_start", name: "Start CPU Profiling", description: "Begin CPU profiling session", descriptionJa: "CPUプロファイリングセッションを開始する", category: "profiler",
  inputSchema: z.object({ deepProfile: z.boolean().optional().default(false).describe("Enable deep profiling") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "ProfCpuStart", params, { successMessage: "CPU profiling started" }) } };

const profCpuStop: ToolDefinition = { id: "prof_cpu_stop", name: "Stop CPU Profiling", description: "Stop CPU profiling and return results", descriptionJa: "CPUプロファイリングを停止して結果を返す", category: "profiler",
  inputSchema: z.object({}),
  handler: async () => bridgeSendAsToolResult("unity", "ProfCpuStop", {}, { successMessage: "CPU profiling stopped" }) };

const profMemSnapshot: ToolDefinition = { id: "prof_mem_snapshot", name: "Memory Snapshot", description: "Take a detailed memory snapshot", descriptionJa: "詳細なメモリスナップショットを取得する", category: "profiler",
  inputSchema: z.object({ savePath: z.string().optional().default("").describe("Save path for snapshot file") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "ProfMemSnapshot", params, { successMessage: "Memory snapshot taken" }) } };

const profGpu: ToolDefinition = { id: "prof_gpu", name: "GPU Profiling", description: "Measure GPU rendering time for current frame", descriptionJa: "現在のフレームのGPUレンダリング時間を計測する", category: "profiler",
  inputSchema: z.object({}),
  handler: async () => bridgeSendAsToolResult("unity", "ProfGpu", {}, { successMessage: "GPU profiling completed" }) };

const profFrameAnalysis: ToolDefinition = { id: "prof_frame_analysis", name: "Frame Analysis", description: "Analyze frame breakdown (scripts, rendering, physics, GC)", descriptionJa: "フレーム内訳を分析する（スクリプト、レンダリング、物理、GC）", category: "profiler",
  inputSchema: z.object({ frameCount: z.number().optional().default(30).describe("Number of frames to analyze") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "ProfFrameAnalysis", params, { successMessage: (_, params) => `Analyzed ${params.frameCount} frames` }) } };

const profBottleneck: ToolDefinition = { id: "prof_bottleneck", name: "Detect Bottleneck", description: "Detect the main performance bottleneck", descriptionJa: "主要なパフォーマンスボトルネックを検出する", category: "profiler",
  inputSchema: z.object({}),
  handler: async () => bridgeSendAsToolResult("unity", "ProfBottleneck", {}, { successMessage: "Bottleneck analysis completed" }) };

const profDrawCalls: ToolDefinition = { id: "prof_draw_calls", name: "Get Draw Calls", description: "Get current draw call and set pass call count", descriptionJa: "現在のドローコール数とセットパスコール数を取得する", category: "profiler",
  inputSchema: z.object({}),
  handler: async () => bridgeSendAsToolResult("unity", "ProfDrawCalls", {}, { successMessage: "Draw call info retrieved" }) };

const profBatches: ToolDefinition = { id: "prof_batches", name: "Get Batch Info", description: "Get batching statistics (static, dynamic, instanced)", descriptionJa: "バッチング統計を取得する（静的、動的、インスタンス）", category: "profiler",
  inputSchema: z.object({}),
  handler: async () => bridgeSendAsToolResult("unity", "ProfBatches", {}, { successMessage: "Batch info retrieved" }) };

const profHeap: ToolDefinition = { id: "prof_heap_size", name: "Get Heap Size", description: "Get managed and native heap size", descriptionJa: "マネージドヒープとネイティブヒープのサイズを取得する", category: "profiler",
  inputSchema: z.object({}),
  handler: async () => bridgeSendAsToolResult("unity", "ProfHeap", {}, { successMessage: "Heap info retrieved" }) };

const profSave: ToolDefinition = { id: "prof_save", name: "Save Profile Data", description: "Save profiler data to a file", descriptionJa: "プロファイラーデータをファイルに保存する", category: "profiler",
  inputSchema: z.object({ path: z.string().optional().default("Assets/Profiler/profile.raw").describe("Save file path") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "ProfSave", params, { successMessage: (_, params) => `Profile saved to ${params.path}` }) } };

export const profilerTools: ToolDefinition[] = [profCpuStart, profCpuStop, profMemSnapshot, profGpu, profFrameAnalysis, profBottleneck, profDrawCalls, profBatches, profHeap, profSave];