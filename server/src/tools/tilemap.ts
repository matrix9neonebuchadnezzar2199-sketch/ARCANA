import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
export const tilemapTools: ToolDefinition[] = [
  {
    id: "tilemap_create",
    name: "Create Tilemap",
    description: "Create a new Tilemap with Grid parent and TilemapRenderer",
    descriptionJa: "Grid親とTilemapRendererを持つ新しいTilemapを作成",
    category: "Tilemap",
    inputSchema: z.object({
      name: z.string().optional().describe("Tilemap name"),
      gridName: z.string().optional().describe("Parent Grid name (creates new if not found)"),
      cellLayout: z.enum(["Rectangle", "Hexagon", "Isometric", "IsometricZAsY"]).optional().describe("Grid cell layout"),
      cellSize: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional().describe("Cell size"),
      sortingOrder: z.number().optional().describe("Sorting order in layer"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("unity", "TilemapCreate", params);
        return { success: true, message: `Tilemap "${params.name || "Tilemap"}" created`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "tilemap_set_tiles",
    name: "Set Tiles",
    description: "Place tiles at specified cell positions on a Tilemap",
    descriptionJa: "Tilemap上の指定セル位置にタイルを配置",
    category: "Tilemap",
    inputSchema: z.object({
      tilemapName: z.string().describe("Target Tilemap name"),
      tiles: z.array(z.object({
        x: z.number().describe("Cell X"),
        y: z.number().describe("Cell Y"),
        tileName: z.string().describe("Tile asset name"),
      })).describe("Array of tile placements"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("unity", "TilemapSetTiles", params);
        return { success: true, message: `${params.tiles.length} tiles placed on "${params.tilemapName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "tilemap_fill_rect",
    name: "Fill Rectangle",
    description: "Fill a rectangular region of the Tilemap with a specified tile",
    descriptionJa: "Tilemapの矩形領域を指定タイルで塗りつぶし",
    category: "Tilemap",
    inputSchema: z.object({
      tilemapName: z.string().describe("Target Tilemap name"),
      tileName: z.string().describe("Tile asset name"),
      startX: z.number().describe("Start cell X"),
      startY: z.number().describe("Start cell Y"),
      width: z.number().describe("Rectangle width in cells"),
      height: z.number().describe("Rectangle height in cells"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("unity", "TilemapFillRect", params);
        return { success: true, message: `Filled ${params.width}x${params.height} area on "${params.tilemapName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "tilemap_clear",
    name: "Clear Tilemap",
    description: "Clear all tiles from a Tilemap or a specific rectangular region",
    descriptionJa: "Tilemapの全タイルまたは指定矩形領域をクリア",
    category: "Tilemap",
    inputSchema: z.object({
      tilemapName: z.string().describe("Target Tilemap name"),
      region: z.object({
        startX: z.number(), startY: z.number(),
        width: z.number(), height: z.number(),
      }).optional().describe("Region to clear (omit to clear all)"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("unity", "TilemapClear", params);
        const msg = params.region ? `Region cleared on "${params.tilemapName}"` : `All tiles cleared from "${params.tilemapName}"`;
        return { success: true, message: msg, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "tilemap_add_collider",
    name: "Add Tilemap Collider",
    description: "Add TilemapCollider2D and optionally CompositeCollider2D for optimized collision",
    descriptionJa: "TilemapCollider2Dと任意でCompositeCollider2Dを追加して衝突判定を最適化",
    category: "Tilemap",
    inputSchema: z.object({
      tilemapName: z.string().describe("Target Tilemap name"),
      useComposite: z.boolean().optional().describe("Use CompositeCollider2D for merged collisions (default: true)"),
      isTrigger: z.boolean().optional().describe("Set collider as trigger"),
      physicsLayer: z.string().optional().describe("Physics layer name"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("unity", "TilemapAddCollider", params);
        return { success: true, message: `Collider added to "${params.tilemapName}"${params.useComposite !== false ? " (composite)" : ""}`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
];