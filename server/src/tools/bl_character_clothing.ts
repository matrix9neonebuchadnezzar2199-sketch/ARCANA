import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
export const blCharacterClothingTools: ToolDefinition[] = [
  {
    id: "bl_char_set_clothing",
    name: "Character: Set Clothing",
    description: "Apply clothing to character. Uses MPFB2 clothing library if available (CC0 asset packs). Accepts slot-based assignment (top, bottom, shoes, etc.) or direct MPFB2 asset names. Install MPFB2 + clothing asset packs for 3D clothing. Without MPFB2, stores metadata only.",
    descriptionJa: "キャラに服を着せる。MPFB2の服ライブラリがあればCC0アセットを直接適用。スロット指定（top/bottom/shoes等）またはアセット名を直接指定。",
    category: "BL_CharacterClothing",
    inputSchema: z.object({
      name: z.string().optional().describe("Target character object name"),
      top: z.string().optional().describe("Top clothing asset (e.g. cortu_green_basic_tshirt, toigo_cowl_top)"),
      bottom: z.string().optional().describe("Bottom clothing asset (e.g. cortu_cargo_pants, toigo_wool_pants)"),
      shoes: z.string().optional().describe("Shoes asset (e.g. toigo_flats, toigo_ankle_boots_female)"),
      dress: z.string().optional().describe("Dress asset (e.g. toigo_shift_dress, mindfront_kimono)"),
      suit: z.string().optional().describe("Suit asset (e.g. toigo_female_suit, toigo_male_suit_3)"),
      hat: z.string().optional().describe("Hat asset"),
      glasses: z.string().optional().describe("Glasses asset"),
      gloves: z.string().optional().describe("Gloves asset"),
      mask: z.string().optional().describe("Mask asset"),
      underwear: z.string().optional().describe("Underwear asset"),
      socks: z.string().optional().describe("Socks asset"),
      outfit: z.string().optional().describe("Full outfit asset (e.g. culturalibre_hero_suit_1, joachip_cyborg_suit)"),
      clothes: z.array(z.string()).optional().describe("List of clothing asset names to apply"),
    }),
    handler: async (params) => { try { return await bridge.send("blender", "bl_char_set_clothing", params); } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } },
  },
  {
    id: "bl_char_remove_clothing",
    name: "Character: Remove Clothing",
    description: "Remove clothing from character. Specify slot name or 'all' to remove everything.",
    descriptionJa: "キャラから服を脱がせる。スロット名指定または'all'で全て除去。",
    category: "BL_CharacterClothing",
    inputSchema: z.object({
      name: z.string().optional().describe("Target character object name"),
      slot: z.string().optional().describe("Slot to remove (e.g. 'top', 'shoes', 'all'). Default: 'all'"),
    }),
    handler: async (params) => { try { return await bridge.send("blender", "bl_char_remove_clothing", params); } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } },
  },
  {
    id: "bl_char_list_clothing",
    name: "Character: List Available Clothing",
    description: "List all available clothing assets organized by category. Shows MPFB2 CC0 assets if installed. Use the asset names from this list in bl_char_set_clothing.",
    descriptionJa: "利用可能な服アセット一覧をカテゴリ別に表示。MPFB2のCC0アセットがインストール済みならそのリストを返す。",
    category: "BL_CharacterClothing",
    inputSchema: z.object({}),
    handler: async (params) => { try { return await bridge.send("blender", "bl_char_list_clothing", params); } catch (error: any) { return { success: false, message: `Error: ${error.message}` }; } },
  },
];