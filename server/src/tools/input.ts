import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const inputCreateAction: ToolDefinition = {
  id: "input_create_action",
  name: "Create Input Action",
  description: "Create a new Input Action asset",
  descriptionJa: "新しいInput Actionアセットを作成する",
  category: "input",
  inputSchema: z.object({ name: z.string().describe("Action asset name"), path: z.string().optional().default("Assets/Input").describe("Save folder") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "InputCreateAction", params, { successMessage: (_, params) => `Input Action created: ${params.name}` }) }
};

const inputAddBinding: ToolDefinition = {
  id: "input_add_binding",
  name: "Add Input Binding",
  description: "Add a key/button binding to an Input Action",
  descriptionJa: "Input Actionにキー/ボタンバインディングを追加する",
  category: "input",
  inputSchema: z.object({ actionName: z.string().describe("Action name"), bindingPath: z.string().describe("Binding path (e.g. <Keyboard>/space, <Gamepad>/buttonSouth)") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "InputAddBinding", params, { successMessage: (_, params) => `Binding added: ${params.bindingPath}` }) }
};

const inputEnable: ToolDefinition = {
  id: "input_enable",
  name: "Enable Input Action",
  description: "Enable or disable an Input Action on a GameObject",
  descriptionJa: "GameObjectのInput Actionを有効化/無効化する",
  category: "input",
  inputSchema: z.object({ objectName: z.string().describe("GameObject name"), enabled: z.boolean().optional().default(true).describe("Enable or disable") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "InputEnable", params, { successMessage: (_, params) => `Input ${params.enabled ? "enabled" : "disabled"} on ${params.objectName}` }) }
};

const inputCreateMap: ToolDefinition = {
  id: "input_create_map",
  name: "Create Action Map",
  description: "Create a new Action Map within an Input Action asset",
  descriptionJa: "Input Actionアセット内に新しいAction Mapを作成する",
  category: "input",
  inputSchema: z.object({ assetName: z.string().describe("Input Action asset name"), mapName: z.string().describe("New Action Map name") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "InputCreateMap", params, { successMessage: (_, params) => `Action Map created: ${params.mapName}` }) }
};

const inputReadValue: ToolDefinition = {
  id: "input_read_value",
  name: "Read Input Value",
  description: "Read current value of an Input Action",
  descriptionJa: "Input Actionの現在値を読み取る",
  category: "input",
  inputSchema: z.object({ objectName: z.string().describe("GameObject name"), actionName: z.string().describe("Action name to read") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "InputReadValue", params, { successMessage: (_, params) => `Value read from ${params.actionName}` }) }
};

const inputRemoveBinding: ToolDefinition = {
  id: "input_remove_binding",
  name: "Remove Input Binding",
  description: "Remove a binding from an Input Action",
  descriptionJa: "Input Actionからバインディングを削除する",
  category: "input",
  inputSchema: z.object({ actionName: z.string().describe("Action name"), bindingIndex: z.number().describe("Binding index to remove") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "InputRemoveBinding", params, { successMessage: (_, params) => `Binding removed from ${params.actionName}` }) }
};

export const inputTools: ToolDefinition[] = [inputCreateAction, inputAddBinding, inputEnable, inputCreateMap, inputReadValue, inputRemoveBinding];