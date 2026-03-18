import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
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
    try {
      const result = await bridge.send("blender", "bl_execute_code", params);
      return result
        ? { success: true, message: "Code executed", data: result }
        : { success: false, message: "Execution failed" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  },
};

export const blExecuteTools: ToolDefinition[] = [blExecuteCode];
