import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const aiSetDestination: ToolDefinition = { id: "ai_set_destination", name: "Set AI Destination", description: "Set NavMeshAgent destination point", descriptionJa: "NavMeshAgentの目的地を設定する", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), x: z.number(), y: z.number(), z: z.number() }),
  handler: async (params) => { try { const r = await bridge.send("unity", "AiSetDestination", params); return { success: true, message: `Destination set for ${params.name}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const aiPatrol: ToolDefinition = { id: "ai_patrol", name: "Setup Patrol Route", description: "Create a patrol route with waypoints", descriptionJa: "ウェイポイント付きのパトロールルートを作成する", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), waypoints: z.string().describe("Comma-separated x,y,z groups e.g. 0,0,0,5,0,5,10,0,0"), loop: z.boolean().optional().default(true), waitTime: z.number().optional().default(2).describe("Wait time at each point") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "AiPatrol", params); return { success: true, message: `Patrol route set for ${params.name}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const aiChase: ToolDefinition = { id: "ai_chase", name: "Chase Target", description: "Make an AI agent chase a target object", descriptionJa: "AIエージェントにターゲットを追跡させる", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), targetName: z.string().describe("Target to chase"), stoppingDistance: z.number().optional().default(2) }),
  handler: async (params) => { try { const r = await bridge.send("unity", "AiChase", params); return { success: true, message: `${params.name} chasing ${params.targetName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const aiFlee: ToolDefinition = { id: "ai_flee", name: "Flee From Target", description: "Make an AI agent flee from a target", descriptionJa: "AIエージェントにターゲットから逃走させる", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), targetName: z.string().describe("Target to flee from"), fleeDistance: z.number().optional().default(20) }),
  handler: async (params) => { try { const r = await bridge.send("unity", "AiFlee", params); return { success: true, message: `${params.name} fleeing from ${params.targetName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const aiIdle: ToolDefinition = { id: "ai_idle", name: "Set AI Idle", description: "Stop the AI agent and enter idle state", descriptionJa: "AIエージェントを停止してアイドル状態にする", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "AiIdle", params); return { success: true, message: `${params.name} set to idle`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const aiSetSpeed: ToolDefinition = { id: "ai_set_speed", name: "Set AI Speed", description: "Change the movement speed of an AI agent", descriptionJa: "AIエージェントの移動速度を変更する", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), speed: z.number().describe("Movement speed"), angularSpeed: z.number().optional().default(120).describe("Rotation speed") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "AiSetSpeed", params); return { success: true, message: `Speed set to ${params.speed} on ${params.name}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const aiAvoidance: ToolDefinition = { id: "ai_avoidance", name: "Set Avoidance Priority", description: "Set the avoidance priority of an AI agent", descriptionJa: "AIエージェントの回避優先度を設定する", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), priority: z.number().min(0).max(99).optional().default(50).describe("Priority 0=most important, 99=least") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "AiAvoidance", params); return { success: true, message: `Avoidance priority set to ${params.priority}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const aiVisualizePath: ToolDefinition = { id: "ai_visualize_path", name: "Visualize AI Path", description: "Draw the current navigation path of an agent", descriptionJa: "エージェントの現在のナビゲーション経路を描画する", category: "ai",
  inputSchema: z.object({ name: z.string().describe("Agent GameObject name"), color: z.string().optional().default("#00FF00").describe("Path color hex") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "AiVisualizePath", params); return { success: true, message: `Path visualized for ${params.name}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

export const aiTools: ToolDefinition[] = [aiSetDestination, aiPatrol, aiChase, aiFlee, aiIdle, aiSetSpeed, aiAvoidance, aiVisualizePath];