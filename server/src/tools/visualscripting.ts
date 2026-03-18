import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const vsCreateGraph: ToolDefinition = {
  id: "vs_create_graph",
  name: "Create Visual Script Graph",
  description: "Create a new Visual Scripting graph on a GameObject",
  descriptionJa: "GameObjectに新しいVisual Scriptingグラフを作成",
  category: "visualscripting",
  inputSchema: z.object({ objectName: z.string(), graphType: z.enum(["script","state"]).default("script") }),
  handler: async (p) => {
    const r = await bridge.send("unity", "VsCreateGraph", p);
    return r ? { success: true, message: `Graph created on ${p.objectName}`, data: r }
             : { success: false, message: "Failed to create graph" };
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
    const r = await bridge.send("unity", "VsAddNode", p);
    return r ? { success: true, message: `Node ${p.nodeType} added`, data: r }
             : { success: false, message: "Failed to add node" };
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
    const r = await bridge.send("unity", "VsConnectNodes", p);
    return r ? { success: true, message: `Nodes connected: ${p.fromNodeId} -> ${p.toNodeId}`, data: r }
             : { success: false, message: "Failed to connect nodes" };
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
    const r = await bridge.send("unity", "VsSetVariable", p);
    return r ? { success: true, message: `Variable ${p.varName} set`, data: r }
             : { success: false, message: "Failed to set variable" };
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
    const r = await bridge.send("unity", "VsAddEvent", p);
    return r ? { success: true, message: `Event ${p.eventType} added`, data: r }
             : { success: false, message: "Failed to add event" };
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
    const r = await bridge.send("unity", "VsRemoveNode", p);
    return r ? { success: true, message: `Node ${p.nodeId} removed`, data: r }
             : { success: false, message: "Failed to remove node" };
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
    const r = await bridge.send("unity", "VsAddSubgraph", p);
    return r ? { success: true, message: `Subgraph ${p.subgraphAsset} embedded`, data: r }
             : { success: false, message: "Failed to add subgraph" };
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
    const r = await bridge.send("unity", "VsListNodes", p);
    return r ? { success: true, message: "Nodes listed", data: r }
             : { success: false, message: "Failed to list nodes" };
  }
};

export const visualScriptingTools: ToolDefinition[] = [
  vsCreateGraph, vsAddNode, vsConnectNodes, vsSetVariable,
  vsAddEvent, vsRemoveNode, vsAddSubgraph, vsListNodes
];