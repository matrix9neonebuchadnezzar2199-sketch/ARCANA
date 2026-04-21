import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";

const blExecuteCode: ToolDefinition = {
  id: "bl_execute_code",
  name: "Execute Python Code",
  description: "Execute arbitrary Python code in Blender. Returns stdout output. Use with caution.",
  descriptionJa: "Blender?????Python??????????????????????",
  category: "bl_scene",
  inputSchema: z.object({
    code: z.string().describe("Python code to execute in Blender"),
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("blender", "bl_execute_code", params, { successMessage: "Code executed" });
  },
};

export const blExecuteTools: ToolDefinition[] = [blExecuteCode];
