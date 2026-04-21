import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { globalRegistry } from "./core/registry";
import { superSave } from "./core/supersave";
import { ARCANA_SERVER_VERSION } from "./version";

// Import all tool modules
import { sceneTools } from "./tools/scene";
import { transformTools } from "./tools/transform";
import { materialTools } from "./tools/material";
import { lightingTools } from "./tools/lighting";
import { terrainTools } from "./tools/terrain";
import { audioTools } from "./tools/audio";
import { cameraTools } from "./tools/camera";
import { physicsTools } from "./tools/physics";
import { vfxTools } from "./tools/vfx";
import { animationTools } from "./tools/animation";
import { uiTools } from "./tools/ui";
import { optimizationTools } from "./tools/optimization";
import { componentTools } from "./tools/component";
import { prefabTools } from "./tools/prefab";
import { layertagTools } from "./tools/layertag";
import { environmentTools } from "./tools/environment";
import { navigationTools } from "./tools/navigation";
import { postProcessingTools } from "./tools/postprocessing";
import { scriptTools } from "./tools/script";
import { renderTools } from "./tools/render";
import { assetTools } from "./tools/asset";
import { editorTools } from "./tools/editor";
import { selectionTools } from "./tools/selection";
import { constraintTools } from "./tools/constraint";
import { buildTools } from "./tools/build";
import { meshTools } from "./tools/mesh";
import { timelineTools } from "./tools/timeline";
import { cinemachineTools } from "./tools/cinemachine";
import { probuilderTools } from "./tools/probuilder";
import { inputTools } from "./tools/input";
import { shaderTools } from "./tools/shader";
import { networkingTools } from "./tools/networking";
import { twodTools } from "./tools/twod";
import { splineTools } from "./tools/spline";
import { visualScriptingTools } from "./tools/visualscripting";
import { ragdollTools } from "./tools/ragdoll";
import { clothTools } from "./tools/cloth";
import { decalTools } from "./tools/decal";
import { xrTools } from "./tools/xr";
import { aiTools } from "./tools/ai";
import { lodTools } from "./tools/lod";
import { gizmoTools } from "./tools/gizmo";
import { reflectionProbeTools } from "./tools/reflectionprobe";
import { lightmapTools } from "./tools/lightmap";
import { occlusionTools } from "./tools/occlusion";
import { streamingTools } from "./tools/streaming";
import { tagManagerTools } from "./tools/tagmanager";
import { screenshotTools } from "./tools/screenshot";
import { ueSceneTools } from "./tools/ue_scene";
import { ueTransformTools } from "./tools/ue_transform";
import { ueMaterialTools } from "./tools/ue_material";
import { ueLightingTools } from "./tools/ue_lighting";
import { ueLandscapeTools } from "./tools/ue_landscape";
import { ueAudioTools } from "./tools/ue_audio";
import { ueCameraTools } from "./tools/ue_camera";
import { ueMeshTools } from "./tools/ue_mesh";
import { ueBlueprintTools } from "./tools/ue_blueprint";
import { ueNiagaraTools } from "./tools/ue_niagara";
import { ueAnimationTools } from "./tools/ue_animation";
import { ueUiTools } from "./tools/ue_ui";
import { ueAiTools } from "./tools/ue_ai";
import { uePhysicsTools } from "./tools/ue_physics";
import { ueSequencerTools } from "./tools/ue_sequencer";
import { ueBuildTools } from "./tools/ue_build";
import { ueLevelTools } from "./tools/ue_level";
import { ueFoliageTools } from "./tools/ue_foliage";
import { uePcgTools } from "./tools/ue_pcg";
import { ueMetahumanTools } from "./tools/ue_metahuman";
import { blObjectTools } from "./tools/bl_object";
import { blMeshTools } from "./tools/bl_mesh";
import { blMaterialTools } from "./tools/bl_material";
import { blModifierTools } from "./tools/bl_modifier";
import { blSculptTools } from "./tools/bl_sculpt";
import { blAnimationTools } from "./tools/bl_animation";
import { blCameraTools } from "./tools/bl_camera";
import { blLightTools } from "./tools/bl_light";
import { blRenderTools } from "./tools/bl_render";
import { blSceneTools } from "./tools/bl_scene";
import { blExecuteTools } from "./tools/bl_execute";
import { blNodeTools } from "./tools/bl_node";
import { blUVTools } from "./tools/bl_uv";
import { blParticleTools } from "./tools/bl_particle";
import { blArmatureTools } from "./tools/bl_armature";
import { blGreasePencilTools } from "./tools/bl_greasepencil";
import { vrchatTools } from "./tools/vrchat";
import { addressablesTools } from "./tools/addressables";
import { localizationTools } from "./tools/localization";
import { debugTools } from "./tools/debug";
import { testingTools } from "./tools/testing";
import { profilerTools } from "./tools/profiler";

// ===== Phase 5: New Low-level Tools =====
import { inputSystemTools } from "./tools/input_system";
import { textmeshproTools } from "./tools/textmeshpro";
import { tilemapTools } from "./tools/tilemap";
import { ueUmgTools } from "./tools/ue_umg";
import { ueEnhancedInputTools } from "./tools/ue_enhanced_input";
import { ueMetaSoundTools, ueControlRigTools } from "./tools/ue_metasound_controlrig";
import { blGeometryNodesTools } from "./tools/bl_geometry_nodes";
import { blCompositorTools } from "./tools/bl_compositor";
import { blTexturePaintTools } from "./tools/bl_texture_paint";
import { blVseTools } from "./tools/bl_vse";

// ===== Phase 5: Recipe System =====
import { recipeSceneTools } from "./tools/recipe_scenes";
import { recipeProjectTools } from "./tools/recipe_project";
import { recipePipelineTools } from "./tools/recipe_pipeline";

// ===== Phase 5: Character Creation =====
import { blCharacterBodyTools } from "./tools/bl_character_body";
import { blCharacterFaceTools } from "./tools/bl_character_face";
import { blCharacterHairTools } from "./tools/bl_character_hair";
import { blCharacterMaterialTools } from "./tools/bl_character_material";
import { blCharacterExpressionTools } from "./tools/bl_character_expression";
import { blCharacterExportTools } from "./tools/bl_character_export";
import { blCharacterClothingTools } from "./tools/bl_character_clothing";
import { unityVrchatTools } from "./tools/unity_vrchat";
import { imageTo3dTools } from './tools/image_to_3d';
import { bridge } from './bridge';


// Register all tools
const allTools = [
  ...sceneTools, ...transformTools, ...materialTools, ...lightingTools,
  ...terrainTools, ...audioTools, ...cameraTools, ...physicsTools,
  ...vfxTools, ...animationTools, ...uiTools, ...optimizationTools,
  ...componentTools, ...prefabTools, ...layertagTools, ...environmentTools,
  ...navigationTools, ...postProcessingTools, ...scriptTools,
  ...renderTools, ...assetTools, ...editorTools,
  ...selectionTools, ...constraintTools, ...buildTools,
  ...meshTools, ...timelineTools,
  ...cinemachineTools, ...probuilderTools, ...inputTools, ...shaderTools, ...networkingTools, ...twodTools,
  ...splineTools,
  ...visualScriptingTools,
  ...ragdollTools,
  ...clothTools,
  ...decalTools,
  ...xrTools,
  ...aiTools,
  ...lodTools,
  ...gizmoTools,
  ...reflectionProbeTools,
  ...lightmapTools,
  ...occlusionTools,
  ...streamingTools,
  ...tagManagerTools,
  ...screenshotTools,
  ...ueSceneTools,
  ...ueTransformTools,
  ...ueMaterialTools,
  ...ueLightingTools,
  ...ueLandscapeTools,
  ...ueAudioTools,
  ...ueCameraTools,
  ...ueMeshTools,
  ...ueBlueprintTools,
  ...ueNiagaraTools,
  ...ueAnimationTools,
  ...ueUiTools,
  ...ueAiTools,
  ...uePhysicsTools,
  ...ueSequencerTools,
  ...ueBuildTools,
  ...ueLevelTools,
  ...ueFoliageTools,
  ...uePcgTools,
  ...ueMetahumanTools,
    ...blObjectTools,
    ...blMeshTools,
    ...blMaterialTools,
    ...blModifierTools,
    ...blSculptTools,
    ...blAnimationTools,
    ...blCameraTools,
    ...blLightTools,
    ...blRenderTools,
    ...blSceneTools,

    ...blExecuteTools,
    ...blNodeTools,
    ...blUVTools,
    ...blParticleTools,
    ...blArmatureTools,
  ...vrchatTools, ...debugTools, ...testingTools, ...profilerTools,
  // ===== Phase 5: Low-level Tools =====
  ...inputSystemTools,
  ...addressablesTools,
  ...textmeshproTools,
  ...tilemapTools,
  ...localizationTools,
  ...ueUmgTools,
  ...ueEnhancedInputTools,
  ...ueMetaSoundTools,
  ...ueControlRigTools,
  ...blGeometryNodesTools,
  ...blCompositorTools,
  ...blGreasePencilTools,
  ...blTexturePaintTools,
  ...blVseTools,
  // ===== Phase 5: Recipe System =====
  ...recipeSceneTools,
  ...recipeProjectTools,
  ...recipePipelineTools,
  // ===== Phase 5: Character Creation =====
  ...blCharacterBodyTools,
  ...blCharacterFaceTools,
  ...blCharacterHairTools,
  ...blCharacterMaterialTools,
  ...blCharacterExpressionTools,
  ...blCharacterExportTools,
  ...blCharacterClothingTools,
  ...unityVrchatTools,
  ...imageTo3dTools,
];

allTools.forEach(tool => { if (tool) globalRegistry.register(tool); });
console.error(`[ARCANA] ${allTools.length} tools registered across ${new Set(allTools.filter(Boolean).map(t => t!.category)).size} categories`);

// Start WebSocket bridges for Unity/UE/Blender
bridge.start();

const server = new Server({ name: "arcana-mcp-server", version: ARCANA_SERVER_VERSION }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: "arcana_discover", description: "Search available ARCANA tools by keyword or category", inputSchema: { type: "object", properties: { query: { type: "string", description: "Search keyword or category name" } }, required: ["query"] } },
    { name: "arcana_inspect", description: "Get full schema and details for a specific tool", inputSchema: { type: "object", properties: { toolId: { type: "string", description: "Tool ID to inspect" } }, required: ["toolId"] } },
    { name: "arcana_execute", description: "Execute any ARCANA tool with parameters", inputSchema: { type: "object", properties: { toolId: { type: "string", description: "Tool ID to execute" }, params: { type: "object", description: "Tool parameters" } }, required: ["toolId"] } },
    { name: "arcana_status", description: "Check which editors (Unity/UE/Blender) are currently connected", inputSchema: { type: "object", properties: {} } },
        {
          name: "arcana_compose", description: "Execute multiple tools in sequence", inputSchema: { type: "object", properties: { steps: { type: "array", items: { type: "object", properties: { toolId: { type: "string" }, params: { type: "object" } }, required: ["toolId"] } } }, required: ["steps"] } }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  let result: any;
  switch (name) {
    case "arcana_discover": result = await superSave.discover({ query: args?.query as string, category: args?.category as string }); break;
    case "arcana_inspect": result = await superSave.inspect({ toolId: args?.toolId as string }); break;
    case "arcana_execute": result = await superSave.execute({ toolId: args?.toolId as string, params: (args?.params as Record<string, any>) || {} }); break;
    case "arcana_status": result = { success: true, message: "Editor status", data: bridge.getStatus() }; break;
    case "arcana_compose": result = await superSave.compose({ steps: args?.steps as any[] }); break;
    default: result = { success: false, message: `Unknown tool: ${name}` };
  }
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[ARCANA] MCP Server running (v${ARCANA_SERVER_VERSION}, ${globalRegistry.count()} tools)`);
}

main().catch(console.error);
