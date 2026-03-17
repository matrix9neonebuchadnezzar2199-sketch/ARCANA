import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const netSetup: ToolDefinition = {
  id: "net_setup",
  name: "Setup NetworkManager",
  description: "Add and configure a NetworkManager in the scene",
  descriptionJa: "シーンにNetworkManagerを追加・設定する",
  category: "networking",
  inputSchema: z.object({ transport: z.enum(["Unity", "Steam", "EOS"]).optional().default("Unity").describe("Transport type"), maxPlayers: z.number().optional().default(16).describe("Max player count"), port: z.number().optional().default(7777).describe("Port number") }),
  handler: async (params) => { try { const r = await unityBridge.send("NetSetup", params); return { success: true, message: `NetworkManager configured: ${params.transport}, max ${params.maxPlayers}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const netSpawn: ToolDefinition = {
  id: "net_spawn",
  name: "Register Network Prefab",
  description: "Register a prefab as a network spawnable object",
  descriptionJa: "プレハブをネットワークスポーン可能オブジェクトとして登録する",
  category: "networking",
  inputSchema: z.object({ prefabPath: z.string().describe("Prefab asset path"), playerPrefab: z.boolean().optional().default(false).describe("Set as default player prefab") }),
  handler: async (params) => { try { const r = await unityBridge.send("NetSpawn", params); return { success: true, message: `Network prefab registered: ${params.prefabPath}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const netSendRpc: ToolDefinition = {
  id: "net_send_rpc",
  name: "Send RPC",
  description: "Send a Remote Procedure Call to server or clients",
  descriptionJa: "サーバーまたはクライアントにRPCを送信する",
  category: "networking",
  inputSchema: z.object({ objectName: z.string().describe("NetworkObject name"), methodName: z.string().describe("RPC method name"), target: z.enum(["Server", "Clients", "Owner"]).optional().default("Server").describe("RPC target"), args: z.string().optional().default("").describe("Comma-separated arguments") }),
  handler: async (params) => { try { const r = await unityBridge.send("NetSendRpc", params); return { success: true, message: `RPC ${params.methodName} sent to ${params.target}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const netSyncVar: ToolDefinition = {
  id: "net_sync_var",
  name: "Set Network Variable",
  description: "Set a synchronized network variable value",
  descriptionJa: "同期ネットワーク変数の値を設定する",
  category: "networking",
  inputSchema: z.object({ objectName: z.string().describe("NetworkObject name"), variableName: z.string().describe("NetworkVariable field name"), value: z.string().describe("Value as string") }),
  handler: async (params) => { try { const r = await unityBridge.send("NetSyncVar", params); return { success: true, message: `${params.variableName} synced on ${params.objectName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const netConnect: ToolDefinition = {
  id: "net_connect",
  name: "Start Network",
  description: "Start as Host, Server, or Client",
  descriptionJa: "Host/Server/Clientとしてネットワークを開始する",
  category: "networking",
  inputSchema: z.object({ mode: z.enum(["Host", "Server", "Client"]).describe("Network mode"), address: z.string().optional().default("127.0.0.1").describe("Server address (Client mode)") }),
  handler: async (params) => { try { const r = await unityBridge.send("NetConnect", params); return { success: true, message: `Network started as ${params.mode}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const netDisconnect: ToolDefinition = {
  id: "net_disconnect",
  name: "Stop Network",
  description: "Shutdown the current network session",
  descriptionJa: "現在のネットワークセッションを終了する",
  category: "networking",
  inputSchema: z.object({}),
  handler: async () => { try { const r = await unityBridge.send("NetDisconnect", {}); return { success: true, message: "Network disconnected", data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

export const networkingTools: ToolDefinition[] = [netSetup, netSpawn, netSendRpc, netSyncVar, netConnect, netDisconnect];