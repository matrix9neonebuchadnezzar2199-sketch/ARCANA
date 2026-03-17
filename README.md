<p align="center">
  <img src="image/TOP.png" alt="ARCANA Banner" width="100%">
</p>

<h1 align="center">ARCANA</h1>
<p align="center"><strong>Advanced Runtime for Creative AI & Natural-language Automation</strong></p>
<p align="center">Control Unity and Blender with natural language. Free and open source, forever.</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/tools-302-brightgreen.svg" alt="57 Tools">
  <img src="https://img.shields.io/badge/unity-2022.3%2B-black.svg" alt="Unity 2022.3+">
  <img src="https://img.shields.io/badge/node-18%2B-green.svg" alt="Node 18+">
  <img src="https://img.shields.io/badge/MCP-compatible-purple.svg" alt="MCP Compatible">
</p>

<p align="center">
  <a href="README_ja.md">日本語</a> | English
</p>

---

## What is ARCANA?

ARCANA connects AI assistants (Claude, ChatGPT, Gemini, Copilot, etc.) to Unity Editor and Blender via the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/). Instead of clicking through menus and adjusting parameters manually, you describe what you want in plain language and ARCANA executes it.


## Features

- **302 Tools** across 46 categories, covering scene, transform, material, lighting, terrain, audio, camera, physics, VFX, animation, UI, optimization, component, prefab, layer/tag, environment, navigation, postprocessing, script, selection, constraint, build, render, asset, editor, mesh, timeline, cinemachine, probuilder, input system, shader, networking, 2D, XR/VR, AI/nav, spline, visual scripting, ragdoll, cloth, decal, VRChat, addressables, localization, debug, testing, profiler, LOD, gizmo, reflection probe, lightmap, occlusion culling, streaming, tag manager, and screenshot
- **Natural Language Control** - Describe what you want, AI executes it in Unity/Blender
- **Any AI Client** - Works with Claude Desktop, Cursor, VS Code, ChatGPT, Gemini CLI
- **SuperSave Mode** - 4 meta-tools dynamically load all tools, reducing token usage by ~98%
- **Unity + Blender** - One server controls both editors simultaneously
- **Open Source** - MIT License, free forever, community-driven
- **Bilingual** - English and Japanese support
- **Undo Safe** - Every tool supports Unity Undo/Redo

## Architecture

![ARCANA to Unity and Blender](image/ARCANA%20to%20Unity%26Blender.png)


## Tool List (302 tools)

### Scene (3)
| Tool ID | Description |
|---------|-------------|
| `scene_list_objects` | List all GameObjects in the scene |
| `scene_create_gameobject` | Create a new GameObject with optional primitive, position, color |
| `scene_delete_gameobject` | Delete a GameObject by name |

### Transform (5)
| Tool ID | Description |
|---------|-------------|
| `transform_set_position` | Set world position |
| `transform_set_rotation` | Set rotation in euler angles |
| `transform_set_scale` | Set local scale |
| `transform_set_parent` | Set parent-child relationship |
| `transform_look_at` | Make object face a target position |

### Material (5)
| Tool ID | Description |
|---------|-------------|
| `material_set_color` | Set main color |
| `material_set_transparency` | Set alpha with automatic render mode |
| `material_set_emission` | Enable emission with color and intensity |
| `material_set_shader` | Change shader |
| `material_set_texture` | Set main texture from file |

### Lighting (5)
| Tool ID | Description |
|---------|-------------|
| `lighting_create_light` | Create Directional/Point/Spot/Area light |
| `lighting_set_color` | Change light color |
| `lighting_set_intensity` | Change light intensity |
| `lighting_set_shadow` | Set shadow mode (None/Hard/Soft) |
| `lighting_set_ambient` | Set ambient light color and intensity |

### Terrain (4)
| Tool ID | Description |
|---------|-------------|
| `terrain_create` | Create terrain with custom size |
| `terrain_set_height` | Set height at normalized position |
| `terrain_add_texture` | Add texture layer |
| `terrain_add_trees` | Place tree instances |

### Audio (3)
| Tool ID | Description |
|---------|-------------|
| `audio_add_source` | Add AudioSource with clip, loop, volume |
| `audio_set_volume` | Set volume |
| `audio_set_spatial` | Configure 3D spatial audio |

### Camera (3)
| Tool ID | Description |
|---------|-------------|
| `camera_create` | Create camera with position and FOV |
| `camera_set_fov` | Set field of view |
| `camera_set_background` | Set background color and clear flags |

### Physics (3)
| Tool ID | Description |
|---------|-------------|
| `physics_add_rigidbody` | Add Rigidbody with mass, gravity, kinematic |
| `physics_add_collider` | Add Box/Sphere/Capsule/Mesh collider |
| `physics_set_gravity` | Set global scene gravity |

### VFX (4)
| Tool ID | Description |
|---------|-------------|
| `vfx_create_particle` | Create particle system |
| `vfx_set_color` | Set particle start color |
| `vfx_set_speed` | Set particle speed and lifetime |
| `vfx_set_shape` | Set emission shape |

### Animation (4)
| Tool ID | Description |
|---------|-------------|
| `anim_add_animator` | Add Animator with controller |
| `anim_set_parameter` | Set Animator parameter (float/int/bool/trigger) |
| `anim_play` | Play animation state |
| `anim_create_clip` | Create animation clip with position keyframes |

### UI (4)
| Tool ID | Description |
|---------|-------------|
| `ui_create_canvas` | Create Canvas with render mode |
| `ui_create_text` | Create text element |
| `ui_create_button` | Create button with label |
| `ui_create_image` | Create image element |

### Optimization (4)
| Tool ID | Description |
|---------|-------------|
| `opt_get_scene_stats` | Get object/triangle/material counts |
| `opt_set_static` | Set static flags for batching |
| `opt_add_lod_group` | Add LOD Group |
| `opt_remove_missing_scripts` | Remove all missing scripts |

### Component (4)
| Tool ID | Description |
|---------|-------------|
| `component_add` | Add any component by type name |
| `component_remove` | Remove component by type name |
| `component_set_enabled` | Enable/disable component |
| `component_list` | List all components on object |

### Prefab (3)
| Tool ID | Description |
|---------|-------------|
| `prefab_create` | Save GameObject as prefab |
| `prefab_instantiate` | Instantiate prefab into scene |
| `prefab_unpack` | Unpack prefab instance |

### Layer / Tag (3)
| Tool ID | Description |
|---------|-------------|
| `layertag_set_layer` | Set layer with optional children |
| `layertag_set_tag` | Set tag |
| `layertag_rename` | Rename GameObject |

### Environment (3)
| Tool ID | Description |
|---------|-------------|
| `env_set_skybox` | Set skybox material |
| `env_set_fog` | Configure fog (linear/exponential) |
| `env_set_reflection` | Set reflection source and intensity |

### Navigation (4)
| Tool ID | Description |
|---------|-------------|
| `nav_bake` | Bake NavMesh |
| `nav_add_agent` | Add NavMeshAgent |
| `nav_add_obstacle` | Add NavMeshObstacle |
| `nav_add_link` | Add OffMeshLink |

### PostProcessing (5)
| Tool ID | Description |
|---------|-------------|
| `post_set_bloom` | Set Bloom effect |
| `post_set_color_adjust` | Set Color Adjustments |
| `post_set_dof` | Set Depth of Field |
| `post_set_vignette` | Set Vignette |
| `post_set_motion_blur` | Set Motion Blur |

### Script (4)
| Tool ID | Description |
|---------|-------------|
| `script_create` | Create a new C# script |
| `script_attach` | Attach script to GameObject |
| `script_set_variable` | Set a public variable on a script |
| `script_invoke_method` | Invoke a method on a script |

### Selection (4)
| Tool ID | Description |
|---------|-------------|
| `select_object` | Select a GameObject in the editor |
| `select_all` | Select all GameObjects |
| `select_none` | Deselect all |
| `select_invert` | Invert current selection |

### Constraint (4)
| Tool ID | Description |
|---------|-------------|
| `constraint_position` | Add Position Constraint |
| `constraint_rotation` | Add Rotation Constraint |
| `constraint_scale` | Add Scale Constraint |
| `constraint_aim` | Add Aim Constraint |

### Build (6)
| Tool ID | Description |
|---------|-------------|
| `build_set_platform` | Set build target platform |
| `build_add_scene` | Add scene to build settings |
| `build_set_player` | Set player settings |
| `build_execute` | Execute build |
| `build_get_settings` | Get current build settings |
| `build_clean` | Clean build cache |

### Render (4)
| Tool ID | Description |
|---------|-------------|
| `render_screenshot` | Take a screenshot |
| `render_set_resolution` | Set game resolution |
| `render_set_quality` | Set quality level |
| `render_capture_cubemap` | Capture cubemap |

### Asset (5)
| Tool ID | Description |
|---------|-------------|
| `asset_import` | Import asset from file |
| `asset_delete` | Delete asset |
| `asset_rename` | Rename asset |
| `asset_move` | Move asset to folder |
| `asset_refresh` | Refresh AssetDatabase |

### Editor (5)
| Tool ID | Description |
|---------|-------------|
| `editor_play_mode` | Toggle Play/Stop mode |
| `editor_save_scene` | Save current scene |
| `editor_load_scene` | Load a scene |
| `editor_undo_redo` | Undo or Redo |
| `editor_clear_console` | Clear console |

### Mesh (6)
| Tool ID | Description |
|---------|-------------|
| `mesh_combine` | Combine meshes |
| `mesh_separate` | Separate mesh |
| `mesh_set_vertices` | Set vertex positions |
| `mesh_recalculate` | Recalculate normals/bounds |
| `mesh_export` | Export mesh to OBJ/FBX |
| `mesh_get_info` | Get mesh information |

### Timeline (6)
| Tool ID | Description |
|---------|-------------|
| `timeline_create` | Create Timeline asset |
| `timeline_add_track` | Add track to timeline |
| `timeline_add_clip` | Add clip to track |
| `timeline_set_duration` | Set timeline duration |
| `timeline_bind_object` | Bind object to track |
| `timeline_play` | Play timeline |

### Cinemachine (6)
| Tool ID | Description |
|---------|-------------|
| `cm_create` | Create Cinemachine virtual camera |
| `cm_set_follow` | Set follow target |
| `cm_set_look_at` | Set look-at target |
| `cm_set_blend` | Set camera blend |
| `cm_set_noise` | Set camera noise profile |
| `cm_create_freelook` | Create FreeLook camera |

### ProBuilder (6)
| Tool ID | Description |
|---------|-------------|
| `pb_create_shape` | Create ProBuilder shape |
| `pb_extrude_face` | Extrude face |
| `pb_set_material` | Set face material |
| `pb_merge` | Merge objects |
| `pb_subdivide` | Subdivide mesh |
| `pb_export` | Export to OBJ |

### Input System (6)
| Tool ID | Description |
|---------|-------------|
| `input_create_action` | Create input action |
| `input_add_binding` | Add binding to action |
| `input_enable` | Enable/disable action |
| `input_create_map` | Create action map |
| `input_read_value` | Read input value |
| `input_remove_binding` | Remove binding |

### Shader (6)
| Tool ID | Description |
|---------|-------------|
| `shader_create_graph` | Create Shader Graph |
| `shader_add_node` | Add node to graph |
| `shader_connect` | Connect shader nodes |
| `shader_set_property` | Set shader property |
| `shader_compile` | Compile shader |
| `shader_assign` | Assign shader to material |

### Networking (6)
| Tool ID | Description |
|---------|-------------|
| `net_setup` | Setup networking |
| `net_spawn` | Spawn networked object |
| `net_send_rpc` | Send RPC |
| `net_sync_var` | Sync variable |
| `net_connect` | Connect to server |
| `net_disconnect` | Disconnect |

### 2D (6)
| Tool ID | Description |
|---------|-------------|
| `2d_create_sprite` | Create sprite object |
| `2d_set_sorting_layer` | Set sorting layer and order |
| `2d_create_tilemap` | Create tilemap |
| `2d_set_tile` | Place tile on tilemap |
| `2d_add_collider` | Add 2D collider |
| `2d_add_animator` | Add 2D animator |

### VRChat (10)
| Tool ID | Description |
|---------|-------------|
| `vrc_setup_avatar` | Setup VRChat avatar |
| `vrc_add_mirror` | Add VRC mirror |
| `vrc_add_pickup` | Add VRC pickup |
| `vrc_set_spawn` | Set spawn point |
| `vrc_add_portal` | Add world portal |
| `vrc_setup_station` | Setup station/chair |
| `vrc_add_trigger` | Add VRC trigger |
| `vrc_set_layer` | Set VRC layer |
| `vrc_optimize` | Optimize for VRChat |
| `vrc_validate` | Validate avatar/world |

### Addressables (6)
| Tool ID | Description |
|---------|-------------|
| `addr_mark` | Mark asset as addressable |
| `addr_create_group` | Create addressable group |
| `addr_set_address` | Set asset address |
| `addr_build` | Build addressables |
| `addr_load` | Load addressable at runtime |
| `addr_release` | Release addressable |

### Localization (6)
| Tool ID | Description |
|---------|-------------|
| `loc_create_table` | Create string table |
| `loc_add_entry` | Add localized entry |
| `loc_add_locale` | Add locale |
| `loc_set_active` | Set active locale |
| `loc_export` | Export localization |
| `loc_import` | Import localization |

### Debug (10)
| Tool ID | Description |
|---------|-------------|
| `debug_log` | Log message |
| `debug_draw_ray` | Draw debug ray |
| `debug_draw_line` | Draw debug line |
| `debug_draw_sphere` | Draw debug sphere |
| `debug_break` | Pause editor |
| `debug_clear` | Clear debug draws |
| `debug_time_scale` | Set time scale |
| `debug_fps` | Show FPS overlay |
| `debug_bounds` | Show object bounds |
| `debug_hierarchy` | Print hierarchy tree |

### Testing (8)
| Tool ID | Description |
|---------|-------------|
| `test_create` | Create test class |
| `test_run` | Run tests |
| `test_assert` | Add assertion |
| `test_mock` | Create mock object |
| `test_perf` | Performance test |
| `test_coverage` | Check coverage |
| `test_report` | Generate report |
| `test_cleanup` | Cleanup test data |

### Profiler (10)
| Tool ID | Description |
|---------|-------------|
| `prof_cpu_start` | Start CPU profiling |
| `prof_cpu_stop` | Stop CPU profiling |
| `prof_mem_snapshot` | Memory snapshot |
| `prof_gpu` | GPU profiling |
| `prof_frame` | Frame analysis |
| `prof_bottleneck` | Detect bottlenecks |
| `prof_drawcalls` | Analyze draw calls |
| `prof_batches` | Analyze batches |
| `prof_heap` | Heap analysis |
| `prof_save` | Save profiler data |

### XR / VR (10)
| Tool ID | Description |
|---------|-------------|
| `xr_setup` | Setup XR environment |
| `xr_tracking` | Configure tracking |
| `xr_controller` | Setup controller |
| `xr_haptics` | Send haptic feedback |
| `xr_teleport` | Setup teleportation |
| `xr_grab` | Enable grab interaction |
| `xr_ray_interaction` | Setup ray interaction |
| `xr_ui` | Setup XR UI canvas |
| `xr_passthrough` | Toggle passthrough |
| `xr_boundary` | Set play boundary |

### AI / NavAgent (8)
| Tool ID | Description |
|---------|-------------|
| `ai_set_destination` | Set agent destination |
| `ai_patrol` | Set patrol waypoints |
| `ai_chase` | Chase target |
| `ai_flee` | Flee from threat |
| `ai_idle` | Set idle state |
| `ai_set_speed` | Set agent speed |
| `ai_avoidance` | Set avoidance priority |
| `ai_visualize_path` | Visualize nav path |

### Spline (8)
| Tool ID | Description |
|---------|-------------|
| `spline_create` | Create spline container |
| `spline_add_knot` | Add control point |
| `spline_remove_knot` | Remove control point |
| `spline_set_tangent` | Set knot tangent |
| `spline_animate` | Animate along spline |
| `spline_extrude` | Extrude mesh along spline |
| `spline_evaluate` | Evaluate point on spline |
| `spline_get_length` | Get spline length |

### Visual Scripting (8)
| Tool ID | Description |
|---------|-------------|
| `vs_create_graph` | Create visual script graph |
| `vs_add_node` | Add node to graph |
| `vs_connect_nodes` | Connect graph nodes |
| `vs_set_variable` | Set graph variable |
| `vs_add_event` | Add event node |
| `vs_remove_node` | Remove node |
| `vs_add_subgraph` | Embed subgraph |
| `vs_list_nodes` | List all nodes |

### Ragdoll (6)
| Tool ID | Description |
|---------|-------------|
| `ragdoll_create` | Create ragdoll setup |
| `ragdoll_enable` | Enable/disable ragdoll |
| `ragdoll_set_joint_limits` | Set joint limits |
| `ragdoll_add_force` | Apply force to bone |
| `ragdoll_set_collision` | Set collision mode |
| `ragdoll_remove` | Remove ragdoll |

### Cloth (5)
| Tool ID | Description |
|---------|-------------|
| `cloth_add` | Add Cloth component |
| `cloth_set_params` | Set cloth parameters |
| `cloth_set_gravity` | Set cloth gravity |
| `cloth_add_collider` | Add cloth collider |
| `cloth_remove` | Remove cloth |

### Decal (5)
| Tool ID | Description |
|---------|-------------|
| `decal_create` | Create decal projector |
| `decal_set_size` | Set decal size |
| `decal_set_material` | Set decal material |
| `decal_set_opacity` | Set decal opacity |
| `decal_remove` | Remove decal |

### LOD (6)
| Tool ID | Description |
|---------|-------------|
| `lod_create_group` | Create LOD Group component |
| `lod_set_transitions` | Set LOD transition distances |
| `lod_assign_renderer` | Assign renderer to LOD level |
| `lod_set_fade_mode` | Set fade mode (None/CrossFade/SpeedTree) |
| `lod_get_info` | Get LOD Group information |
| `lod_remove` | Remove LOD Group |

### Gizmo (6)
| Tool ID | Description |
|---------|-------------|
| `gizmo_draw_sphere` | Draw wire sphere gizmo |
| `gizmo_draw_cube` | Draw wire cube gizmo |
| `gizmo_draw_line` | Draw line gizmo |
| `gizmo_draw_ray` | Draw ray gizmo |
| `gizmo_draw_label` | Draw text label in scene |
| `gizmo_clear_all` | Clear all custom gizmos |

### Reflection Probe (6)
| Tool ID | Description |
|---------|-------------|
| `probe_create` | Create Reflection Probe |
| `probe_set_size` | Set probe bounding box size |
| `probe_set_resolution` | Set cubemap resolution |
| `probe_set_intensity` | Set reflection intensity |
| `probe_bake` | Bake Reflection Probe |
| `probe_remove` | Remove Reflection Probe |

### Lightmap (6)
| Tool ID | Description |
|---------|-------------|
| `lightmap_bake` | Bake lightmaps |
| `lightmap_set_resolution` | Set texels per unit |
| `lightmap_set_max_size` | Set max atlas size |
| `lightmap_set_object_scale` | Set object lightmap scale |
| `lightmap_clear` | Clear baked lightmaps |
| `lightmap_get_info` | Get lightmap settings |

### Occlusion Culling (6)
| Tool ID | Description |
|---------|-------------|
| `occlusion_bake` | Bake occlusion culling |
| `occlusion_set_occluder` | Set Occluder Static |
| `occlusion_set_occludee` | Set Occludee Static |
| `occlusion_set_params` | Set occlusion parameters |
| `occlusion_clear` | Clear occlusion data |
| `occlusion_visualize` | Toggle occlusion visualization |

### Streaming (6)
| Tool ID | Description |
|---------|-------------|
| `streaming_load_scene` | Load scene asynchronously |
| `streaming_unload_scene` | Unload scene asynchronously |
| `streaming_set_active_scene` | Set active scene |
| `streaming_get_loaded_scenes` | List loaded scenes |
| `streaming_preload` | Preload scene without activating |
| `streaming_get_progress` | Get loading progress |

### Tag Manager (4)
| Tool ID | Description |
|---------|-------------|
| `tagmgr_add_tag` | Add custom tag |
| `tagmgr_add_layer` | Add custom layer |
| `tagmgr_add_sorting_layer` | Add sorting layer |
| `tagmgr_list_all` | List all tags and layers |

### Screenshot (4)
| Tool ID | Description |
|---------|-------------|
| `screenshot_game_view` | Capture Game View |
| `screenshot_scene_view` | Capture Scene View |
| `screenshot_camera` | Capture from specific camera |
| `screenshot_360` | Capture 360 panorama |

## SuperSave Mode

Instead of registering all 302 tools in the AI context, SuperSave exposes only 4 meta-tools:

| Meta-Tool | Purpose |
|-----------|---------|
| `arcana.discover` | Search available tools by keyword or category |
| `arcana.inspect` | Get full schema for a specific tool |
| `arcana.execute` | Run any tool with parameters |
| `arcana.compose` | Chain multiple tools in a pipeline |

This reduces token consumption by approximately 98%.

## Quick Start

### Requirements

- Node.js 18+
- Unity 2022.3+ or Blender 3.6+
- An MCP-compatible AI client

### Installation

```bash
git clone https://github.com/matrix9neonebuchadnezzar2199-sketch/ARCANA.git
cd ARCANA/server
npm install
npm run build
```

Then import the `unity-plugin` folder into your Unity project.

Open Unity > Tools > ARCANA > Setup to configure your AI client automatically.

### Test It

Tell your AI assistant:

```
"List all GameObjects in the current Unity scene"
"Create a red cube at position (0, 5, 0)"
"Add a point light above the cube with soft shadows"
"Create a 500x500 terrain with grass texture and 200 trees"
```

## Roadmap

| Phase | Status | Content |
|-------|--------|---------|
| 1 | Done | Core server, SuperSave, 302 Unity tools |
| 2 | Done | Navigation, PostProcessing, Script, Selection, Constraint, Build, Render, Asset, Editor, Mesh, Timeline, Cinemachine, ProBuilder, Input, Shader, Networking, 2D, VRChat, Addressables, Localization, Debug, Testing, Profiler, XR, AI, Spline, VisualScripting, Ragdoll, Cloth, Decal, LOD, Gizmo, ReflectionProbe, Lightmap, OcclusionCulling, Streaming, TagManager, Screenshot |
| 3 | Planned | Blender addon, 50+ Blender tools |
| 4 | Planned | Unreal Engine support |
| 5 | Planned | 400+ tools, community contributions |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. All skill levels welcome.

## Acknowledgements

- [Synaptic AI Pro](https://synaptic-ai.net/) - Inspiration and proof of concept
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol standard
- [Unity-MCP](https://github.com/IvanMurzak/Unity-MCP) - Architecture reference

## License

MIT License. See [LICENSE](LICENSE) for details.