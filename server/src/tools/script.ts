import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
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
    try {
      const result = await bridge.send("unity", "ScriptCreate", params);
      return { success: true, message: `Script ${params.className}.cs created in ${params.folder}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
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
    try {
      const result = await bridge.send("unity", "ScriptAttach", params);
      return { success: true, message: `${params.scriptName} attached to ${params.objectName}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
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
    try {
      const result = await bridge.send("unity", "ScriptSetVariable", params);
      return { success: true, message: `${params.variableName} set to ${params.value} on ${params.scriptName}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
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
    try {
      const result = await bridge.send("unity", "ScriptInvokeMethod", params);
      return { success: true, message: `${params.methodName} invoked on ${params.scriptName}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

export const scriptTools: ToolDefinition[] = [scriptCreate, scriptAttach, scriptSetVariable, scriptInvokeMethod];