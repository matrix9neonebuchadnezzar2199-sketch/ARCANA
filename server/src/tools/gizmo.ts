import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const gizmoDrawSphere: ToolDefinition = {
  id: "gizmo_draw_sphere",
  name: "Draw Gizmo Sphere",
  description: "Draw a wire sphere gizmo at a position",
  descriptionJa: "指定位置にワイヤースフィアギズモを描画",
  category: "gizmo",
  inputSchema: z.object({ x: z.number(), y: z.number(), z: z.number(), radius: z.number().default(1), r: z.number().default(1), g: z.number().default(1), b: z.number().default(0) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "GizmoDrawSphere", p);
      return r ? { success: true, message: "Gizmo sphere drawn", data: r }
               : { success: false, message: "Failed to draw gizmo sphere" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

const gizmoDrawCube: ToolDefinition = {
  id: "gizmo_draw_cube",
  name: "Draw Gizmo Cube",
  description: "Draw a wire cube gizmo at a position",
  descriptionJa: "指定位置にワイヤーキューブギズモを描画",
  category: "gizmo",
  inputSchema: z.object({ x: z.number(), y: z.number(), z: z.number(), sizeX: z.number().default(1), sizeY: z.number().default(1), sizeZ: z.number().default(1), r: z.number().default(0), g: z.number().default(1), b: z.number().default(0) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "GizmoDrawCube", p);
      return r ? { success: true, message: "Gizmo cube drawn", data: r }
               : { success: false, message: "Failed to draw gizmo cube" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

const gizmoDrawLine: ToolDefinition = {
  id: "gizmo_draw_line",
  name: "Draw Gizmo Line",
  description: "Draw a line gizmo between two points",
  descriptionJa: "2点間にラインギズモを描画",
  category: "gizmo",
  inputSchema: z.object({ fromX: z.number(), fromY: z.number(), fromZ: z.number(), toX: z.number(), toY: z.number(), toZ: z.number(), r: z.number().default(1), g: z.number().default(0), b: z.number().default(0) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "GizmoDrawLine", p);
      return r ? { success: true, message: "Gizmo line drawn", data: r }
               : { success: false, message: "Failed to draw gizmo line" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

const gizmoDrawRay: ToolDefinition = {
  id: "gizmo_draw_ray",
  name: "Draw Gizmo Ray",
  description: "Draw a ray gizmo from origin in a direction",
  descriptionJa: "原点から方向を指定してレイギズモを描画",
  category: "gizmo",
  inputSchema: z.object({ originX: z.number(), originY: z.number(), originZ: z.number(), dirX: z.number(), dirY: z.number(), dirZ: z.number(), r: z.number().default(0), g: z.number().default(0), b: z.number().default(1) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "GizmoDrawRay", p);
      return r ? { success: true, message: "Gizmo ray drawn", data: r }
               : { success: false, message: "Failed to draw gizmo ray" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

const gizmoDrawLabel: ToolDefinition = {
  id: "gizmo_draw_label",
  name: "Draw Gizmo Label",
  description: "Draw a text label in the scene view",
  descriptionJa: "シーンビューにテキストラベルを描画",
  category: "gizmo",
  inputSchema: z.object({ x: z.number(), y: z.number(), z: z.number(), text: z.string(), fontSize: z.number().default(12) }),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "GizmoDrawLabel", p);
      return r ? { success: true, message: `Label drawn: ${p.text}`, data: r }
               : { success: false, message: "Failed to draw label" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

const gizmoClearAll: ToolDefinition = {
  id: "gizmo_clear_all",
  name: "Clear All Gizmos",
  description: "Clear all custom gizmos from the scene",
  descriptionJa: "シーンからすべてのカスタムギズモをクリア",
  category: "gizmo",
  inputSchema: z.object({}),
  handler: async (p) => {
    try {
      const r = await bridge.send("unity", "GizmoClearAll", p);
      return r ? { success: true, message: "All gizmos cleared", data: r }
               : { success: false, message: "Failed to clear gizmos" };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  }
};

export const gizmoTools: ToolDefinition[] = [
  gizmoDrawSphere, gizmoDrawCube, gizmoDrawLine,
  gizmoDrawRay, gizmoDrawLabel, gizmoClearAll
];