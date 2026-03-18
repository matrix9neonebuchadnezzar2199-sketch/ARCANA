import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";
import { unrealBridge } from "../bridge/unreal-bridge";
import { blenderBridge } from "../bridge/blender-bridge";

export const recipeSceneTools: ToolDefinition[] = [
  {
    id: "recipe_fps_scene",
    name: "Recipe: FPS Scene",
    description: "Generate a complete FPS scene with terrain, lighting, camera, post-processing, nav mesh, and spawn points.",
    descriptionJa: "FPSシーンを一括生成（地形・ライティング・カメラ・ポストプロセス・ナビメッシュ・スポーン地点）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      terrainSize: z.number().optional().describe("Terrain size in meters (default 500)"),
      timeOfDay: z.enum(["morning", "noon", "evening", "night"]).optional().describe("Lighting preset"),
      spawnCount: z.number().optional().describe("Number of spawn points (default 8)"),
    }),
    handler: async (params) => {
      const bridge = params.editor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("recipe_fps_scene", params);
    },
  },
  {
    id: "recipe_tps_scene",
    name: "Recipe: TPS Scene",
    description: "Generate a complete third-person shooter scene with cover objects, camera rig, and AI patrol paths.",
    descriptionJa: "TPSシーンを一括生成（遮蔽物・カメラリグ・AI巡回パス）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      mapStyle: z.enum(["urban", "forest", "desert", "snow"]).optional().describe("Map theme"),
      coverCount: z.number().optional().describe("Number of cover objects (default 20)"),
    }),
    handler: async (params) => {
      const bridge = params.editor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("recipe_tps_scene", params);
    },
  },
  {
    id: "recipe_platformer_scene",
    name: "Recipe: Platformer Scene",
    description: "Generate a 2D/3D platformer level with platforms, hazards, collectibles, and goal.",
    descriptionJa: "プラットフォーマーレベルを一括生成（足場・トラップ・コレクティブル・ゴール）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      dimension: z.enum(["2d", "3d"]).optional().describe("2D or 3D (default 3d)"),
      difficulty: z.enum(["easy", "medium", "hard"]).optional().describe("Difficulty level"),
      platformCount: z.number().optional().describe("Number of platforms (default 15)"),
    }),
    handler: async (params) => {
      const bridge = params.editor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("recipe_platformer_scene", params);
    },
  },
  {
    id: "recipe_horror_scene",
    name: "Recipe: Horror Scene",
    description: "Generate a horror scene with dark lighting, fog, ambient audio sources, flickering lights, and jump-scare triggers.",
    descriptionJa: "ホラーシーンを一括生成（暗めライティング・フォグ・環境音・明滅ライト・ジャンプスケアトリガー）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      setting: z.enum(["mansion", "hospital", "forest", "underground"]).optional().describe("Horror setting"),
      fogDensity: z.number().optional().describe("Fog density 0.0-1.0 (default 0.6)"),
    }),
    handler: async (params) => {
      const bridge = params.editor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("recipe_horror_scene", params);
    },
  },
  {
    id: "recipe_racing_scene",
    name: "Recipe: Racing Scene",
    description: "Generate a racing track with checkpoints, starting grid, barriers, and lap system.",
    descriptionJa: "レーシングシーンを一括生成（チェックポイント・スターティンググリッド・バリア・ラップシステム）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      trackType: z.enum(["circuit", "rally", "drag"]).optional().describe("Track type"),
      lapCount: z.number().optional().describe("Number of laps (default 3)"),
    }),
    handler: async (params) => {
      const bridge = params.editor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("recipe_racing_scene", params);
    },
  },
  {
    id: "recipe_rpg_dungeon",
    name: "Recipe: RPG Dungeon",
    description: "Generate an RPG dungeon with rooms, corridors, doors, treasure chests, enemy spawn zones, and boss room.",
    descriptionJa: "RPGダンジョンを一括生成（部屋・通路・扉・宝箱・敵スポーン・ボス部屋）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      roomCount: z.number().optional().describe("Number of rooms (default 8)"),
      theme: z.enum(["stone", "cave", "ice", "fire"]).optional().describe("Dungeon theme"),
      hasBoss: z.boolean().optional().describe("Include boss room (default true)"),
    }),
    handler: async (params) => {
      const bridge = params.editor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("recipe_rpg_dungeon", params);
    },
  },
  {
    id: "recipe_open_world_base",
    name: "Recipe: Open World Base",
    description: "Generate an open world base setup with large terrain, world streaming zones, LOD groups, weather system, and day-night cycle.",
    descriptionJa: "オープンワールド基盤を一括生成（大型地形・ストリーミングゾーン・LOD・天候・昼夜サイクル）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      worldSize: z.number().optional().describe("World size in km (default 4)"),
      biome: z.enum(["temperate", "tropical", "arctic", "desert"]).optional().describe("Primary biome"),
    }),
    handler: async (params) => {
      const bridge = params.editor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("recipe_open_world_base", params);
    },
  },
  {
    id: "recipe_vr_room",
    name: "Recipe: VR Room",
    description: "Generate a VR-ready room with teleport points, grab interactables, UI canvas in world space, and guardian boundary.",
    descriptionJa: "VRルームを一括生成（テレポートポイント・グラブ対象・ワールドUI・ガーディアン境界）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      roomType: z.enum(["living", "office", "gallery", "lab"]).optional().describe("Room type"),
      interactableCount: z.number().optional().describe("Grabbable objects (default 10)"),
    }),
    handler: async (params) => {
      const bridge = params.editor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("recipe_vr_room", params);
    },
  },
  {
    id: "recipe_ui_main_menu",
    name: "Recipe: Main Menu UI",
    description: "Generate a complete main menu with title, start/options/quit buttons, background, and BGM AudioSource.",
    descriptionJa: "メインメニューUIを一括生成（タイトル・開始/設定/終了ボタン・背景・BGM）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      style: z.enum(["minimal", "cinematic", "retro", "anime"]).optional().describe("UI style"),
      title: z.string().optional().describe("Game title text"),
    }),
    handler: async (params) => {
      const bridge = params.editor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("recipe_ui_main_menu", params);
    },
  },
  {
    id: "recipe_ui_hud",
    name: "Recipe: HUD",
    description: "Generate a game HUD with health bar, ammo counter, minimap placeholder, crosshair, and score display.",
    descriptionJa: "ゲームHUDを一括生成（HP・弾数・ミニマップ・クロスヘア・スコア表示）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      genre: z.enum(["fps", "rpg", "racing", "platformer"]).optional().describe("Genre preset"),
    }),
    handler: async (params) => {
      const bridge = params.editor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("recipe_ui_hud", params);
    },
  },
  {
    id: "recipe_ui_inventory",
    name: "Recipe: Inventory UI",
    description: "Generate an inventory UI with grid slots, drag-and-drop setup, item tooltip, and equipment panel.",
    descriptionJa: "インベントリUIを一括生成（グリッドスロット・ドラッグ＆ドロップ・ツールチップ・装備パネル）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      slotCount: z.number().optional().describe("Inventory slots (default 24)"),
      columns: z.number().optional().describe("Grid columns (default 6)"),
    }),
    handler: async (params) => {
      const bridge = params.editor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("recipe_ui_inventory", params);
    },
  },
  {
    id: "recipe_ui_dialogue",
    name: "Recipe: Dialogue UI",
    description: "Generate a dialogue UI with speaker name, text box with typewriter effect setup, portrait slot, and choice buttons.",
    descriptionJa: "会話UIを一括生成（話者名・テキストボックス・タイプライター演出・立ち絵枠・選択肢ボタン）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      choiceCount: z.number().optional().describe("Max choices (default 4)"),
      style: z.enum(["jrpg", "visual_novel", "western", "minimal"]).optional().describe("Dialogue style"),
    }),
    handler: async (params) => {
      const bridge = params.editor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("recipe_ui_dialogue", params);
    },
  },
  {
    id: "recipe_lighting_studio",
    name: "Recipe: Studio Lighting",
    description: "Generate a 3-point studio lighting setup (key, fill, rim) with optional backdrop and reflection probe.",
    descriptionJa: "スタジオライティングを一括生成（キー・フィル・リムの3点照明＋背景＋リフレクションプローブ）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal", "blender"]).describe("Target editor"),
      preset: z.enum(["soft", "dramatic", "product", "portrait"]).optional().describe("Lighting mood"),
    }),
    handler: async (params) => {
      const bridgeMap: any = { unity: unityBridge, unreal: unrealBridge, blender: blenderBridge };
      return bridgeMap[params.editor].send("recipe_lighting_studio", params);
    },
  },
  {
    id: "recipe_pbr_material",
    name: "Recipe: PBR Material",
    description: "Generate a full PBR material with albedo, normal, metallic, roughness, AO, and emission slots auto-configured.",
    descriptionJa: "PBRマテリアルを一括生成（アルベド・ノーマル・メタリック・ラフネス・AO・エミッション自動設定）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal", "blender"]).describe("Target editor"),
      materialType: z.enum(["brick", "wood", "metal", "fabric", "stone", "glass", "skin"]).describe("Material type"),
      tiling: z.number().optional().describe("UV tiling (default 1)"),
    }),
    handler: async (params) => {
      const bridgeMap: any = { unity: unityBridge, unreal: unrealBridge, blender: blenderBridge };
      return bridgeMap[params.editor].send("recipe_pbr_material", params);
    },
  },
  {
    id: "recipe_post_process",
    name: "Recipe: Post Processing Stack",
    description: "Generate a post-processing stack with bloom, color grading, vignette, ambient occlusion, and depth of field.",
    descriptionJa: "ポストプロセスを一括設定（ブルーム・カラーグレーディング・ビネット・AO・被写界深度）",
    category: "Recipe_Scene",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal"]).describe("Target editor"),
      mood: z.enum(["cinematic", "vibrant", "noir", "retro", "horror"]).optional().describe("Visual mood preset"),
    }),
    handler: async (params) => {
      const bridge = params.editor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("recipe_post_process", params);
    },
  },
];