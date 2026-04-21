/**
 * Single source of truth for every MCP tool definition (used by index + smoke tests).
 */

import type { ToolDefinition } from "./core/registry";

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
import { recipeSceneTools } from "./tools/recipe_scenes";
import { recipeProjectTools } from "./tools/recipe_project";
import { recipePipelineTools } from "./tools/recipe_pipeline";
import { blCharacterBodyTools } from "./tools/bl_character_body";
import { blCharacterFaceTools } from "./tools/bl_character_face";
import { blCharacterHairTools } from "./tools/bl_character_hair";
import { blCharacterMaterialTools } from "./tools/bl_character_material";
import { blCharacterExpressionTools } from "./tools/bl_character_expression";
import { blCharacterExportTools } from "./tools/bl_character_export";
import { blCharacterClothingTools } from "./tools/bl_character_clothing";
import { unityVrchatTools } from "./tools/unity_vrchat";
import { imageTo3dTools } from "./tools/image_to_3d";

export const ALL_TOOL_DEFINITIONS: ToolDefinition[] = [
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
  ...recipeSceneTools,
  ...recipeProjectTools,
  ...recipePipelineTools,
  ...blCharacterBodyTools,
  ...blCharacterFaceTools,
  ...blCharacterHairTools,
  ...blCharacterMaterialTools,
  ...blCharacterExpressionTools,
  ...blCharacterExportTools,
  ...blCharacterClothingTools,
  ...unityVrchatTools,
  ...imageTo3dTools,
].filter(Boolean) as ToolDefinition[];
