import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const ueBpCreate: ToolDefinition = {
  id: "ue_bp_create", name: "Create Blueprint",
  description: "Create a new Blueprint class",
  descriptionJa: "新しいBlueprintクラスを作成",
  category: "ue_blueprint",
  inputSchema: z.object({ name: z.string(), parentClass: z.enum(["Actor","Pawn","Character","GameMode","PlayerController","Widget"]).default("Actor"), path: z.string().default("/Game/Blueprints") }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "BpCreate", p, { successMessage: (_, p) => `Blueprint created: ${p.name}` }) }
};

const ueBpAddComponent: ToolDefinition = {
  id: "ue_bp_add_component", name: "Add BP Component",
  description: "Add a component to a Blueprint",
  descriptionJa: "Blueprintにコンポーネントを追加",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string(), componentType: z.string(), componentName: z.string().optional() }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "BpAddComponent", p, { successMessage: (_, p) => `Component ${p.componentType} added` }) }
};

const ueBpAddVariable: ToolDefinition = {
  id: "ue_bp_add_variable", name: "Add BP Variable",
  description: "Add a variable to a Blueprint",
  descriptionJa: "Blueprintに変数を追加",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string(), varName: z.string(), varType: z.enum(["Bool","Int","Float","String","Vector","Rotator","Transform","Object"]).default("Float"), defaultValue: z.any().optional() }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "BpAddVariable", p, { successMessage: (_, p) => `Variable ${p.varName} added` }) }
};

const ueBpAddFunction: ToolDefinition = {
  id: "ue_bp_add_function", name: "Add BP Function",
  description: "Add a custom function to a Blueprint",
  descriptionJa: "Blueprintにカスタム関数を追加",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string(), funcName: z.string(), isPure: z.boolean().default(false) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "BpAddFunction", p, { successMessage: (_, p) => `Function ${p.funcName} added` }) }
};

const ueBpAddEvent: ToolDefinition = {
  id: "ue_bp_add_event", name: "Add BP Event",
  description: "Add an event node (BeginPlay, Tick, Overlap, etc.)",
  descriptionJa: "イベントノードを追加（BeginPlay, Tick, Overlap等）",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string(), eventType: z.enum(["BeginPlay","Tick","EndPlay","ActorBeginOverlap","ActorEndOverlap","AnyDamage","Hit"]).default("BeginPlay") }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "BpAddEvent", p, { successMessage: (_, p) => `Event ${p.eventType} added` }) }
};

const ueBpAddNode: ToolDefinition = {
  id: "ue_bp_add_node", name: "Add BP Node",
  description: "Add a node to the Blueprint event graph",
  descriptionJa: "Blueprintイベントグラフにノードを追加",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string(), nodeType: z.string(), posX: z.number().default(0), posY: z.number().default(0) }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "BpAddNode", p, { successMessage: (_, p) => `Node ${p.nodeType} added` }) }
};

const ueBpConnectNodes: ToolDefinition = {
  id: "ue_bp_connect_nodes", name: "Connect BP Nodes",
  description: "Connect two nodes in a Blueprint graph",
  descriptionJa: "Blueprintグラフ内の2つのノードを接続",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string(), fromNode: z.string(), fromPin: z.string(), toNode: z.string(), toPin: z.string() }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "BpConnectNodes", p, { successMessage: (_, p) => `Connected ${p.fromNode} -> ${p.toNode}` }) }
};

const ueBpCompile: ToolDefinition = {
  id: "ue_bp_compile", name: "Compile Blueprint",
  description: "Compile a Blueprint and report errors",
  descriptionJa: "Blueprintをコンパイルしてエラーを報告",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string() }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "BpCompile", p, { successMessage: (_, p) => `Blueprint compiled: ${p.bpName}` }) }
};

const ueBpSpawn: ToolDefinition = {
  id: "ue_bp_spawn", name: "Spawn Blueprint Actor",
  description: "Spawn an instance of a Blueprint in the level",
  descriptionJa: "Blueprintのインスタンスをレベルにスポーン",
  category: "ue_blueprint",
  inputSchema: z.object({ bpPath: z.string(), x: z.number().default(0), y: z.number().default(0), z: z.number().default(0), name: z.string().optional() }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "BpSpawn", p, { successMessage: "Blueprint actor spawned" }) }
};

const ueBpGetInfo: ToolDefinition = {
  id: "ue_bp_get_info", name: "Get Blueprint Info",
  description: "Get components, variables, functions of a Blueprint",
  descriptionJa: "Blueprintのコンポーネント・変数・関数情報を取得",
  category: "ue_blueprint",
  inputSchema: z.object({ bpName: z.string() }),
  handler: async (p) => { return bridgeSendAsToolResult("unreal", "BpGetInfo", p, { successMessage: (_, p) => `Info for ${p.bpName}` }) }
};

export const ueBlueprintTools: ToolDefinition[] = [
  ueBpCreate, ueBpAddComponent, ueBpAddVariable, ueBpAddFunction, ueBpAddEvent,
  ueBpAddNode, ueBpConnectNodes, ueBpCompile, ueBpSpawn, ueBpGetInfo
];