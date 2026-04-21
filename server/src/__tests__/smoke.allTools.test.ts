import { ALL_TOOL_DEFINITIONS } from "../allToolDefinitions";
import { bridge } from "../bridge";
import { ToolRegistry } from "../core/registry";
import { globalRegistry } from "../core/registry";
import { superSave } from "../core/supersave";

const EDITOR_TARGETS = new Set(["unity", "unreal", "blender", "server"]);

describe("smoke: full tool catalog", () => {
  test("every tool has required fields and a Zod-safeParse", () => {
    for (const t of ALL_TOOL_DEFINITIONS) {
      expect(typeof t.id).toBe("string");
      expect(t.id.length).toBeGreaterThan(0);
      expect(typeof t.name).toBe("string");
      expect(typeof t.category).toBe("string");
      expect(typeof t.description).toBe("string");
      expect(typeof t.descriptionJa).toBe("string");
      expect(typeof t.handler).toBe("function");
      expect(t.inputSchema).toBeDefined();
      expect(typeof (t.inputSchema as { safeParse?: unknown }).safeParse).toBe("function");
    }
  });

  test("tool ids are unique", () => {
    const ids = ALL_TOOL_DEFINITIONS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("all tools register into a fresh registry without duplicates", () => {
    const reg = new ToolRegistry();
    const spy = jest.spyOn(console, "warn").mockImplementation();
    for (const t of ALL_TOOL_DEFINITIONS) {
      reg.register(t);
    }
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
    expect(reg.count()).toBe(ALL_TOOL_DEFINITIONS.length);
  });

  test("resolveEditor maps every tool id to a known bridge target", () => {
    for (const t of ALL_TOOL_DEFINITIONS) {
      const ed = bridge.resolveEditor(t.id);
      expect(EDITOR_TARGETS.has(ed)).toBe(true);
    }
  });

  test("SuperSave discover returns hits for every category (spot check)", async () => {
    globalRegistry.clearForTesting();
    for (const t of ALL_TOOL_DEFINITIONS) {
      globalRegistry.register(t);
    }
    const categories = [...new Set(ALL_TOOL_DEFINITIONS.map((t) => t.category))].sort();
    for (const category of categories) {
      const r = await superSave.discover({ category });
      expect(r.success).toBe(true);
      const tools = (r.data as { tools: { id: string; category: string }[] }).tools;
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.every((x) => x.category === category)).toBe(true);
    }
    globalRegistry.clearForTesting();
  });
});
