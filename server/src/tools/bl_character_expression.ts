import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
export const blCharacterExpressionTools: ToolDefinition[] = [
  {
    id: "bl_char_create_unified_shapekeys",
    name: "Character: Create Unified Expression Shape Keys",
    description: "Auto-generate all 70+ Unified Expressions shape keys for VRCFaceTracking compatibility. Creates base shapes for eyes, mouth, brow, nose, cheek, jaw, and tongue.",
    descriptionJa: "Unified Expressions全70+Shape Keyを一括自動生成（VRCFaceTracking互換）。目・口・眉・鼻・頬・顎・舌のベースシェイプを作成",
    category: "BL_CharacterExpression",
    inputSchema: z.object({
      objectName: z.string().optional().describe("Target character mesh object name"),
      includeExtended: z.boolean().optional().describe("Include extended tongue and cheek shapes (default true)"),
      defaultStrength: z.number().min(0).max(1).optional().describe("Default deformation strength for generated keys (default 1.0)"),
    }),
    handler: async (params) => bridge.send("blender", "bl_char_create_unified_shapekeys", params),
  },
  {
    id: "bl_char_set_shapekey_value",
    name: "Character: Set Shape Key Value",
    description: "Set a single shape key to a specific value (0.0-1.0). Works with any shape key by name.",
    descriptionJa: "個別Shape Keyの値を設定（名前指定で任意のShape Keyを0.0〜1.0で調整）",
    category: "BL_CharacterExpression",
    inputSchema: z.object({
      objectName: z.string().optional().describe("Target character mesh object name"),
      shapeKeyName: z.string().describe("Shape key name (e.g. EyeClosedLeft, MouthSmileRight)"),
      value: z.number().min(0).max(1).describe("Shape key value"),
    }),
    handler: async (params) => bridge.send("blender", "bl_char_set_shapekey_value", params),
  },
  {
    id: "bl_char_create_expression_preset",
    name: "Character: Create Expression Preset",
    description: "Create a named expression preset by combining multiple shape keys (e.g. happy = MouthSmileLeft 0.8 + MouthSmileRight 0.8 + CheekSquintLeft 0.3 + CheekSquintRight 0.3).",
    descriptionJa: "表情プリセット作成（複数Shape Keyの組み合わせに名前を付けて保存。例：笑顔=MouthSmileL 0.8+MouthSmileR 0.8+CheekSquint 0.3）",
    category: "BL_CharacterExpression",
    inputSchema: z.object({
      objectName: z.string().optional().describe("Target character mesh object name"),
      presetName: z.string().describe("Expression preset name (e.g. happy, angry, sad, surprised)"),
      shapeKeys: z.record(z.number().min(0).max(1)).describe("Map of shape key names to values"),
    }),
    handler: async (params) => bridge.send("blender", "bl_char_create_expression_preset", params),
  },
  {
    id: "bl_char_setup_viseme",
    name: "Character: Setup Visemes",
    description: "Auto-generate lip-sync viseme shape keys (vrc.v_sil, vrc.v_PP, vrc.v_FF, vrc.v_TH, vrc.v_DD, vrc.v_kk, vrc.v_CH, vrc.v_SS, vrc.v_nn, vrc.v_RR, vrc.v_aa, vrc.v_E, vrc.v_ih, vrc.v_oh, vrc.v_ou).",
    descriptionJa: "リップシンク用Viseme Shape Key自動生成（vrc.v_sil〜vrc.v_ou の15種。VRChat標準準拠）",
    category: "BL_CharacterExpression",
    inputSchema: z.object({
      objectName: z.string().optional().describe("Target character mesh object name"),
      style: z.enum(["realistic", "anime", "minimal"]).optional().describe("Viseme deformation style (default realistic)"),
      strength: z.number().min(0).max(1).optional().describe("Overall viseme strength (default 1.0)"),
    }),
    handler: async (params) => bridge.send("blender", "bl_char_setup_viseme", params),
  },
  {
    id: "bl_char_create_custom_shapekey",
    name: "Character: Create Custom Shape Key",
    description: "Create a custom shape key from the current mesh deformation state. Enter edit/sculpt mode, deform, then call this to register.",
    descriptionJa: "カスタムShape Key作成（現在のメッシュ変形状態からShape Keyを登録。編集/スカルプトで変形後に呼び出し）",
    category: "BL_CharacterExpression",
    inputSchema: z.object({
      objectName: z.string().optional().describe("Target character mesh object name"),
      keyName: z.string().describe("Name for the new shape key"),
      category: z.enum(["face", "body", "clothing", "other"]).optional().describe("Shape key category for organization"),
    }),
    handler: async (params) => bridge.send("blender", "bl_char_create_custom_shapekey", params),
  },
  {
    id: "bl_char_mirror_shapekeys",
    name: "Character: Mirror Shape Keys",
    description: "Auto-mirror Left shape keys to Right (or vice versa). Handles naming conventions like EyeClosedLeft -> EyeClosedRight.",
    descriptionJa: "Shape Keyの左右自動ミラー生成（EyeClosedLeft→EyeClosedRight等、命名規則に基づいて自動対応）",
    category: "BL_CharacterExpression",
    inputSchema: z.object({
      objectName: z.string().optional().describe("Target character mesh object name"),
      direction: z.enum(["left_to_right", "right_to_left"]).optional().describe("Mirror direction (default left_to_right)"),
      filter: z.string().optional().describe("Only mirror shape keys containing this string (e.g. Eye, Mouth)"),
    }),
    handler: async (params) => bridge.send("blender", "bl_char_mirror_shapekeys", params),
  },
  {
    id: "bl_char_batch_shapekeys",
    name: "Character: Batch Set Shape Keys",
    description: "Set multiple shape key values at once using a JSON map. Efficient for applying full expression states.",
    descriptionJa: "Shape Key一括設定（JSONマップで複数キーの値を同時設定。表情全体の適用に最適）",
    category: "BL_CharacterExpression",
    inputSchema: z.object({
      objectName: z.string().optional().describe("Target character mesh object name"),
      values: z.record(z.number().min(0).max(1)).describe("Map of shape key names to values"),
      resetOthers: z.boolean().optional().describe("Reset unlisted shape keys to 0 (default false)"),
    }),
    handler: async (params) => bridge.send("blender", "bl_char_batch_shapekeys", params),
  },
  {
    id: "bl_char_export_expressions",
    name: "Character: Export Expression Data",
    description: "Export all shape key names, values, and expression presets to JSON file for reuse on another avatar.",
    descriptionJa: "表情データをJSON出力（全Shape Key名・値・プリセットを保存。別アバターへの再利用用）",
    category: "BL_CharacterExpression",
    inputSchema: z.object({
      objectName: z.string().optional().describe("Target character mesh object name"),
      outputPath: z.string().optional().describe("Output JSON file path (default: same dir as .blend)"),
      includePresets: z.boolean().optional().describe("Include custom expression presets (default true)"),
    }),
    handler: async (params) => bridge.send("blender", "bl_char_export_expressions", params),
  },
];