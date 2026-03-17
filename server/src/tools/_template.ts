// Tool Template - Copy this file to create a new tool
//
// 1. Copy this file: cp _template.ts your_tool.ts
// 2. Update the tool definition below
// 3. Import and register in index.ts

import { z } from "zod";
import { ToolDefinition } from "../core/registry";
import { unityBridge } from "../bridge/unity-bridge";

export const templateTool: ToolDefinition = {
  id: "category_action",
  name: "Template Tool",
  description: "Description of what this tool does",
  descriptionJa: "このツールの説明",
  category: "category",
  inputSchema: z.object({
    param1: z.string().describe("Description of param1"),
    param2: z.number().optional().describe("Optional param2")
  }),
  handler: async (params) => {
    try {
      const result = await unityBridge.send("CategoryAction", params);
      return {
        success: true,
        message: "Action completed successfully",
        data: result
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed: ${error.message}`
      };
    }
  }
};