import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const vsCreateGraph: ToolDefinition = {
  id: "vs_create_graph",
  name: "Create Visual Script Graph",
  description: "Create a new Visual Scripting graph on a GameObject",
  descriptionJa: "GameObjectに新しいVisual Scriptingグラフを作成",
  category: "visualscripting",
  inputSchema: z.object({ objectName: z.string(), graphType: z.enum(["script","state"]).default("script") }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "VsCreateGraph", p, { successMessage: (_, p) => `Graph created on ${p.objectName}` });
  }
};

const vsAddNode: ToolDefinition = {
  id: "vs_add_node",
  name: "Add Node to Graph",
  description: "Add a node (unit) to a Visual Scripting graph",
  descriptionJa: "Visual Scriptingグラフにノードを追加",
  category: "visualscripting",
  inputSchema: z.object({ objectName: z.string(), nodeType: z.string(), posX: z.number().default(0), posY: z.number().default(0) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "VsAddNode", p, { successMessage: (_, p) => `Node ${p.nodeType} added` });
  }
};

const vsConnectNodes: ToolDefinition = {
  id: "vs_connect_nodes",
  name: "Connect Nodes",
  description: "Connect two nodes in a Visual Scripting graph",
  descriptionJa: "Visual Scriptingグラフ内の2つのノードを接続",
  category: "visualscripting",
  inputSchema: z.object({ objectName: z.string(), fromNodeId: z.string(), fromPort: z.string(), toNodeId: z.string(), toPort: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "VsConnectNodes", p, { successMessage: (_, p) => `Nodes connected: ${p.fromNodeId} -> ${p.toNodeId}` });
  }
};

const vsSetVariable: ToolDefinition = {
  id: "vs_set_variable",
  name: "Set Graph Variable",
  description: "Set a variable in the Visual Scripting graph",
  descriptionJa: "Visual Scriptingグラフの変数を設定",
  category: "visualscripting",
  inputSchema: z.object({ objectName: z.string(), varName: z.string(), varType: z.enum(["float","int","bool","string","vector3"]).default("float"), value: z.any() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "VsSetVariable", p, { successMessage: (_, p) => `Variable ${p.varName} set` });
  }
};

const vsAddEvent: ToolDefinition = {
  id: "vs_add_event",
  name: "Add Event Node",
  description: "Add an event node (OnStart, OnUpdate, OnTrigger, etc.) to the graph",
  descriptionJa: "グラフにイベントノード（OnStart, OnUpdate等）を追加",
  category: "visualscripting",
  inputSchema: z.object({ objectName: z.string(), eventType: z.enum(["OnStart","OnUpdate","OnFixedUpdate","OnTriggerEnter","OnTriggerExit","OnCollisionEnter","OnCollisionExit","OnDestroy"]) }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "VsAddEvent", p, { successMessage: (_, p) => `Event ${p.eventType} added` });
  }
};

const vsRemoveNode: ToolDefinition = {
  id: "vs_remove_node",
  name: "Remove Node",
  description: "Remove a node from a Visual Scripting graph",
  descriptionJa: "Visual Scriptingグラフからノードを削除",
  category: "visualscripting",
  inputSchema: z.object({ objectName: z.string(), nodeId: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "VsRemoveNode", p, { successMessage: (_, p) => `Node ${p.nodeId} removed` });
  }
};

const vsAddSubgraph: ToolDefinition = {
  id: "vs_add_subgraph",
  name: "Add Subgraph",
  description: "Embed a subgraph (nested graph) inside the current graph",
  descriptionJa: "現在のグラフにサブグラフ（ネストグラフ）を埋め込む",
  category: "visualscripting",
  inputSchema: z.object({ objectName: z.string(), subgraphAsset: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "VsAddSubgraph", p, { successMessage: (_, p) => `Subgraph ${p.subgraphAsset} embedded` });
  }
};

const vsListNodes: ToolDefinition = {
  id: "vs_list_nodes",
  name: "List Graph Nodes",
  description: "List all nodes in a Visual Scripting graph",
  descriptionJa: "Visual Scriptingグラフ内の全ノードを一覧表示",
  category: "visualscripting",
  inputSchema: z.object({ objectName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "VsListNodes", p, { successMessage: "Nodes listed" });
  }
};

export const visualScriptingTools: ToolDefinition[] = [
  vsCreateGraph, vsAddNode, vsConnectNodes, vsSetVariable,
  vsAddEvent, vsRemoveNode, vsAddSubgraph, vsListNodes
];