import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const aiSetDestination: ToolDefinition = { id: "ai_set_destination", name: "Set AI Destination", description: "Set NavMeshAgent destination point", descriptionJa: "NavMeshAgentの目的地を設定する", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), x: z.number(), y: z.number(), z: z.number() }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "AiSetDestination", params, { successMessage: (_, params) => `Destination set for ${params.name}` }) } };

const aiPatrol: ToolDefinition = { id: "ai_patrol", name: "Setup Patrol Route", description: "Create a patrol route with waypoints", descriptionJa: "ウェイポイント付きのパトロールルートを作成する", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), waypoints: z.string().describe("Comma-separated x,y,z groups e.g. 0,0,0,5,0,5,10,0,0"), loop: z.boolean().optional().default(true), waitTime: z.number().optional().default(2).describe("Wait time at each point") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "AiPatrol", params, { successMessage: (_, params) => `Patrol route set for ${params.name}` }) } };

const aiChase: ToolDefinition = { id: "ai_chase", name: "Chase Target", description: "Make an AI agent chase a target object", descriptionJa: "AIエージェントにターゲットを追跡させる", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), targetName: z.string().describe("Target to chase"), stoppingDistance: z.number().optional().default(2) }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "AiChase", params, { successMessage: (_, params) => `${params.name} chasing ${params.targetName}` }) } };

const aiFlee: ToolDefinition = { id: "ai_flee", name: "Flee From Target", description: "Make an AI agent flee from a target", descriptionJa: "AIエージェントにターゲットから逃走させる", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), targetName: z.string().describe("Target to flee from"), fleeDistance: z.number().optional().default(20) }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "AiFlee", params, { successMessage: (_, params) => `${params.name} fleeing from ${params.targetName}` }) } };

const aiIdle: ToolDefinition = { id: "ai_idle", name: "Set AI Idle", description: "Stop the AI agent and enter idle state", descriptionJa: "AIエージェントを停止してアイドル状態にする", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "AiIdle", params, { successMessage: (_, params) => `${params.name} set to idle` }) } };

const aiSetSpeed: ToolDefinition = { id: "ai_set_speed", name: "Set AI Speed", description: "Change the movement speed of an AI agent", descriptionJa: "AIエージェントの移動速度を変更する", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), speed: z.number().describe("Movement speed"), angularSpeed: z.number().optional().default(120).describe("Rotation speed") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "AiSetSpeed", params, { successMessage: (_, params) => `Speed set to ${params.speed} on ${params.name}` }) } };

const aiAvoidance: ToolDefinition = { id: "ai_avoidance", name: "Set Avoidance Priority", description: "Set the avoidance priority of an AI agent", descriptionJa: "AIエージェントの回避優先度を設定する", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), priority: z.number().min(0).max(99).optional().default(50).describe("Priority 0=most important, 99=least") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "AiAvoidance", params, { successMessage: (_, params) => `Avoidance priority set to ${params.priority}` }) } };

const aiVisualizePath: ToolDefinition = { id: "ai_visualize_path", name: "Visualize AI Path", description: "Draw the current navigation path of an agent", descriptionJa: "エージェントの現在のナビゲーション経路を描画する", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), color: z.string().optional().default("#00FF00").describe("Path color hex") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "AiVisualizePath", params, { successMessage: (_, params) => `Path visualized for ${params.name}` }) } };

export const aiTools: ToolDefinition[] = [aiSetDestination, aiPatrol, aiChase, aiFlee, aiIdle, aiSetSpeed, aiAvoidance, aiVisualizePath];