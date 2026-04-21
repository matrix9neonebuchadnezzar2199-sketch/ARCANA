import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const selectObject: ToolDefinition = {
  id: "select_object",
  name: "Select Object",
  description: "Select a GameObject by name in the editor",
  descriptionJa: "名前でGameObjectを選択する",
  category: "selection",
  inputSchema: z.object({
    name: z.string().describe("GameObject name to select")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "SelectObject", params, { successMessage: (_, params) => `Selected: ${params.name}` });
  }
};

const selectAll: ToolDefinition = {
  id: "select_all",
  name: "Select All",
  description: "Select all GameObjects in the scene",
  descriptionJa: "シーン内の全GameObjectを選択する",
  category: "selection",
  inputSchema: z.object({}),
  handler: async () => {
    return bridgeSendAsToolResult("unity", "SelectAll", {}, { successMessage: "All objects selected" });
  }
};

const selectNone: ToolDefinition = {
  id: "select_none",
  name: "Deselect All",
  description: "Clear the current selection",
  descriptionJa: "現在の選択を解除する",
  category: "selection",
  inputSchema: z.object({}),
  handler: async () => {
    return bridgeSendAsToolResult("unity", "SelectNone", {}, { successMessage: "Selection cleared" });
  }
};

const selectInvert: ToolDefinition = {
  id: "select_invert",
  name: "Invert Selection",
  description: "Invert the current selection",
  descriptionJa: "現在の選択を反転する",
  category: "selection",
  inputSchema: z.object({}),
  handler: async () => {
    return bridgeSendAsToolResult("unity", "SelectInvert", {}, { successMessage: "Selection inverted" });
  }
};

export const selectionTools: ToolDefinition[] = [selectObject, selectAll, selectNone, selectInvert];