import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";
import { unrealBridge } from "../bridge/unreal-bridge";
import { blenderBridge } from "../bridge/blender-bridge";

export const recipePipelineTools: ToolDefinition[] = [
  {
    id: "pipeline_blender_to_unity",
    name: "Pipeline: Blender to Unity",
    description: "Export model from Blender (FBX) and auto-import into Unity with correct scale, rotation fix, and material remapping.",
    descriptionJa: "Blender→Unity自動パイプライン（FBXエクスポート→スケール・回転補正・マテリアル再マッピングで自動インポート）",
    category: "Recipe_Pipeline",
    inputSchema: z.object({
      blenderObject: z.string().describe("Blender object name to export"),
      unityPath: z.string().optional().describe("Unity import path (default Assets/Imports/)"),
      format: z.enum(["fbx", "gltf"]).optional().describe("Export format (default fbx)"),
      applyTransform: z.boolean().optional().describe("Apply transform on export (default true)"),
    }),
    handler: async (params) => {
      await blenderBridge.send("pipeline_export_fbx", params);
      return unityBridge.send("pipeline_import_fbx", params);
    },
  },
  {
    id: "pipeline_blender_to_unreal",
    name: "Pipeline: Blender to Unreal",
    description: "Export model from Blender (FBX) and auto-import into Unreal with axis conversion, collision setup, and LOD hints.",
    descriptionJa: "Blender→UE自動パイプライン（FBXエクスポート→軸変換・コリジョン設定・LODヒント付きインポート）",
    category: "Recipe_Pipeline",
    inputSchema: z.object({
      blenderObject: z.string().describe("Blender object name to export"),
      unrealPath: z.string().optional().describe("Unreal content path (default /Game/Imports/)"),
      generateCollision: z.boolean().optional().describe("Auto-generate collision (default true)"),
    }),
    handler: async (params) => {
      await blenderBridge.send("pipeline_export_fbx_ue", params);
      return unrealBridge.send("pipeline_import_fbx", params);
    },
  },
  {
    id: "pipeline_unity_to_unreal",
    name: "Pipeline: Unity to Unreal",
    description: "Export Unity prefab as FBX and import into Unreal with component mapping suggestions (Collider->Collision, Rigidbody->Physics).",
    descriptionJa: "Unity→UE変換パイプライン（プレハブFBX化→コンポーネントマッピング提案付きインポート）",
    category: "Recipe_Pipeline",
    inputSchema: z.object({
      prefabPath: z.string().describe("Unity prefab asset path"),
      unrealPath: z.string().optional().describe("Unreal destination path"),
    }),
    handler: async (params) => {
      await unityBridge.send("pipeline_export_prefab", params);
      return unrealBridge.send("pipeline_import_converted", params);
    },
  },
  {
    id: "pipeline_texture_batch_convert",
    name: "Pipeline: Texture Batch Convert",
    description: "Batch convert textures between formats (PNG/TGA/EXR/DDS) and resize for target platform.",
    descriptionJa: "テクスチャ一括変換（PNG/TGA/EXR/DDS間変換＋プラットフォーム向けリサイズ）",
    category: "Recipe_Pipeline",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal", "blender"]).describe("Target editor"),
      sourcePath: z.string().describe("Source texture folder path"),
      targetFormat: z.enum(["png", "tga", "exr", "dds"]).describe("Target format"),
      maxResolution: z.number().optional().describe("Max resolution (default 2048)"),
    }),
    handler: async (params) => {
      const bridgeMap: any = { unity: unityBridge, unreal: unrealBridge, blender: blenderBridge };
      return bridgeMap[params.editor].send("pipeline_texture_batch_convert", params);
    },
  },
  {
    id: "pipeline_animation_retarget",
    name: "Pipeline: Animation Retarget",
    description: "Retarget animation from one skeleton to another across editors, mapping bone names automatically.",
    descriptionJa: "アニメーションリターゲット（スケルトン間・エディタ間でボーン名自動マッピング）",
    category: "Recipe_Pipeline",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal", "blender"]).describe("Target editor"),
      sourceAnim: z.string().describe("Source animation asset path"),
      targetSkeleton: z.string().describe("Target skeleton/avatar asset path"),
      boneMapping: z.record(z.string()).optional().describe("Custom bone name mapping overrides"),
    }),
    handler: async (params) => {
      const bridgeMap: any = { unity: unityBridge, unreal: unrealBridge, blender: blenderBridge };
      return bridgeMap[params.editor].send("pipeline_animation_retarget", params);
    },
  },
  {
    id: "pipeline_lod_generator",
    name: "Pipeline: LOD Generator",
    description: "Auto-generate LOD levels for a mesh: decimate in Blender, then import LOD group into Unity/Unreal.",
    descriptionJa: "LOD自動生成（Blenderでデシメート→Unity/UEにLODグループとしてインポート）",
    category: "Recipe_Pipeline",
    inputSchema: z.object({
      targetEditor: z.enum(["unity", "unreal"]).describe("Target editor for LOD import"),
      blenderObject: z.string().describe("Blender source object name"),
      lodLevels: z.number().optional().describe("Number of LOD levels (default 3)"),
      reductionRatios: z.array(z.number()).optional().describe("Polygon reduction ratios per level (default [1.0, 0.5, 0.25])"),
    }),
    handler: async (params) => {
      await blenderBridge.send("pipeline_generate_lods", params);
      const bridge = params.targetEditor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("pipeline_import_lod_group", params);
    },
  },
  {
    id: "pipeline_material_sync",
    name: "Pipeline: Material Sync",
    description: "Sync material settings between Blender and Unity/Unreal: map Principled BSDF to Standard/Lit shader properties.",
    descriptionJa: "マテリアル同期（Blender Principled BSDF→Unity Standard/UE Litシェーダーへプロパティ自動マッピング）",
    category: "Recipe_Pipeline",
    inputSchema: z.object({
      targetEditor: z.enum(["unity", "unreal"]).describe("Target editor"),
      blenderMaterial: z.string().describe("Blender material name"),
      targetMaterialPath: z.string().optional().describe("Target material asset path"),
    }),
    handler: async (params) => {
      const matData = await blenderBridge.send("pipeline_read_material", params);
      const bridge = params.targetEditor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("pipeline_apply_material", { ...params, matData });
    },
  },
  {
    id: "pipeline_lightmap_bake_transfer",
    name: "Pipeline: Lightmap Bake & Transfer",
    description: "Bake lightmaps in Blender Cycles and transfer as lightmap textures to Unity/Unreal with UV2 auto-setup.",
    descriptionJa: "ライトマップベイク＆転送（Blender Cyclesでベイク→UV2自動設定でUnity/UEに転送）",
    category: "Recipe_Pipeline",
    inputSchema: z.object({
      targetEditor: z.enum(["unity", "unreal"]).describe("Target editor"),
      resolution: z.number().optional().describe("Lightmap resolution (default 1024)"),
      samples: z.number().optional().describe("Bake samples (default 128)"),
    }),
    handler: async (params) => {
      const bakeResult = await blenderBridge.send("pipeline_bake_lightmap", params);
      const bridge = params.targetEditor === "unity" ? unityBridge : unrealBridge;
      return bridge.send("pipeline_import_lightmap", { ...params, bakeResult });
    },
  },
  {
    id: "pipeline_asset_validator",
    name: "Pipeline: Asset Validator",
    description: "Validate an asset before cross-editor transfer: check polygon count, bone count, texture size, naming, and scale.",
    descriptionJa: "アセットバリデーター（エディタ間転送前にポリゴン数・ボーン数・テクスチャサイズ・命名・スケールを検証）",
    category: "Recipe_Pipeline",
    inputSchema: z.object({
      editor: z.enum(["unity", "unreal", "blender"]).describe("Source editor"),
      assetPath: z.string().describe("Asset path to validate"),
      targetEditor: z.enum(["unity", "unreal"]).optional().describe("Target editor for compatibility check"),
      maxPolygons: z.number().optional().describe("Max polygon count (default 100000)"),
      maxBones: z.number().optional().describe("Max bone count (default 256)"),
    }),
    handler: async (params) => {
      const bridgeMap: any = { unity: unityBridge, unreal: unrealBridge, blender: blenderBridge };
      return bridgeMap[params.editor].send("pipeline_asset_validator", params);
    },
  },
  {
    id: "pipeline_batch_export",
    name: "Pipeline: Batch Export",
    description: "Batch export multiple Blender objects as individual FBX/glTF files with consistent settings for game engine import.",
    descriptionJa: "一括エクスポート（複数Blenderオブジェクトを個別FBX/glTFファイルとして統一設定でエクスポート）",
    category: "Recipe_Pipeline",
    inputSchema: z.object({
      objects: z.array(z.string()).describe("List of Blender object names to export"),
      format: z.enum(["fbx", "gltf", "obj"]).optional().describe("Export format (default fbx)"),
      outputDir: z.string().optional().describe("Output directory path"),
      applyModifiers: z.boolean().optional().describe("Apply modifiers before export (default true)"),
      targetEditor: z.enum(["unity", "unreal"]).optional().describe("Optimize settings for target editor"),
    }),
    handler: async (params) => {
      return blenderBridge.send("pipeline_batch_export", params);
    },
  },
];