import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const dbgLog: ToolDefinition = { id: "debug_log", name: "Debug Log", description: "Print a message to Unity console", descriptionJa: "Unityコンソールにメッセージを出力する", category: "debug",
  inputSchema: z.object({ message: z.string().describe("Log message") }),
  handler: async (params) => { try { const r = await unityBridge.send("DebugLog", params); return { success: true, message: `Logged: ${params.message}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const dbgWarn: ToolDefinition = { id: "debug_warn", name: "Debug Warning", description: "Print a warning to Unity console", descriptionJa: "Unityコンソールに警告を出力する", category: "debug",
  inputSchema: z.object({ message: z.string().describe("Warning message") }),
  handler: async (params) => { try { const r = await unityBridge.send("DebugWarn", params); return { success: true, message: `Warning: ${params.message}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const dbgError: ToolDefinition = { id: "debug_error", name: "Debug Error", description: "Print an error to Unity console", descriptionJa: "Unityコンソールにエラーを出力する", category: "debug",
  inputSchema: z.object({ message: z.string().describe("Error message") }),
  handler: async (params) => { try { const r = await unityBridge.send("DebugError", params); return { success: true, message: `Error: ${params.message}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const dbgDrawLine: ToolDefinition = { id: "debug_draw_line", name: "Draw Debug Line", description: "Draw a debug line in the scene view", descriptionJa: "シーンビューにデバッグ線を描画する", category: "debug",
  inputSchema: z.object({ startX: z.number(), startY: z.number(), startZ: z.number(), endX: z.number(), endY: z.number(), endZ: z.number(), color: z.string().optional().default("#FF0000").describe("Line color hex"), duration: z.number().optional().default(5).describe("Duration in seconds") }),
  handler: async (params) => { try { const r = await unityBridge.send("DebugDrawLine", params); return { success: true, message: "Debug line drawn", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const dbgDrawSphere: ToolDefinition = { id: "debug_draw_sphere", name: "Draw Debug Sphere", description: "Draw a debug sphere gizmo in the scene", descriptionJa: "シーンにデバッグ球ギズモを描画する", category: "debug",
  inputSchema: z.object({ x: z.number(), y: z.number(), z: z.number(), radius: z.number().optional().default(1), color: z.string().optional().default("#00FF00").describe("Sphere color hex") }),
  handler: async (params) => { try { const r = await unityBridge.send("DebugDrawSphere", params); return { success: true, message: "Debug sphere drawn", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const dbgRaycast: ToolDefinition = { id: "debug_raycast", name: "Debug Raycast", description: "Cast a ray and return hit info", descriptionJa: "レイキャストして衝突情報を返す", category: "debug",
  inputSchema: z.object({ originX: z.number(), originY: z.number(), originZ: z.number(), dirX: z.number().optional().default(0), dirY: z.number().optional().default(-1), dirZ: z.number().optional().default(0), maxDistance: z.number().optional().default(100) }),
  handler: async (params) => { try { const r = await unityBridge.send("DebugRaycast", params); return { success: true, message: "Raycast completed", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const dbgFps: ToolDefinition = { id: "debug_fps", name: "Show FPS", description: "Get current editor FPS / frame time", descriptionJa: "現在のエディタFPS/フレーム時間を取得する", category: "debug",
  inputSchema: z.object({}),
  handler: async () => { try { const r = await unityBridge.send("DebugFps", {}); return { success: true, message: "FPS info retrieved", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const dbgMemory: ToolDefinition = { id: "debug_memory", name: "Memory Info", description: "Get current memory usage information", descriptionJa: "現在のメモリ使用情報を取得する", category: "debug",
  inputSchema: z.object({}),
  handler: async () => { try { const r = await unityBridge.send("DebugMemory", {}); return { success: true, message: "Memory info retrieved", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const dbgWireframe: ToolDefinition = { id: "debug_wireframe", name: "Toggle Wireframe", description: "Toggle wireframe rendering mode in scene view", descriptionJa: "シーンビューのワイヤーフレーム表示を切り替える", category: "debug",
  inputSchema: z.object({ enabled: z.boolean().optional().default(true).describe("Enable wireframe") }),
  handler: async (params) => { try { const r = await unityBridge.send("DebugWireframe", params); return { success: true, message: `Wireframe ${params.enabled ? "enabled" : "disabled"}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const dbgBounds: ToolDefinition = { id: "debug_bounds", name: "Show Bounds", description: "Display bounding boxes for selected objects", descriptionJa: "選択オブジェクトの境界ボックスを表示する", category: "debug",
  inputSchema: z.object({ name: z.string().optional().describe("GameObject name (empty for all selected)") }),
  handler: async (params) => { try { const r = await unityBridge.send("DebugBounds", params); return { success: true, message: "Bounds displayed", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

export const debugTools: ToolDefinition[] = [dbgLog, dbgWarn, dbgError, dbgDrawLine, dbgDrawSphere, dbgRaycast, dbgFps, dbgMemory, dbgWireframe, dbgBounds];