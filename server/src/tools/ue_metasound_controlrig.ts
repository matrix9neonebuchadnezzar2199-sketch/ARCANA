import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unrealBridge } from "../bridge/unreal-bridge";

// ===== MetaSound (5 tools) =====

export const ueMetaSoundTools: ToolDefinition[] = [
  {
    id: "ue_metasound_create_source",
    name: "Create MetaSound Source",
    description: "Create a new MetaSound Source asset for procedural audio",
    descriptionJa: "プロシージャルオーディオ用の新しいMetaSound Sourceアセットを作成",
    category: "UE_MetaSound",
    inputSchema: z.object({
      name: z.string().describe("MetaSound asset name"),
      path: z.string().optional().describe("Content path (e.g. /Game/Audio/)"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("MetaSoundCreateSource", params);
      return { success: true, message: `MetaSound source "${params.name}" created`, data: result };
    },
  },
  {
    id: "ue_metasound_add_node",
    name: "Add MetaSound Node",
    description: "Add an audio node (Oscillator, Filter, Envelope, Delay, Mixer, etc.) to a MetaSound graph",
    descriptionJa: "MetaSoundグラフにオーディオノード（オシレーター、フィルター、エンベロープ、ディレイ、ミキサー等）を追加",
    category: "UE_MetaSound",
    inputSchema: z.object({
      sourceName: z.string().describe("Target MetaSound source"),
      nodeType: z.enum(["Oscillator", "LFO", "Filter", "Envelope", "ADSR", "Delay", "Reverb", "Mixer", "Gain", "WavePlayer", "Noise", "Trigger", "Random", "Math"]).describe("Node type"),
      nodeName: z.string().optional().describe("Custom node label"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("MetaSoundAddNode", params);
      return { success: true, message: `${params.nodeType} node added to "${params.sourceName}"`, data: result };
    },
  },
  {
    id: "ue_metasound_connect_nodes",
    name: "Connect MetaSound Nodes",
    description: "Connect an output pin of one node to an input pin of another node",
    descriptionJa: "あるノードの出力ピンを別のノードの入力ピンに接続",
    category: "UE_MetaSound",
    inputSchema: z.object({
      sourceName: z.string().describe("Target MetaSound source"),
      fromNode: z.string().describe("Output node name"),
      fromPin: z.string().describe("Output pin name"),
      toNode: z.string().describe("Input node name"),
      toPin: z.string().describe("Input pin name"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("MetaSoundConnectNodes", params);
      return { success: true, message: `Connected ${params.fromNode}.${params.fromPin} -> ${params.toNode}.${params.toPin}`, data: result };
    },
  },
  {
    id: "ue_metasound_set_parameter",
    name: "Set MetaSound Parameter",
    description: "Set a parameter value on a MetaSound node",
    descriptionJa: "MetaSoundノードのパラメータ値を設定",
    category: "UE_MetaSound",
    inputSchema: z.object({
      sourceName: z.string().describe("Target MetaSound source"),
      nodeName: z.string().describe("Target node name"),
      parameterName: z.string().describe("Parameter name (e.g. Frequency, Gain, CutoffFrequency)"),
      value: z.number().describe("Parameter value"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("MetaSoundSetParameter", params);
      return { success: true, message: `${params.parameterName} = ${params.value} on "${params.nodeName}"`, data: result };
    },
  },
  {
    id: "ue_metasound_add_input_output",
    name: "Add Graph Input/Output",
    description: "Add an exposed input or output parameter to the MetaSound graph interface",
    descriptionJa: "MetaSoundグラフインターフェースに公開入力/出力パラメータを追加",
    category: "UE_MetaSound",
    inputSchema: z.object({
      sourceName: z.string().describe("Target MetaSound source"),
      direction: z.enum(["Input", "Output"]).describe("Input or Output"),
      paramName: z.string().describe("Parameter name"),
      paramType: z.enum(["Float", "Int", "Bool", "Audio", "Trigger", "String", "WaveTable"]).describe("Parameter data type"),
      defaultValue: z.number().optional().describe("Default value (for numeric types)"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("MetaSoundAddInputOutput", params);
      return { success: true, message: `${params.direction} "${params.paramName}" (${params.paramType}) added to "${params.sourceName}"`, data: result };
    },
  },
];

// ===== Control Rig (5 tools) =====

export const ueControlRigTools: ToolDefinition[] = [
  {
    id: "ue_controlrig_create",
    name: "Create Control Rig",
    description: "Create a new Control Rig Blueprint for a skeletal mesh",
    descriptionJa: "スケルタルメッシュ用の新しいControl Rig Blueprintを作成",
    category: "UE_ControlRig",
    inputSchema: z.object({
      name: z.string().describe("Control Rig asset name"),
      skeletonPath: z.string().describe("Skeleton asset path"),
      path: z.string().optional().describe("Content path"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("ControlRigCreate", params);
      return { success: true, message: `Control Rig "${params.name}" created`, data: result };
    },
  },
  {
    id: "ue_controlrig_add_control",
    name: "Add Rig Control",
    description: "Add a control element (transform, float, bool, vector) to the Control Rig",
    descriptionJa: "Control Rigにコントロール要素（トランスフォーム、float、bool、ベクトル）を追加",
    category: "UE_ControlRig",
    inputSchema: z.object({
      rigName: z.string().describe("Target Control Rig"),
      controlName: z.string().describe("Control name (e.g. IK_Hand_L, FK_Spine_01)"),
      controlType: z.enum(["Transform", "TransformNoScale", "Float", "Bool", "Integer", "Vector2D", "Position", "Rotator"]).describe("Control value type"),
      parentBone: z.string().optional().describe("Parent bone name"),
      shapeType: z.enum(["Circle", "Square", "Sphere", "Box", "Arrow", "FourWayArrow"]).optional().describe("Gizmo shape"),
      color: z.object({ r: z.number(), g: z.number(), b: z.number() }).optional().describe("Gizmo color"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("ControlRigAddControl", params);
      return { success: true, message: `Control "${params.controlName}" (${params.controlType}) added to "${params.rigName}"`, data: result };
    },
  },
  {
    id: "ue_controlrig_add_bone_chain",
    name: "Add IK/FK Bone Chain",
    description: "Set up an IK or FK chain on a series of bones with controls",
    descriptionJa: "一連のボーンにコントロール付きIKまたはFKチェーンを設定",
    category: "UE_ControlRig",
    inputSchema: z.object({
      rigName: z.string().describe("Target Control Rig"),
      chainType: z.enum(["IK", "FK", "IKFK"]).describe("Chain type"),
      startBone: z.string().describe("First bone in the chain"),
      endBone: z.string().describe("Last bone in the chain (effector)"),
      poleBone: z.string().optional().describe("Pole vector bone (for IK)"),
      createControls: z.boolean().optional().describe("Auto-create controls for the chain (default: true)"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("ControlRigAddBoneChain", params);
      return { success: true, message: `${params.chainType} chain set from "${params.startBone}" to "${params.endBone}"`, data: result };
    },
  },
  {
    id: "ue_controlrig_add_constraint",
    name: "Add Rig Constraint",
    description: "Add a constraint (Aim, Parent, Position, Rotation) to a bone or control",
    descriptionJa: "ボーンまたはコントロールにコンストレイント（Aim、Parent、Position、Rotation）を追加",
    category: "UE_ControlRig",
    inputSchema: z.object({
      rigName: z.string().describe("Target Control Rig"),
      constraintType: z.enum(["Aim", "Parent", "Position", "Rotation", "Scale", "LookAt"]).describe("Constraint type"),
      targetElement: z.string().describe("Element to constrain"),
      sourceElement: z.string().describe("Element to constrain to"),
      weight: z.number().optional().describe("Constraint weight (0-1)"),
      maintainOffset: z.boolean().optional().describe("Maintain current offset"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("ControlRigAddConstraint", params);
      return { success: true, message: `${params.constraintType} constraint: "${params.targetElement}" -> "${params.sourceElement}"`, data: result };
    },
  },
  {
    id: "ue_controlrig_assign_to_mesh",
    name: "Assign Control Rig to Mesh",
    description: "Assign a Control Rig to a Skeletal Mesh actor in the level for use in Sequencer or gameplay",
    descriptionJa: "レベル内のSkeletal MeshアクターにControl Rigを割り当てSequencerやゲームプレイで使用",
    category: "UE_ControlRig",
    inputSchema: z.object({
      actorName: z.string().describe("Skeletal Mesh actor name in level"),
      rigAssetPath: z.string().describe("Control Rig asset path"),
    }),
    handler: async (params) => {
      const result = await unrealBridge.send("ControlRigAssignToMesh", params);
      return { success: true, message: `Control Rig assigned to "${params.actorName}"`, data: result };
    },
  },
];