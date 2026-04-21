import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const netSetup: ToolDefinition = {
  id: "net_setup",
  name: "Setup NetworkManager",
  description: "Add and configure a NetworkManager in the scene",
  descriptionJa: "シーンにNetworkManagerを追加・設定する",
  category: "networking",
  inputSchema: z.object({ transport: z.enum(["Unity", "Steam", "EOS"]).optional().default("Unity").describe("Transport type"), maxPlayers: z.number().optional().default(16).describe("Max player count"), port: z.number().optional().default(7777).describe("Port number") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "NetSetup", params, { successMessage: (_, params) => `NetworkManager configured: ${params.transport}, max ${params.maxPlayers}` }) }
};

const netSpawn: ToolDefinition = {
  id: "net_spawn",
  name: "Register Network Prefab",
  description: "Register a prefab as a network spawnable object",
  descriptionJa: "プレハブをネットワークスポーン可能オブジェクトとして登録する",
  category: "networking",
  inputSchema: z.object({ prefabPath: z.string().describe("Prefab asset path"), playerPrefab: z.boolean().optional().default(false).describe("Set as default player prefab") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "NetSpawn", params, { successMessage: (_, params) => `Network prefab registered: ${params.prefabPath}` }) }
};

const netSendRpc: ToolDefinition = {
  id: "net_send_rpc",
  name: "Send RPC",
  description: "Send a Remote Procedure Call to server or clients",
  descriptionJa: "サーバーまたはクライアントにRPCを送信する",
  category: "networking",
  inputSchema: z.object({ objectName: z.string().describe("NetworkObject name"), methodName: z.string().describe("RPC method name"), target: z.enum(["Server", "Clients", "Owner"]).optional().default("Server").describe("RPC target"), args: z.string().optional().default("").describe("Comma-separated arguments") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "NetSendRpc", params, { successMessage: (_, params) => `RPC ${params.methodName} sent to ${params.target}` }) }
};

const netSyncVar: ToolDefinition = {
  id: "net_sync_var",
  name: "Set Network Variable",
  description: "Set a synchronized network variable value",
  descriptionJa: "同期ネットワーク変数の値を設定する",
  category: "networking",
  inputSchema: z.object({ objectName: z.string().describe("NetworkObject name"), variableName: z.string().describe("NetworkVariable field name"), value: z.string().describe("Value as string") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "NetSyncVar", params, { successMessage: (_, params) => `${params.variableName} synced on ${params.objectName}` }) }
};

const netConnect: ToolDefinition = {
  id: "net_connect",
  name: "Start Network",
  description: "Start as Host, Server, or Client",
  descriptionJa: "Host/Server/Clientとしてネットワークを開始する",
  category: "networking",
  inputSchema: z.object({ mode: z.enum(["Host", "Server", "Client"]).describe("Network mode"), address: z.string().optional().default("127.0.0.1").describe("Server address (Client mode)") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "NetConnect", params, { successMessage: (_, params) => `Network started as ${params.mode}` }) }
};

const netDisconnect: ToolDefinition = {
  id: "net_disconnect",
  name: "Stop Network",
  description: "Shutdown the current network session",
  descriptionJa: "現在のネットワークセッションを終了する",
  category: "networking",
  inputSchema: z.object({}),
  handler: async () => bridgeSendAsToolResult("unity", "NetDisconnect", {}, { successMessage: "Network disconnected" })
};

export const networkingTools: ToolDefinition[] = [netSetup, netSpawn, netSendRpc, netSyncVar, netConnect, netDisconnect];