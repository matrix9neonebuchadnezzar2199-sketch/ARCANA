<p align="center">
  <img src="image/TOP.png" alt="ARCANA Banner" width="100%">
</p>

<h1 align="center">ARCANA</h1>
<p align="center"><strong>Advanced Runtime for Creative AI & Natural-language Automation</strong></p>
<p align="center"><b>Unity</b>・<b>Unreal Engine</b>・<b>Blender</b> を自然言語で操作。<br>オープンソース、永久無料。</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/Tools-578-brightgreen.svg" alt="438 Tools">
  <img src="https://img.shields.io/badge/Categories-81-orange.svg" alt="66 Categories">
  <img src="https://img.shields.io/badge/Unity-2022.3+-black?logo=unity" alt="Unity 2022.3+">
  <img src="https://img.shields.io/badge/Unreal_Engine-5.x-black?logo=unrealengine" alt="UE 5.x">
  <img src="https://img.shields.io/badge/Blender-3.6+-orange?logo=blender" alt="Blender 3.6+">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white" alt="Node 18+">
  <img src="https://img.shields.io/badge/MCP-Compatible-purple" alt="MCP Compatible">
</p>

<p align="center">日本語 | <a href="README.md">English</a></p>

---

## なぜ ARCANA？

既存のMCPエディタツールは1エディタ・20〜60ツール程度です。
ARCANAは **3エディタ・81カテゴリ・578ツール** を1つのサーバーで提供します。

| | ARCANA | Unity-MCP | Blender-MCP | Unreal-MCP |
|---|---|---|---|---|
| **ツール数** | **578** | ~20 | ~15 | ~30 |
| **エディタ** | Unity + UE + Blender | Unity | Blender | UE |
| **SuperSave** | 4メタツール | - | - | - |

## ARCANA とは？

ARCANAはAIアシスタント（Claude, ChatGPT, Gemini, Copilot, Cursor）を [Model Context Protocol](https://modelcontextprotocol.io/) 経由で **Unity**・**Unreal Engine**・**Blender** に接続します。メニュー操作やパラメータ調整の代わりに、自然言語で指示するだけでARCANAが実行します。

## 主な特徴

- **578ツール / 81カテゴリ** - Unity 302、Unreal Engine 136、Blender 140
- **3エディタ対応** - 1つのサーバーでUnity・UE・Blenderを同時制御
- **自然言語操作** - やりたいことを言葉で伝えるだけ
- **任意のAIクライアント** - Claude Desktop, Cursor, VS Code, ChatGPT, Gemini CLI
- **SuperSaveモード** - 4つのメタツールでトークン使用量を約98%削減
- **ブリッジアーキテクチャ** - エディタごとにWebSocket接続（Unity :9877, UE :9878, Blender :9879）
- **オープンソース** - MIT、永久無料
- **バイリンガル** - 英語・日本語完全対応
- **Undo対応** - Unity全ツールがUndo/Redo対応

## アーキテクチャ

```
AIクライアント       MCP            ARCANAサーバー          エディタ
Claude, Cursor  <==========>  Node.js/TypeScript  ----> Unity   :9877
ChatGPT 等       stdio/SSE    578ツール/81カテゴリ ----> UE 5    :9878
                                                  ----> Blender :9879
```

## ツール一覧

### Unity ツール（302 / 46カテゴリ）

<details>
<summary>クリックでUnityツール一覧を展開</summary>

| カテゴリ | 数 | 主なツール |
|----------|-----|-----------|
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

### Unreal Engine ツール（136 / 20カテゴリ）

<details>
<summary>クリックでUEツール一覧を展開</summary>

| カテゴリ | 数 | 主なツール |
|----------|-----|-----------|
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


### Blender ツール（140 / 15カテゴリ）

<details>
<summary>クリックでBlenderツール一覧を展開</summary>

| カテゴリ | 数 | 主なツール |
|----------|-----|-----------|
| BL Object | 10 | bl_object_create, bl_object_delete, bl_object_duplicate |
| BL Mesh | 10 | bl_mesh_edit_vertices, bl_mesh_extrude_faces, bl_mesh_bevel |
| BL Material | 8 | bl_material_create, bl_material_set_color, bl_material_assign |
| BL Modifier | 10 | bl_mod_subsurf, bl_mod_mirror, bl_mod_boolean |
| BL Sculpt | 8 | bl_sculpt_set_brush, bl_sculpt_set_strength, bl_sculpt_remesh |
| BL Animation | 10 | bl_anim_insert_keyframe, bl_anim_create_bone, bl_anim_bake |
| BL Camera | 6 | bl_camera_create, bl_camera_set_focal, bl_camera_set_dof |
| BL Light | 6 | bl_light_create, bl_light_set_color, bl_light_set_power |
| BL Render | 10 | bl_render_set_engine, bl_render_set_resolution, bl_render_execute |
| BL Scene | 8 | bl_scene_list, bl_scene_create, bl_scene_set_world |
| BL Node | 10 | bl_node_add, bl_node_connect, bl_node_set_value |
| BL UV | 8 | bl_uv_unwrap, bl_uv_smart_project, bl_uv_pack_islands |
| BL Particle | 8 | bl_particle_add, bl_particle_add_hair, bl_particle_set_count |
| BL Armature | 10 | bl_armature_create, bl_armature_add_bone, bl_armature_auto_weights |
| BL Grease Pencil | 8 | bl_gp_create, bl_gp_add_layer, bl_gp_set_brush |

</details>

## SuperSave モード

578ツール全てを登録する代わりに、**4つのメタツール**のみ公開：

| メタツール | 用途 |
|---|---|
| arcana.discover | キーワード・カテゴリでツール検索 |
| arcana.inspect | 特定ツールのスキーマ取得 |
| arcana.execute | IDとパラメータでツール実行 |
| arcana.compose | 複数ツールをパイプライン実行 |

トークン消費を約 **98%** 削減します。

## クイックスタート

### 必要環境

- Node.js 18+
- Unity 2022.3+ / Unreal Engine 5.x / Blender 3.6+（任意の組み合わせ）
- MCP対応AIクライアント（Claude Desktop, Cursor, VS Code 等）

### インストール

```bash
git clone https://github.com/matrix9neonebuchadnezzar2199-sketch/ARCANA.git
cd ARCANA/server
npm install
npm run build
```

### Unity セットアップ

1. `unity-plugin` フォルダをUnityプロジェクトにインポート
2. Unity > Tools > ARCANA > Setup を開く
3. WebSocketブリッジが localhost:9877 で起動

### Unreal Engine セットアップ

1. `ue-plugin` フォルダをプロジェクトの Plugins ディレクトリにコピー
2. Edit > Plugins で ARCANA を有効化
3. WebSocketブリッジが localhost:9878 で起動

### 試してみる

**Unity:**
```
"現在のUnityシーンのGameObjectを全て一覧して"
"位置(0, 5, 0)に赤いキューブを作って"
"キューブの上にソフトシャドウ付きポイントライトを追加して"
```

**Unreal Engine:**
```
"現在のレベルのアクターを全て一覧して"
"位置(0, 0, 200)にキューブをスポーンして"
"5000ルーメンの暖色ポイントライトを作成して"
```

## ロードマップ

| フェーズ | 状態 | 内容 |
|---|---|---|
| 1 | 完了 | コアMCPサーバー、SuperSave、ブリッジアーキテクチャ |
| 2 | 完了 | Unity 302ツール（46カテゴリ） |
| 3 | 完了 | Unreal Engine 136ツール（20カテゴリ） |
| 4 | 完了 | Blender 140ツール（15カテゴリ） |
| 5 | 次 | クロスエディタワークフロー、700+ツール、レシピシステム |

## コントリビュート

[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。全てのスキルレベル歓迎です。

## 謝辞

- [Synaptic AI Pro](https://synaptic-ai.net/) - インスピレーションと概念実証
- [Model Context Protocol](https://modelcontextprotocol.io/) - プロトコル標準
- [Unity-MCP](https://github.com/IvanMurzak/Unity-MCP) - アーキテクチャ参考

## ライセンス

MIT License. [LICENSE](LICENSE) を参照してください。