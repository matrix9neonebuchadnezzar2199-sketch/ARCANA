import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const scriptCreate: ToolDefinition = {
  id: "script_create",
  name: "Create C# Script",
  description: "Create a new C# MonoBehaviour script file",
  descriptionJa: "新しいC# MonoBehaviourスクリプトを作成する",
  category: "script",
  inputSchema: z.object({
    className: z.string().describe("Class name for the script"),
    code: z.string().describe("Full C# source code"),
    folder: z.string().optional().default("Assets/Scripts").describe("Target folder path")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "ScriptCreate", params, { successMessage: (_, params) => `Script ${params.className}.cs created in ${params.folder}` });
  }
};

const scriptAttach: ToolDefinition = {
  id: "script_attach",
  name: "Attach Script",
  description: "Attach an existing script to a GameObject",
  descriptionJa: "既存のスクリプトをGameObjectにアタッチする",
  category: "script",
  inputSchema: z.object({
    objectName: z.string().describe("Target GameObject name"),
    scriptName: z.string().describe("Script class name to attach")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "ScriptAttach", params, { successMessage: (_, params) => `${params.scriptName} attached to ${params.objectName}` });
  }
};

const scriptSetVariable: ToolDefinition = {
  id: "script_set_variable",
  name: "Set Script Variable",
  description: "Set a public variable on an attached script",
  descriptionJa: "アタッチ済みスクリプトのpublic変数を設定する",
  category: "script",
  inputSchema: z.object({
    objectName: z.string().describe("Target GameObject name"),
    scriptName: z.string().describe("Script class name"),
    variableName: z.string().describe("Variable name"),
    value: z.string().describe("Value as string (auto-converted)")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "ScriptSetVariable", params, { successMessage: (_, params) => `${params.variableName} set to ${params.value} on ${params.scriptName}` });
  }
};

const scriptInvokeMethod: ToolDefinition = {
  id: "script_invoke_method",
  name: "Invoke Script Method",
  description: "Invoke a public method on an attached script",
  descriptionJa: "アタッチ済みスクリプトのpublicメソッドを呼び出す",
  category: "script",
  inputSchema: z.object({
    objectName: z.string().describe("Target GameObject name"),
    scriptName: z.string().describe("Script class name"),
    methodName: z.string().describe("Method name to invoke"),
    args: z.string().optional().default("").describe("Comma-separated arguments")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "ScriptInvokeMethod", params, { successMessage: (_, params) => `${params.methodName} invoked on ${params.scriptName}` });
  }
};

export const scriptTools: ToolDefinition[] = [scriptCreate, scriptAttach, scriptSetVariable, scriptInvokeMethod];