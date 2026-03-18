import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const shaderSetProperty: ToolDefinition = {
  id: "shader_set_property",
  name: "Set Shader Property",
  description: "Set a float, color, or vector property on a material shader",
  descriptionJa: "マテリアルシェーダーのfloat/color/vectorプロパティを設定する",
  category: "shader",
  inputSchema: z.object({ objectName: z.string().describe("GameObject name"), propertyName: z.string().describe("Shader property name (e.g. _Metallic)"), valueType: z.enum(["float", "color", "vector"]).describe("Value type"), value: z.string().describe("Value as string (float: 0.5, color: #FF0000, vector: 1,0,0,1)") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "ShaderSetProperty", params); return { success: true, message: `${params.propertyName} set on ${params.objectName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const shaderSetKeyword: ToolDefinition = {
  id: "shader_set_keyword",
  name: "Set Shader Keyword",
  description: "Enable or disable a shader keyword on a material",
  descriptionJa: "マテリアルのシェーダーキーワードを有効/無効にする",
  category: "shader",
  inputSchema: z.object({ objectName: z.string().describe("GameObject name"), keyword: z.string().describe("Shader keyword (e.g. _EMISSION)"), enabled: z.boolean().optional().default(true).describe("Enable or disable") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "ShaderSetKeyword", params); return { success: true, message: `Keyword ${params.keyword} ${params.enabled ? "enabled" : "disabled"}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const shaderSwitch: ToolDefinition = {
  id: "shader_switch",
  name: "Switch Shader",
  description: "Switch the shader on a material by full shader name",
  descriptionJa: "シェーダー名を指定してマテリアルのシェーダーを切り替える",
  category: "shader",
  inputSchema: z.object({ objectName: z.string().describe("GameObject name"), shaderName: z.string().describe("Full shader name (e.g. Universal Render Pipeline/Lit)") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "ShaderSwitch", params); return { success: true, message: `Shader switched to ${params.shaderName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const shaderSetGlobal: ToolDefinition = {
  id: "shader_set_global",
  name: "Set Global Shader Property",
  description: "Set a global shader property affecting all materials",
  descriptionJa: "全マテリアルに影響するグローバルシェーダープロパティを設定する",
  category: "shader",
  inputSchema: z.object({ propertyName: z.string().describe("Global property name"), valueType: z.enum(["float", "color", "vector"]).describe("Value type"), value: z.string().describe("Value as string") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "ShaderSetGlobal", params); return { success: true, message: `Global ${params.propertyName} set`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const shaderGetProperties: ToolDefinition = {
  id: "shader_get_properties",
  name: "Get Shader Properties",
  description: "List all properties of the shader on a material",
  descriptionJa: "マテリアルのシェーダー全プロパティを一覧取得する",
  category: "shader",
  inputSchema: z.object({ objectName: z.string().describe("GameObject name") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "ShaderGetProperties", params); return { success: true, message: `Properties retrieved for ${params.objectName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

const shaderListAll: ToolDefinition = {
  id: "shader_list_all",
  name: "List Available Shaders",
  description: "List all available shaders in the project",
  descriptionJa: "プロジェクト内の利用可能な全シェーダーを一覧表示する",
  category: "shader",
  inputSchema: z.object({ filter: z.string().optional().default("").describe("Filter keyword") }),
  handler: async (params) => { try { const r = await bridge.send("unity", "ShaderListAll", params); return { success: true, message: "Shader list retrieved", data: r }; } catch (e: any) { return { success: false, message: e.message }; } }
};

export const shaderTools: ToolDefinition[] = [shaderSetProperty, shaderSetKeyword, shaderSwitch, shaderSetGlobal, shaderGetProperties, shaderListAll];