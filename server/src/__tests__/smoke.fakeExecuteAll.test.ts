import WebSocket from "ws";
import { ALL_TOOL_DEFINITIONS } from "../allToolDefinitions";
import { bridge } from "../bridge";
import { globalRegistry } from "../core/registry";
import { superSave } from "../core/supersave";
import { closeWs, connectFakeEditor, FakeEditorId } from "./helpers/fakeEditorWsClient";

const TEST_PORTS = {
  unity: 29887,
  unreal: 29888,
  blender: 29889,
} as const;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

describe("smoke: fake bridge execute for full catalog", () => {
  const sockets: WebSocket[] = [];

  beforeAll(async () => {
    bridge.stop();
    bridge.start({ ...TEST_PORTS });
    await sleep(400);
    const editors: FakeEditorId[] = ["unity", "unreal", "blender"];
    for (const ed of editors) {
      sockets.push(await connectFakeEditor(ed, TEST_PORTS[ed]));
    }
  }, 20000);

  afterAll(async () => {
    for (const ws of sockets) {
      await closeWs(ws);
    }
    sockets.length = 0;
    await sleep(200);
    bridge.stop();
    await sleep(100);
  });

  beforeEach(() => {
    globalRegistry.clearForTesting();
    for (const t of ALL_TOOL_DEFINITIONS) {
      globalRegistry.register(t);
    }
  });

  afterEach(() => {
    globalRegistry.clearForTesting();
  });

  test("every tool execute({}) returns a ToolResult-shaped object (no throw)", async () => {
    for (const t of ALL_TOOL_DEFINITIONS) {
      let r: unknown;
      try {
        r = await superSave.execute({ toolId: t.id, params: {} });
      } catch (e: any) {
        throw new Error(`execute threw for ${t.id}: ${e?.message ?? e}`);
      }
      expect(r).toBeDefined();
      expect(typeof r).toBe("object");
      expect(r).not.toBeNull();
      expect(typeof (r as { success?: unknown }).success).toBe("boolean");
    }
  }, 180000);
});
