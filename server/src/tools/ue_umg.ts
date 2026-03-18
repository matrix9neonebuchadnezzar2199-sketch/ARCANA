import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unrealBridge } from "../bridge/unreal-bridge";

export const ueUmgTools: ToolDefinition[] = [
  {
    id: "ue_umg_create_widget",
    name: "Create UMG Widget Blueprint",
    description: "Create a new UMG Widget Blueprint asset",
    descriptionJa: "新しいUMG Widget Blueprintアセットを作成",
    category: "UE_UMG",
    inputSchema: z.object({
      name: z.string().describe("Widget blueprint name"),
      parentClass: z.enum(["UserWidget", "ActivatableWidget", "CommonActivatableWidget"]).optional().describe("Parent widget class"),
      path: z.string().optional().describe("Content path (e.g. /Game/UI/)"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("UMGCreateWidget", params);
      return { success: true, message: `Widget "${params.name}" created`, data: result };
    },
  },
  {
    id: "ue_umg_add_element",
    name: "Add UI Element",
    description: "Add a UI element (Text, Button, Image, ProgressBar, etc.) to a Widget Blueprint",
    descriptionJa: "Widget Blueprintにui要素（テキスト、ボタン、画像、プログレスバー等）を追加",
    category: "UE_UMG",
    inputSchema: z.object({
      widgetName: z.string().describe("Target widget blueprint name"),
      elementType: z.enum(["TextBlock", "Button", "Image", "ProgressBar", "Slider", "CheckBox", "ComboBox", "EditableText", "RichTextBlock", "CircularThrobber"]).describe("UI element type"),
      elementName: z.string().describe("Element variable name"),
      parentSlot: z.string().optional().describe("Parent element name (for nesting)"),
      text: z.string().optional().describe("Text content (for TextBlock, Button)"),
      alignment: z.object({ x: z.number(), y: z.number() }).optional().describe("Alignment (0-1)"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("UMGAddElement", params);
      return { success: true, message: `${params.elementType} "${params.elementName}" added to "${params.widgetName}"`, data: result };
    },
  },
  {
    id: "ue_umg_add_layout_panel",
    name: "Add Layout Panel",
    description: "Add a layout panel (Canvas, HorizontalBox, VerticalBox, Grid, etc.) to organize UI elements",
    descriptionJa: "UI要素を整理するレイアウトパネル（Canvas、水平Box、垂直Box、Grid等）を追加",
    category: "UE_UMG",
    inputSchema: z.object({
      widgetName: z.string().describe("Target widget blueprint name"),
      panelType: z.enum(["CanvasPanel", "HorizontalBox", "VerticalBox", "GridPanel", "UniformGridPanel", "WidgetSwitcher", "ScrollBox", "SizeBox", "Overlay", "WrapBox"]).describe("Panel type"),
      panelName: z.string().describe("Panel variable name"),
      parentSlot: z.string().optional().describe("Parent element name"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("UMGAddLayoutPanel", params);
      return { success: true, message: `${params.panelType} "${params.panelName}" added to "${params.widgetName}"`, data: result };
    },
  },
  {
    id: "ue_umg_set_anchors",
    name: "Set Element Anchors",
    description: "Set anchor and offset for a UI element within a Canvas Panel",
    descriptionJa: "Canvas Panel内のUI要素のアンカーとオフセットを設定",
    category: "UE_UMG",
    inputSchema: z.object({
      widgetName: z.string().describe("Target widget blueprint"),
      elementName: z.string().describe("Target element name"),
      anchorMin: z.object({ x: z.number(), y: z.number() }).describe("Anchor minimum (0-1)"),
      anchorMax: z.object({ x: z.number(), y: z.number() }).describe("Anchor maximum (0-1)"),
      offsetLeft: z.number().optional().describe("Left offset"),
      offsetTop: z.number().optional().describe("Top offset"),
      offsetRight: z.number().optional().describe("Right offset"),
      offsetBottom: z.number().optional().describe("Bottom offset"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("UMGSetAnchors", params);
      return { success: true, message: `Anchors set on "${params.elementName}" in "${params.widgetName}"`, data: result };
    },
  },
  {
    id: "ue_umg_set_style",
    name: "Set Element Style",
    description: "Set visual style properties (color, font size, opacity, visibility) on a UI element",
    descriptionJa: "UI要素のビジュアルスタイル（色、フォントサイズ、透明度、表示）を設定",
    category: "UE_UMG",
    inputSchema: z.object({
      widgetName: z.string().describe("Target widget blueprint"),
      elementName: z.string().describe("Target element name"),
      color: z.object({ r: z.number(), g: z.number(), b: z.number(), a: z.number().optional() }).optional().describe("Color tint"),
      fontSize: z.number().optional().describe("Font size (for text elements)"),
      opacity: z.number().optional().describe("Render opacity (0-1)"),
      visibility: z.enum(["Visible", "Collapsed", "Hidden", "HitTestInvisible", "SelfHitTestInvisible"]).optional().describe("Visibility state"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("UMGSetStyle", params);
      return { success: true, message: `Style updated on "${params.elementName}"`, data: result };
    },
  },
  {
    id: "ue_umg_bind_event",
    name: "Bind Widget Event",
    description: "Bind a UI event (OnClicked, OnHovered, OnValueChanged) to a function",
    descriptionJa: "UIイベント（OnClicked、OnHovered、OnValueChanged）を関数にバインド",
    category: "UE_UMG",
    inputSchema: z.object({
      widgetName: z.string().describe("Target widget blueprint"),
      elementName: z.string().describe("Target element name"),
      eventType: z.enum(["OnClicked", "OnPressed", "OnReleased", "OnHovered", "OnUnhovered", "OnValueChanged", "OnTextChanged", "OnTextCommitted"]).describe("Event type"),
      functionName: z.string().describe("Function name to bind to"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("UMGBindEvent", params);
      return { success: true, message: `${params.eventType} on "${params.elementName}" bound to "${params.functionName}"`, data: result };
    },
  },
  {
    id: "ue_umg_add_animation",
    name: "Add Widget Animation",
    description: "Create a widget animation that animates element properties over time",
    descriptionJa: "時間経過で要素プロパティをアニメートするウィジェットアニメーションを作成",
    category: "UE_UMG",
    inputSchema: z.object({
      widgetName: z.string().describe("Target widget blueprint"),
      animationName: z.string().describe("Animation name"),
      duration: z.number().describe("Animation duration in seconds"),
      tracks: z.array(z.object({
        elementName: z.string().describe("Target element"),
        property: z.enum(["Opacity", "Translation", "Scale", "Color", "Angle"]).describe("Property to animate"),
        keyframes: z.array(z.object({
          time: z.number().describe("Time in seconds"),
          value: z.number().describe("Property value at this time"),
        })).describe("Keyframes"),
      })).describe("Animation tracks"),
      looping: z.boolean().optional().describe("Loop the animation"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("UMGAddAnimation", params);
      return { success: true, message: `Animation "${params.animationName}" created in "${params.widgetName}"`, data: result };
    },
  },
  {
    id: "ue_umg_show_widget",
    name: "Show Widget in Viewport",
    description: "Add a widget to the viewport or remove it, with optional z-order",
    descriptionJa: "ウィジェットをビューポートに追加または削除（Zオーダー指定可）",
    category: "UE_UMG",
    inputSchema: z.object({
      widgetName: z.string().describe("Widget blueprint name"),
      action: z.enum(["AddToViewport", "RemoveFromParent"]).describe("Action"),
      zOrder: z.number().optional().describe("Z-order (higher = on top)"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("UMGShowWidget", params);
      const msg = params.action === "AddToViewport" ? `"${params.widgetName}" added to viewport` : `"${params.widgetName}" removed`;
      return { success: true, message: msg, data: result };
    },
  },
];