import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
export const addressablesTools: ToolDefinition[] = [
  {
    id: "addressables_create_group",
    name: "Create Addressable Group",
    description: "Create a new Addressables group with specified settings",
    descriptionJa: "指定設定で新しいAddressablesグループを作成",
    category: "Addressables",
    inputSchema: z.object({
      groupName: z.string().describe("Group name"),
      buildPath: z.string().optional().describe("Build path profile variable (default: LocalBuildPath)"),
      loadPath: z.string().optional().describe("Load path profile variable (default: LocalLoadPath)"),
      bundleMode: z.enum(["PackTogether", "PackSeparately", "PackTogetherByLabel"]).optional().describe("Bundle packing mode"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "AddressablesCreateGroup", params, { successMessage: (_, params) => `Addressable group "${params.groupName}" created` });
    },
  },
  {
    id: "addressables_mark_asset",
    name: "Mark Asset as Addressable",
    description: "Mark an asset as Addressable and assign it to a group",
    descriptionJa: "アセットをAddressableとしてマークしグループに割り当て",
    category: "Addressables",
    inputSchema: z.object({
      assetPath: z.string().describe("Asset path relative to Assets/ (e.g. Assets/Prefabs/Enemy.prefab)"),
      groupName: z.string().optional().describe("Group to assign to (default: Default Local Group)"),
      address: z.string().optional().describe("Custom address (default: asset path)"),
      labels: z.array(z.string()).optional().describe("Labels to assign"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "AddressablesMarkAsset", params, { successMessage: (_, params) => `Asset "${params.assetPath}" marked as Addressable` });
    },
  },
  {
    id: "addressables_set_labels",
    name: "Set Addressable Labels",
    description: "Add or remove labels on an Addressable asset entry",
    descriptionJa: "Addressableアセットエントリのラベルを追加・削除",
    category: "Addressables",
    inputSchema: z.object({
      address: z.string().describe("Addressable address or asset path"),
      addLabels: z.array(z.string()).optional().describe("Labels to add"),
      removeLabels: z.array(z.string()).optional().describe("Labels to remove"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "AddressablesSetLabels", params, { successMessage: (_, params) => `Labels updated for "${params.address}"` });
    },
  },
  {
    id: "addressables_build",
    name: "Build Addressables",
    description: "Trigger Addressables content build",
    descriptionJa: "Addressablesコンテンツビルドを実行",
    category: "Addressables",
    inputSchema: z.object({
      cleanBuild: z.boolean().optional().describe("Clean build (rebuild everything)"),
      profileName: z.string().optional().describe("Build profile name to use"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "AddressablesBuild", params, { successMessage: (_, params) => `Addressables build ${params.cleanBuild ? "(clean) " : ""}completed` });
    },
  },
  {
    id: "addressables_list_groups",
    name: "List Addressable Groups",
    description: "List all Addressable groups and their entries",
    descriptionJa: "全Addressablesグループとそのエントリを一覧表示",
    category: "Addressables",
    inputSchema: z.object({
      includeEntries: z.boolean().optional().describe("Include entry details (default: false)"),
      groupFilter: z.string().optional().describe("Filter groups by name pattern"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "AddressablesListGroups", params, { successMessage: "Addressable groups listed" });
    },
  },
  {
    id: "addressables_analyze",
    name: "Analyze Addressables",
    description: "Run Addressables analysis rules to detect issues like duplicated assets",
    descriptionJa: "Addressables分析ルールを実行し重複アセット等の問題を検出",
    category: "Addressables",
    inputSchema: z.object({
      rules: z.array(z.enum(["CheckBundleDupeDependencies", "CheckResourcesDupeDependencies", "CheckSceneDupeDependencies", "BuildBundleLayout"])).optional().describe("Analysis rules to run (default: all)"),
      autoFix: z.boolean().optional().describe("Auto-fix detected issues"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("unity", "AddressablesAnalyze", params, { successMessage: "Addressables analysis completed" });
    },
  },
];