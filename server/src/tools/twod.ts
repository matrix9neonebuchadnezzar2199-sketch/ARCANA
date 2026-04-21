import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const twodCreateSprite: ToolDefinition = {
  id: "2d_create_sprite",
  name: "Create Sprite Object",
  description: "Create a new GameObject with a SpriteRenderer",
  descriptionJa: "SpriteRenderer付きの新しいGameObjectを作成する",
  category: "2d",
  inputSchema: z.object({ name: z.string().optional().default("Sprite").describe("Object name"), spritePath: z.string().optional().describe("Sprite asset path"), x: z.number().optional().default(0), y: z.number().optional().default(0), z: z.number().optional().default(0), color: z.string().optional().default("#FFFFFF").describe("Tint color hex") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "2dCreateSprite", params, { successMessage: (_, params) => `Sprite created: ${params.name}` }) }
};

const twodSetSortingLayer: ToolDefinition = {
  id: "2d_set_sorting_layer",
  name: "Set Sorting Layer",
  description: "Set the sorting layer and order of a SpriteRenderer",
  descriptionJa: "SpriteRendererのソーティングレイヤーと順序を設定する",
  category: "2d",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), layerName: z.string().optional().default("Default").describe("Sorting layer name"), order: z.number().optional().default(0).describe("Order in layer") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "2dSetSortingLayer", params, { successMessage: (_, params) => `Sorting set: ${params.layerName} order ${params.order}` }) }
};

const twodCreateTilemap: ToolDefinition = {
  id: "2d_create_tilemap",
  name: "Create Tilemap",
  description: "Create a new Tilemap with Grid parent",
  descriptionJa: "Grid親付きの新しいTilemapを作成する",
  category: "2d",
  inputSchema: z.object({ name: z.string().optional().default("Tilemap").describe("Tilemap name"), cellSize: z.number().optional().default(1).describe("Grid cell size") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "2dCreateTilemap", params, { successMessage: (_, params) => `Tilemap created: ${params.name}` }) }
};

const twodSetTile: ToolDefinition = {
  id: "2d_set_tile",
  name: "Place Tile",
  description: "Place a tile at a grid position on a Tilemap",
  descriptionJa: "Tilemap上のグリッド位置にタイルを配置する",
  category: "2d",
  inputSchema: z.object({ tilemapName: z.string().describe("Tilemap name"), tilePath: z.string().describe("Tile asset path"), gridX: z.number().describe("Grid X position"), gridY: z.number().describe("Grid Y position") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "2dSetTile", params, { successMessage: (_, params) => `Tile placed at (${params.gridX}, ${params.gridY})` }) }
};

const twodAddCollider2D: ToolDefinition = {
  id: "2d_add_collider",
  name: "Add 2D Collider",
  description: "Add a 2D collider to a GameObject",
  descriptionJa: "GameObjectに2Dコライダーを追加する",
  category: "2d",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), type: z.enum(["Box", "Circle", "Capsule", "Polygon", "Edge", "Composite"]).describe("2D collider type"), isTrigger: z.boolean().optional().default(false).describe("Is trigger") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "2dAddCollider", params, { successMessage: (_, params) => `${params.type}Collider2D added to ${params.name}` }) }
};

const twodAddAnimator: ToolDefinition = {
  id: "2d_add_animator",
  name: "Add 2D Animator",
  description: "Add Animator with 2D sprite animation controller",
  descriptionJa: "2Dスプライトアニメーションコントローラー付きAnimatorを追加する",
  category: "2d",
  inputSchema: z.object({ name: z.string().describe("GameObject name"), controllerPath: z.string().optional().describe("Animator controller asset path") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "2dAddAnimator", params, { successMessage: (_, params) => `2D Animator added to ${params.name}` }) }
};

export const twodTools: ToolDefinition[] = [twodCreateSprite, twodSetSortingLayer, twodCreateTilemap, twodSetTile, twodAddCollider2D, twodAddAnimator];