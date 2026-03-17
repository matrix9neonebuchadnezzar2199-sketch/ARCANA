import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const testCreate: ToolDefinition = { id: "test_create", name: "Create Test Script", description: "Create a new NUnit/Unity Test Framework test script", descriptionJa: "新しいNUnit/Unity Test Frameworkテストスクリプトを作成する", category: "testing",
  inputSchema: z.object({ className: z.string().describe("Test class name"), mode: z.enum(["EditMode", "PlayMode"]).optional().default("EditMode").describe("Test mode"), folder: z.string().optional().default("Assets/Tests").describe("Save folder") }),
  handler: async (params) => { try { const r = await unityBridge.send("TestCreate", params); return { success: true, message: `Test created: ${params.className} (${params.mode})`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const testRun: ToolDefinition = { id: "test_run", name: "Run Tests", description: "Run unit tests by category, class, or all", descriptionJa: "カテゴリ・クラス・全体でユニットテストを実行する", category: "testing",
  inputSchema: z.object({ filter: z.string().optional().default("").describe("Test filter (class name, category, or empty for all)"), mode: z.enum(["EditMode", "PlayMode", "All"]).optional().default("All").describe("Test mode") }),
  handler: async (params) => { try { const r = await unityBridge.send("TestRun", params); return { success: true, message: "Tests executed", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const testAssert: ToolDefinition = { id: "test_add_assert", name: "Add Test Assertion", description: "Add an assertion to an existing test method", descriptionJa: "既存のテストメソッドにアサーションを追加する", category: "testing",
  inputSchema: z.object({ className: z.string().describe("Test class name"), methodName: z.string().describe("Test method name"), assertType: z.enum(["AreEqual", "IsTrue", "IsFalse", "IsNull", "IsNotNull", "Throws"]).describe("Assertion type"), expected: z.string().optional().default("").describe("Expected value"), actual: z.string().optional().default("").describe("Actual expression") }),
  handler: async (params) => { try { const r = await unityBridge.send("TestAddAssert", params); return { success: true, message: `Assert.${params.assertType} added to ${params.methodName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const testMock: ToolDefinition = { id: "test_create_mock", name: "Create Mock Object", description: "Create a mock/stub object for testing", descriptionJa: "テスト用のモック/スタブオブジェクトを作成する", category: "testing",
  inputSchema: z.object({ interfaceName: z.string().describe("Interface or class to mock"), mockName: z.string().optional().describe("Mock variable name") }),
  handler: async (params) => { try { const r = await unityBridge.send("TestCreateMock", params); return { success: true, message: `Mock created for ${params.interfaceName}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const testPerf: ToolDefinition = { id: "test_performance", name: "Performance Test", description: "Create a performance measurement test", descriptionJa: "パフォーマンス計測テストを作成する", category: "testing",
  inputSchema: z.object({ className: z.string().describe("Test class name"), methodName: z.string().describe("Method to benchmark"), iterations: z.number().optional().default(100).describe("Number of iterations") }),
  handler: async (params) => { try { const r = await unityBridge.send("TestPerformance", params); return { success: true, message: `Performance test created: ${params.methodName} x${params.iterations}`, data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const testCoverage: ToolDefinition = { id: "test_coverage", name: "Get Test Coverage", description: "Get code coverage report for tests", descriptionJa: "テストのコードカバレッジレポートを取得する", category: "testing",
  inputSchema: z.object({ assemblyFilter: z.string().optional().default("").describe("Assembly filter") }),
  handler: async (params) => { try { const r = await unityBridge.send("TestCoverage", params); return { success: true, message: "Coverage report generated", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const testReport: ToolDefinition = { id: "test_report", name: "Get Test Report", description: "Get the latest test run results", descriptionJa: "最新のテスト実行結果を取得する", category: "testing",
  inputSchema: z.object({}),
  handler: async () => { try { const r = await unityBridge.send("TestReport", {}); return { success: true, message: "Test report retrieved", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

const testCleanup: ToolDefinition = { id: "test_cleanup", name: "Cleanup Test Data", description: "Remove temporary test objects and data", descriptionJa: "一時テストオブジェクトとデータを削除する", category: "testing",
  inputSchema: z.object({}),
  handler: async () => { try { const r = await unityBridge.send("TestCleanup", {}); return { success: true, message: "Test data cleaned up", data: r }; } catch (e: any) { return { success: false, message: e.message }; } } };

export const testingTools: ToolDefinition[] = [testCreate, testRun, testAssert, testMock, testPerf, testCoverage, testReport, testCleanup];