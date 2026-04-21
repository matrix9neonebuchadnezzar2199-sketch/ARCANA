import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const tagmgrAddTag: ToolDefinition = {
  id: "tagmgr_add_tag",
  name: "Add Custom Tag",
  description: "Add a new custom tag to the Tag Manager",
  descriptionJa: "Tag Managerに新しいカスタムタグを追加",
  category: "tagmanager",
  inputSchema: z.object({ tagName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "TagmgrAddTag", p, { successMessage: (_, p) => `Tag added: ${p.tagName}` });
  }
};

const tagmgrAddLayer: ToolDefinition = {
  id: "tagmgr_add_layer",
  name: "Add Custom Layer",
  description: "Add a new custom layer to the Tag Manager",
  descriptionJa: "Tag Managerに新しいカスタムレイヤーを追加",
  category: "tagmanager",
  inputSchema: z.object({ layerName: z.string(), layerIndex: z.number().optional() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "TagmgrAddLayer", p, { successMessage: (_, p) => `Layer added: ${p.layerName}` });
  }
};

const tagmgrAddSortingLayer: ToolDefinition = {
  id: "tagmgr_add_sorting_layer",
  name: "Add Sorting Layer",
  description: "Add a new sorting layer to the Tag Manager",
  descriptionJa: "Tag Managerに新しいソーティングレイヤーを追加",
  category: "tagmanager",
  inputSchema: z.object({ layerName: z.string() }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "TagmgrAddSortingLayer", p, { successMessage: (_, p) => `Sorting layer added: ${p.layerName}` });
  }
};

const tagmgrListAll: ToolDefinition = {
  id: "tagmgr_list_all",
  name: "List Tags and Layers",
  description: "List all tags, layers, and sorting layers",
  descriptionJa: "全タグ・レイヤー・ソーティングレイヤーを一覧表示",
  category: "tagmanager",
  inputSchema: z.object({}),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "TagmgrListAll", p, { successMessage: "Tags and layers listed" });
  }
};

export const tagManagerTools: ToolDefinition[] = [
  tagmgrAddTag, tagmgrAddLayer, tagmgrAddSortingLayer, tagmgrListAll
];