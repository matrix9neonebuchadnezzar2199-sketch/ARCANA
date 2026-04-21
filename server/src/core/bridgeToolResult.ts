import { bridge } from "../bridge";

import type { ToolResult } from "./registry";

/**
 * Wraps {@link bridge.send} so SuperSave `execute` / `compose` always see a {@link ToolResult}.
 */
export async function bridgeSendAsToolResult(
  editor: string,
  pluginToolName: string,
  params: Record<string, any>,
  options?: { successMessage?: string }
): Promise<ToolResult> {
  try {
    const data = await bridge.send(editor, pluginToolName, params);
    return {
      success: true,
      message: options?.successMessage ?? `${pluginToolName} completed`,
      data,
    };
  } catch (error: any) {
    return { success: false, message: error?.message ?? String(error) };
  }
}
