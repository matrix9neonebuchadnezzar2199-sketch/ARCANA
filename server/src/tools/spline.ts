import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const splineCreate: ToolDefinition = {
  id: "spline_create",
  name: "Create Spline",
  description: "Create a new spline container in the scene",
  descriptionJa: "シーンに新しいスプラインコンテナを作成",
  category: "spline",
  inputSchema: z.object({ name: z.string().optional(), type: z.enum(["catmullrom","bezier","linear"]).default("catmullrom") }),
  handler: async (p) => {
    return bridgeSendAsToolResult("unity", "SplineCreate", p, { successMessage: (_, p) => `Spline created: ${p.name ?? "NewSpline"}` });
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
    return bridgeSendAsToolResult("unity", "SplineAddKnot", p, { successMessage: (_, p) => `Knot added to ${p.splineName}` });
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
    return bridgeSendAsToolResult("unity", "SplineRemoveKnot", p, { successMessage: (_, p) => `Knot ${p.index} removed` });
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
    return bridgeSendAsToolResult("unity", "SplineSetTangent", p, { successMessage: (_, p) => `Tangent set at knot ${p.index}` });
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
    return bridgeSendAsToolResult("unity", "SplineAnimate", p, { successMessage: (_, p) => `${p.objectName} animating along ${p.splineName}` });
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
    return bridgeSendAsToolResult("unity", "SplineExtrude", p, { successMessage: (_, p) => `Extruded mesh on ${p.splineName}` });
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
    return bridgeSendAsToolResult("unity", "SplineEvaluate", p, { successMessage: (_, p) => `Evaluated at t=${p.t}` });
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
    return bridgeSendAsToolResult("unity", "SplineGetLength", p, { successMessage: (_, p) => `Spline length retrieved` });
  }
};

export const splineTools: ToolDefinition[] = [
  splineCreate, splineAddKnot, splineRemoveKnot, splineSetTangent,
  splineAnimate, splineExtrude, splineEvaluate, splineGetLength
];