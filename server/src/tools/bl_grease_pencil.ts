import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
export const blGreasePencilTools: ToolDefinition[] = [
  {
    id: "bl_gp_create_object",
    name: "Create Grease Pencil Object",
    description: "Create a new Grease Pencil object with an initial layer and material",
    descriptionJa: "初期レイヤーとマテリアル付きの新しいGrease Pencilオブジェクトを作成",
    category: "BL_GreasePencil",
    inputSchema: z.object({
      name: z.string().optional().describe("Object name"),
      strokeColor: z.object({ r: z.number(), g: z.number(), b: z.number(), a: z.number().optional() }).optional().describe("Initial stroke color"),
      fillColor: z.object({ r: z.number(), g: z.number(), b: z.number(), a: z.number().optional() }).optional().describe("Initial fill color"),
      location: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional().describe("Object location"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_gp_create_object", params);
        return { success: true, message: `Grease Pencil object "${params.name || "GPencil"}" created`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_gp_add_layer",
    name: "Add Grease Pencil Layer",
    description: "Add a new layer to a Grease Pencil object",
    descriptionJa: "Grease Pencilオブジェクトに新しいレイヤーを追加",
    category: "BL_GreasePencil",
    inputSchema: z.object({
      objectName: z.string().describe("Target Grease Pencil object"),
      layerName: z.string().describe("New layer name"),
      opacity: z.number().optional().describe("Layer opacity (0-1)"),
      blendMode: z.enum(["REGULAR", "OVERLAY", "ADD", "SUBTRACT", "MULTIPLY", "DIVIDE"]).optional().describe("Blend mode"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_gp_add_layer", params);
        return { success: true, message: `Layer "${params.layerName}" added to "${params.objectName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_gp_draw_stroke",
    name: "Draw Stroke",
    description: "Programmatically draw a stroke with specified points on a Grease Pencil layer",
    descriptionJa: "Grease Pencilレイヤーに指定ポイントでストロークをプログラム的に描画",
    category: "BL_GreasePencil",
    inputSchema: z.object({
      objectName: z.string().describe("Target Grease Pencil object"),
      layerName: z.string().optional().describe("Target layer (default: active layer)"),
      frame: z.number().optional().describe("Frame number (default: current frame)"),
      points: z.array(z.object({
        x: z.number(), y: z.number(), z: z.number(),
        pressure: z.number().optional(),
        strength: z.number().optional(),
      })).describe("Stroke points with optional pressure and strength"),
      materialIndex: z.number().optional().describe("Material slot index"),
      lineWidth: z.number().optional().describe("Stroke line width"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_gp_draw_stroke", params);
        return { success: true, message: `Stroke with ${params.points.length} points drawn on "${params.objectName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_gp_add_modifier",
    name: "Add GP Modifier",
    description: "Add a Grease Pencil modifier (Thickness, Noise, Smooth, Tint, Offset, etc.)",
    descriptionJa: "Grease Pencilモディファイア（太さ、ノイズ、スムーズ、ティント、オフセット等）を追加",
    category: "BL_GreasePencil",
    inputSchema: z.object({
      objectName: z.string().describe("Target Grease Pencil object"),
      modifierType: z.enum(["GP_THICK", "GP_NOISE", "GP_SMOOTH", "GP_TINT", "GP_OFFSET", "GP_OPACITY", "GP_SUBDIV", "GP_SIMPLIFY", "GP_MIRROR", "GP_BUILD", "GP_LENGTH"]).describe("Modifier type"),
      modifierName: z.string().optional().describe("Custom modifier name"),
      factor: z.number().optional().describe("Effect factor/strength"),
      layerFilter: z.string().optional().describe("Apply only to this layer"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_gp_add_modifier", params);
        return { success: true, message: `GP modifier ${params.modifierType} added to "${params.objectName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_gp_add_effect",
    name: "Add GP Visual Effect",
    description: "Add a Grease Pencil visual effect (Blur, Shadow, Glow, Rim, Wave, Pixel, Swirl)",
    descriptionJa: "Grease Pencilビジュアルエフェクト（ブラー、シャドウ、グロー、リム、ウェーブ、ピクセル、スワール）を追加",
    category: "BL_GreasePencil",
    inputSchema: z.object({
      objectName: z.string().describe("Target Grease Pencil object"),
      effectType: z.enum(["FX_BLUR", "FX_SHADOW", "FX_GLOW", "FX_RIM", "FX_WAVE", "FX_PIXEL", "FX_SWIRL", "FX_COLORIZE", "FX_FLIP"]).describe("Effect type"),
      color: z.object({ r: z.number(), g: z.number(), b: z.number() }).optional().describe("Effect color (for Shadow, Glow, Rim)"),
      size: z.number().optional().describe("Effect size/radius"),
      samples: z.number().optional().describe("Sample count (for Blur, Shadow)"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_gp_add_effect", params);
        return { success: true, message: `GP effect ${params.effectType} added to "${params.objectName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "bl_gp_set_onion_skinning",
    name: "Set Onion Skinning",
    description: "Configure onion skinning (ghosting) settings for animation preview",
    descriptionJa: "アニメーションプレビュー用のオニオンスキニング（ゴースト）設定を構成",
    category: "BL_GreasePencil",
    inputSchema: z.object({
      objectName: z.string().describe("Target Grease Pencil object"),
      enabled: z.boolean().describe("Enable onion skinning"),
      framesBefore: z.number().optional().describe("Number of ghost frames before current"),
      framesAfter: z.number().optional().describe("Number of ghost frames after current"),
      colorBefore: z.object({ r: z.number(), g: z.number(), b: z.number() }).optional().describe("Ghost color for past frames"),
      colorAfter: z.object({ r: z.number(), g: z.number(), b: z.number() }).optional().describe("Ghost color for future frames"),
      opacity: z.number().optional().describe("Ghost opacity (0-1)"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("blender", "bl_gp_set_onion_skinning", params);
        const state = params.enabled ? "enabled" : "disabled";
        return { success: true, message: `Onion skinning ${state} on "${params.objectName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
];