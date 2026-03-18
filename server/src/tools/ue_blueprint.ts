import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const ueBpCreate: ToolDefinition = {
  id: "ue_bp_create", name: "Create Blueprint",
  description: "Create a new Blueprint class",
  descriptionJa: "新しいBlueprintクラスを作成",
  category: "ue_blueprint",
  inputSchema: z.object({ name: z.string(), parentClass: z.enum(["Actor","Pawn","Character","GameMode","PlayerController","Widget"]).default("Actor"), path: z.string().default("/Game/Blueprints") }),
  handler: async (p) => { try { const r = await bridge.send("unreal", "BpCreate", p); return r ? { success: true, message: `Blueprint created: ${p.name}`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const ueBpAddComponent: ToolDefinition = {
  id: "ue_bp_add_component", name: "Add BP Component",
  description: "Add a component to a Blueprint",
  descriptionJa: "Blueprintにコンポーネントを追加",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string(), componentType: z.string(), componentName: z.string().optional() }),
  handler: async (p) => { try { const r = await bridge.send("unreal", "BpAddComponent", p); return r ? { success: true, message: `Component ${p.componentType} added`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const ueBpAddVariable: ToolDefinition = {
  id: "ue_bp_add_variable", name: "Add BP Variable",
  description: "Add a variable to a Blueprint",
  descriptionJa: "Blueprintに変数を追加",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string(), varName: z.string(), varType: z.enum(["Bool","Int","Float","String","Vector","Rotator","Transform","Object"]).default("Float"), defaultValue: z.any().optional() }),
  handler: async (p) => { try { const r = await bridge.send("unreal", "BpAddVariable", p); return r ? { success: true, message: `Variable ${p.varName} added`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const ueBpAddFunction: ToolDefinition = {
  id: "ue_bp_add_function", name: "Add BP Function",
  description: "Add a custom function to a Blueprint",
  descriptionJa: "Blueprintにカスタム関数を追加",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string(), funcName: z.string(), isPure: z.boolean().default(false) }),
  handler: async (p) => { try { const r = await bridge.send("unreal", "BpAddFunction", p); return r ? { success: true, message: `Function ${p.funcName} added`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const ueBpAddEvent: ToolDefinition = {
  id: "ue_bp_add_event", name: "Add BP Event",
  description: "Add an event node (BeginPlay, Tick, Overlap, etc.)",
  descriptionJa: "イベントノードを追加（BeginPlay, Tick, Overlap等）",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string(), eventType: z.enum(["BeginPlay","Tick","EndPlay","ActorBeginOverlap","ActorEndOverlap","AnyDamage","Hit"]).default("BeginPlay") }),
  handler: async (p) => { try { const r = await bridge.send("unreal", "BpAddEvent", p); return r ? { success: true, message: `Event ${p.eventType} added`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const ueBpAddNode: ToolDefinition = {
  id: "ue_bp_add_node", name: "Add BP Node",
  description: "Add a node to the Blueprint event graph",
  descriptionJa: "Blueprintイベントグラフにノードを追加",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string(), nodeType: z.string(), posX: z.number().default(0), posY: z.number().default(0) }),
  handler: async (p) => { try { const r = await bridge.send("unreal", "BpAddNode", p); return r ? { success: true, message: `Node ${p.nodeType} added`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const ueBpConnectNodes: ToolDefinition = {
  id: "ue_bp_connect_nodes", name: "Connect BP Nodes",
  description: "Connect two nodes in a Blueprint graph",
  descriptionJa: "Blueprintグラフ内の2つのノードを接続",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string(), fromNode: z.string(), fromPin: z.string(), toNode: z.string(), toPin: z.string() }),
  handler: async (p) => { try { const r = await bridge.send("unreal", "BpConnectNodes", p); return r ? { success: true, message: `Connected ${p.fromNode} -> ${p.toNode}`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const ueBpCompile: ToolDefinition = {
  id: "ue_bp_compile", name: "Compile Blueprint",
  description: "Compile a Blueprint and report errors",
  descriptionJa: "Blueprintをコンパイルしてエラーを報告",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string() }),
  handler: async (p) => { try { const r = await bridge.send("unreal", "BpCompile", p); return r ? { success: true, message: `Blueprint compiled: ${p.bpName}`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const ueBpSpawn: ToolDefinition = {
  id: "ue_bp_spawn", name: "Spawn Blueprint Actor",
  description: "Spawn an instance of a Blueprint in the level",
  descriptionJa: "Blueprintのインスタンスをレベルにスポーン",
  category: "ue_blueprint",
  inputSchema: z.object({ bpPath: z.string(), x: z.number().default(0), y: z.number().default(0), z: z.number().default(0), name: z.string().optional() }),
  handler: async (p) => { try { const r = await bridge.send("unreal", "BpSpawn", p); return r ? { success: true, message: "Blueprint actor spawned", data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

const ueBpGetInfo: ToolDefinition = {
  id: "ue_bp_get_info", name: "Get Blueprint Info",
  description: "Get components, variables, functions of a Blueprint",
  descriptionJa: "Blueprintのコンポーネント・変数・関数情報を取得",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string() }),
  handler: async (p) => { try { const r = await bridge.send("unreal", "BpGetInfo", p); return r ? { success: true, message: `Info for ${p.bpName}`, data: r } : { success: false, message: "Failed" }; } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } }
};

export const ueBlueprintTools: ToolDefinition[] = [
  ueBpCreate, ueBpAddComponent, ueBpAddVariable, ueBpAddFunction, ueBpAddEvent,
  ueBpAddNode, ueBpConnectNodes, ueBpCompile, ueBpSpawn, ueBpGetInfo
];