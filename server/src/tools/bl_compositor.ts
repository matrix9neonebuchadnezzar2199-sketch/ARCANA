import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
export const blCompositorTools: ToolDefinition[] = [
  {
    id: "bl_compositor_enable",
    name: "Enable Compositor",
    description: "Enable the compositor and optionally use nodes",
    descriptionJa: "コンポジターを有効化し、オプションでノードを使用",
    category: "BL_Compositor",
    inputSchema: z.object({
      useNodes: z.boolean().optional().describe("Enable node-based compositing (default: true)"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("blender", "bl_compositor_enable", params, { successMessage: "Compositor enabled" });
    },
  },
  {
    id: "bl_compositor_add_node",
    name: "Add Compositor Node",
    description: "Add a node to the compositor tree",
    descriptionJa: "コンポジターツリーにノードを追加",
    category: "BL_Compositor",
    inputSchema: z.object({
      nodeType: z.string().describe("Node type (e.g. CompositorNodeGlare, CompositorNodeBlur, CompositorNodeColorBalance, CompositorNodeLensdist)"),
      nodeName: z.string().optional().describe("Custom label"),
      locationX: z.number().optional().describe("X position"),
      locationY: z.number().optional().describe("Y position"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("blender", "bl_compositor_add_node", params, { successMessage: (_, params) => `Compositor node "${params.nodeType}" added` });
    },
  },
  {
    id: "bl_compositor_connect",
    name: "Connect Compositor Nodes",
    description: "Connect an output socket of one compositor node to an input socket of another",
    descriptionJa: "コンポジターノードの出力ソケットを別のノードの入力ソケットに接続",
    category: "BL_Compositor",
    inputSchema: z.object({
      fromNode: z.string().describe("Output node name"),
      fromSocket: z.union([z.string(), z.number()]).describe("Output socket name or index"),
      toNode: z.string().describe("Input node name"),
      toSocket: z.union([z.string(), z.number()]).describe("Input socket name or index"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("blender", "bl_compositor_connect", params, { successMessage: (_, params) => `Connected ${params.fromNode}[${params.fromSocket}] -> ${params.toNode}[${params.toSocket}]` });
    },
  },
  {
    id: "bl_compositor_add_glare",
    name: "Add Glare Effect",
    description: "Add and configure a Glare node (Fog Glow, Streaks, Bloom, Ghosts)",
    descriptionJa: "Glareノード（Fog Glow、Streaks、Bloom、Ghosts）を追加・設定",
    category: "BL_Compositor",
    inputSchema: z.object({
      glareType: z.enum(["FogGlow", "Streaks", "Bloom", "Ghosts"]).describe("Glare type"),
      quality: z.enum(["High", "Medium", "Low"]).optional().describe("Quality"),
      threshold: z.number().optional().describe("Threshold value"),
      streaks: z.number().optional().describe("Number of streaks (for Streaks type)"),
      autoConnect: z.boolean().optional().describe("Auto-connect between Render Layers and Composite (default: true)"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("blender", "bl_compositor_add_glare", params, { successMessage: (_, params) => `Glare (${params.glareType}) added` });
    },
  },
  {
    id: "bl_compositor_add_color_correction",
    name: "Add Color Correction",
    description: "Add a color correction chain (Color Balance, Brightness/Contrast, Hue/Saturation)",
    descriptionJa: "色補正チェーン（カラーバランス、明度/コントラスト、色相/彩度）を追加",
    category: "BL_Compositor",
    inputSchema: z.object({
      brightness: z.number().optional().describe("Brightness adjustment"),
      contrast: z.number().optional().describe("Contrast adjustment"),
      hue: z.number().optional().describe("Hue shift"),
      saturation: z.number().optional().describe("Saturation multiplier"),
      gamma: z.number().optional().describe("Gamma correction"),
      gain: z.object({ r: z.number(), g: z.number(), b: z.number() }).optional().describe("RGB gain"),
      autoConnect: z.boolean().optional().describe("Auto-connect in chain (default: true)"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("blender", "bl_compositor_add_color_correction", params, { successMessage: "Color correction chain added" });
    },
  },
  {
    id: "bl_compositor_add_denoise",
    name: "Add Denoise Node",
    description: "Add a Denoise node to clean up render noise, auto-connected to render passes",
    descriptionJa: "レンダーノイズを除去するDenoiseノードを追加（レンダーパスに自動接続）",
    category: "BL_Compositor",
    inputSchema: z.object({
      useHDR: z.boolean().optional().describe("HDR denoising mode"),
      prefilter: z.enum(["None", "Fast", "Accurate"]).optional().describe("Prefilter mode"),
      autoConnect: z.boolean().optional().describe("Auto-connect to Render Layers (default: true)"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("blender", "bl_compositor_add_denoise", params, { successMessage: "Denoise node added" });
    },
  },
  {
    id: "bl_compositor_add_vignette",
    name: "Add Vignette Effect",
    description: "Add a vignette darkening effect using Ellipse Mask + Mix nodes",
    descriptionJa: "楕円マスク + ミックスノードを使ったビネット暗転効果を追加",
    category: "BL_Compositor",
    inputSchema: z.object({
      intensity: z.number().optional().describe("Vignette intensity (0-1, default: 0.5)"),
      softness: z.number().optional().describe("Edge softness (default: 0.3)"),
      autoConnect: z.boolean().optional().describe("Auto-connect in chain (default: true)"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("blender", "bl_compositor_add_vignette", params, { successMessage: (_, params) => `Vignette added (intensity: ${params.intensity || 0.5})` });
    },
  },
];