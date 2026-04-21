import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
export const blVseTools: ToolDefinition[] = [
  {
    id: "bl_vse_add_strip",
    name: "Add Sequence Strip",
    description: "Add a media strip (movie, image, sound, scene, color) to the Video Sequence Editor",
    descriptionJa: "Video Sequence Editorにメディアストリップ（動画、画像、音声、シーン、カラー）を追加",
    category: "BL_VSE",
    inputSchema: z.object({
      stripType: z.enum(["MOVIE", "IMAGE", "SOUND", "SCENE", "COLOR", "TEXT", "ADJUSTMENT"]).describe("Strip type"),
      filepath: z.string().optional().describe("File path (for MOVIE, IMAGE, SOUND)"),
      sceneName: z.string().optional().describe("Scene name (for SCENE strip)"),
      channel: z.number().describe("Channel number (row in timeline)"),
      frameStart: z.number().describe("Start frame"),
      frameEnd: z.number().optional().describe("End frame (auto-detected for media files)"),
      color: z.object({ r: z.number(), g: z.number(), b: z.number() }).optional().describe("Color (for COLOR strip)"),
      text: z.string().optional().describe("Text content (for TEXT strip)"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("blender", "bl_vse_add_strip", params, { successMessage: (_, params) => `${params.stripType} strip added to channel ${params.channel} at frame ${params.frameStart}` });
    },
  },
  {
    id: "bl_vse_add_transition",
    name: "Add Transition",
    description: "Add a transition effect (Cross, Gamma Cross, Wipe) between two strips",
    descriptionJa: "2つのストリップ間にトランジション効果（クロス、ガンマクロス、ワイプ）を追加",
    category: "BL_VSE",
    inputSchema: z.object({
      transitionType: z.enum(["CROSS", "GAMMA_CROSS", "WIPE"]).describe("Transition type"),
      stripA: z.string().describe("First strip name"),
      stripB: z.string().describe("Second strip name"),
      channel: z.number().describe("Channel for the transition strip"),
      wipeType: z.enum(["SINGLE", "DOUBLE", "IRIS", "CLOCK"]).optional().describe("Wipe subtype (for WIPE)"),
      wipeAngle: z.number().optional().describe("Wipe angle in degrees"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("blender", "bl_vse_add_transition", params, { successMessage: (_, params) => `${params.transitionType} transition added between "${params.stripA}" and "${params.stripB}"` });
    },
  },
  {
    id: "bl_vse_add_effect",
    name: "Add Strip Effect",
    description: "Add a visual effect strip (Glow, Gaussian Blur, Speed Control, Transform, Color Mix)",
    descriptionJa: "ビジュアルエフェクトストリップ（グロー、ガウシアンブラー、速度制御、トランスフォーム、カラーミックス）を追加",
    category: "BL_VSE",
    inputSchema: z.object({
      effectType: z.enum(["GLOW", "GAUSSIAN_BLUR", "SPEED", "TRANSFORM", "COLOR_MIX", "MULTIPLY", "ALPHA_OVER", "ALPHA_UNDER"]).describe("Effect type"),
      inputStrip: z.string().describe("Input strip name"),
      channel: z.number().describe("Channel for the effect strip"),
      blurSizeX: z.number().optional().describe("Blur size X (for GAUSSIAN_BLUR)"),
      blurSizeY: z.number().optional().describe("Blur size Y (for GAUSSIAN_BLUR)"),
      speedFactor: z.number().optional().describe("Speed factor (for SPEED, 1.0 = normal)"),
      glowThreshold: z.number().optional().describe("Glow threshold (for GLOW)"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("blender", "bl_vse_add_effect", params, { successMessage: (_, params) => `${params.effectType} effect added on "${params.inputStrip}"` });
    },
  },
  {
    id: "bl_vse_cut_strip",
    name: "Cut Strip",
    description: "Cut a strip at a specified frame into two pieces",
    descriptionJa: "指定フレームでストリップを2つに分割",
    category: "BL_VSE",
    inputSchema: z.object({
      stripName: z.string().describe("Strip to cut"),
      frame: z.number().describe("Frame to cut at"),
      cutType: z.enum(["SOFT", "HARD"]).optional().describe("Cut type (SOFT keeps source, HARD duplicates data)"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("blender", "bl_vse_cut_strip", params, { successMessage: (_, params) => `Strip "${params.stripName}" cut at frame ${params.frame}` });
    },
  },
  {
    id: "bl_vse_set_strip_properties",
    name: "Set Strip Properties",
    description: "Modify properties of a sequence strip (opacity, offset, crop, mute, speed)",
    descriptionJa: "シーケンスストリップのプロパティ（不透明度、オフセット、クロップ、ミュート、速度）を変更",
    category: "BL_VSE",
    inputSchema: z.object({
      stripName: z.string().describe("Target strip name"),
      opacity: z.number().optional().describe("Strip opacity (0-1)"),
      offsetStart: z.number().optional().describe("Start offset in frames"),
      offsetEnd: z.number().optional().describe("End offset in frames"),
      cropTop: z.number().optional().describe("Crop from top in pixels"),
      cropBottom: z.number().optional().describe("Crop from bottom in pixels"),
      cropLeft: z.number().optional().describe("Crop from left in pixels"),
      cropRight: z.number().optional().describe("Crop from right in pixels"),
      mute: z.boolean().optional().describe("Mute the strip"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("blender", "bl_vse_set_strip_properties", params, { successMessage: (_, params) => `Properties updated on strip "${params.stripName}"` });
    },
  },
  {
    id: "bl_vse_render_animation",
    name: "Render VSE Animation",
    description: "Render the VSE timeline to a video file or image sequence",
    descriptionJa: "VSEタイムラインを動画ファイルまたは画像シーケンスとしてレンダリング",
    category: "BL_VSE",
    inputSchema: z.object({
      outputPath: z.string().describe("Output file path"),
      format: z.enum(["FFMPEG", "AVI_RAW", "AVI_JPEG", "PNG", "JPEG", "OPEN_EXR"]).optional().describe("Output format"),
      codec: z.enum(["H264", "MPEG4", "WEBM", "AV1", "NONE"]).optional().describe("Video codec (for FFMPEG)"),
      quality: z.number().optional().describe("Encoding quality (0-100)"),
      frameStart: z.number().optional().describe("Start frame (default: scene start)"),
      frameEnd: z.number().optional().describe("End frame (default: scene end)"),
      resolutionX: z.number().optional().describe("Output width"),
      resolutionY: z.number().optional().describe("Output height"),
    }),
    handler: async (params) => {
      return bridgeSendAsToolResult("blender", "bl_vse_render_animation", params, { successMessage: (_, params) => `VSE render started: ${params.outputPath}` });
    },
  },
];