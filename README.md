<p align="center">
  <img src="image/TOP.png" alt="ARCANA Banner" width="100%">
</p>

<h1 align="center">ARCANA</h1>
<p align="center"><strong>Advanced Runtime for Creative AI & Natural-language Automation</strong></p>
<p align="center">Control <b>Unity</b>, <b>Unreal Engine</b>, and <b>Blender</b> with natural language.<br>Free and open source, forever.</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/Tools-438-brightgreen.svg" alt="438 Tools">
  <img src="https://img.shields.io/badge/Categories-66-orange.svg" alt="66 Categories">
  <img src="https://img.shields.io/badge/Unity-2022.3+-black?logo=unity" alt="Unity 2022.3+">
  <img src="https://img.shields.io/badge/Unreal_Engine-5.x-black?logo=unrealengine" alt="UE 5.x">
  <img src="https://img.shields.io/badge/Blender-3.6+-orange?logo=blender" alt="Blender 3.6+">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white" alt="Node 18+">
  <img src="https://img.shields.io/badge/MCP-Compatible-purple" alt="MCP Compatible">
</p>

<p align="center"><a href="README_ja.md">日本語</a> | English</p>

---

## Why ARCANA?

Most MCP editor tools support one editor with 20-60 tools.
ARCANA provides **438 tools across 3 editors and 66 categories** from a single server.

| | ARCANA | Unity-MCP | Blender-MCP | Unreal-MCP |
|---|---|---|---|---|
| **Tools** | **438** | ~20 | ~15 | ~30 |
| **Editors** | Unity + UE + Blender | Unity | Blender | UE |
| **SuperSave** | 4 meta-tools | - | - | - |

## What is ARCANA?

ARCANA connects AI assistants (Claude, ChatGPT, Gemini, Copilot, Cursor) to **Unity**, **Unreal Engine**, and **Blender** via the [Model Context Protocol](https://modelcontextprotocol.io/). Describe what you want in plain language and ARCANA executes it.

## Key Features

- **438 Tools / 66 Categories** - Unity 302, Unreal Engine 136, Blender planned
- **3 Editor Support** - One server controls Unity, UE, and Blender
- **Natural Language** - Describe what you want, AI does it
- **Any AI Client** - Claude Desktop, Cursor, VS Code, ChatGPT, Gemini CLI
- **SuperSave Mode** - 4 meta-tools reduce token usage ~98%
- **Bridge Architecture** - WebSocket per editor (Unity :9877, UE :9878, Blender :9879)
- **Open Source** - MIT, free forever
- **Bilingual** - English + Japanese
- **Undo Safe** - Unity tools support Undo/Redo

## Architecture

```
AI Client           MCP            ARCANA Server        Editors
Claude, Cursor  <==========>  Node.js/TypeScript  ----> Unity   :9877
ChatGPT, etc.    stdio/SSE    438 tools / 66 cat  ----> UE 5    :9878
                                                  ----> Blender :9879
```
## Tool Overview

### Unity Tools (302 tools / 46 categories)

<details>
<summary>Click to expand Unity tool list</summary>

| Category | Count | Examples |
|----------|-------|---------|
| Scene | 3 | scene_list_objects, scene_create_gameobject, scene_delete_gameobject |
| Transform | 5 | transform_set_position, transform_set_rotation, transform_set_scale |
| Material | 5 | material_set_color, material_set_transparency, material_set_emission |
| Lighting | 5 | lighting_create_light, lighting_set_color, lighting_set_intensity |
| Terrain | 4 | terrain_create, terrain_set_height, terrain_add_texture |
| Audio | 3 | audio_add_source, audio_set_volume, audio_set_spatial |
| Camera | 3 | camera_create, camera_set_fov, camera_set_background |
| Physics | 3 | physics_add_rigidbody, physics_add_collider, physics_set_gravity |
| VFX | 4 | vfx_create_particle, vfx_set_color, vfx_set_speed |
| Animation | 4 | anim_add_animator, anim_set_parameter, anim_play |
| UI | 4 | ui_create_canvas, ui_create_text, ui_create_button |
| Optimization | 4 | opt_get_scene_stats, opt_set_static, opt_add_lod_group |
| Component | 4 | component_add, component_remove, component_set_enabled |
| Prefab | 3 | prefab_create, prefab_instantiate, prefab_unpack |
| Layer / Tag | 3 | layertag_set_layer, layertag_set_tag, layertag_rename |
| Environment | 3 | env_set_skybox, env_set_fog, env_set_reflection |
| Navigation | 4 | nav_bake, nav_add_agent, nav_add_obstacle |
| PostProcessing | 5 | post_set_bloom, post_set_color_adjust, post_set_dof |
| Script | 4 | script_create, script_attach, script_set_variable |
| Selection | 4 | select_object, select_all, select_none |
| Constraint | 4 | constraint_position, constraint_rotation, constraint_scale |
| Build | 6 | build_set_platform, build_add_scene, build_execute |
| Render | 4 | render_screenshot, render_set_resolution, render_set_quality |
| Asset | 5 | asset_import, asset_delete, asset_rename |
| Editor | 5 | editor_play_mode, editor_save_scene, editor_load_scene |
| Mesh | 6 | mesh_combine, mesh_separate, mesh_export |
| Timeline | 6 | timeline_create, timeline_add_track, timeline_add_clip |
| Cinemachine | 6 | cm_create, cm_set_follow, cm_set_look_at |
| ProBuilder | 6 | pb_create_shape, pb_extrude_face, pb_set_material |
| Input System | 6 | input_create_action, input_add_binding, input_enable |
| Shader | 6 | shader_create_graph, shader_add_node, shader_connect |
| Networking | 6 | net_setup, net_spawn, net_send_rpc |
| 2D | 6 | 2d_create_sprite, 2d_set_sorting_layer, 2d_create_tilemap |
| VRChat | 10 | vrc_setup_avatar, vrc_add_mirror, vrc_add_pickup |
| Addressables | 6 | addr_mark, addr_create_group, addr_build |
| Localization | 6 | loc_create_table, loc_add_entry, loc_add_locale |
| Debug | 10 | debug_log, debug_draw_ray, debug_draw_line |
| Testing | 8 | test_create, test_run, test_assert |
| Profiler | 10 | prof_cpu_start, prof_mem_snapshot, prof_gpu |
| XR / VR | 10 | xr_setup, xr_tracking, xr_controller |
| AI / NavAgent | 8 | ai_set_destination, ai_patrol, ai_chase |
| Spline | 8 | spline_create, spline_add_knot, spline_animate |
| Visual Scripting | 8 | vs_create_graph, vs_add_node, vs_connect_nodes |
| Ragdoll | 6 | ragdoll_create, ragdoll_enable, ragdoll_set_joint_limits |
| Cloth | 5 | cloth_add, cloth_set_params, cloth_set_gravity |
| Decal | 5 | decal_create, decal_set_size, decal_set_material |
| LOD | 6 | lod_create_group, lod_set_transitions, lod_assign_renderer |
| Gizmo | 6 | gizmo_draw_sphere, gizmo_draw_cube, gizmo_draw_line |
| Reflection Probe | 6 | probe_create, probe_set_size, probe_bake |
| Lightmap | 6 | lightmap_bake, lightmap_set_resolution, lightmap_clear |
| Occlusion | 6 | occlusion_bake, occlusion_set_occluder, occlusion_clear |
| Streaming | 6 | streaming_load_scene, streaming_unload_scene, streaming_preload |
| Tag Manager | 4 | tagmgr_add_tag, tagmgr_add_layer, tagmgr_list_all |
| Screenshot | 4 | screenshot_game_view, screenshot_scene_view, screenshot_360 |

</details>

### Unreal Engine Tools (136 tools / 20 categories)

<details>
<summary>Click to expand Unreal Engine tool list</summary>

| Category | Count | Examples |
|----------|-------|---------|
| UE Scene | 6 | ue_scene_list_actors, ue_scene_spawn_actor, ue_scene_delete_actor |
| UE Transform | 6 | ue_transform_set_location, ue_transform_set_rotation, ue_transform_set_scale |
| UE Material | 8 | ue_material_create, ue_material_set_color, ue_material_set_metallic |
| UE Lighting | 6 | ue_light_create, ue_light_set_color, ue_light_set_intensity |
| UE Landscape | 8 | ue_landscape_create, ue_landscape_sculpt, ue_landscape_paint |
| UE Audio | 6 | ue_audio_add_component, ue_audio_set_volume, ue_audio_set_spatial |
| UE Camera | 6 | ue_camera_create, ue_camera_set_fov, ue_camera_set_active |
| UE Mesh | 6 | ue_mesh_import, ue_mesh_set_collision, ue_mesh_set_nanite |
| UE Blueprint | 10 | ue_bp_create, ue_bp_add_component, ue_bp_compile |
| UE Niagara | 6 | ue_niagara_create, ue_niagara_set_param, ue_niagara_set_spawn_rate |
| UE Animation | 6 | ue_anim_import, ue_anim_play, ue_anim_create_blendspace |
| UE UI / UMG | 6 | ue_ui_create_widget, ue_ui_add_text, ue_ui_add_button |
| UE AI | 8 | ue_ai_create_bt, ue_ai_create_bb, ue_ai_run_bt |
| UE Physics | 6 | ue_physics_enable, ue_physics_set_mass, ue_physics_add_force |
| UE Sequencer | 8 | ue_seq_create, ue_seq_add_track, ue_seq_render_movie |
| UE Build | 6 | ue_build_set_platform, ue_build_package, ue_build_cook |
| UE Level | 6 | ue_level_create, ue_level_open, ue_level_save |
| UE Foliage | 6 | ue_foliage_add_type, ue_foliage_paint, ue_foliage_erase |
| UE PCG | 6 | ue_pcg_create_graph, ue_pcg_add_node, ue_pcg_execute |
| UE MetaHuman | 6 | ue_mh_spawn, ue_mh_set_body, ue_mh_set_face |

</details>
## SuperSave Mode

Instead of registering all 438 tools, SuperSave exposes only **4 meta-tools**:

| Meta-Tool | Purpose |
|---|---|
| arcana.discover | Search tools by keyword or category |
| arcana.inspect | Get full schema for a specific tool |
| arcana.execute | Run any tool by ID with parameters |
| arcana.compose | Chain multiple tools into a pipeline |

Token usage reduced by approximately **98%**.

## Quick Start

### Requirements

- Node.js 18+
- Unity 2022.3+ / Unreal Engine 5.x / Blender 3.6+ (any combination)
- MCP-compatible AI client (Claude Desktop, Cursor, VS Code, etc.)

### Installation

```bash
git clone https://github.com/matrix9neonebuchadnezzar2199-sketch/ARCANA.git
cd ARCANA/server
npm install
npm run build
```

### Unity Setup

1. Import the `unity-plugin` folder into your Unity project
2. Open Unity > Tools > ARCANA > Setup
3. WebSocket bridge starts on localhost:9877

### Unreal Engine Setup

1. Copy the `ue-plugin` folder into your project Plugins directory
2. Enable ARCANA plugin in Edit > Plugins
3. WebSocket bridge starts on localhost:9878

### Try It

**Unity:**
```
"List all GameObjects in the current Unity scene"
"Create a red cube at position (0, 5, 0)"
"Add a point light above the cube with soft shadows"
```

**Unreal Engine:**
```
"List all actors in the current level"
"Spawn a cube at location (0, 0, 200)"
"Create a point light with 5000 lumens and warm temperature"
```

## Roadmap

| Phase | Status | Content |
|---|---|---|
| 1 | Done | Core MCP server, SuperSave, Bridge architecture |
| 2 | Done | Unity 302 tools (46 categories) |
| 3 | Done | Unreal Engine 136 tools (20 categories) |
| 4 | Next | Blender addon + 100-200 Blender tools |
| 5 | Planned | Cross-editor workflows, 600+ tools, Recipe system |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. All skill levels welcome.

## Acknowledgements

- [Synaptic AI Pro](https://synaptic-ai.net/) - Inspiration and proof of concept
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol standard
- [Unity-MCP](https://github.com/IvanMurzak/Unity-MCP) - Architecture reference

## License

MIT License. See [LICENSE](LICENSE) for details.