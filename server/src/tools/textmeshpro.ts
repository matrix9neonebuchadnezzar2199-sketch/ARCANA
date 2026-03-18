import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

export const textmeshproTools: ToolDefinition[] = [
  {
    id: "tmp_create_text",
    name: "Create TextMeshPro Text",
    description: "Create a TextMeshPro text object in the scene or on a Canvas",
    descriptionJa: "シーンまたはCanvas上にTextMeshProテキストオブジェクトを作成",
    category: "TextMeshPro",
    inputSchema: z.object({
      name: z.string().optional().describe("Object name"),
      text: z.string().describe("Text content"),
      isUI: z.boolean().optional().describe("Create as UI element on Canvas (default: true)"),
      parentCanvas: z.string().optional().describe("Parent Canvas name (UI mode)"),
      fontSize: z.number().optional().describe("Font size"),
      color: z.object({ r: z.number(), g: z.number(), b: z.number(), a: z.number().optional() }).optional().describe("Text color"),
      alignment: z.enum(["TopLeft", "Top", "TopRight", "Left", "Center", "Right", "BottomLeft", "Bottom", "BottomRight"]).optional().describe("Text alignment"),
      position: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional().describe("Position"),
    }),
    handler: async (params) => {
      const result = await unityBridge.send("TMPCreateText", params);
      return { success: true, message: `TMP text "${params.name || "Text"}" created`, data: result };
    },
  },
  {
    id: "tmp_set_text",
    name: "Set Text Content",
    description: "Update the text content of a TextMeshPro component",
    descriptionJa: "TextMeshProコンポーネントのテキスト内容を更新",
    category: "TextMeshPro",
    inputSchema: z.object({
      objectName: z.string().describe("Target object name"),
      text: z.string().describe("New text content"),
      richText: z.boolean().optional().describe("Enable rich text tags (default: true)"),
    }),
    handler: async (params) => {
      const result = await unityBridge.send("TMPSetText", params);
      return { success: true, message: `Text updated on "${params.objectName}"`, data: result };
    },
  },
  {
    id: "tmp_set_style",
    name: "Set Text Style",
    description: "Configure font style, size, spacing, and overflow settings",
    descriptionJa: "フォントスタイル、サイズ、間隔、オーバーフロー設定を構成",
    category: "TextMeshPro",
    inputSchema: z.object({
      objectName: z.string().describe("Target object name"),
      fontSize: z.number().optional().describe("Font size"),
      fontStyle: z.array(z.enum(["Bold", "Italic", "Underline", "Strikethrough", "LowerCase", "UpperCase", "SmallCaps"])).optional().describe("Font style flags"),
      characterSpacing: z.number().optional().describe("Character spacing"),
      wordSpacing: z.number().optional().describe("Word spacing"),
      lineSpacing: z.number().optional().describe("Line spacing"),
      paragraphSpacing: z.number().optional().describe("Paragraph spacing"),
      overflowMode: z.enum(["Overflow", "Ellipsis", "Masking", "Truncate", "ScrollRect", "Page", "Linked"]).optional().describe("Text overflow mode"),
      autoSize: z.boolean().optional().describe("Enable auto-sizing"),
      autoSizeMin: z.number().optional().describe("Min font size for auto-size"),
      autoSizeMax: z.number().optional().describe("Max font size for auto-size"),
    }),
    handler: async (params) => {
      const result = await unityBridge.send("TMPSetStyle", params);
      return { success: true, message: `Style updated on "${params.objectName}"`, data: result };
    },
  },
  {
    id: "tmp_set_color_gradient",
    name: "Set Text Color Gradient",
    description: "Apply a 4-corner color gradient to TextMeshPro text",
    descriptionJa: "TextMeshProテキストに4コーナーカラーグラデーションを適用",
    category: "TextMeshPro",
    inputSchema: z.object({
      objectName: z.string().describe("Target object name"),
      topLeft: z.object({ r: z.number(), g: z.number(), b: z.number() }).describe("Top-left color"),
      topRight: z.object({ r: z.number(), g: z.number(), b: z.number() }).describe("Top-right color"),
      bottomLeft: z.object({ r: z.number(), g: z.number(), b: z.number() }).describe("Bottom-left color"),
      bottomRight: z.object({ r: z.number(), g: z.number(), b: z.number() }).describe("Bottom-right color"),
    }),
    handler: async (params) => {
      const result = await unityBridge.send("TMPSetColorGradient", params);
      return { success: true, message: `Color gradient applied on "${params.objectName}"`, data: result };
    },
  },
  {
    id: "tmp_set_font_asset",
    name: "Set Font Asset",
    description: "Change the TMP font asset used by a TextMeshPro component",
    descriptionJa: "TextMeshProコンポーネントで使用するTMPフォントアセットを変更",
    category: "TextMeshPro",
    inputSchema: z.object({
      objectName: z.string().describe("Target object name"),
      fontAssetName: z.string().describe("TMP Font Asset name (e.g. LiberationSans SDF)"),
      materialPreset: z.string().optional().describe("Material preset name"),
    }),
    handler: async (params) => {
      const result = await unityBridge.send("TMPSetFontAsset", params);
      return { success: true, message: `Font changed to "${params.fontAssetName}" on "${params.objectName}"`, data: result };
    },
  },
  {
    id: "tmp_create_input_field",
    name: "Create TMP Input Field",
    description: "Create a TextMeshPro input field UI element with validation settings",
    descriptionJa: "バリデーション設定付きのTextMeshPro入力フィールドUIを作成",
    category: "TextMeshPro",
    inputSchema: z.object({
      name: z.string().optional().describe("Object name"),
      parentCanvas: z.string().optional().describe("Parent Canvas name"),
      placeholder: z.string().optional().describe("Placeholder text"),
      contentType: z.enum(["Standard", "Autocorrected", "IntegerNumber", "DecimalNumber", "Alphanumeric", "Name", "EmailAddress", "Password", "Pin", "Custom"]).optional().describe("Content type"),
      characterLimit: z.number().optional().describe("Max character count (0 = unlimited)"),
      lineType: z.enum(["SingleLine", "MultiLineSubmit", "MultiLineNewline"]).optional().describe("Line type"),
      fontSize: z.number().optional().describe("Font size"),
    }),
    handler: async (params) => {
      const result = await unityBridge.send("TMPCreateInputField", params);
      return { success: true, message: `TMP Input Field "${params.name || "InputField"}" created`, data: result };
    },
  },
];