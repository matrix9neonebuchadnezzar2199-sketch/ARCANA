import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const tagmgrAddTag: ToolDefinition = {
  id: "tagmgr_add_tag",
  name: "Add Custom Tag",
  description: "Add a new custom tag to the Tag Manager",
  descriptionJa: "Tag Managerに新しいカスタムタグを追加",
  category: "tagmanager",
  inputSchema: z.object({ tagName: z.string() }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "TagmgrAddTag", p);
      return r ? { success: true, message: `Tag added: ${p.tagName}`, data: r }
               : { success: false, message: "Failed to add tag" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "TagmgrAddLayer", p);
      return r ? { success: true, message: `Layer added: ${p.layerName}`, data: r }
               : { success: false, message: "Failed to add layer" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "TagmgrAddSortingLayer", p);
      return r ? { success: true, message: `Sorting layer added: ${p.layerName}`, data: r }
               : { success: false, message: "Failed to add sorting layer" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
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
    try {
      const r = await bridge.send("unity", "TagmgrListAll", p);
      return r ? { success: true, message: "Tags and layers listed", data: r }
               : { success: false, message: "Failed to list tags and layers" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

export const tagManagerTools: ToolDefinition[] = [
  tagmgrAddTag, tagmgrAddLayer, tagmgrAddSortingLayer, tagmgrListAll
];