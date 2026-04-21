import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
export const layertagSetLayer: ToolDefinition = {
  id: "layertag_set_layer",
  name: "Set Layer",
  description: "Set the layer of a GameObject",
  descriptionJa: "GameObjectのレイヤーを設定",
  category: "layertag",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    layer: z.number().describe("Layer number 0-31"),
    includeChildren: z.boolean().optional().describe("Apply to children, default true")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "LayerTagSetLayer", params, { successMessage: (_, params) => `Set layer of ${params.name} to ${params.layer}` });
  }
};

export const layertagSetTag: ToolDefinition = {
  id: "layertag_set_tag",
  name: "Set Tag",
  description: "Set the tag of a GameObject",
  descriptionJa: "GameObjectのタグを設定",
  category: "layertag",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    tag: z.string().describe("Tag name, e.g. Player, Enemy, Untagged")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "LayerTagSetTag", params, { successMessage: (_, params) => `Set tag of ${params.name} to ${params.tag}` });
  }
};

export const layertagRename: ToolDefinition = {
  id: "layertag_rename",
  name: "Rename GameObject",
  description: "Rename a GameObject",
  descriptionJa: "GameObjectの名前を変更",
  category: "layertag",
  inputSchema: z.object({
    name: z.string().describe("Current GameObject name"),
    newName: z.string().describe("New name")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "LayerTagRename", params, { successMessage: (_, params) => `Renamed ${params.name} to ${params.newName}` });
  }
};

export const layertagTools = [
  layertagSetLayer,
  layertagSetTag,
  layertagRename
];