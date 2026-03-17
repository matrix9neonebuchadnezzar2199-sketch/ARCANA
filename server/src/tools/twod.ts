import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const twodCreateSprite: ToolDefinition = {
  id: "2d_create_sprite",
  name: "Create Sprite Object",
  description: "Create a new GameObject with a SpriteRenderer",
  descriptionJa: "SpriteRenderer付きの新しいGameObjectを作成する",
  category: "2d",
  inputSchema: z.object({ name: z.string().optional().default("Sprite").describe("Object name"), spritePath: z.string().optional().describe("Sprite asset path"), x: z.number().optional().default(0), y: z.number().optional().default(0), z: z.number().optional().default(0), color: z.string().optional().default("#FFFFFF").describe("Tint color hex") }),
  handler: async (params) => { try { const r = await unityBridge.send("2dCreateSprite", params); return { success: true, message: `Sprite created: ${params.name}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const twodSetSortingLayer: ToolDefinition = {
  id: "2d_set_sorting_layer",
  name: "Set Sorting Layer",
  description: "Set the sorting layer and order of a SpriteRenderer",
  descriptionJa: "SpriteRendererのソーティングレイヤーと順序を設定する",
  category: "2d",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), layerName: z.string().optional().default("Default").describe("Sorting layer name"), order: z.number().optional().default(0).describe("Order in layer") }),
  handler: async (params) => { try { const r = await unityBridge.send("2dSetSortingLayer", params); return { success: true, message: `Sorting set: ${params.layerName} order ${params.order}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const twodCreateTilemap: ToolDefinition = {
  id: "2d_create_tilemap",
  name: "Create Tilemap",
  description: "Create a new Tilemap with Grid parent",
  descriptionJa: "Grid親付きの新しいTilemapを作成する",
  category: "2d",
  inputSchema: z.object({ name: z.string().optional().default("Tilemap").describe("Tilemap name"), cellSize: z.number().optional().default(1).describe("Grid cell size") }),
  handler: async (params) => { try { const r = await unityBridge.send("2dCreateTilemap", params); return { success: true, message: `Tilemap created: ${params.name}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const twodSetTile: ToolDefinition = {
  id: "2d_set_tile",
  name: "Place Tile",
  description: "Place a tile at a grid position on a Tilemap",
  descriptionJa: "Tilemap上のグリッド位置にタイルを配置する",
  category: "2d",
  inputSchema: z.object({ tilemapName: z.string().describe("Tilemap name"), tilePath: z.string().describe("Tile asset path"), gridX: z.number().describe("Grid X position"), gridY: z.number().describe("Grid Y position") }),
  handler: async (params) => { try { const r = await unityBridge.send("2dSetTile", params); return { success: true, message: `Tile placed at (${params.gridX}, ${params.gridY})`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const twodAddCollider2D: ToolDefinition = {
  id: "2d_add_collider",
  name: "Add 2D Collider",
  description: "Add a 2D collider to a GameObject",
  descriptionJa: "GameObjectに2Dコライダーを追加する",
  category: "2d",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), type: z.enum(["Box", "Circle", "Capsule", "Polygon", "Edge", "Composite"]).describe("2D collider type"), isTrigger: z.boolean().optional().default(false).describe("Is trigger") }),
  handler: async (params) => { try { const r = await unityBridge.send("2dAddCollider", params); return { success: true, message: `${params.type}Collider2D added to ${params.name}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const twodAddAnimator: ToolDefinition = {
  id: "2d_add_animator",
  name: "Add 2D Animator",
  description: "Add Animator with 2D sprite animation controller",
  descriptionJa: "2Dスプライトアニメーションコントローラー付きAnimatorを追加する",
  category: "2d",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), controllerPath: z.string().optional().describe("Animator controller asset path") }),
  handler: async (params) => { try { const r = await unityBridge.send("2dAddAnimator", params); return { success: true, message: `2D Animator added to ${params.name}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

export const twodTools: ToolDefinition[] = [twodCreateSprite, twodSetSortingLayer, twodCreateTilemap, twodSetTile, twodAddCollider2D, twodAddAnimator];