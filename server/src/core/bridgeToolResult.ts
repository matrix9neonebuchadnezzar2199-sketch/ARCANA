import { bridge } from "../bridge";

import type { ToolResult } from "./registry";

export type BridgeSuccessMessage =
  | string
  | ((data: unknown, params: Record<string, any>) => string);

/**
 * Wraps {@link bridge.send} so SuperSave `execute` / `compose` always see a {@link ToolResult}.
 */
export async function bridgeSendAsToolResult(
  editor: string,
  pluginToolName: string,
  params: Record<string, any>,
  options?: { successMessage?: BridgeSuccessMessage }
): Promise<ToolResult> {
  try {
    const data = await bridge.send(editor, pluginToolName, params);
    const sm = options?.successMessage;
    const message =
      typeof sm === "function"
        ? sm(data, params)
        : (sm ?? `${pluginToolName} completed`);
    return { success: true, message, data };
  } catch (error: any) {
    return { success: false, message: error?.message ?? String(error) };
  }
}
