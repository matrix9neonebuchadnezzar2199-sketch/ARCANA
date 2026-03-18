import { z } from "zod";

import { ToolDefinition, ToolResult } from "../core/registry";

// ============================================================
// Image Analysis Prompt Templates
// ============================================================

const CHARACTER_ANALYSIS_PROMPT = `Analyze this character image and extract parameters as JSON:
{
  "body": {
    "gender": "male|female",
    "heightCm": number,
    "bodyType": "slim|average|athletic|muscular|curvy|heavy",
    "style": "anime|realistic|chibi"
  },
  "face": {
    "outline": "round|oval|square|heart|triangle",
    "eyeSize": 0-1,
    "eyeAngle": 0-1,
    "eyeColor": {"r":0-1,"g":0-1,"b":0-1},
    "noseWidth": 0-1,
    "noseHeight": 0-1,
    "mouthWidth": 0-1,
    "lipThickness": 0-1,
    "earPointy": 0-1,
    "jawWidth": 0-1,
    "cheekbone": 0-1,
    "preset": "anime|realistic|chibi"
  },
  "hair": {
    "style": "straight|wavy|curly|ponytail|twintail|bun|braids|mohawk|himecut|short|bob|long",
    "frontCm": number,
    "sideCm": number,
    "backCm": number,
    "colorPreset": "black|brown|blonde|red|ash|platinum_blonde|pink|lavender|silver|blue|green|white",
    "colorCustom": {"r":0-1,"g":0-1,"b":0-1} | null,
    "gradient": {"type":"ombre|balayage","rootColor":{},"tipColor":{}} | null,
    "highlights": {"color":{},"amount":0-1} | null,
    "parting": "center|left|right",
    "accessories": ["ribbon","tiara","hairpin","hat","headband"] | []
  },
  "skin": {
    "colorPreset": "fair|light|medium|olive|tan|brown|dark|deep",
    "colorCustom": {"r":0-1,"g":0-1,"b":0-1} | null,
    "freckles": boolean,
    "moles": [{"position":"string","size":0-1}],
    "scars": [{"position":"string","type":"slash|burn|stitch"}]
  },
  "makeup": {
    "eyeshadow": {"r":0-1,"g":0-1,"b":0-1} | null,
    "blush": {"r":0-1,"g":0-1,"b":0-1} | null,
    "lipColor": {"r":0-1,"g":0-1,"b":0-1} | null,
    "eyeliner": boolean
  },
  "expression": "neutral|smile|sad|angry|surprised|wink",
  "clothing": "description of clothing for reference"
}
Return ONLY valid JSON.`;

const SCENE_ANALYSIS_PROMPT = `Analyze this scene/landscape image and extract parameters as JSON:
{
  "environment": {
    "type": "outdoor|indoor|fantasy|scifi|urban|rural|underwater|space",
    "biome": "forest|desert|snow|tropical|mountain|plains|ocean|cave|city",
    "timeOfDay": "dawn|morning|noon|afternoon|sunset|dusk|night|midnight",
    "weather": "clear|cloudy|overcast|rain|snow|fog|storm|wind"
  },
  "terrain": {
    "type": "flat|hills|mountains|canyon|valley|island|cliff",
    "heightScale": 0-1,
    "roughness": 0-1,
    "hasWater": boolean,
    "waterType": "ocean|lake|river|waterfall|pond" | null
  },
  "lighting": {
    "sunIntensity": 0-1,
    "sunColor": {"r":0-1,"g":0-1,"b":0-1},
    "sunAngle": 0-90,
    "ambientIntensity": 0-1,
    "ambientColor": {"r":0-1,"g":0-1,"b":0-1},
    "hasFog": boolean,
    "fogDensity": 0-1,
    "fogColor": {"r":0-1,"g":0-1,"b":0-1}
  },
  "sky": {
    "type": "procedural|hdri|gradient",
    "color1": {"r":0-1,"g":0-1,"b":0-1},
    "color2": {"r":0-1,"g":0-1,"b":0-1},
    "cloudDensity": 0-1,
    "starVisibility": 0-1
  },
  "vegetation": {
    "trees": {"type":"conifer|deciduous|palm|sakura|dead","density":0-1},
    "grass": {"density":0-1,"height":0-1},
    "flowers": boolean,
    "mushrooms": boolean
  },
  "structures": [
    {"type":"castle|house|ruin|bridge|tower|shrine|wall|gate","position":"foreground|midground|background","scale":0-1}
  ],
  "atmosphere": {
    "mood": "peaceful|dramatic|eerie|mystical|epic|cozy|desolate|romantic",
    "particleEffects": ["fireflies","dust","embers","snowflakes","rain","petals","sparks"],
    "colorGrading": {"temperature":0-1,"saturation":0-1,"contrast":0-1}
  },
  "postProcessing": {
    "bloom": 0-1,
    "depthOfField": boolean,
    "focusDistance": number,
    "vignette": 0-1,
    "chromaticAberration": 0-1
  },
  "camera": {
    "angle": "eye_level|low|high|aerial|worms_eye",
    "fov": number,
    "position": "description"
  }
}
Return ONLY valid JSON.`;

const FULL_ANALYSIS_PROMPT = `Analyze this image and extract BOTH character(s) AND scene parameters as JSON:
{
  "characters": [
    {
      "id": 1,
      "position": [x, y, z],
      ... (same as character schema)
    }
  ],
  "scene": {
    ... (same as scene schema)
  }
}
Return ONLY valid JSON.`;

// ============================================================
// Tool: arcana_analyze_image
// ============================================================
const analyzeImageTool: ToolDefinition = {
  id: "arcana_analyze_image",
  name: "Analyze Image",
  description: "Analyze an image (character/scene/both) and extract 3D parameters as JSON. Does NOT create anything - preview only.",
  descriptionJa: "画像（キャラ/風景/両方）を解析し、3DパラメータをJSON抽出。プレビューのみ、生成はしない。",
  category: "ImageTo3D",
  inputSchema: z.object({
    imageUrl: z.string().optional().describe("URL of the image to analyze"),
    imageBase64: z.string().optional().describe("Base64 encoded image data"),
    mode: z.enum(["character", "scene", "full"]).default("full").describe("Analysis mode: character only, scene only, or full (both)"),
  }),
  handler: async (params: any) => {
    const mode = params.mode || "full";
    let prompt = "";
    if (mode === "character") prompt = CHARACTER_ANALYSIS_PROMPT;
    else if (mode === "scene") prompt = SCENE_ANALYSIS_PROMPT;
    else prompt = FULL_ANALYSIS_PROMPT;

    return {
      success: true,
      message: "Image analysis schema generated",
      data: {
      tool: "arcana_analyze_image",
      mode: mode,
      prompt: prompt,
      instruction: "Send this prompt along with the image to a Vision-capable AI (Claude, GPT-4V). The AI will return structured JSON parameters. Pass the result to arcana_image_to_character, arcana_image_to_scene, or arcana_image_to_world.",
      note: "This tool provides the analysis schema. The actual vision analysis is performed by the AI client (Claude Vision, etc.) which then feeds parameters to ARCANA execution tools.",
    } };
  },
};

// ============================================================
// Tool: arcana_image_to_character
// ============================================================
const imageToCharacterTool: ToolDefinition = {
  id: "arcana_image_to_character",
  name: "Image to Character",
  description: "Create a 3D character from analyzed image parameters. Accepts the JSON output from image analysis and calls character creation tools.",
  descriptionJa: "画像解析結果からキャラクターを3D生成。解析JSONを受け取り、キャラクリエイトツールを一括実行。",
  category: "ImageTo3D",
  inputSchema: z.object({
    analysisJson: z.any().describe("Character analysis JSON from arcana_analyze_image or direct Vision AI output"),
    targetEditor: z.enum(["blender", "unity", "unreal"]).default("blender"),
    autoRig: z.boolean().default(true).describe("Automatically add armature and rig"),
    autoExpressions: z.boolean().default(true).describe("Generate Unified Expression shape keys"),
    exportFormat: z.enum(["none", "vrm", "fbx"]).default("none"),
  }),
  handler: async (params: any) => {
    const data = params.analysisJson;
    const editor = params.targetEditor || "blender";

    // Build the tool execution pipeline from analysis data
    const pipeline: any[] = [];

    // 1. Create base body
    if (data.body) {
      pipeline.push({
        tool: "bl_char_create_base",
        params: { gender: data.body.gender, style: data.body.style || "anime" }
      });
      if (data.body.heightCm) {
        pipeline.push({ tool: "bl_char_set_height", params: { height: data.body.heightCm } });
      }
      if (data.body.bodyType) {
        pipeline.push({ tool: "bl_char_set_body_type", params: { type: data.body.bodyType } });
      }
    }

    // 2. Face
    if (data.face) {
      if (data.face.preset) {
        pipeline.push({ tool: "bl_char_set_face_preset", params: { preset: data.face.preset } });
      }
      if (data.face.outline) {
        pipeline.push({ tool: "bl_char_set_face_outline", params: { shape: data.face.outline } });
      }
      if (data.face.eyeSize !== undefined || data.face.eyeAngle !== undefined) {
        pipeline.push({
          tool: "bl_char_set_eye_shape",
          params: { size: data.face.eyeSize, angle: data.face.eyeAngle, spacing: data.face.eyeSpacing }
        });
      }
      if (data.face.eyeColor) {
        pipeline.push({ tool: "bl_char_set_pupil", params: { color: data.face.eyeColor } });
      }
      if (data.face.noseWidth !== undefined) {
        pipeline.push({
          tool: "bl_char_set_nose",
          params: { width: data.face.noseWidth, height: data.face.noseHeight }
        });
      }
      if (data.face.mouthWidth !== undefined) {
        pipeline.push({
          tool: "bl_char_set_mouth",
          params: { width: data.face.mouthWidth, lipThickness: data.face.lipThickness }
        });
      }
      if (data.face.earPointy !== undefined && data.face.earPointy > 0) {
        pipeline.push({ tool: "bl_char_set_ear", params: { pointy: data.face.earPointy } });
      }
      if (data.face.jawWidth !== undefined) {
        pipeline.push({ tool: "bl_char_set_jaw", params: { width: data.face.jawWidth } });
      }
      if (data.face.cheekbone !== undefined) {
        pipeline.push({ tool: "bl_char_set_cheekbone", params: { value: data.face.cheekbone } });
      }
    }

    // 3. Hair
    if (data.hair) {
      if (data.hair.style) {
        pipeline.push({ tool: "bl_char_set_hair_style", params: { style: data.hair.style } });
      }
      if (data.hair.frontCm || data.hair.backCm) {
        pipeline.push({
          tool: "bl_char_set_hair_length",
          params: { frontCm: data.hair.frontCm, sideCm: data.hair.sideCm, backCm: data.hair.backCm }
        });
      }
      if (data.hair.colorPreset) {
        pipeline.push({ tool: "bl_char_set_hair_color", params: { preset: data.hair.colorPreset } });
      } else if (data.hair.colorCustom) {
        pipeline.push({ tool: "bl_char_set_hair_color", params: { color: data.hair.colorCustom } });
      }
      if (data.hair.gradient) {
        pipeline.push({ tool: "bl_char_set_hair_gradient", params: data.hair.gradient });
      }
      if (data.hair.highlights) {
        pipeline.push({ tool: "bl_char_set_hair_highlight", params: data.hair.highlights });
      }
      if (data.hair.parting) {
        pipeline.push({ tool: "bl_char_set_hair_parting", params: { side: data.hair.parting } });
      }
      if (data.hair.accessories && data.hair.accessories.length > 0) {
        for (const acc of data.hair.accessories) {
          pipeline.push({ tool: "bl_char_set_hair_accessory", params: { type: acc } });
        }
      }
    }

    // 4. Skin
    if (data.skin) {
      if (data.skin.colorPreset) {
        pipeline.push({ tool: "bl_char_set_skin_color", params: { preset: data.skin.colorPreset } });
      } else if (data.skin.colorCustom) {
        pipeline.push({ tool: "bl_char_set_skin_color", params: { color: data.skin.colorCustom } });
      }
      if (data.skin.freckles) {
        pipeline.push({ tool: "bl_char_set_skin_texture", params: { texture: "freckles" } });
      }
      if (data.skin.moles) {
        for (const mole of data.skin.moles) {
          pipeline.push({ tool: "bl_char_add_mole", params: mole });
        }
      }
      if (data.skin.scars) {
        for (const scar of data.skin.scars) {
          pipeline.push({ tool: "bl_char_add_scar", params: scar });
        }
      }
    }

    // 5. Makeup
    if (data.makeup) {
      pipeline.push({ tool: "bl_char_set_makeup", params: data.makeup });
    }

    // 6. Expression
    if (data.expression && data.expression !== "neutral") {
      pipeline.push({ tool: "bl_char_set_expression_preset", params: { preset: data.expression } });
    }

    // 7. Auto extras
    if (params.autoExpressions) {
      pipeline.push({ tool: "bl_char_create_unified_shapekeys", params: {} });
      pipeline.push({ tool: "bl_char_setup_viseme", params: {} });
    }

    if (params.autoRig) {
      pipeline.push({ tool: "bl_armature_create", params: { name: "CharacterRig" } });
    }

    // 8. Export
    if (params.exportFormat === "vrm") {
      pipeline.push({ tool: "bl_char_export_vrm", params: {} });
    } else if (params.exportFormat === "fbx") {
      pipeline.push({
        tool: "bl_char_export_fbx",
        params: { target: editor === "unreal" ? "unreal" : "unity" }
      });
    }

    return {
      success: true,
      message: "Character creation pipeline generated",
      data: {
      tool: "arcana_image_to_character",
      pipeline: pipeline,
      stepCount: pipeline.length,
      instruction: "Execute this pipeline using arcana_compose or sequentially with arcana_execute.",
      analysisUsed: Object.keys(data),
    } };
  },
};

// ============================================================
// Tool: arcana_image_to_scene
// ============================================================
const imageToSceneTool: ToolDefinition = {
  id: "arcana_image_to_scene",
  name: "Image to Scene",
  description: "Create a 3D scene/landscape from analyzed image parameters. Accepts scene analysis JSON and calls scene/environment tools.",
  descriptionJa: "画像解析結果から3Dシーン/風景を生成。解析JSONを受け取り、シーン構築ツールを一括実行。",
  category: "ImageTo3D",
  inputSchema: z.object({
    analysisJson: z.any().describe("Scene analysis JSON from arcana_analyze_image or direct Vision AI output"),
    targetEditor: z.enum(["blender", "unity", "unreal"]).default("blender"),
    quality: z.enum(["draft", "normal", "high"]).default("normal"),
  }),
  handler: async (params: any) => {
    const data = params.analysisJson;
    const editor = params.targetEditor || "blender";
    const prefix = editor === "blender" ? "bl_" : editor === "unity" ? "" : "ue_";
    const pipeline: any[] = [];

    // 1. Terrain
    if (data.terrain) {
      if (editor === "blender") {
        pipeline.push({
          tool: "bl_object_create",
          params: { type: "PLANE", name: "Terrain", location: [0, 0, 0] }
        });
        pipeline.push({
          tool: "bl_mod_subsurf",
          params: { name: "Terrain", viewport: 6, render: 6 }
        });
      } else if (editor === "unity") {
        pipeline.push({ tool: "terrain_create", params: { heightScale: data.terrain.heightScale } });
      } else {
        pipeline.push({ tool: "ue_landscape_create", params: {} });
      }
    }

    // 2. Lighting
    if (data.lighting) {
      if (editor === "blender") {
        pipeline.push({
          tool: "bl_light_create",
          params: {
            type: "SUN", name: "Sun",
            energy: (data.lighting.sunIntensity || 0.5) * 10,
          }
        });
        if (data.lighting.sunColor) {
          pipeline.push({
            tool: "bl_light_set_color",
            params: { name: "Sun", color: data.lighting.sunColor }
          });
        }
      } else if (editor === "unity") {
        pipeline.push({
          tool: "lighting_create_light",
          params: { type: "Directional", color: data.lighting.sunColor }
        });
      }
    }

    // 3. Sky / World
    if (data.sky) {
      if (editor === "blender") {
        pipeline.push({
          tool: "bl_render_set_world_color",
          params: { color: data.sky.color1, strength: 1.0 }
        });
      } else if (editor === "unity") {
        pipeline.push({ tool: "env_set_skybox", params: {} });
      }
    }

    // 4. Fog
    if (data.lighting && data.lighting.hasFog) {
      if (editor === "unity") {
        pipeline.push({
          tool: "env_set_fog",
          params: {
            enabled: true,
            density: data.lighting.fogDensity,
            color: data.lighting.fogColor
          }
        });
      }
    }

    // 5. Vegetation (as object placement hints)
    if (data.vegetation) {
      if (data.vegetation.trees && data.vegetation.trees.density > 0) {
        pipeline.push({
          tool: editor === "blender" ? "bl_object_create" : editor === "unity" ? "scene_create_gameobject" : "ue_scene_spawn_actor",
          params: { type: editor === "blender" ? "CONE" : "Empty", name: "TreePlaceholder" }
        });
      }
    }

    // 6. Structures
    if (data.structures) {
      for (const struct of data.structures) {
        pipeline.push({
          tool: editor === "blender" ? "bl_object_create" : editor === "unity" ? "scene_create_gameobject" : "ue_scene_spawn_actor",
          params: { type: editor === "blender" ? "CUBE" : "Empty", name: `Structure_${struct.type}` }
        });
      }
    }

    // 7. Post Processing
    if (data.postProcessing) {
      if (editor === "blender") {
        pipeline.push({ tool: "bl_comp_enable", params: { enable: true } });
        if (data.postProcessing.bloom > 0) {
          pipeline.push({
            tool: "bl_comp_add_node",
            params: { type: "CompositorNodeGlare", name: "Bloom" }
          });
        }
      } else if (editor === "unity") {
        if (data.postProcessing.bloom > 0) {
          pipeline.push({
            tool: "post_set_bloom",
            params: { intensity: data.postProcessing.bloom }
          });
        }
      }
    }

    // 8. Color Management / Grading
    if (data.atmosphere && data.atmosphere.colorGrading) {
      if (editor === "blender") {
        pipeline.push({
          tool: "bl_render_set_color_management",
          params: {
            viewTransform: "Filmic",
            exposure: (data.atmosphere.colorGrading.temperature - 0.5) * 2,
          }
        });
      }
    }

    // 9. Camera
    if (data.camera) {
      if (editor === "blender") {
        const camY = data.camera.angle === "aerial" ? -20 : data.camera.angle === "low" ? -5 : -10;
        const camZ = data.camera.angle === "aerial" ? 30 : data.camera.angle === "low" ? 1 : 5;
        pipeline.push({
          tool: "bl_camera_create",
          params: { name: "SceneCamera", location: [0, camY, camZ], fov: data.camera.fov || 60 }
        });
      }
    }

    return {
      success: true,
      message: "Scene creation pipeline generated",
      data: {
      tool: "arcana_image_to_scene",
      pipeline: pipeline,
      stepCount: pipeline.length,
      instruction: "Execute this pipeline using arcana_compose or sequentially with arcana_execute.",
      sceneType: data.environment?.type,
      mood: data.atmosphere?.mood,
    } };
  },
};

// ============================================================
// Tool: arcana_image_to_world
// ============================================================
const imageToWorldTool: ToolDefinition = {
  id: "arcana_image_to_world",
  name: "Image to World",
  description: "Create a complete 3D world from an image — both characters AND scene. Combines image_to_character and image_to_scene.",
  descriptionJa: "画像からキャラクターとシーンを同時に3D生成。image_to_characterとimage_to_sceneを統合実行。",
  category: "ImageTo3D",
  inputSchema: z.object({
    analysisJson: z.any().describe("Full analysis JSON containing both 'characters' array and 'scene' object"),
    targetEditor: z.enum(["blender", "unity", "unreal"]).default("blender"),
    autoRig: z.boolean().default(true),
    autoExpressions: z.boolean().default(true),
    quality: z.enum(["draft", "normal", "high"]).default("normal"),
  }),
  handler: async (params: any) => {
    const data = params.analysisJson;
    const pipeline: any[] = [];

    // Scene first
    if (data.scene) {
      pipeline.push({
        tool: "arcana_image_to_scene",
        params: { analysisJson: data.scene, targetEditor: params.targetEditor, quality: params.quality }
      });
    }

    // Then characters
    if (data.characters && Array.isArray(data.characters)) {
      for (let i = 0; i < data.characters.length; i++) {
        pipeline.push({
          tool: "arcana_image_to_character",
          params: {
            analysisJson: data.characters[i],
            targetEditor: params.targetEditor,
            autoRig: params.autoRig,
            autoExpressions: params.autoExpressions,
          }
        });
        // Position character
        if (data.characters[i].position) {
          pipeline.push({
            tool: params.targetEditor === "blender" ? "bl_object_set_location" : "transform_set_position",
            params: {
              name: `Character_${data.characters[i].body?.gender || "character"}_${data.characters[i].body?.style || "anime"}`,
              location: data.characters[i].position,
            }
          });
        }
      }
    }

    return {
      success: true,
      message: "World creation pipeline generated",
      data: {
      tool: "arcana_image_to_world",
      pipeline: pipeline,
      stepCount: pipeline.length,
      characterCount: data.characters?.length || 0,
      hasScene: !!data.scene,
      instruction: "Execute the scene pipeline first, then each character pipeline. Use arcana_compose for sequential execution.",
    } };
  },
};

// ============================================================
// Export
// ============================================================
export const imageTo3dTools: ToolDefinition[] = [
  analyzeImageTool,
  imageToCharacterTool,
  imageToSceneTool,
  imageToWorldTool,
];
