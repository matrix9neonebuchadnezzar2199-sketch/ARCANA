import { globalRegistry, ToolDefinition } from "../core/registry";

const makeTool = (id: string, category = "test"): ToolDefinition => ({
  id,
  name: `Tool ${id}`,
  description: `Description for ${id}`,
  descriptionJa: `${id} ???`,
  category,
  inputSchema: {} as any,
  handler: async () => ({ success: true, message: "ok" }),
});

describe("Registry", () => {
  beforeEach(() => {
    (globalRegistry as any).tools.clear();
  });

  test("register and retrieve a tool", () => {
    const tool = makeTool("test_tool_1");
    globalRegistry.register(tool);
    expect(globalRegistry.get("test_tool_1")).toBe(tool);
  });

  test("get returns undefined for unknown tool", () => {
    expect(globalRegistry.get("nonexistent")).toBeUndefined();
  });

  test("duplicate registration warns but does not throw", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation();
    const tool = makeTool("dup_tool");
    globalRegistry.register(tool);
    globalRegistry.register(tool);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("getAll returns all registered tools", () => {
    globalRegistry.register(makeTool("a"));
    globalRegistry.register(makeTool("b"));
    globalRegistry.register(makeTool("c"));
    const all = globalRegistry.getAll();
    expect(all.length).toBe(3);
  });

  test("getCategories returns distinct categories", () => {
    globalRegistry.register(makeTool("x1", "cat_a"));
    globalRegistry.register(makeTool("x2", "cat_a"));
    globalRegistry.register(makeTool("x3", "cat_b"));
    const cats = globalRegistry.getCategories();
    expect(cats).toContain("cat_a");
    expect(cats).toContain("cat_b");
    expect(cats.length).toBe(2);
  });

  test("search by keyword", () => {
    globalRegistry.register(makeTool("light_create", "lighting"));
    globalRegistry.register(makeTool("mesh_combine", "mesh"));
    const results = globalRegistry.search("light");
    expect(results.length).toBe(1);
    expect(results[0].id).toBe("light_create");
  });

  test("getByCategory filters correctly", () => {
    globalRegistry.register(makeTool("a1", "animation"));
    globalRegistry.register(makeTool("a2", "animation"));
    globalRegistry.register(makeTool("s1", "scene"));
    const results = globalRegistry.getByCategory("animation");
    expect(results.length).toBe(2);
  });

  test("count returns correct number", () => {
    globalRegistry.register(makeTool("t1"));
    globalRegistry.register(makeTool("t2"));
    expect(globalRegistry.count()).toBe(2);
  });
});
