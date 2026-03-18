import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
export const blSculptTools: ToolDefinition[] = [
  {
    id: "bl_sculpt_enter_mode",
    name: "Enter Sculpt Mode",
    description: "Enter sculpt mode on a mesh object with optional multires setup",
    descriptionJa: "メッシュオブジェクトでスカルプトモードに入る（オプションでMultires設定）",
    category: "BL_Sculpt",
    inputSchema: z.object({
      objectName: z.string().describe("Target mesh object"),
      addMultires: z.boolean().optional().describe("Add Multires modifier if not present"),
      multiresLevels: z.number().optional().describe("Multires subdivision levels to add"),
      enableDyntopo: z.boolean().optional().describe("Enable dynamic topology sculpting"),
    }),
    handler: async (params) => {
      const result = await bridge.send("blender", "SculptEnterMode", params);
      return { success: true, message: `Sculpt mode entered on "${params.objectName}"`, data: result };
    },
  },
  {
    id: "bl_sculpt_set_brush",
    name: "Set Sculpt Brush",
    description: "Select and configure a sculpt brush with radius, strength, and settings",
    descriptionJa: "半径、強度、設定でスカルプトブラシを選択・構成",
    category: "BL_Sculpt",
    inputSchema: z.object({
      brush: z.enum(["DRAW", "CLAY", "CLAY_STRIPS", "INFLATE", "BLOB", "CREASE", "SMOOTH", "FLATTEN", "FILL", "SCRAPE", "PINCH", "GRAB", "SNAKE_HOOK", "THUMB", "NUDGE", "ROTATE", "MASK", "DRAW_FACE_SETS", "ELASTIC_DEFORM", "CLOTH", "POSE", "SLIDE_RELAX", "MULTIRES_DISPLACEMENT_ERASER", "MULTIRES_DISPLACEMENT_SMEAR"]).describe("Brush type"),
      radius: z.number().optional().describe("Brush radius in pixels"),
      strength: z.number().optional().describe("Brush strength (0-1)"),
      autoSmooth: z.number().optional().describe("Auto smooth factor (0-1)"),
      direction: z.enum(["ADD", "SUBTRACT"]).optional().describe("Stroke direction"),
    }),
    handler: async (params) => {
      const result = await bridge.send("blender", "SculptSetBrush", params);
      return { success: true, message: `Brush set to ${params.brush}`, data: result };
    },
  },
  {
    id: "bl_sculpt_apply_stroke",
    name: "Apply Sculpt Stroke",
    description: "Programmatically apply a sculpt stroke along a path of points",
    descriptionJa: "ポイントパスに沿ってスカルプトストロークをプログラム的に適用",
    category: "BL_Sculpt",
    inputSchema: z.object({
      objectName: z.string().describe("Target sculpt object"),
      brush: z.string().optional().describe("Brush to use (default: current)"),
      points: z.array(z.object({
        x: z.number(), y: z.number(), z: z.number(),
        pressure: z.number().optional(),
      })).describe("Stroke path points in world space"),
      strength: z.number().optional().describe("Override brush strength"),
      radius: z.number().optional().describe("Override brush radius"),
    }),
    handler: async (params) => {
      const result = await bridge.send("blender", "SculptApplyStroke", params);
      return { success: true, message: `Sculpt stroke applied (${params.points.length} points) on "${params.objectName}"`, data: result };
    },
  },
  {
    id: "bl_sculpt_remesh",
    name: "Remesh Sculpt",
    description: "Apply voxel or quadriflow remesh to a sculpted object",
    descriptionJa: "スカルプトオブジェクトにボクセルまたはQuadriFlowリメッシュを適用",
    category: "BL_Sculpt",
    inputSchema: z.object({
      objectName: z.string().describe("Target object"),
      mode: z.enum(["VOXEL", "QUAD"]).describe("Remesh mode"),
      voxelSize: z.number().optional().describe("Voxel size (for VOXEL mode, smaller = more detail)"),
      targetFaces: z.number().optional().describe("Target face count (for QUAD mode)"),
      smoothNormals: z.boolean().optional().describe("Smooth normals after remesh"),
      preserveVolume: z.boolean().optional().describe("Preserve volume"),
    }),
    handler: async (params) => {
      const result = await bridge.send("blender", "SculptRemesh", params);
      return { success: true, message: `${params.mode} remesh applied to "${params.objectName}"`, data: result };
    },
  },
  {
    id: "bl_sculpt_mask_operations",
    name: "Sculpt Mask Operations",
    description: "Perform mask operations: fill, clear, invert, smooth, sharpen, or extract masked region",
    descriptionJa: "マスク操作を実行: 塗りつぶし、クリア、反転、スムーズ、シャープ、マスク領域の抽出",
    category: "BL_Sculpt",
    inputSchema: z.object({
      objectName: z.string().describe("Target sculpt object"),
      operation: z.enum(["FILL", "CLEAR", "INVERT", "SMOOTH", "SHARPEN", "EXTRACT", "GROW", "SHRINK"]).describe("Mask operation"),
      iterations: z.number().optional().describe("Iterations for smooth/sharpen/grow/shrink"),
      extractThickness: z.number().optional().describe("Thickness for mask extract"),
    }),
    handler: async (params) => {
      const result = await bridge.send("blender", "SculptMaskOperations", params);
      return { success: true, message: `Mask ${params.operation} applied on "${params.objectName}"`, data: result };
    },
  },
  {
    id: "bl_sculpt_face_sets",
    name: "Face Set Operations",
    description: "Create, modify, or visibility-toggle face sets for organized sculpting",
    descriptionJa: "整理されたスカルプト用にフェイスセットの作成、変更、表示切替を実行",
    category: "BL_Sculpt",
    inputSchema: z.object({
      objectName: z.string().describe("Target sculpt object"),
      operation: z.enum(["INIT_FROM_NORMALS", "INIT_FROM_SHARP_EDGES", "INIT_FROM_MATERIALS", "INIT_FROM_UV_SEAMS", "VISIBILITY_SHOW_ALL", "VISIBILITY_HIDE_SET", "VISIBILITY_SHOW_SET", "RANDOMIZE_COLORS"]).describe("Face set operation"),
      faceSetId: z.number().optional().describe("Target face set ID (for visibility operations)"),
      threshold: z.number().optional().describe("Threshold angle for normal-based init"),
    }),
    handler: async (params) => {
      const result = await bridge.send("blender", "SculptFaceSets", params);
      return { success: true, message: `Face set ${params.operation} on "${params.objectName}"`, data: result };
    },
  },
];