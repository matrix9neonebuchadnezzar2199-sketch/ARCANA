import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
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
      const result = await bridge.send("blender", "CompositorEnable", params);
      return { success: true, message: "Compositor enabled", data: result };
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
      const result = await bridge.send("blender", "CompositorAddNode", params);
      return { success: true, message: `Compositor node "${params.nodeType}" added`, data: result };
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
      const result = await bridge.send("blender", "CompositorConnect", params);
      return { success: true, message: `Connected ${params.fromNode}[${params.fromSocket}] -> ${params.toNode}[${params.toSocket}]`, data: result };
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
      const result = await bridge.send("blender", "CompositorAddGlare", params);
      return { success: true, message: `Glare (${params.glareType}) added`, data: result };
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
      const result = await bridge.send("blender", "CompositorAddColorCorrection", params);
      return { success: true, message: "Color correction chain added", data: result };
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
      const result = await bridge.send("blender", "CompositorAddDenoise", params);
      return { success: true, message: "Denoise node added", data: result };
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
      const result = await bridge.send("blender", "CompositorAddVignette", params);
      return { success: true, message: `Vignette added (intensity: ${params.intensity || 0.5})`, data: result };
    },
  },
];