import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const tagmgrAddTag: ToolDefinition = {
  id: "tagmgr_add_tag",
  name: "Add Custom Tag",
  description: "Add a new custom tag to the Tag Manager",
  descriptionJa: "Tag Managerに新しいカスタムタグを追加",
  category: "tagmanager",
  inputSchema: z.object({ tagName: z.string() }),
  handler: async (p) => {
    const r = await unityBridge.send("TagmgrAddTag", p);
    return r ? { success: true, message: `Tag added: ${p.tagName}`, data: r }
             : { success: false, message: "Failed to add tag" };
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
    const r = await unityBridge.send("TagmgrAddLayer", p);
    return r ? { success: true, message: `Layer added: ${p.layerName}`, data: r }
             : { success: false, message: "Failed to add layer" };
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
    const r = await unityBridge.send("TagmgrAddSortingLayer", p);
    return r ? { success: true, message: `Sorting layer added: ${p.layerName}`, data: r }
             : { success: false, message: "Failed to add sorting layer" };
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
    const r = await unityBridge.send("TagmgrListAll", p);
    return r ? { success: true, message: "Tags and layers listed", data: r }
             : { success: false, message: "Failed to list tags and layers" };
  }
};

export const tagManagerTools: ToolDefinition[] = [
  tagmgrAddTag, tagmgrAddLayer, tagmgrAddSortingLayer, tagmgrListAll
];