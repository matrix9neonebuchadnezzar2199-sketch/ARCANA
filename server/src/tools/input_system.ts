import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
export const inputSystemTools: ToolDefinition[] = [
  {
    id: "input_system_create_action_map",
    name: "Create Input Action Map",
    description: "Create a new Input Action Map in an Input Actions asset",
    descriptionJa: "Input Actionsアセットに新しいInput Action Mapを作成",
    category: "InputSystem",
    inputSchema: z.object({
      assetName: z.string().describe("Input Actions asset name"),
      mapName: z.string().describe("Action map name (e.g. Player, UI, Vehicle)"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "InputSystemCreateActionMap", params, { successMessage: (_, params) => `Action map "${params.mapName}" created in "${params.assetName}"` });
    },
  },
  {
    id: "input_system_add_action",
    name: "Add Input Action",
    description: "Add an action to an existing action map with specified type",
    descriptionJa: "既存のアクションマップに指定タイプのアクションを追加",
    category: "InputSystem",
    inputSchema: z.object({
      assetName: z.string().describe("Input Actions asset name"),
      mapName: z.string().describe("Target action map name"),
      actionName: z.string().describe("New action name (e.g. Move, Jump, Fire)"),
      actionType: z.enum(["Value", "Button", "PassThrough"]).describe("Action type"),
      controlType: z.enum(["Vector2", "Float", "Button", "Vector3", "Quaternion", "Integer", "Stick", "Dpad", "Touch"]).optional().describe("Expected control type"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "InputSystemAddAction", params, { successMessage: (_, params) => `Action "${params.actionName}" added to "${params.mapName}"` });
    },
  },
  {
    id: "input_system_add_binding",
    name: "Add Input Binding",
    description: "Bind a physical input path to an action",
    descriptionJa: "物理入力パスをアクションにバインド",
    category: "InputSystem",
    inputSchema: z.object({
      assetName: z.string().describe("Input Actions asset name"),
      mapName: z.string().describe("Action map name"),
      actionName: z.string().describe("Action name"),
      path: z.string().describe("Input path (e.g. <Keyboard>/space, <Gamepad>/buttonSouth, <Mouse>/leftButton)"),
      compositeType: z.string().optional().describe("Composite type (e.g. 2DVector for WASD)"),
      compositePart: z.string().optional().describe("Part in composite (e.g. up, down, left, right)"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "InputSystemAddBinding", params, { successMessage: (_, params) => `Binding "${params.path}" added to "${params.actionName}"` });
    },
  },
  {
    id: "input_system_add_composite",
    name: "Add Composite Binding",
    description: "Add a composite binding (e.g. WASD as 2D Vector) to an action",
    descriptionJa: "アクションにコンポジットバインディング（例: WASDを2Dベクトルとして）を追加",
    category: "InputSystem",
    inputSchema: z.object({
      assetName: z.string().describe("Input Actions asset name"),
      mapName: z.string().describe("Action map name"),
      actionName: z.string().describe("Action name"),
      compositeType: z.enum(["2DVector", "3DVector", "1DAxis", "ButtonWithOneModifier", "ButtonWithTwoModifiers"]).describe("Composite type"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "InputSystemAddComposite", params, { successMessage: (_, params) => `Composite ${params.compositeType} added to "${params.actionName}"` });
    },
  },
  {
    id: "input_system_list_actions",
    name: "List Input Actions",
    description: "List all action maps and their actions in an Input Actions asset",
    descriptionJa: "Input Actionsアセット内の全アクションマップとアクションを一覧表示",
    category: "InputSystem",
    inputSchema: z.object({
      assetName: z.string().describe("Input Actions asset name"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "InputSystemListActions", params, { successMessage: (_, params) => `Actions listed for "${params.assetName}"` });
    },
  },
  {
    id: "input_system_set_control_scheme",
    name: "Set Control Scheme",
    description: "Create or update a control scheme with required device types",
    descriptionJa: "必要なデバイスタイプを持つコントロールスキームを作成・更新",
    category: "InputSystem",
    inputSchema: z.object({
      assetName: z.string().describe("Input Actions asset name"),
      schemeName: z.string().describe("Control scheme name (e.g. KeyboardMouse, Gamepad, Touch)"),
      devices: z.array(z.object({
        devicePath: z.string().describe("Device path (e.g. <Keyboard>, <Gamepad>, <Touchscreen>)"),
        required: z.boolean().optional().describe("Whether the device is required"),
      })).describe("Required devices for this scheme"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "InputSystemSetControlScheme", params, { successMessage: (_, params) => `Control scheme "${params.schemeName}" configured` });
    },
  },
];