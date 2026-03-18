import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const profCpuStart: ToolDefinition = { id: "prof_cpu_start", name: "Start CPU Profiling", description: "Begin CPU profiling session", descriptionJa: "CPUプロファイリングセッションを開始する", category: "profiler",
  inputSchema: z.object({ deepProfile: z.boolean().optional().default(false).describe("Enable deep profiling") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "ProfCpuStart", params); return { success: true, message: "CPU profiling started", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const profCpuStop: ToolDefinition = { id: "prof_cpu_stop", name: "Stop CPU Profiling", description: "Stop CPU profiling and return results", descriptionJa: "CPUプロファイリングを停止して結果を返す", category: "profiler",
  inputSchema: z.object({}),
  handler: async () => { try { const r = await bridge.send("unity", "ProfCpuStop", {}); return { success: true, message: "CPU profiling stopped", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const profMemSnapshot: ToolDefinition = { id: "prof_mem_snapshot", name: "Memory Snapshot", description: "Take a detailed memory snapshot", descriptionJa: "詳細なメモリスナップショットを取得する", category: "profiler",
  inputSchema: z.object({ savePath: z.string().optional().default("").describe("Save path for snapshot file") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "ProfMemSnapshot", params); return { success: true, message: "Memory snapshot taken", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const profGpu: ToolDefinition = { id: "prof_gpu", name: "GPU Profiling", description: "Measure GPU rendering time for current frame", descriptionJa: "現在のフレームのGPUレンダリング時間を計測する", category: "profiler",
  inputSchema: z.object({}),
  handler: async () => { try { const r = await bridge.send("unity", "ProfGpu", {}); return { success: true, message: "GPU profiling completed", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const profFrameAnalysis: ToolDefinition = { id: "prof_frame_analysis", name: "Frame Analysis", description: "Analyze frame breakdown (scripts, rendering, physics, GC)", descriptionJa: "フレーム内訳を分析する（スクリプト、レンダリング、物理、GC）", category: "profiler",
  inputSchema: z.object({ frameCount: z.number().optional().default(30).describe("Number of frames to analyze") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "ProfFrameAnalysis", params); return { success: true, message: `Analyzed ${params.frameCount} frames`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const profBottleneck: ToolDefinition = { id: "prof_bottleneck", name: "Detect Bottleneck", description: "Detect the main performance bottleneck", descriptionJa: "主要なパフォーマンスボトルネックを検出する", category: "profiler",
  inputSchema: z.object({}),
  handler: async () => { try { const r = await bridge.send("unity", "ProfBottleneck", {}); return { success: true, message: "Bottleneck analysis completed", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const profDrawCalls: ToolDefinition = { id: "prof_draw_calls", name: "Get Draw Calls", description: "Get current draw call and set pass call count", descriptionJa: "現在のドローコール数とセットパスコール数を取得する", category: "profiler",
  inputSchema: z.object({}),
  handler: async () => { try { const r = await bridge.send("unity", "ProfDrawCalls", {}); return { success: true, message: "Draw call info retrieved", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const profBatches: ToolDefinition = { id: "prof_batches", name: "Get Batch Info", description: "Get batching statistics (static, dynamic, instanced)", descriptionJa: "バッチング統計を取得する（静的、動的、インスタンス）", category: "profiler",
  inputSchema: z.object({}),
  handler: async () => { try { const r = await bridge.send("unity", "ProfBatches", {}); return { success: true, message: "Batch info retrieved", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const profHeap: ToolDefinition = { id: "prof_heap_size", name: "Get Heap Size", description: "Get managed and native heap size", descriptionJa: "マネージドヒープとネイティブヒープのサイズを取得する", category: "profiler",
  inputSchema: z.object({}),
  handler: async () => { try { const r = await bridge.send("unity", "ProfHeap", {}); return { success: true, message: "Heap info retrieved", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const profSave: ToolDefinition = { id: "prof_save", name: "Save Profile Data", description: "Save profiler data to a file", descriptionJa: "プロファイラーデータをファイルに保存する", category: "profiler",
  inputSchema: z.object({ path: z.string().optional().default("Assets/Profiler/profile.raw").describe("Save file path") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "ProfSave", params); return { success: true, message: `Profile saved to ${params.path}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

export const profilerTools: ToolDefinition[] = [profCpuStart, profCpuStop, profMemSnapshot, profGpu, profFrameAnalysis, profBottleneck, profDrawCalls, profBatches, profHeap, profSave];