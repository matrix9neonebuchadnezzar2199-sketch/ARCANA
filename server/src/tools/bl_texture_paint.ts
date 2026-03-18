import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
export const blTexturePaintTools: ToolDefinition[] = [
  {
    id: "bl_tpaint_enter_mode",
    name: "Enter Texture Paint Mode",
    description: "Enter texture paint mode on a mesh object, creating a paint slot if needed",
    descriptionJa: "メッシュオブジェクトでテクスチャペイントモードに入る（必要に応じペイントスロット作成）",
    category: "BL_TexturePaint",
    inputSchema: z.object({
      objectName: z.string().describe("Target mesh object"),
      createSlot: z.boolean().optional().describe("Create a new paint slot if none exists (default: true)"),
      imageWidth: z.number().optional().describe("New image width (default: 1024)"),
      imageHeight: z.number().optional().describe("New image height (default: 1024)"),
      baseColor: z.object({ r: z.number(), g: z.number(), b: z.number(), a: z.number().optional() }).optional().describe("Base fill color for new image"),
    }),
    handler: async (params) => {
      const result = await bridge.send("blender", "bl_tpaint_enter_mode", params);
      return { success: true, message: `Texture paint mode entered on "${params.objectName}"`, data: result };
    },
  },
  {
    id: "bl_tpaint_set_brush",
    name: "Set Paint Brush",
    description: "Configure the texture paint brush type, color, radius, and strength",
    descriptionJa: "テクスチャペイントブラシのタイプ、色、半径、強度を設定",
    category: "BL_TexturePaint",
    inputSchema: z.object({
      brush: z.enum(["DRAW", "SOFTEN", "SMEAR", "CLONE", "FILL", "MASK"]).describe("Brush type"),
      color: z.object({ r: z.number(), g: z.number(), b: z.number() }).optional().describe("Brush color"),
      secondaryColor: z.object({ r: z.number(), g: z.number(), b: z.number() }).optional().describe("Secondary color"),
      radius: z.number().optional().describe("Brush radius in pixels"),
      strength: z.number().optional().describe("Brush strength (0-1)"),
      blendMode: z.enum(["MIX", "DARKEN", "MULTIPLY", "LIGHTEN", "SCREEN", "ADD", "SUBTRACT", "OVERLAY", "SOFTLIGHT", "ERASE_ALPHA", "ADD_ALPHA"]).optional().describe("Blend mode"),
    }),
    handler: async (params) => {
      const result = await bridge.send("blender", "bl_tpaint_set_brush", params);
      return { success: true, message: `Paint brush set to ${params.brush}`, data: result };
    },
  },
  {
    id: "bl_tpaint_apply_stroke",
    name: "Apply Paint Stroke",
    description: "Programmatically apply a paint stroke along UV-space or 3D-space points",
    descriptionJa: "UV空間または3D空間のポイントに沿ってペイントストロークをプログラム的に適用",
    category: "BL_TexturePaint",
    inputSchema: z.object({
      objectName: z.string().describe("Target object"),
      points: z.array(z.object({
        x: z.number(), y: z.number(), z: z.number().optional(),
        pressure: z.number().optional(),
      })).describe("Stroke points (UV 2D or world 3D)"),
      color: z.object({ r: z.number(), g: z.number(), b: z.number() }).optional().describe("Override color"),
      radius: z.number().optional().describe("Override radius"),
      strength: z.number().optional().describe("Override strength"),
    }),
    handler: async (params) => {
      const result = await bridge.send("blender", "bl_tpaint_apply_stroke", params);
      return { success: true, message: `Paint stroke applied (${params.points.length} points) on "${params.objectName}"`, data: result };
    },
  },
  {
    id: "bl_tpaint_fill_layer",
    name: "Fill Paint Layer",
    description: "Fill the entire paint image or a masked region with a solid color",
    descriptionJa: "ペイント画像全体またはマスク領域をソリッドカラーで塗りつぶし",
    category: "BL_TexturePaint",
    inputSchema: z.object({
      objectName: z.string().describe("Target object"),
      color: z.object({ r: z.number(), g: z.number(), b: z.number(), a: z.number().optional() }).describe("Fill color"),
      imageName: z.string().optional().describe("Specific image name to fill (default: active paint slot)"),
    }),
    handler: async (params) => {
      const result = await bridge.send("blender", "bl_tpaint_fill_layer", params);
      return { success: true, message: `Paint layer filled on "${params.objectName}"`, data: result };
    },
  },
  {
    id: "bl_tpaint_save_image",
    name: "Save Paint Image",
    description: "Save the painted texture image to disk",
    descriptionJa: "ペイントしたテクスチャ画像をディスクに保存",
    category: "BL_TexturePaint",
    inputSchema: z.object({
      imageName: z.string().optional().describe("Image name to save (default: all dirty images)"),
      filepath: z.string().optional().describe("Custom save path (overrides existing path)"),
      format: z.enum(["PNG", "JPEG", "BMP", "TIFF", "OPEN_EXR", "TARGA"]).optional().describe("Image format"),
    }),
    handler: async (params) => {
      const result = await bridge.send("blender", "bl_tpaint_save_image", params);
      return { success: true, message: `Paint image saved${params.imageName ? ": " + params.imageName : ""}`, data: result };
    },
  },
];