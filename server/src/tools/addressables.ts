import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const addrCreateGroup: ToolDefinition = { id: "addr_create_group", name: "Create Addressable Group", description: "Create a new Addressable asset group", descriptionJa: "新しいAddressableアセットグループを作成する", category: "addressables",
  inputSchema: z.object({ groupName: z.string().describe("Group name"), schema: z.enum(["Packed", "Virtual"]).optional().default("Packed").describe("Build schema") }),
  handler: async (params) => { try { const r = await unityBridge.send("AddrCreateGroup", params); return { success: true, message: `Group created: ${params.groupName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const addrAddEntry: ToolDefinition = { id: "addr_add_entry", name: "Add Addressable Entry", description: "Mark an asset as Addressable and add to a group", descriptionJa: "アセットをAddressableに設定してグループに追加する", category: "addressables",
  inputSchema: z.object({ assetPath: z.string().describe("Asset path"), groupName: z.string().describe("Target group name"), address: z.string().optional().describe("Custom address (default: asset path)") }),
  handler: async (params) => { try { const r = await unityBridge.send("AddrAddEntry", params); return { success: true, message: `Entry added: ${params.assetPath}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const addrSetLabel: ToolDefinition = { id: "addr_set_label", name: "Set Addressable Label", description: "Add or remove a label on an Addressable entry", descriptionJa: "Addressableエントリにラベルを追加/削除する", category: "addressables",
  inputSchema: z.object({ address: z.string().describe("Entry address"), label: z.string().describe("Label name"), enabled: z.boolean().optional().default(true).describe("Add or remove") }),
  handler: async (params) => { try { const r = await unityBridge.send("AddrSetLabel", params); return { success: true, message: `Label ${params.label} ${params.enabled ? "added" : "removed"}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const addrBuild: ToolDefinition = { id: "addr_build", name: "Build Addressables", description: "Build all Addressable asset bundles", descriptionJa: "全Addressableアセットバンドルをビルドする", category: "addressables",
  inputSchema: z.object({ cleanBuild: z.boolean().optional().default(false).describe("Clean build") }),
  handler: async (params) => { try { const r = await unityBridge.send("AddrBuild", params); return { success: true, message: "Addressables built", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const addrLoad: ToolDefinition = { id: "addr_load", name: "Load Addressable", description: "Load an Addressable asset at runtime by address", descriptionJa: "アドレス指定でAddressableアセットをランタイムロードする", category: "addressables",
  inputSchema: z.object({ address: z.string().describe("Asset address or label") }),
  handler: async (params) => { try { const r = await unityBridge.send("AddrLoad", params); return { success: true, message: `Loaded: ${params.address}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const addrProfile: ToolDefinition = { id: "addr_profile", name: "Set Addressable Profile", description: "Switch the active Addressable build profile", descriptionJa: "Addressableビルドプロファイルを切り替える", category: "addressables",
  inputSchema: z.object({ profileName: z.string().describe("Profile name to activate") }),
  handler: async (params) => { try { const r = await unityBridge.send("AddrProfile", params); return { success: true, message: `Profile set: ${params.profileName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

export const addressablesTools: ToolDefinition[] = [addrCreateGroup, addrAddEntry, addrSetLabel, addrBuild, addrLoad, addrProfile];