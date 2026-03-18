import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
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
      const result = await bridge.send("unity", "InputSystemCreateActionMap", params);
      return { success: true, message: `Action map "${params.mapName}" created in "${params.assetName}"`, data: result };
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
      const result = await bridge.send("unity", "InputSystemAddAction", params);
      return { success: true, message: `Action "${params.actionName}" added to "${params.mapName}"`, data: result };
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
      const result = await bridge.send("unity", "InputSystemAddBinding", params);
      return { success: true, message: `Binding "${params.path}" added to "${params.actionName}"`, data: result };
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
      const result = await bridge.send("unity", "InputSystemAddComposite", params);
      return { success: true, message: `Composite ${params.compositeType} added to "${params.actionName}"`, data: result };
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
      const result = await bridge.send("unity", "InputSystemListActions", params);
      return { success: true, message: `Actions listed for "${params.assetName}"`, data: result };
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
      const result = await bridge.send("unity", "InputSystemSetControlScheme", params);
      return { success: true, message: `Control scheme "${params.schemeName}" configured`, data: result };
    },
  },
];