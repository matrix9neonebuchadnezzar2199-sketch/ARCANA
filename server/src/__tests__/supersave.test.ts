import { globalRegistry, ToolDefinition } from "../core/registry";
import { superSave } from "../core/supersave";

const makeTool = (id: string, category = "test"): ToolDefinition => ({
  id,
  name: `Tool ${id}`,
  description: `Desc ${id}`,
  descriptionJa: `?? ${id}`,
  category,
  inputSchema: {} as any,
  handler: async (params: any) => ({ success: true, message: "executed", data: params }),
});

describe("SuperSave", () => {
  beforeEach(() => {
    globalRegistry.clearForTesting();
    globalRegistry.register(makeTool("bl_object_create", "bl_object"));
    globalRegistry.register(makeTool("bl_object_delete", "bl_object"));
    globalRegistry.register(makeTool("scene_list", "scene"));
  });

  test("discover returns all tools when no query", async () => {
    const result = await superSave.discover({});
    expect(result.success).toBe(true);
    expect(result.data.tools.length).toBe(3);
    expect(result.data.totalRegistered).toBe(3);
  });

  test("discover filters by query", async () => {
    const result = await superSave.discover({ query: "object" });
    expect(result.success).toBe(true);
    expect(result.data.tools.length).toBe(2);
  });

  test("discover filters by category", async () => {
    const result = await superSave.discover({ category: "scene" });
    expect(result.success).toBe(true);
    expect(result.data.tools.length).toBe(1);
    expect(result.data.tools[0].id).toBe("scene_list");
  });

  test("inspect returns tool schema", async () => {
    const result = await superSave.inspect({ toolId: "bl_object_create" });
    expect(result.success).toBe(true);
    expect(result.data.id).toBe("bl_object_create");
  });

  test("inspect returns error for unknown tool", async () => {
    const result = await superSave.inspect({ toolId: "nonexistent" });
    expect(result.success).toBe(false);
  });

  test("execute runs tool handler", async () => {
    const result = await superSave.execute({
      toolId: "bl_object_create",
      params: { type: "CUBE" },
    });
    expect(result.success).toBe(true);
    expect(result.data.type).toBe("CUBE");
  });

  test("execute returns error for unknown tool", async () => {
    const result = await superSave.execute({ toolId: "fake", params: {} });
    expect(result.success).toBe(false);
  });

  test("execute coerces legacy raw handler return into ToolResult", async () => {
    globalRegistry.register({
      id: "legacy_raw_tool",
      name: "Legacy raw",
      description: "Returns non-ToolResult",
      descriptionJa: "x",
      category: "test",
      inputSchema: {} as any,
      handler: async () => ({ ping: 1 } as any),
    });
    const r = await superSave.execute({ toolId: "legacy_raw_tool", params: {} });
    expect(r.success).toBe(true);
    expect((r.data as { ping: number }).ping).toBe(1);
  });

  test("compose runs multiple steps", async () => {
    const result = await superSave.compose({
      steps: [
        { toolId: "bl_object_create", params: { type: "CUBE" } },
        { toolId: "bl_object_delete", params: { name: "Cube" } },
      ],
    });
    expect(result.success).toBe(true);
    expect(result.data.steps.length).toBe(2);
  });

  test("compose fails on unknown tool", async () => {
    const result = await superSave.compose({
      steps: [{ toolId: "fake_tool", params: {} }],
    });
    expect(result.success).toBe(false);
  });
});
