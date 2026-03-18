import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
export const uePcgTools: ToolDefinition[] = [
  {
    id: "ue_pcg_create_graph",
    name: "Create PCG Graph",
    description: "Create a new Procedural Content Generation graph asset",
    descriptionJa: "新しいProcedural Content Generationグラフアセットを作成",
    category: "UE_PCG",
    inputSchema: z.object({
      name: z.string().describe("PCG graph asset name"),
      path: z.string().optional().describe("Content path (e.g. /Game/PCG/)"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "PCGCreateGraph", params);
      return { success: true, message: `PCG graph "${params.name}" created`, data: result };
    },
  },
  {
    id: "ue_pcg_add_scatter_node",
    name: "Add Scatter Node",
    description: "Add a surface scatter node to distribute meshes across terrain or surfaces",
    descriptionJa: "地形やサーフェスにメッシュを分散配置するサーフェススキャッターノードを追加",
    category: "UE_PCG",
    inputSchema: z.object({
      graphName: z.string().describe("Target PCG graph"),
      meshPath: z.string().describe("Static mesh asset path to scatter"),
      density: z.number().optional().describe("Points per square meter"),
      minScale: z.number().optional().describe("Minimum random scale"),
      maxScale: z.number().optional().describe("Maximum random scale"),
      alignToSurface: z.boolean().optional().describe("Align instances to surface normal"),
      randomRotation: z.boolean().optional().describe("Apply random Y-axis rotation"),
      seed: z.number().optional().describe("Random seed"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "PCGAddScatterNode", params);
      return { success: true, message: `Scatter node added to "${params.graphName}"`, data: result };
    },
  },
  {
    id: "ue_pcg_add_filter_node",
    name: "Add Filter Node",
    description: "Add a filter node to include or exclude points by slope, height, density, or tag",
    descriptionJa: "傾斜、高さ、密度、タグでポイントを含む・除外するフィルターノードを追加",
    category: "UE_PCG",
    inputSchema: z.object({
      graphName: z.string().describe("Target PCG graph"),
      filterType: z.enum(["Slope", "Height", "Density", "Tag", "Distance", "Bounds"]).describe("Filter type"),
      minValue: z.number().optional().describe("Minimum threshold"),
      maxValue: z.number().optional().describe("Maximum threshold"),
      tagName: z.string().optional().describe("Tag name (for Tag filter)"),
      invert: z.boolean().optional().describe("Invert filter result"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "PCGAddFilterNode", params);
      return { success: true, message: `${params.filterType} filter added to "${params.graphName}"`, data: result };
    },
  },
  {
    id: "ue_pcg_add_spline_sampler",
    name: "Add Spline Sampler Node",
    description: "Add a spline sampler node to generate points along a spline",
    descriptionJa: "スプラインに沿ってポイントを生成するスプラインサンプラーノードを追加",
    category: "UE_PCG",
    inputSchema: z.object({
      graphName: z.string().describe("Target PCG graph"),
      samplingMode: z.enum(["Distance", "NumberOfSamples", "Subdivision"]).optional().describe("Sampling mode"),
      spacing: z.number().optional().describe("Distance between samples"),
      numSamples: z.number().optional().describe("Number of sample points"),
      fillMode: z.enum(["None", "Interior", "Exterior"]).optional().describe("Area fill mode"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "PCGAddSplineSampler", params);
      return { success: true, message: `Spline sampler added to "${params.graphName}"`, data: result };
    },
  },
  {
    id: "ue_pcg_spawn_actor",
    name: "Add PCG Volume to Level",
    description: "Place a PCG volume actor in the level bound to a PCG graph",
    descriptionJa: "PCGグラフにバインドされたPCGボリュームアクターをレベルに配置",
    category: "UE_PCG",
    inputSchema: z.object({
      graphName: z.string().describe("PCG graph asset name"),
      location: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional().describe("Volume location"),
      volumeSize: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional().describe("Volume extent size"),
      generateOnLoad: z.boolean().optional().describe("Generate on level load (default: true)"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "PCGSpawnActor", params);
      return { success: true, message: `PCG volume placed for "${params.graphName}"`, data: result };
    },
  },
  {
    id: "ue_pcg_regenerate",
    name: "Regenerate PCG",
    description: "Force regenerate a PCG graph instance in the level",
    descriptionJa: "レベル内のPCGグラフインスタンスを強制再生成",
    category: "UE_PCG",
    inputSchema: z.object({
      actorName: z.string().optional().describe("PCG volume actor name (regenerates all if omitted)"),
      newSeed: z.number().optional().describe("New random seed"),
    }),
    handler: async (params) => {
      const result = await bridge.send("unreal", "PCGRegenerate", params);
      const target = params.actorName || "all PCG actors";
      return { success: true, message: `PCG regenerated: ${target}`, data: result };
    },
  },
];