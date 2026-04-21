import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const testCreate: ToolDefinition = { id: "test_create", name: "Create Test Script", description: "Create a new NUnit/Unity Test Framework test script", descriptionJa: "新しいNUnit/Unity Test Frameworkテストスクリプトを作成する", category: "testing",
  inputSchema: z.object({ className: z.string().describe("Test class name"), mode: z.enum(["EditMode", "PlayMode"]).optional().default("EditMode").describe("Test mode"), folder: z.string().optional().default("Assets/Tests").describe("Save folder") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "TestCreate", params, { successMessage: (_, params) => `Test created: ${params.className} (${params.mode})` }) } };

const testRun: ToolDefinition = { id: "test_run", name: "Run Tests", description: "Run unit tests by category, class, or all", descriptionJa: "カテゴリ・クラス・全体でユニットテストを実行する", category: "testing",
  inputSchema: z.object({ filter: z.string().optional().default("").describe("Test filter (class name, category, or empty for all)"), mode: z.enum(["EditMode", "PlayMode", "All"]).optional().default("All").describe("Test mode") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "TestRun", params, { successMessage: "Tests executed" }) } };

const testAssert: ToolDefinition = { id: "test_add_assert", name: "Add Test Assertion", description: "Add an assertion to an existing test method", descriptionJa: "既存のテストメソッドにアサーションを追加する", category: "testing",
  inputSchema: z.object({ className: z.string().describe("Test class name"), methodName: z.string().describe("Test method name"), assertType: z.enum(["AreEqual", "IsTrue", "IsFalse", "IsNull", "IsNotNull", "Throws"]).describe("Assertion type"), expected: z.string().optional().default("").describe("Expected value"), actual: z.string().optional().default("").describe("Actual expression") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "TestAddAssert", params, { successMessage: (_, params) => `Assert.${params.assertType} added to ${params.methodName}` }) } };

const testMock: ToolDefinition = { id: "test_create_mock", name: "Create Mock Object", description: "Create a mock/stub object for testing", descriptionJa: "テスト用のモック/スタブオブジェクトを作成する", category: "testing",
  inputSchema: z.object({ interfaceName: z.string().describe("Interface or class to mock"), mockName: z.string().optional().describe("Mock variable name") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "TestCreateMock", params, { successMessage: (_, params) => `Mock created for ${params.interfaceName}` }) } };

const testPerf: ToolDefinition = { id: "test_performance", name: "Performance Test", description: "Create a performance measurement test", descriptionJa: "パフォーマンス計測テストを作成する", category: "testing",
  inputSchema: z.object({ className: z.string().describe("Test class name"), methodName: z.string().describe("Method to benchmark"), iterations: z.number().optional().default(100).describe("Number of iterations") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "TestPerformance", params, { successMessage: (_, params) => `Performance test created: ${params.methodName} x${params.iterations}` }) } };

const testCoverage: ToolDefinition = { id: "test_coverage", name: "Get Test Coverage", description: "Get code coverage report for tests", descriptionJa: "テストのコードカバレッジレポートを取得する", category: "testing",
  inputSchema: z.object({ assemblyFilter: z.string().optional().default("").describe("Assembly filter") }),
  handler: async (params) => { return bridgeSendAsToolResult("unity", "TestCoverage", params, { successMessage: "Coverage report generated" }) } };

const testReport: ToolDefinition = { id: "test_report", name: "Get Test Report", description: "Get the latest test run results", descriptionJa: "最新のテスト実行結果を取得する", category: "testing",
  inputSchema: z.object({}),
  handler: async () => bridgeSendAsToolResult("unity", "TestReport", {}, { successMessage: "Test report retrieved" }) };

const testCleanup: ToolDefinition = { id: "test_cleanup", name: "Cleanup Test Data", description: "Remove temporary test objects and data", descriptionJa: "一時テストオブジェクトとデータを削除する", category: "testing",
  inputSchema: z.object({}),
  handler: async () => bridgeSendAsToolResult("unity", "TestCleanup", {}, { successMessage: "Test data cleaned up" }) };

export const testingTools: ToolDefinition[] = [testCreate, testRun, testAssert, testMock, testPerf, testCoverage, testReport, testCleanup];