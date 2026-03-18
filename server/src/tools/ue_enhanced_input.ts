import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unrealBridge } from "../bridge/unreal-bridge";

export const ueEnhancedInputTools: ToolDefinition[] = [
  {
    id: "ue_einput_create_action",
    name: "Create Input Action",
    description: "Create an Enhanced Input Action asset",
    descriptionJa: "Enhanced Input Actionアセットを作成",
    category: "UE_EnhancedInput",
    inputSchema: z.object({
      name: z.string().describe("Input Action asset name (e.g. IA_Move, IA_Jump, IA_Look)"),
      valueType: z.enum(["Bool", "Float", "Axis2D", "Axis3D"]).describe("Action value type"),
      path: z.string().optional().describe("Content path (e.g. /Game/Input/)"),
      consumeInput: z.boolean().optional().describe("Consume input (default: true)"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("EnhancedInputCreateAction", params);
      return { success: true, message: `Input Action "${params.name}" created (${params.valueType})`, data: result };
    },
  },
  {
    id: "ue_einput_create_mapping_context",
    name: "Create Input Mapping Context",
    description: "Create an Enhanced Input Mapping Context asset",
    descriptionJa: "Enhanced Input Mapping Contextアセットを作成",
    category: "UE_EnhancedInput",
    inputSchema: z.object({
      name: z.string().describe("Mapping context name (e.g. IMC_Default, IMC_Vehicle)"),
      path: z.string().optional().describe("Content path"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("EnhancedInputCreateMappingContext", params);
      return { success: true, message: `Mapping Context "${params.name}" created`, data: result };
    },
  },
  {
    id: "ue_einput_add_mapping",
    name: "Add Key Mapping",
    description: "Add a key mapping to an Input Mapping Context for a specific Input Action",
    descriptionJa: "特定のInput Action用のキーマッピングをInput Mapping Contextに追加",
    category: "UE_EnhancedInput",
    inputSchema: z.object({
      contextName: z.string().describe("Target Mapping Context name"),
      actionName: z.string().describe("Input Action asset name"),
      key: z.string().describe("Key name (e.g. W, SpaceBar, Gamepad_Left2D, MouseXY2D)"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("EnhancedInputAddMapping", params);
      return { success: true, message: `Key "${params.key}" mapped to "${params.actionName}" in "${params.contextName}"`, data: result };
    },
  },
  {
    id: "ue_einput_add_modifier",
    name: "Add Input Modifier",
    description: "Add an input modifier (Negate, Swizzle, DeadZone, Scalar, etc.) to a key mapping",
    descriptionJa: "キーマッピングに入力モディファイア（Negate、Swizzle、DeadZone、Scalar等）を追加",
    category: "UE_EnhancedInput",
    inputSchema: z.object({
      contextName: z.string().describe("Target Mapping Context"),
      actionName: z.string().describe("Target Input Action"),
      key: z.string().describe("Target key"),
      modifierType: z.enum(["Negate", "Swizzle", "DeadZone", "Scalar", "FOVScaling", "ToWorldSpace", "ResponseCurve"]).describe("Modifier type"),
      swizzleOrder: z.enum(["YXZ", "ZYX", "XZY", "YZX", "ZXY"]).optional().describe("Swizzle axis order (for Swizzle modifier)"),
      negateX: z.boolean().optional().describe("Negate X axis"),
      negateY: z.boolean().optional().describe("Negate Y axis"),
      negateZ: z.boolean().optional().describe("Negate Z axis"),
      scalar: z.number().optional().describe("Scalar multiplier value"),
      deadZoneLower: z.number().optional().describe("Dead zone lower threshold"),
      deadZoneUpper: z.number().optional().describe("Dead zone upper threshold"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("EnhancedInputAddModifier", params);
      return { success: true, message: `Modifier ${params.modifierType} added to "${params.key}" on "${params.actionName}"`, data: result };
    },
  },
  {
    id: "ue_einput_add_trigger",
    name: "Add Input Trigger",
    description: "Add an input trigger (Pressed, Released, Hold, Tap, Pulse) to a key mapping",
    descriptionJa: "キーマッピングに入力トリガー（Pressed、Released、Hold、Tap、Pulse）を追加",
    category: "UE_EnhancedInput",
    inputSchema: z.object({
      contextName: z.string().describe("Target Mapping Context"),
      actionName: z.string().describe("Target Input Action"),
      key: z.string().describe("Target key"),
      triggerType: z.enum(["Pressed", "Released", "Down", "Hold", "HoldAndRelease", "Tap", "Pulse", "ChordAction"]).describe("Trigger type"),
      holdTimeThreshold: z.number().optional().describe("Hold time threshold in seconds (for Hold triggers)"),
      tapReleaseTimeThreshold: z.number().optional().describe("Tap release time in seconds (for Tap trigger)"),
      interval: z.number().optional().describe("Pulse interval in seconds (for Pulse trigger)"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("EnhancedInputAddTrigger", params);
      return { success: true, message: `Trigger ${params.triggerType} added to "${params.key}" on "${params.actionName}"`, data: result };
    },
  },
  {
    id: "ue_einput_list_context",
    name: "List Mapping Context",
    description: "List all mappings, modifiers, and triggers in an Input Mapping Context",
    descriptionJa: "Input Mapping Context内の全マッピング、モディファイア、トリガーを一覧表示",
    category: "UE_EnhancedInput",
    inputSchema: z.object({
      contextName: z.string().describe("Mapping Context name"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("EnhancedInputListContext", params);
      return { success: true, message: `Mappings listed for "${params.contextName}"`, data: result };
    },
  },
];