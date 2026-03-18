import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
export const blCharacterExportTools: ToolDefinition[] = [
  {
    id: "bl_char_export_vrm",
    name: "Character: Export VRM",
    description: "Export character as VRM format with auto-populated metadata (title, author, license). Includes spring bones, blend shapes, and materials.",
    descriptionJa: "VRM形式エクスポート（メタデータ自動付与：タイトル・著者・ライセンス。スプリングボーン・ブレンドシェイプ・マテリアル含む）",
    category: "BL_CharacterExport",
    inputSchema: z.object({
      objectName: z.string().optional().describe("Target character armature name"),
      outputPath: z.string().optional().describe("Output .vrm file path"),
      title: z.string().optional().describe("Avatar title"),
      author: z.string().optional().describe("Author name"),
      license: z.enum(["CC0", "CC_BY", "CC_BY_NC", "CC_BY_SA", "CC_BY_NC_SA", "CC_BY_ND", "CC_BY_NC_ND", "other"]).optional().describe("License type (default CC_BY_NC)"),
      version: z.enum(["0.x", "1.0"]).optional().describe("VRM version (default 1.0)"),
    }),
    handler: async (params) => { try { return await bridge.send("blender", "bl_char_export_vrm", params); } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } },
  },
  {
    id: "bl_char_export_fbx",
    name: "Character: Export FBX",
    description: "Export character as FBX optimized for Unity or Unreal. Auto-applies correct axis, scale, and bone orientation settings.",
    descriptionJa: "FBXエクスポート（Unity/UE向け最適化設定を自動適用：軸・スケール・ボーン方向）",
    category: "BL_CharacterExport",
    inputSchema: z.object({
      objectName: z.string().optional().describe("Target character armature name"),
      outputPath: z.string().optional().describe("Output .fbx file path"),
      targetEngine: z.enum(["unity", "unreal"]).optional().describe("Target engine for optimized settings (default unity)"),
      includeShapeKeys: z.boolean().optional().describe("Include shape keys / blend shapes (default true)"),
      applyModifiers: z.boolean().optional().describe("Apply modifiers before export (default true)"),
    }),
    handler: async (params) => { try { return await bridge.send("blender", "bl_char_export_fbx", params); } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } },
  },
  {
    id: "bl_char_validate_avatar",
    name: "Character: Validate Avatar",
    description: "Run VRChat avatar validation: check polygon count (<70k for Excellent), bone count (<150), texture memory (<40MB), material count, mesh count, and particle systems.",
    descriptionJa: "アバターバリデーション（VRChatランク基準：ポリゴン数<70k=Excellent、ボーン<150、テクスチャメモリ<40MB、マテリアル数・メッシュ数・パーティクル数チェック）",
    category: "BL_CharacterExport",
    inputSchema: z.object({
      objectName: z.string().optional().describe("Target character armature name"),
      targetRank: z.enum(["excellent", "good", "medium", "poor"]).optional().describe("Target VRChat performance rank (default good)"),
    }),
    handler: async (params) => { try { return await bridge.send("blender", "bl_char_validate_avatar", params); } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } },
  },
  {
    id: "bl_char_optimize_avatar",
    name: "Character: Optimize Avatar",
    description: "Auto-optimize avatar: decimate to target polygon count, merge materials into atlas, merge meshes by category, remove unused shape keys.",
    descriptionJa: "アバター自動最適化（目標ポリゴン数へデシメート・マテリアルアトラス化・メッシュ統合・未使用Shape Key除去）",
    category: "BL_CharacterExport",
    inputSchema: z.object({
      objectName: z.string().optional().describe("Target character armature name"),
      targetPolygons: z.number().optional().describe("Target polygon count (default 32000)"),
      mergeTextures: z.boolean().optional().describe("Merge textures into atlas (default true)"),
      atlasResolution: z.number().optional().describe("Atlas texture resolution (default 2048)"),
      mergeMeshes: z.boolean().optional().describe("Merge meshes by category (default true)"),
      removeUnusedShapeKeys: z.boolean().optional().describe("Remove shape keys with 0 influence (default false)"),
    }),
    handler: async (params) => { try { return await bridge.send("blender", "bl_char_optimize_avatar", params); } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } },
  },
  {
    id: "bl_char_setup_springbone",
    name: "Character: Setup Spring Bones",
    description: "Configure VRM SpringBone / VRChat PhysBone chains for hair, skirt, accessories. Auto-detects chains by bone naming convention or manual specification.",
    descriptionJa: "スプリングボーン設定（VRM SpringBone/VRChat PhysBone。髪・スカート・アクセサリの揺れ物チェーンをボーン命名規則から自動検出 or 手動指定）",
    category: "BL_CharacterExport",
    inputSchema: z.object({
      objectName: z.string().optional().describe("Target character armature name"),
      mode: z.enum(["auto_detect", "manual"]).optional().describe("Detection mode (default auto_detect)"),
      manualChains: z.array(z.object({
        rootBone: z.string().describe("Chain root bone name"),
        stiffness: z.number().min(0).max(1).optional(),
        gravity: z.number().min(0).max(1).optional(),
        damping: z.number().min(0).max(1).optional(),
        radius: z.number().optional(),
      })).optional().describe("Manual chain definitions (if mode is manual)"),
      colliderGroups: z.array(z.object({
        boneName: z.string().describe("Collider parent bone"),
        radius: z.number().describe("Collider sphere radius"),
        offset: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional(),
      })).optional().describe("Collider groups for collision avoidance (head, chest, etc.)"),
    }),
    handler: async (params) => { try { return await bridge.send("blender", "bl_char_setup_springbone", params); } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } },
  },
];