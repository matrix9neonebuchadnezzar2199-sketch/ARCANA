import { ToolDefinition } from "../core/registry";
import { bridge } from "../bridge";
import { z } from "zod";
export const probuilderTools: ToolDefinition[] = [
  {
    id: "probuilder_create_shape",
    name: "Create ProBuilder Shape",
    description: "Create a ProBuilder editable mesh primitive",
    descriptionJa: "ProBuilder編集可能メッシュプリミティブを作成",
    category: "ProBuilder",
    inputSchema: z.object({
      shape: z.enum(["Cube", "Cylinder", "Sphere", "Plane", "Prism", "Stair", "Arch", "Door", "Pipe", "Cone", "Torus", "Custom"]).describe("Shape type"),
      name: z.string().optional().describe("Object name"),
      position: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional().describe("Position"),
      size: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional().describe("Size"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("unity", "ProBuilderCreateShape", params);
        return { success: true, message: `ProBuilder ${params.shape} created`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "probuilder_extrude_faces",
    name: "Extrude Faces",
    description: "Extrude selected faces of a ProBuilder mesh by a given distance",
    descriptionJa: "ProBuilderメッシュの選択面を指定距離で押し出し",
    category: "ProBuilder",
    inputSchema: z.object({
      objectName: z.string().describe("Target ProBuilder object"),
      faceIndices: z.array(z.number()).describe("Indices of faces to extrude"),
      distance: z.number().describe("Extrusion distance"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("unity", "ProBuilderExtrudeFaces", params);
        return { success: true, message: `Extruded ${params.faceIndices.length} faces by ${params.distance}`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "probuilder_subdivide",
    name: "Subdivide Mesh",
    description: "Subdivide a ProBuilder mesh to increase geometry detail",
    descriptionJa: "ProBuilderメッシュを細分化してジオメトリの詳細度を上げる",
    category: "ProBuilder",
    inputSchema: z.object({
      objectName: z.string().describe("Target ProBuilder object"),
      iterations: z.number().optional().describe("Number of subdivision iterations (default: 1)"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("unity", "ProBuilderSubdivide", params);
        return { success: true, message: `Mesh "${params.objectName}" subdivided`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "probuilder_merge_objects",
    name: "Merge ProBuilder Objects",
    description: "Merge multiple ProBuilder objects into a single mesh",
    descriptionJa: "複数のProBuilderオブジェクトを1つのメッシュに結合",
    category: "ProBuilder",
    inputSchema: z.object({
      objectNames: z.array(z.string()).describe("Names of ProBuilder objects to merge"),
      resultName: z.string().optional().describe("Name for the merged object"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("unity", "ProBuilderMergeObjects", params);
        return { success: true, message: `Merged ${params.objectNames.length} objects`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "probuilder_boolean_operation",
    name: "Boolean Operation",
    description: "Perform CSG boolean operation between two ProBuilder meshes",
    descriptionJa: "2つのProBuilderメッシュ間でCSGブーリアン演算を実行",
    category: "ProBuilder",
    inputSchema: z.object({
      objectA: z.string().describe("First object name"),
      objectB: z.string().describe("Second object name"),
      operation: z.enum(["Union", "Subtract", "Intersect"]).describe("Boolean operation type"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("unity", "ProBuilderBooleanOperation", params);
        return { success: true, message: `Boolean ${params.operation}: ${params.objectA} & ${params.objectB}`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "probuilder_set_material_per_face",
    name: "Set Material Per Face",
    description: "Assign different materials to specific faces of a ProBuilder mesh",
    descriptionJa: "ProBuilderメッシュの特定の面に異なるマテリアルを割り当て",
    category: "ProBuilder",
    inputSchema: z.object({
      objectName: z.string().describe("Target ProBuilder object"),
      assignments: z.array(z.object({
        faceIndices: z.array(z.number()).describe("Face indices"),
        materialName: z.string().describe("Material name to assign"),
      })).describe("Material assignments per face group"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("unity", "ProBuilderSetMaterialPerFace", params);
        return { success: true, message: `Materials assigned on "${params.objectName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "probuilder_generate_uv",
    name: "Generate UV Mapping",
    description: "Auto-generate UV mapping for a ProBuilder mesh",
    descriptionJa: "ProBuilderメッシュのUVマッピングを自動生成",
    category: "ProBuilder",
    inputSchema: z.object({
      objectName: z.string().describe("Target ProBuilder object"),
      mode: z.enum(["Auto", "Box", "Planar"]).optional().describe("UV projection mode"),
      tilingX: z.number().optional().describe("Tiling X"),
      tilingY: z.number().optional().describe("Tiling Y"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("unity", "ProBuilderGenerateUV", params);
        return { success: true, message: `UV generated for "${params.objectName}"`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
  {
    id: "probuilder_export_mesh",
    name: "Export ProBuilder Mesh",
    description: "Export a ProBuilder mesh as a standard Unity mesh asset or OBJ file",
    descriptionJa: "ProBuilderメッシュを標準Unityメッシュアセット又はOBJファイルとしてエクスポート",
    category: "ProBuilder",
    inputSchema: z.object({
      objectName: z.string().describe("Target ProBuilder object"),
      format: z.enum(["Asset", "OBJ", "STL"]).optional().describe("Export format"),
      path: z.string().optional().describe("Export path relative to Assets/"),
    }),
    handler: async (params) => {
      try {
        const result = await bridge.send("unity", "ProBuilderExportMesh", params);
        return { success: true, message: `Mesh "${params.objectName}" exported as ${params.format || "Asset"}`, data: result };
      } catch (error: any) {
        return { success: false, message: `Error: ${error.message}` };
      }
    },
  },
];