import { bridge } from "../bridge";

describe("Bridge", () => {
  test("bridge instance exists", () => {
    expect(bridge).toBeDefined();
  });

  test("getStatus returns object with editor states", () => {
    const status = bridge.getStatus();
    expect(status).toHaveProperty("unity");
    expect(status).toHaveProperty("unreal");
    expect(status).toHaveProperty("blender");
  });

  test("resolveEditor maps bl_ prefix to blender", () => {
    const editor = bridge.resolveEditor("bl_object_create");
    expect(editor).toBe("blender");
  });

  test("resolveEditor maps ue_ prefix to unreal", () => {
    const editor = bridge.resolveEditor("ue_scene_list");
    expect(editor).toBe("unreal");
  });

  test("resolveEditor maps unprefixed to unity", () => {
    const editor = bridge.resolveEditor("scene_create");
    expect(editor).toBe("unity");
  });

  test("send to disconnected editor rejects", async () => {
    await expect(bridge.send("blender", "bl_test", {})).rejects.toThrow();
  });
});
