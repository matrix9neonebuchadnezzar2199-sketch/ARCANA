import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
export const recipeProjectTools: ToolDefinition[] = [
  {
    id: "project_health_check",
    name: "Project Health Check",
    description: "Run a comprehensive project health check: missing references, unused assets, duplicate materials, and script errors.",
    descriptionJa: "プロジェクト健全性チェック（参照切れ・未使用アセット・重複マテリアル・スクリプトエラー）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      checks: z.array(z.enum(["missing_refs", "unused_assets", "duplicate_materials", "script_errors", "all"])).optional().describe("Checks to run (default all)"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_health_check", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_texture_audit",
    name: "Project Texture Audit",
    description: "Audit all textures: find oversized textures, non-power-of-2, uncompressed, and suggest optimizations.",
    descriptionJa: "テクスチャ監査（サイズ超過・非2のべき乗・未圧縮を検出し最適化提案）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      maxSize: z.number().optional().describe("Max recommended texture size in px (default 2048)"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_texture_audit", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_polygon_budget",
    name: "Project Polygon Budget",
    description: "Analyze scene polygon counts per object, flag objects exceeding budget, and suggest LOD candidates.",
    descriptionJa: "ポリゴンバジェット分析（オブジェクト別ポリゴン数・予算超過フラグ・LOD候補提案）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal", "blender"]).describe("Target editor"),
      budget: z.number().optional().describe("Total polygon budget (default 500000)"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_polygon_budget", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_naming_convention",
    name: "Project Naming Convention Check",
    description: "Check all assets and GameObjects follow naming conventions (prefixes, PascalCase, etc.) and report violations.",
    descriptionJa: "命名規則チェック（プレフィックス・PascalCase等の規則違反をレポート）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      convention: z.enum(["unity_standard", "ue_standard", "custom"]).optional().describe("Naming convention set"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_naming_convention", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_build_size_report",
    name: "Project Build Size Report",
    description: "Generate a build size report showing asset size breakdown by category (textures, meshes, audio, scripts).",
    descriptionJa: "ビルドサイズレポート生成（テクスチャ・メッシュ・オーディオ・スクリプト別容量内訳）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_build_size_report", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_scene_profiler",
    name: "Project Scene Profiler",
    description: "Profile the current scene: draw calls, batches, shadow casters, active lights, and physics colliders count.",
    descriptionJa: "シーンプロファイル取得（ドローコール・バッチ・シャドウキャスター・ライト数・コライダー数）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_scene_profiler", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_missing_reference_fix",
    name: "Project Missing Reference Fix",
    description: "Detect and auto-fix missing script/asset references by removing broken components or suggesting replacements.",
    descriptionJa: "参照切れ自動修復（壊れたコンポーネント除去または置換候補提案）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      mode: z.enum(["report", "remove", "suggest"]).optional().describe("Fix mode (default report)"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_missing_reference_fix", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_layer_tag_setup",
    name: "Project Layer & Tag Setup",
    description: "Batch create layers, tags, and sorting layers for a project template (FPS, RPG, platformer, etc.).",
    descriptionJa: "レイヤー・タグ一括セットアップ（FPS/RPG/プラットフォーマー等のテンプレート）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      template: z.enum(["fps", "rpg", "platformer", "racing", "custom"]).describe("Project template"),
      customLayers: z.array(z.string()).optional().describe("Custom layer names (if template is custom)"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_layer_tag_setup", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_folder_structure",
    name: "Project Folder Structure",
    description: "Create a standardized project folder structure (Art, Scripts, Prefabs, Scenes, Audio, etc.) based on best practices.",
    descriptionJa: "プロジェクトフォルダ構造を自動生成（Art/Scripts/Prefabs/Scenes/Audio等のベストプラクティス準拠）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      genre: z.enum(["fps", "rpg", "platformer", "simulation", "general"]).optional().describe("Game genre for tailored structure"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_folder_structure", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_gitignore_setup",
    name: "Project .gitignore Setup",
    description: "Generate a .gitignore file optimized for Unity or Unreal projects, including Library, Temp, Build, Intermediate, etc.",
    descriptionJa: ".gitignoreを自動生成（Unity/UEプロジェクト向け最適化）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      extras: z.array(z.string()).optional().describe("Extra ignore patterns"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_gitignore_setup", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_collision_matrix",
    name: "Project Collision Matrix Setup",
    description: "Configure physics collision matrix between layers for a game template (e.g., Player vs Enemy, Bullet vs Environment).",
    descriptionJa: "コリジョンマトリクス設定（レイヤー間の衝突設定をテンプレートで一括構成）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      template: z.enum(["fps", "rpg", "platformer", "custom"]).describe("Game template"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_collision_matrix", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_quality_settings",
    name: "Project Quality Settings",
    description: "Configure quality tiers (Low/Medium/High/Ultra) with shadow, LOD, texture, and rendering settings per tier.",
    descriptionJa: "品質設定を一括構成（Low/Medium/High/Ultraの影・LOD・テクスチャ・レンダリング設定）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      platform: z.enum(["pc", "mobile", "console", "vr"]).optional().describe("Target platform"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_quality_settings", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_input_preset",
    name: "Project Input Preset",
    description: "Generate a complete input mapping preset for keyboard+mouse and gamepad based on game genre.",
    descriptionJa: "入力マッピングプリセット生成（キーボード+マウス・ゲームパッド、ジャンル別テンプレート）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      genre: z.enum(["fps", "tps", "rpg", "platformer", "racing", "fighting"]).describe("Game genre"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_input_preset", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_audio_setup",
    name: "Project Audio Setup",
    description: "Configure audio system: mixer groups (BGM, SFX, Voice, Ambience), snapshot presets, and attenuation defaults.",
    descriptionJa: "オーディオシステム一括設定（ミキサーグループ・スナップショット・減衰デフォルト）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      groups: z.array(z.string()).optional().describe("Mixer groups (default BGM, SFX, Voice, Ambience)"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_audio_setup", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "project_scene_template_save",
    name: "Project Scene Template Save",
    description: "Save the current scene as a reusable template (hierarchy, settings, components) for quick duplication.",
    descriptionJa: "現在のシーンをテンプレートとして保存（階層・設定・コンポーネントを再利用可能に）",
    category: "Recipe_Project",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      templateName: z.string().describe("Template name"),
      description: z.string().optional().describe("Template description"),
    }),
    handler: async (params) => {
      try {
        return bridge.send(params.editor, "project_scene_template_save", params);
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
];