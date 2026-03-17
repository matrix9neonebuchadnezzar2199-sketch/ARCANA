import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

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
    try {
      const result = await unityBridge.send("SelectObject", params);
      return { success: true, message: `Selected: ${params.name}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
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
    try {
      const result = await unityBridge.send("SelectAll", {});
      return { success: true, message: "All objects selected", data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
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
    try {
      const result = await unityBridge.send("SelectNone", {});
      return { success: true, message: "Selection cleared", data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
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
    try {
      const result = await unityBridge.send("SelectInvert", {});
      return { success: true, message: "Selection inverted", data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

export const selectionTools: ToolDefinition[] = [selectObject, selectAll, selectNone, selectInvert];