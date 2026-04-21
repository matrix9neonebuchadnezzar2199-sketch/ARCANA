import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
export const blCharacterClothingTools: ToolDefinition[] = [
  {
    id: "bl_char_set_clothing",
    name: "Character: Set Clothing",
    description: "Apply MPFB2 clothing to character. IMPORTANT: Call bl_char_list_clothing FIRST to get available asset names. Do NOT create clothing manually with primitives. Available assets include full suits (female_casualsuit01, male_elegantsuit01, etc.) and shoes (shoes01-06). Pass asset names to the appropriate slot parameter.",
    descriptionJa: "Set clothing on character. Uses MPFB2 clothes library with CC0 assets.",
    category: "BL_CharacterClothing",
    inputSchema: z.object({
      name: z.string().optional().describe("Target character object name"),
      top: z.string().optional().describe("Top clothing asset. Call bl_char_list_clothing first. Examples: female_casualsuit01, female_sportsuit01"),
      bottom: z.string().optional().describe("Bottom clothing asset. Examples: male_casualsuit03. Note: most MPFB2 clothing are full suits, not separate tops/bottoms"),
      shoes: z.string().optional().describe("Shoes asset. Examples: shoes01, shoes02, shoes03, shoes04, shoes05, shoes06"),
      dress: z.string().optional().describe("Dress/suit asset. Examples: female_elegantsuit01, female_casualsuit02"),
      suit: z.string().optional().describe("Suit asset. Examples: male_elegantsuit01, male_worksuit01, male_casualsuit01"),
      hat: z.string().optional().describe("Hat asset"),
      glasses: z.string().optional().describe("Glasses asset"),
      gloves: z.string().optional().describe("Gloves asset"),
      mask: z.string().optional().describe("Mask asset"),
      underwear: z.string().optional().describe("Underwear asset"),
      socks: z.string().optional().describe("Socks asset"),
      outfit: z.string().optional().describe("Full outfit asset. Call bl_char_list_clothing to see all available assets"),
      clothes: z.array(z.string()).optional().describe("List of clothing asset names to apply"),
    }),
    handler: async (params) => { return bridgeSendAsToolResult("blender", "bl_char_set_clothing", params) },
  },
  {
    id: "bl_char_remove_clothing",
    name: "Character: Remove Clothing",
    description: "Remove clothing from character. Specify slot name or 'all' to remove everything.",
    descriptionJa: "Character kara fuku wo nugaseru. Slot shitei mataha all de subete jokyo.",
    category: "BL_CharacterClothing",
    inputSchema: z.object({
      name: z.string().optional().describe("Target character object name"),
      slot: z.string().optional().describe("Slot to remove (e.g. 'top', 'shoes', 'all'). Default: 'all'"),
    }),
    handler: async (params) => { return bridgeSendAsToolResult("blender", "bl_char_remove_clothing", params) },
  },
  {
    id: "bl_char_list_clothing",
    name: "Character: List Available Clothing",
    description: "List all available clothing assets organized by category. Shows MPFB2 CC0 assets if installed. Use the asset names from this list in bl_char_set_clothing.",
    descriptionJa: "List available clothing assets by category from installed packs.",
    category: "BL_CharacterClothing",
    inputSchema: z.object({}),
    handler: async (params) => { return bridgeSendAsToolResult("blender", "bl_char_list_clothing", params) },
  },
  {
    id: "bl_char_list_hair",
    name: "Character: List Available Hair Assets",
    description: "List all MPFB2 hair assets installed. Use this FIRST to discover available hair styles before calling bl_char_set_hair_style. Returns asset names that can be used directly.",
    descriptionJa: "List installed MPFB2 hair assets. Call before bl_char_set_hair_style.",
    category: "BL_CharacterHair",
    inputSchema: z.object({}),
    handler: async (params) =>
      bridgeSendAsToolResult("blender", "bl_char_list_hair", params, {
        successMessage: "Hair assets listed",
      }),
  },
  {
    id: "bl_char_list_skins",
    name: "Character: List Available Skin Assets",
    description: "List all MPFB2 skin assets installed. Use this FIRST to discover available skins before calling bl_char_set_skin_color. Returns asset names and preset mappings.",
    descriptionJa: "List installed MPFB2 skin assets. Call before bl_char_set_skin_color.",
    category: "BL_CharacterMaterial",
    inputSchema: z.object({}),
    handler: async (params) =>
      bridgeSendAsToolResult("blender", "bl_char_list_skins", params, {
        successMessage: "Skin assets listed",
      }),
  },];