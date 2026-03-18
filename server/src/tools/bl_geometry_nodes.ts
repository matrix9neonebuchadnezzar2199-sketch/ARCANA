import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
export const blGeometryNodesTools: ToolDefinition[] = [
  {
    id: "bl_geonodes_create_tree",
    name: "Create Geometry Nodes Tree",
    description: "Create a new Geometry Nodes modifier on an object with an empty node tree",
    descriptionJa: "オブジェクトに空のノードツリーで新しいGeometry Nodesモディファイアを作成",
    category: "BL_GeometryNodes",
    inputSchema: z.object({
      objectName: z.string().describe("Target object name"),
      treeName: z.string().optional().describe("Node tree name"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_geonodes_create_tree", params);
        return { success: true, message: `Geometry Nodes tree created on "${params.objectName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_geonodes_add_node",
    name: "Add Geometry Node",
    description: "Add a node to a Geometry Nodes tree by type",
    descriptionJa: "タイプ指定でGeometry Nodesツリーにノードを追加",
    category: "BL_GeometryNodes",
    inputSchema: z.object({
      treeName: z.string().describe("Target node tree name"),
      nodeType: z.string().describe("Node type identifier (e.g. GeometryNodeMeshGrid, GeometryNodeDistributePointsOnFaces, GeometryNodeInstanceOnPoints)"),
      nodeName: z.string().optional().describe("Custom node label"),
      locationX: z.number().optional().describe("Node X position in editor"),
      locationY: z.number().optional().describe("Node Y position in editor"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_geonodes_add_node", params);
        return { success: true, message: `Node "${params.nodeType}" added to "${params.treeName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_geonodes_connect",
    name: "Connect Nodes",
    description: "Connect an output socket of one node to an input socket of another",
    descriptionJa: "あるノードの出力ソケットを別のノードの入力ソケットに接続",
    category: "BL_GeometryNodes",
    inputSchema: z.object({
      treeName: z.string().describe("Target node tree name"),
      fromNode: z.string().describe("Output node name or label"),
      fromSocket: z.union([z.string(), z.number()]).describe("Output socket name or index"),
      toNode: z.string().describe("Input node name or label"),
      toSocket: z.union([z.string(), z.number()]).describe("Input socket name or index"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_geonodes_connect", params);
        return { success: true, message: `Connected ${params.fromNode}[${params.fromSocket}] -> ${params.toNode}[${params.toSocket}]`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_geonodes_set_input",
    name: "Set Node Input Value",
    description: "Set a default value on a node input socket",
    descriptionJa: "ノードの入力ソケットにデフォルト値を設定",
    category: "BL_GeometryNodes",
    inputSchema: z.object({
      treeName: z.string().describe("Target node tree name"),
      nodeName: z.string().describe("Target node name or label"),
      socketName: z.union([z.string(), z.number()]).describe("Input socket name or index"),
      value: z.union([z.number(), z.boolean(), z.string(), z.array(z.number())]).describe("Value to set (number, bool, string, or array for vector)"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_geonodes_set_input", params);
        return { success: true, message: `Input "${params.socketName}" set on "${params.nodeName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_geonodes_add_scatter_setup",
    name: "Add Scatter Setup",
    description: "Create a complete scatter setup: Distribute Points on Faces + Instance on Points",
    descriptionJa: "完全なスキャッターセットアップを作成: 面上にポイント分散 + ポイント上にインスタンス",
    category: "BL_GeometryNodes",
    inputSchema: z.object({
      objectName: z.string().describe("Surface object to scatter on"),
      instanceObject: z.string().describe("Object to instance (e.g. tree, rock)"),
      density: z.number().optional().describe("Point density"),
      seed: z.number().optional().describe("Random seed"),
      minScale: z.number().optional().describe("Minimum random scale"),
      maxScale: z.number().optional().describe("Maximum random scale"),
      alignToNormal: z.boolean().optional().describe("Align instances to surface normal"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_geonodes_add_scatter_setup", params);
        return { success: true, message: `Scatter setup created: "${params.instanceObject}" on "${params.objectName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_geonodes_add_array_setup",
    name: "Add Array Setup",
    description: "Create a procedural array setup using Mesh Line + Instance on Points",
    descriptionJa: "Mesh Line + Instance on Pointsを使ったプロシージャル配列セットアップを作成",
    category: "BL_GeometryNodes",
    inputSchema: z.object({
      objectName: z.string().describe("Object to array"),
      count: z.number().describe("Number of instances"),
      offset: z.object({ x: z.number(), y: z.number(), z: z.number() }).describe("Offset between instances"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_geonodes_add_array_setup", params);
        return { success: true, message: `Array setup: ${params.count}x "${params.objectName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_geonodes_add_deform_node",
    name: "Add Deformation Node",
    description: "Add a mesh deformation node (SetPosition with noise, smooth, etc.)",
    descriptionJa: "メッシュ変形ノード（ノイズ付きSetPosition、スムーズ等）を追加",
    category: "BL_GeometryNodes",
    inputSchema: z.object({
      treeName: z.string().describe("Target node tree name"),
      deformType: z.enum(["NoiseDisplace", "Smooth", "SetPosition", "ProximityTransfer", "Warp"]).describe("Deformation type"),
      strength: z.number().optional().describe("Deformation strength"),
      noiseScale: z.number().optional().describe("Noise scale (for NoiseDisplace)"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_geonodes_add_deform_node", params);
        return { success: true, message: `${params.deformType} deformation added to "${params.treeName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_geonodes_add_group_input",
    name: "Add Group Input",
    description: "Add an exposed input parameter to the Geometry Nodes group interface",
    descriptionJa: "Geometry Nodesグループインターフェースに公開入力パラメータを追加",
    category: "BL_GeometryNodes",
    inputSchema: z.object({
      treeName: z.string().describe("Target node tree name"),
      inputName: z.string().describe("Input parameter name"),
      inputType: z.enum(["Float", "Int", "Bool", "Vector", "Color", "String", "Object", "Collection", "Material", "Geometry"]).describe("Input data type"),
      defaultValue: z.union([z.number(), z.boolean(), z.string(), z.array(z.number())]).optional().describe("Default value"),
      minValue: z.number().optional().describe("Minimum value (for numeric types)"),
      maxValue: z.number().optional().describe("Maximum value (for numeric types)"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_geonodes_add_group_input", params);
        return { success: true, message: `Group input "${params.inputName}" (${params.inputType}) added to "${params.treeName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_geonodes_add_curve_setup",
    name: "Add Curve-to-Mesh Setup",
    description: "Create a curve-to-mesh pipeline (Curve Line/Circle + Curve to Mesh + profile)",
    descriptionJa: "カーブtoメッシュパイプライン（カーブライン/サークル + Curve to Mesh + プロファイル）を作成",
    category: "BL_GeometryNodes",
    inputSchema: z.object({
      treeName: z.string().describe("Target node tree name"),
      curveType: z.enum(["Line", "Circle", "Quadrilateral", "Star", "Spiral"]).describe("Base curve type"),
      profileType: z.enum(["Circle", "Square", "Custom"]).optional().describe("Profile curve type"),
      profileRadius: z.number().optional().describe("Profile radius"),
      resolution: z.number().optional().describe("Curve resolution"),
      fillCaps: z.boolean().optional().describe("Fill end caps"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_geonodes_add_curve_setup", params);
        return { success: true, message: `Curve-to-Mesh setup (${params.curveType}) added to "${params.treeName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_geonodes_list_tree",
    name: "List Node Tree",
    description: "List all nodes and connections in a Geometry Nodes tree",
    descriptionJa: "Geometry Nodesツリー内の全ノードと接続を一覧表示",
    category: "BL_GeometryNodes",
    inputSchema: z.object({
      treeName: z.string().describe("Node tree name"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_geonodes_list_tree", params);
        return { success: true, message: `Node tree "${params.treeName}" listed`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
];