import { bridge } from "../bridge";
import { globalRegistry } from "../core/registry";
import { superSave } from "../core/supersave";
import { sceneTools } from "../tools/scene";
import { blObjectTools } from "../tools/bl_object";
import { ueSceneTools } from "../tools/ue_scene";
import { recipeSceneTools } from "../tools/recipe_scenes";
import { closeWs, connectFakeEditor, FakeEditorId } from "./helpers/fakeEditorWsClient";
import WebSocket from "ws";

const TEST_PORTS = {
  unity: 29877,
  unreal: 29878,
  blender: 29879,
} as const;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

describe("integration: bridge + SuperSave + real tool handlers", () => {
  const sockets: WebSocket[] = [];

  beforeAll(async () => {
    bridge.stop();
    bridge.start({ ...TEST_PORTS });
    await sleep(400);
    const editors: FakeEditorId[] = ["unity", "unreal", "blender"];
    for (const ed of editors) {
      const ws = await connectFakeEditor(ed, TEST_PORTS[ed]);
      sockets.push(ws);
    }
  }, 20000);

  afterAll(async () => {
    for (const ws of sockets) {
      await closeWs(ws);
    }
    sockets.length = 0;
    await sleep(300);
    bridge.stop();
    await sleep(100);
  });

  beforeEach(() => {
    globalRegistry.clearForTesting();
    for (const t of sceneTools) globalRegistry.register(t);
    globalRegistry.register(blObjectTools[0]);
    globalRegistry.register(ueSceneTools[0]);
    globalRegistry.register(recipeSceneTools[0]);
  });

  test("C1: discover → inspect → execute (Unity scene_list_objects)", async () => {
    const d = await superSave.discover({ query: "scene" });
    expect(d.success).toBe(true);
    expect((d.data as any).tools.some((x: { id: string }) => x.id === "scene_list_objects")).toBe(true);

    const i = await superSave.inspect({ toolId: "scene_list_objects" });
    expect(i.success).toBe(true);
    expect((i.data as any).id).toBe("scene_list_objects");

    const e = await superSave.execute({
      toolId: "scene_list_objects",
      params: { includeInactive: false },
    });
    expect(e.success).toBe(true);
    expect(e.data?.mock).toBe(true);
    expect(e.data?.tool).toBe("SceneListObjects");
  });

  test("C2: compose Unity scene_create → scene_list", async () => {
    const r = await superSave.compose({
      steps: [
        {
          toolId: "scene_create_gameobject",
          params: { name: "TestCube", primitive: "Cube", position: { x: 0, y: 0, z: 0 } },
        },
        { toolId: "scene_list_objects", params: {} },
      ],
    });
    expect(r.success).toBe(true);
    const steps = (r.data as any).steps as Array<{ toolId: string; result: any }>;
    expect(steps.length).toBe(2);
    expect(steps[0].toolId).toBe("scene_create_gameobject");
    expect(steps[0].result.success).toBe(true);
    expect(steps[1].result.success).toBe(true);
  });

  test("C3: Blender bl_object_create", async () => {
    const r = await superSave.execute({
      toolId: "bl_object_create",
      params: { type: "Cube", x: 0, y: 0, z: 0 },
    });
    expect(r.success).toBe(true);
    expect(r.data?.tool).toBe("bl_object_create");
  });

  test("C4: UE ue_scene_list_actors", async () => {
    const r = await superSave.execute({
      toolId: "ue_scene_list_actors",
      params: {},
    });
    expect(r.success).toBe(true);
    expect(r.data?.tool).toBe("SceneListActors");
  });

  test("C5: recipe_fps_scene targets Unity via explicit editor param", async () => {
    const r = await superSave.execute({
      toolId: "recipe_fps_scene",
      params: { editor: "unity", terrainSize: 10, timeOfDay: "noon" },
    });
    expect(r.success).toBe(true);
    expect(r.data?.tool).toBe("recipe_fps_scene");
    expect(r.data?.mock).toBe(true);
  });

  test("resolveEditor picks unity for recipe when Unity is connected first", () => {
    expect(bridge.resolveEditor("recipe_fps_scene")).toBe("unity");
  });
});
