import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const xrSetup: ToolDefinition = { id: "xr_setup", name: "Setup XR Rig", description: "Create and configure an XR Origin rig", descriptionJa: "XR Originリグを作成・設定する", category: "xr",
  inputSchema: z.object({ trackingMode: z.enum(["RoomScale", "Stationary"]).optional().default("RoomScale"), height: z.number().optional().default(1.8) }),
  handler: async (params) => { try { const r = await unityBridge.send("XrSetup", params); return { success: true, message: `XR Rig created: ${params.trackingMode}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const xrTracking: ToolDefinition = { id: "xr_tracking", name: "Set Tracking Origin", description: "Set XR tracking origin mode", descriptionJa: "XRトラッキングオリジンモードを設定する", category: "xr",
  inputSchema: z.object({ origin: z.enum(["Floor", "Device", "Eye"]).optional().default("Floor") }),
  handler: async (params) => { try { const r = await unityBridge.send("XrTracking", params); return { success: true, message: `Tracking origin: ${params.origin}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const xrController: ToolDefinition = { id: "xr_controller", name: "Configure Controller", description: "Configure XR controller input mappings", descriptionJa: "XRコントローラーの入力マッピングを設定する", category: "xr",
  inputSchema: z.object({ hand: z.enum(["Left", "Right", "Both"]).optional().default("Both"), modelPath: z.string().optional().describe("Controller model prefab path") }),
  handler: async (params) => { try { const r = await unityBridge.send("XrController", params); return { success: true, message: `Controller configured: ${params.hand}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const xrHaptics: ToolDefinition = { id: "xr_haptics", name: "Send Haptic Feedback", description: "Send haptic vibration to a controller", descriptionJa: "コントローラーにハプティクス振動を送信する", category: "xr",
  inputSchema: z.object({ hand: z.enum(["Left", "Right"]).describe("Target hand"), amplitude: z.number().min(0).max(1).optional().default(0.5), duration: z.number().optional().default(0.1).describe("Duration in seconds") }),
  handler: async (params) => { try { const r = await unityBridge.send("XrHaptics", params); return { success: true, message: `Haptics sent to ${params.hand}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const xrTeleport: ToolDefinition = { id: "xr_teleport", name: "Add Teleport Locomotion", description: "Add teleport locomotion system to XR rig", descriptionJa: "XRリグにテレポート移動システムを追加する", category: "xr",
  inputSchema: z.object({ lineType: z.enum(["Straight", "Bezier"]).optional().default("Bezier"), maxDistance: z.number().optional().default(10) }),
  handler: async (params) => { try { const r = await unityBridge.send("XrTeleport", params); return { success: true, message: `Teleport added: ${params.lineType}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const xrGrab: ToolDefinition = { id: "xr_grab", name: "Make Grabbable", description: "Make an object grabbable in XR", descriptionJa: "オブジェクトをXRで掴めるようにする", category: "xr",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), throwOnDetach: z.boolean().optional().default(true), snapToHand: z.boolean().optional().default(false) }),
  handler: async (params) => { try { const r = await unityBridge.send("XrGrab", params); return { success: true, message: `${params.name} made grabbable`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const xrRayInteraction: ToolDefinition = { id: "xr_ray_interaction", name: "Add Ray Interactor", description: "Add ray-based interaction to XR controller", descriptionJa: "XRコントローラーにレイベースインタラクションを追加する", category: "xr",
  inputSchema: z.object({ hand: z.enum(["Left", "Right"]).describe("Controller hand"), maxDistance: z.number().optional().default(30) }),
  handler: async (params) => { try { const r = await unityBridge.send("XrRayInteraction", params); return { success: true, message: `Ray interactor added to ${params.hand}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const xrUI: ToolDefinition = { id: "xr_ui", name: "Create XR UI Canvas", description: "Create a world-space UI canvas for XR interaction", descriptionJa: "XRインタラクション用のワールドスペースUIキャンバスを作成する", category: "xr",
  inputSchema: z.object({ name: z.string().optional().default("XR_Canvas"), width: z.number().optional().default(1), height: z.number().optional().default(0.6), x: z.number().optional().default(0), y: z.number().optional().default(1.5), z: z.number().optional().default(2) }),
  handler: async (params) => { try { const r = await unityBridge.send("XrUI", params); return { success: true, message: `XR Canvas created: ${params.name}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const xrPassthrough: ToolDefinition = { id: "xr_passthrough", name: "Enable Passthrough", description: "Enable AR/MR passthrough mode", descriptionJa: "AR/MRパススルーモードを有効化する", category: "xr",
  inputSchema: z.object({ enabled: z.boolean().optional().default(true), opacity: z.number().min(0).max(1).optional().default(1) }),
  handler: async (params) => { try { const r = await unityBridge.send("XrPassthrough", params); return { success: true, message: `Passthrough ${params.enabled ? "enabled" : "disabled"}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const xrBoundary: ToolDefinition = { id: "xr_boundary", name: "Set Play Boundary", description: "Configure the XR play area boundary", descriptionJa: "XRプレイエリア境界を設定する", category: "xr",
  inputSchema: z.object({ width: z.number().optional().default(3), depth: z.number().optional().default(3), showVisual: z.boolean().optional().default(true) }),
  handler: async (params) => { try { const r = await unityBridge.send("XrBoundary", params); return { success: true, message: `Boundary set: ${params.width}x${params.depth}m`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

export const xrTools: ToolDefinition[] = [xrSetup, xrTracking, xrController, xrHaptics, xrTeleport, xrGrab, xrRayInteraction, xrUI, xrPassthrough, xrBoundary];