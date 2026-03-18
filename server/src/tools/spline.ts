import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
const splineCreate: ToolDefinition = {
  id: "spline_create",
  name: "Create Spline",
  description: "Create a new spline container in the scene",
  descriptionJa: "シーンに新しいスプラインコンテナを作成",
  category: "spline",
  inputSchema: z.object({ name: z.string().optional(), type: z.enum(["catmullrom","bezier","linear"]).default("catmullrom") }),
  handler: async (p) => {
    const r = await bridge.send("unity", "SplineCreate", p);
    return r ? { success: true, message: `Spline created: ${p.name ?? "NewSpline"}`, data: r }
             : { success: false, message: "Failed to create spline" };
  }
};

const splineAddKnot: ToolDefinition = {
  id: "spline_add_knot",
  name: "Add Spline Knot",
  description: "Add a knot (control point) to an existing spline",
  descriptionJa: "既存スプラインにノット（制御点）を追加",
  category: "spline",
  inputSchema: z.object({ splineName: z.string(), x: z.number(), y: z.number(), z: z.number(), index: z.number().optional() }),
  handler: async (p) => {
    const r = await bridge.send("unity", "SplineAddKnot", p);
    return r ? { success: true, message: `Knot added to ${p.splineName}`, data: r }
             : { success: false, message: "Failed to add knot" };
  }
};

const splineRemoveKnot: ToolDefinition = {
  id: "spline_remove_knot",
  name: "Remove Spline Knot",
  description: "Remove a knot from a spline by index",
  descriptionJa: "インデックス指定でスプラインからノットを削除",
  category: "spline",
  inputSchema: z.object({ splineName: z.string(), index: z.number() }),
  handler: async (p) => {
    const r = await bridge.send("unity", "SplineRemoveKnot", p);
    return r ? { success: true, message: `Knot ${p.index} removed`, data: r }
             : { success: false, message: "Failed to remove knot" };
  }
};

const splineSetTangent: ToolDefinition = {
  id: "spline_set_tangent",
  name: "Set Spline Tangent",
  description: "Set the tangent of a spline knot",
  descriptionJa: "スプラインノットのタンジェントを設定",
  category: "spline",
  inputSchema: z.object({ splineName: z.string(), index: z.number(), inX: z.number(), inY: z.number(), inZ: z.number(), outX: z.number(), outY: z.number(), outZ: z.number() }),
  handler: async (p) => {
    const r = await bridge.send("unity", "SplineSetTangent", p);
    return r ? { success: true, message: `Tangent set at knot ${p.index}`, data: r }
             : { success: false, message: "Failed to set tangent" };
  }
};

const splineAnimate: ToolDefinition = {
  id: "spline_animate",
  name: "Animate Along Spline",
  description: "Animate a GameObject along a spline path",
  descriptionJa: "スプラインパスに沿ってGameObjectをアニメーション",
  category: "spline",
  inputSchema: z.object({ objectName: z.string(), splineName: z.string(), duration: z.number().default(5), loop: z.boolean().default(false) }),
  handler: async (p) => {
    const r = await bridge.send("unity", "SplineAnimate", p);
    return r ? { success: true, message: `${p.objectName} animating along ${p.splineName}`, data: r }
             : { success: false, message: "Failed to animate along spline" };
  }
};

const splineExtrude: ToolDefinition = {
  id: "spline_extrude",
  name: "Spline Extrude Mesh",
  description: "Generate an extruded mesh along a spline",
  descriptionJa: "スプラインに沿って押し出しメッシュを生成",
  category: "spline",
  inputSchema: z.object({ splineName: z.string(), radius: z.number().default(0.5), sides: z.number().default(8), segments: z.number().default(32) }),
  handler: async (p) => {
    const r = await bridge.send("unity", "SplineExtrude", p);
    return r ? { success: true, message: `Extruded mesh on ${p.splineName}`, data: r }
             : { success: false, message: "Failed to extrude" };
  }
};

const splineEvaluate: ToolDefinition = {
  id: "spline_evaluate",
  name: "Evaluate Spline Point",
  description: "Get position/tangent at a normalized t value on the spline",
  descriptionJa: "正規化tでスプライン上の位置・タンジェントを取得",
  category: "spline",
  inputSchema: z.object({ splineName: z.string(), t: z.number().min(0).max(1) }),
  handler: async (p) => {
    const r = await bridge.send("unity", "SplineEvaluate", p);
    return r ? { success: true, message: `Evaluated at t=${p.t}`, data: r }
             : { success: false, message: "Failed to evaluate" };
  }
};

const splineGetLength: ToolDefinition = {
  id: "spline_get_length",
  name: "Get Spline Length",
  description: "Get the total length of a spline",
  descriptionJa: "スプラインの総距離を取得",
  category: "spline",
  inputSchema: z.object({ splineName: z.string() }),
  handler: async (p) => {
    const r = await bridge.send("unity", "SplineGetLength", p);
    return r ? { success: true, message: `Spline length retrieved`, data: r }
             : { success: false, message: "Failed to get length" };
  }
};

export const splineTools: ToolDefinition[] = [
  splineCreate, splineAddKnot, splineRemoveKnot, splineSetTangent,
  splineAnimate, splineExtrude, splineEvaluate, splineGetLength
];