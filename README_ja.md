[![ARCANA Banner](image/TOP.png)](https://github.com/matrix9neonebuchadnezzar2199-sketch/ARCANA)

**Advanced Runtime for Creative AI & Natural-language Automation**

**Unity**、**Unreal Engine**、**Blender** を自然言語で操作。
一言でシーン構築。ゲーム感覚でキャラクリエイト。オープンソース、永久無料。

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE) [![832 Tools](https://img.shields.io/badge/Tools-832-blue.svg)](#%E3%83%84%E3%83%BC%E3%83%AB%E4%B8%80%E8%A6%A7) [![93 Categories](https://img.shields.io/badge/Categories-93-purple.svg)](#%E3%83%84%E3%83%BC%E3%83%AB%E4%B8%80%E8%A6%A7) [![Unity 2022.3+](https://img.shields.io/badge/Unity-2022.3%2B-black.svg)](https://unity.com/) [![UE 5.x](https://img.shields.io/badge/Unreal_Engine-5.x-black.svg)](https://unrealengine.com/) [![Blender 4.2+](https://img.shields.io/badge/Blender-4.2%2B-orange.svg)](https://blender.org/) [![Node 18+](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/) [![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-brightgreen.svg)](https://modelcontextprotocol.io/)

[English](README.md) | 日本語

---

## なぜ ARCANA？

一般的なMCPエディタツールは1エディタ対応で20〜60ツール。ARCANAは**1サーバーで3エディタ、832ツール、94カテゴリ**を提供します。さらに**一言でシーン自動構築**、**ゲーム感覚のキャラクリエイト**が可能です。

|  | ARCANA | 一般的なMCPツール |
| --- | --- | --- |
| **ツール数** | **832** | 20〜60 |
| **対応エディタ** | Unity + UE + Blender | 単一エディタ |
| **シーン自動生成** | 一言で完了 | - |
| **キャラクリエイト** | ゲーム感覚スライダー | - |
| **クロスエディタ連携** | Blender→Unity/UE自動 | - |
| **SuperSave** | 4メタツール（トークン約98%削減） | - |

## こんなことで困ってない？ ARCANAなら一発。

<details>
<summary><strong>クリックして具体例を見る</strong></summary>

#### 「FPSシーンの構築に何時間もかかる...」
```
"地形、ライティング、ポストプロセス、ナビメッシュ、スポーン地点8個でFPSシーン作って"
```
一言で完了。ARCANAの**レシピシステム**が全部まとめて構築します。

#### 「UIレイアウトが面倒すぎる...」
```
"タイトル、開始・設定・終了ボタン、BGM付きのメインメニュー作って"
```
Canvas、ボタン、イベントバインド、レイアウト — 全部自動生成。

#### 「VRChatアバター作りたいけどワークフローが地獄...」
```
"身長160cm、大きめの目、アッシュの髪、アニメ調の女性アバター作って"
"髪全チェーンにPhysBone追加して、柔らかめの揺れにして"
"Unified Expressions全70+Shape Keyを自動生成して"
"VRChat Goodランクでバリデーションして"
```
体型、顔、髪、表情、VRMエクスポート、VRChatセットアップ — 全部自然言語で。

#### 「Blender→Unityのエクスポートがいつも壊れる...」
```
"このモデルをBlenderからUnityに正しいスケールとマテリアル再マッピングで出力して"
```
ARCANAの**パイプラインツール**が軸変換、スケール、マテリアルマッピングを自動処理。

#### 「ライティングとポストプロセスに時間取られすぎ...」
```
"ソフトな雰囲気の3点スタジオライティングをセットアップして"
"ブルーム、カラーグレーディング、被写界深度でシネマティックなポストプロセス適用して"
```
プロ品質のセットアップが数秒で。

#### 「プロジェクトの整理が面倒...」
```
"プロジェクト健全性チェック — 参照切れ、未使用アセット、重複マテリアルを見つけて"
"テクスチャを全部監査して最適化を提案して"
```
プロジェクトメンテナンスを自動化。

</details>

## ARCANAとは

ARCANAはAIアシスタント（Claude, ChatGPT, Gemini, Copilot, Cursor）を [Model Context Protocol](https://modelcontextprotocol.io/) 経由で**Unity**、**Unreal Engine**、**Blender**に接続します。やりたいことを自然言語で伝えるだけでARCANAが実行します。

## 主な特徴

- **832ツール / 94カテゴリ** — Unity 358、Unreal Engine 192、Blender 238、クロスエディタ 40
- **3エディタ対応** — 1サーバーでUnity、UE、Blenderを同時制御
- **自然言語操作** — やりたいことを言葉で伝えるだけ
- **あらゆるAIクライアント対応** — Claude Desktop, Cursor, VS Code, ChatGPT, Gemini CLI
- **SuperSaveモード** — 4つのメタツールでトークン使用量を約98%削減
- **ブリッジアーキテクチャ** — エディタごとにWebSocket（Unity :9877, UE :9878, Blender :9879）
- **オープンソース** — MIT、永久無料
- **バイリンガル** — 英語 + 日本語
- **Undo対応** — UnityツールはUndo/Redo対応

### 主な特徴：一言シーン自動構築

自然言語一言でゲームシーンを丸ごと構築。何時間もかかる手作業はもう不要。

| レシピ | 生成内容 |
| --- | --- |
| `recipe_fps_scene` | 地形、ライティング、カメラ、ポストプロセス、ナビメッシュ、スポーン地点 |
| `recipe_rpg_dungeon` | 部屋、通路、扉、宝箱、敵スポーン、ボス部屋 |
| `recipe_horror_scene` | 暗めライティング、フォグ、環境音、明滅ライト、ジャンプスケアトリガー |
| `recipe_open_world_base` | 大型地形、ストリーミングゾーン、LOD、天候、昼夜サイクル |
| `recipe_vr_room` | テレポートポイント、グラブ対象、ワールドUI、ガーディアン境界 |
| `recipe_ui_main_menu` | タイトル、開始/設定/終了ボタン、背景、BGM |
| `recipe_ui_hud` | HPバー、弾数、ミニマップ、クロスヘア、スコア表示 |
| `recipe_ui_inventory` | グリッドスロット、ドラッグ&ドロップ、ツールチップ、装備パネル |
| `recipe_lighting_studio` | 3点照明（キー・フィル・リム）、背景、リフレクションプローブ |
| `recipe_pbr_material` | アルベド・ノーマル・メタリック・ラフネス・AO・エミッション自動設定 |

さらに**プロジェクト管理ツール**：健全性チェック、テクスチャ監査、ポリゴンバジェット、命名規則、ビルドサイズレポート、コリジョンマトリクス、品質設定など。


### 主な特徴：2D-to-3D --- イラストから3D世界を生成

最強機能。イラストを見せるだけで、ARCANAが3Dシーンを再現します。

1. 画像を貼る（キャラ絵、風景画、コンセプトアート、ゲームスクショ）
2. Claude Visionが画像を解析し、詳細パラメータを抽出
3. ARCANAがパラメータをツール実行パイプラインに変換
4. 3Dエディタが自動で構築

外部AIモデル不要 --- 今チャットしているVision AIをそのまま使います。

| ツール | 機能 |
| --- | --- |
| arcana_analyze_image | 画像から3DパラメータをJSON抽出 |
| arcana_image_to_character | 画像から3Dキャラ生成 |
| arcana_image_to_scene | 画像から3Dシーン生成 |
| arcana_image_to_world | キャラとシーン同時生成 |

**使用例：**
```
ユーザー: [ファンタジー風景のイラストを貼る] このシーン作って
Claude: 山岳地形、夕焼け、霧、城、湖... 12個のツール実行中...
結果: Blender/Unityにシーンが出現
```

### 主な特徴：ゲーム感覚キャラクリエイト

モンハンやVRChatのキャラメイクのように、スライダー感覚でキャラクターを作成・カスタマイズ。髪の長さ1cm単位、肌の色、瞳のパターンまで細かく設定可能。

<details>
<summary><strong>キャラクリエイト パラメータ一覧（78ツール）</strong></summary>

#### 体型（12ツール）
ベースボディ生成、身長(cm)、プロポーション（肩幅・胸囲・ウエスト・ヒップ）、筋肉量、体脂肪率、腕の長さ、脚の長さ、手のサイズ、足のサイズ、首、胴の長さ、アクセサリスロット。

#### 顔（15ツール）
輪郭（丸/卵型/四角/逆三角/ハート）、顎、頬骨、目の形（サイズ・間隔・角度）、二重まぶた、瞳（色・パターン・オッドアイ）、眉、鼻、口、耳（エルフ耳対応！）、額、顎先、こめかみ、ほうれい線、顔プリセット（アニメ/リアル/ちび）。

#### 髪（10ツール）
スタイル（17種：ストレート、ウェーブ、カーリー、ポニーテール、ツインテール、お団子、三つ編み、モヒカン、姫カット...）、長さcm単位（前髪・サイド・バック個別）、カラー（22種：アッシュ、プラチナブロンド、ピンク、ラベンダー...）、グラデーション（オンブレ/バレイヤージュ）、メッシュ、ボリューム、ツヤ、揺れ物物理（PhysBone）、分け目、アクセサリ（リボン、ティアラ、ヘアピン...）。

#### マテリアル・肌（8ツール）
肌色（8プリセット or RGB）、肌質（そばかす・毛穴・加齢）、ほくろ、メイク（アイシャドウ・チーク・リップ・アイライナー・ファンデ）、目のマテリアル、ネイルカラー（グリッター・フレンチ）、タトゥー、傷跡。

#### 表情（8ツール）
Unified Expressions一括自動生成（VRCFaceTracking対応70+Shape Key）、個別Shape Key制御、表情プリセット、Viseme（リップシンク）セットアップ、カスタムShape Key、左右ミラー、一括設定、表情データJSON出力/再利用。

#### エクスポート・VRChat（17ツール）
VRMエクスポート、FBXエクスポート（Unity/UE最適化）、アバターバリデーション（VRChatランクチェック）、自動最適化（デシメート・アトラス・メッシュ統合）、スプリングボーン、Avatar Descriptor、PhysBone、Expression Menu、トグル、Viseme、アイトラッキング、バウンディングボックス、フェイストラッキング、アップロード準備。

#### UE MetaHuman（8ツール）
MetaHuman生成、顔・体型・髪・肌・衣装設定、表情プリセット、エクスポート（FBX/USD）。

</details>

**使用例：**
```
"身長160cm、アニメ調、スリム体型の女性アバターを作って"
"目を大きめに、少しつり目で、瞳の色はバイオレット"
"髪型は姫カット、バック25cm、アッシュブロンドにピンクのメッシュ入れて"
"薄めのメイク — ピンクリップ、ほんのりチーク"
"Unified Expression全Shape Keyとviseme生成して"
"VRChat Goodランクでバリデーションして、VRMでエクスポート"
```

## アーキテクチャ

[![ARCANA Architecture](image/ARCANA%20to%20Unity%26Blender.png)](image/ARCANA%20to%20Unity%26Blender.png)

```
AIクライアント       MCP            ARCANAサーバー        エディタ
Claude, Cursor  <==========>  Node.js/TypeScript  ----> Unity   :9877
ChatGPT等       stdio/SSE    832ツール/94カテゴリ ----> UE 5    :9878
                                                  ----> Blender :9879
```

## ツール一覧

### Unity ツール（358ツール / 53カテゴリ）

<details>
<summary>クリックして Unity ツール一覧を展開</summary>

| カテゴリ | 数 | 代表例 |
| --- | --- | --- |
| Scene | 3 | scene_list_objects, scene_create_gameobject |
| Transform | 5 | transform_set_position, transform_set_rotation |
| Material | 5 | material_set_color, material_set_transparency |
| Lighting | 5 | lighting_create_light, lighting_set_color |
| Terrain | 4 | terrain_create, terrain_set_height |
| Audio | 3 | audio_add_source, audio_set_volume |
| Camera | 3 | camera_create, camera_set_fov |
| Physics | 3 | physics_add_rigidbody, physics_add_collider |
| VFX | 4 | vfx_create_particle, vfx_set_color |
| Animation | 4 | anim_add_animator, anim_set_parameter |
| UI | 4 | ui_create_canvas, ui_create_text |
| Optimization | 4 | opt_get_scene_stats, opt_set_static |
| Component | 4 | component_add, component_remove |
| Prefab | 3 | prefab_create, prefab_instantiate |
| Layer / Tag | 3 | layertag_set_layer, layertag_set_tag |
| Environment | 3 | env_set_skybox, env_set_fog |
| Navigation | 4 | nav_bake, nav_add_agent |
| PostProcessing | 5 | post_set_bloom, post_set_color_adjust |
| Script | 4 | script_create, script_attach |
| Selection | 4 | select_object, select_all |
| Constraint | 4 | constraint_position, constraint_rotation |
| Build | 6 | build_set_platform, build_execute |
| Render | 4 | render_screenshot, render_set_resolution |
| Asset | 5 | asset_import, asset_delete |
| Editor | 5 | editor_play_mode, editor_save_scene |
| Mesh | 6 | mesh_combine, mesh_separate |
| Timeline | 6 | timeline_create, timeline_add_track |
| Shader | 6 | shader_create_graph, shader_add_node |
| Networking | 6 | net_setup, net_spawn |
| 2D | 6 | 2d_create_sprite, 2d_create_tilemap |
| Spline | 8 | spline_create, spline_add_knot |
| Visual Scripting | 8 | vs_create_graph, vs_add_node |
| Ragdoll | 6 | ragdoll_create, ragdoll_enable |
| Cloth | 5 | cloth_add, cloth_set_params |
| Decal | 5 | decal_create, decal_set_size |
| XR / VR | 10 | xr_setup, xr_tracking |
| AI / NavAgent | 8 | ai_set_destination, ai_patrol |
| LOD | 6 | lod_create_group, lod_set_transitions |
| Gizmo | 6 | gizmo_draw_sphere, gizmo_draw_cube |
| Reflection Probe | 6 | probe_create, probe_set_size |
| Lightmap | 6 | lightmap_bake, lightmap_set_resolution |
| Occlusion | 6 | occlusion_bake, occlusion_set_occluder |
| Streaming | 6 | streaming_load_scene, streaming_unload_scene |
| Tag Manager | 4 | tagmgr_add_tag, tagmgr_add_layer |
| Screenshot | 4 | screenshot_game_view, screenshot_scene_view |
| Debug | 10 | debug_log, debug_draw_ray |
| Testing | 8 | test_create, test_run |
| Profiler | 10 | prof_cpu_start, prof_mem_snapshot |
| **Phase 5 新規:** | | |
| Cinemachine | 8 | cm_create_virtual_camera, cm_set_follow_target |
| ProBuilder | 8 | pb_create_shape, pb_extrude_faces |
| Input System | 6 | input_system_create_action_map, input_system_add_action |
| Addressables | 6 | addressables_create_group, addressables_mark_asset |
| TextMeshPro | 6 | tmp_create_text, tmp_set_style |
| Tilemap | 5 | tilemap_create, tilemap_set_tiles |
| Localization | 5 | loc_add_locale, loc_create_string_table |
| VRChat | 22 | vrc_setup_avatar, vrc_add_physbone, vrc_setup_face_tracking |

</details>

### Unreal Engine ツール（192ツール / 27カテゴリ）

<details>
<summary>クリックして UE ツール一覧を展開</summary>

| カテゴリ | 数 | 代表例 |
| --- | --- | --- |
| UE Scene | 6 | ue_scene_list_actors, ue_scene_spawn_actor |
| UE Transform | 6 | ue_transform_set_location, ue_transform_set_rotation |
| UE Material | 8 | ue_material_create, ue_material_set_color |
| UE Lighting | 6 | ue_light_create, ue_light_set_color |
| UE Landscape | 8 | ue_landscape_create, ue_landscape_sculpt |
| UE Audio | 6 | ue_audio_add_component, ue_audio_set_volume |
| UE Camera | 6 | ue_camera_create, ue_camera_set_fov |
| UE Mesh | 6 | ue_mesh_import, ue_mesh_set_collision |
| UE Blueprint | 10 | ue_bp_create, ue_bp_add_component |
| UE Animation | 6 | ue_anim_import, ue_anim_play |
| UE UI / UMG | 6 | ue_ui_create_widget, ue_ui_add_text |
| UE AI | 8 | ue_ai_create_bt, ue_ai_create_bb |
| UE Physics | 6 | ue_physics_enable, ue_physics_set_mass |
| UE Build | 6 | ue_build_set_platform, ue_build_package |
| UE Level | 6 | ue_level_create, ue_level_open |
| UE Foliage | 6 | ue_foliage_add_type, ue_foliage_paint |
| **Phase 5 新規:** | | |
| UE Niagara VFX | 10 | ue_niagara_create_system, ue_niagara_add_emitter |
| UE UMG Widget | 8 | ue_umg_create_widget, ue_umg_add_element |
| UE Sequencer | 8 | ue_sequencer_create_sequence, ue_sequencer_add_track |
| UE Enhanced Input | 6 | ue_einput_create_action, ue_einput_create_mapping |
| UE PCG | 6 | ue_pcg_create_graph, ue_pcg_add_point_sampler |
| UE MetaSound | 5 | ue_metasound_create, ue_metasound_add_node |
| UE Control Rig | 5 | ue_controlrig_create, ue_controlrig_add_control |
| UE MetaHuman | 8 | ue_metahuman_create, ue_metahuman_set_face |

</details>

### Blender ツール（238ツール / 27カテゴリ）

<details>
<summary>クリックして Blender ツール一覧を展開</summary>

| カテゴリ | 数 | 代表例 |
| --- | --- | --- |
| BL Object | 10 | bl_object_create, bl_object_delete |
| BL Mesh | 10 | bl_mesh_edit_vertices, bl_mesh_extrude_faces |
| BL Material | 8 | bl_material_create, bl_material_set_color |
| BL Modifier | 10 | bl_mod_subsurf, bl_mod_mirror |
| BL Sculpt | 8 | bl_sculpt_set_brush, bl_sculpt_set_strength |
| BL Animation | 10 | bl_anim_insert_keyframe, bl_anim_create_bone |
| BL Camera | 6 | bl_camera_create, bl_camera_set_focal |
| BL Light | 6 | bl_light_create, bl_light_set_color |
| BL Render | 10 | bl_render_set_engine, bl_render_set_resolution |
| BL Scene | 8 | bl_scene_list, bl_scene_create |
| BL Node | 10 | bl_node_add, bl_node_connect |
| BL UV | 8 | bl_uv_unwrap, bl_uv_smart_project |
| BL Particle | 8 | bl_particle_add, bl_particle_add_hair |
| BL Armature | 10 | bl_armature_create, bl_armature_add_bone |
| BL Grease Pencil | 8 | bl_gp_create, bl_gp_add_layer |
| **Phase 5 新規:** | | |
| BL Geometry Nodes | 10 | bl_geonodes_create_tree, bl_geonodes_add_node |
| BL Compositor | 7 | bl_comp_enable, bl_comp_add_node |
| BL Grease Pencil+ | 6 | bl_gp_set_brush_advanced, bl_gp_create_frame |
| BL Sculpting+ | 6 | bl_sculpt_dyntopo, bl_sculpt_mask |
| BL Texture Paint | 5 | bl_texpaint_enable, bl_texpaint_set_brush |
| BL Video Sequence | 6 | bl_vse_add_strip, bl_vse_cut |
| **キャラクリエイト:** | | |
| BL キャラ体型 | 12 | bl_char_create_base, bl_char_set_height |
| BL キャラ顔 | 15 | bl_char_set_eye_shape, bl_char_set_nose |
| BL キャラ髪 | 10 | bl_char_set_hair_style, bl_char_set_hair_color |
| BL キャラマテリアル | 8 | bl_char_set_skin_color, bl_char_set_makeup |
| BL キャラ表情 | 8 | bl_char_create_unified_shapekeys, bl_char_setup_viseme |
| BL キャラエクスポート | 5 | bl_char_export_vrm, bl_char_validate_avatar |

</details>

### クロスエディタ & レシピ ツール（40ツール / 3カテゴリ）

<details>
<summary>クリックしてクロスエディタツール一覧を展開</summary>

| カテゴリ | 数 | 代表例 |
| --- | --- | --- |
| レシピ シーン | 15 | recipe_fps_scene, recipe_rpg_dungeon, recipe_horror_scene |
| レシピ プロジェクト | 15 | project_health_check, project_texture_audit, project_polygon_budget |
| レシピ パイプライン | 10 | pipeline_blender_to_unity, pipeline_animation_retarget, pipeline_lod_generator |

</details>

## SuperSave モード

832ツール全部を登録する代わりに、**4つのメタツール**だけを公開：

| メタツール | 機能 |
| --- | --- |
| arcana.discover | キーワードやカテゴリでツールを検索 |
| arcana.inspect | 特定ツールの詳細スキーマを取得 |
| arcana.execute | IDを指定してツールを実行 |
| arcana.compose | 複数ツールをパイプラインで連続実行 |

トークン使用量を約**98%削減**。

## クイックスタート

### Step 0: 事前にインストールするもの（全部無料）

```
セットアップの流れ:

  Step 0: 事前準備
  Node.js + Git + 3Dエディタをインストール     
     |
     |---> Option A: 完全無料で試す（Claude Desktop）
     |     初心者におすすめ。インストールするだけで始められます。
     |
     +---> Option B: 他のAIクライアントで使う
           Cursor / VS Code / Gemini CLI をお使いの方向け。
```

**1. Node.js（ARCANAサーバーに必要）

- [nodejs.org](https://nodejs.org/) からLTS版をダウンロード
- インストーラーを実行（設定はすべてデフォルトでOK）
- 確認: ターミナルを開いて `node --version` と入力

**2. Git**（ARCANAのダウンロードに必要）

- **Windows**: [git-scm.com](https://git-scm.com/download/win) からダウンロードしてインストール
- **Mac**: ターミナルで `xcode-select --install` を実行
- **Linux**: `sudo apt install git`（Ubuntu/Debian）または `sudo dnf install git`（Fedora）
- 確認: `git --version`

**3. 3Dエディタ**（以下から1つ以上）

| エディタ | 費用 | アカウント登録 | インストール容量 | こんな人向け |
|----------|------|---------------|-----------------|-------------|
| **Blender 4.2+** | 無料 | 不要 | 約500 MB | 初心者、キャラ作成、VRChat |
| **Unity 2022.3+** | 無料（Personal） | 必要（Unity ID） | 約5 GB | ゲーム開発 |
| **UE 5.x** | 無料 | 必要（Epic Games） | 約60 GB | ハイエンド映像、AAA |

> **迷ったら Blender で始めてください。** [blender.org/download](https://www.blender.org/download/) からダウンロードしてインストールするだけ。アカウント登録は不要です。

---

### Option A: 完全無料で試す（Claude Desktop）（おすすめ）

> **費用: 0円。** Claude Desktop は Anthropic の無料AIアプリで、MCP に対応しています。
> APIキー不要 — インストールするだけですぐ使えます。

#### セットアップの全体フロー

```
1. Claude Desktop インストール .... Step 1
2. ARCANA ビルド .................. Step 2（クローン＆ビルド）
3. MCP 設定 ...................... Step 3（claude_desktop_config.json）
4. Blender 設定 .................. Step 4（addon.py → ディスクからインストール）
5. 制作開始！ .................... Step 5（AIと対話して3Dシーンを構築）
```

Step 1: Claude Desktop をインストール
claude.com/download からダウンロードしてインストール。 Anthropic のアカウントがなければ無料で作成してください。
```

#### Step 2: ARCANA をダウンロード＆ビルド

```bash
git clone https://github.com/matrix9neonebuchadnezzar2199-sketch/ARCANA.git
cd ARCANA/server
npm install
npm run build
```

#### Step 3: MCP 接続を設定

> **重要:** 設定ファイルは **BOMなしのUTF-8** で保存する必要があります。以下のコマンドなら自動的にBOMなしで書き込みます。

**Windows（PowerShell）— 通常インストール:**

```powershell
$configDir = "$env:APPDATA\Claude"
if (!(Test-Path $configDir)) { New-Item -ItemType Directory -Path $configDir -Force }
$json = '{"mcpServers":{"arcana":{"command":"node","args":["C:\\full\\path\\to\\ARCANA\\server\\dist\\index.js"],"timeout":30000}}}'
[System.IO.File]::WriteAllText("$configDir\claude_desktop_config.json", $json, (New-Object System.Text.UTF8Encoding $false))

Windows（PowerShell）— Microsoft Store版:
$configDir = "$env:LOCALAPPDATA\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude"
if (!(Test-Path $configDir)) { New-Item -ItemType Directory -Path $configDir -Force }
$json = '{"mcpServers":{"arcana":{"command":"node","args":["C:\\full\\path\\to\\ARCANA\\server\\dist\\index.js"],"timeout":30000}}}'
[System.IO.File]::WriteAllText("$configDir\claude_desktop_config.json", $json, (New-Object System.Text.UTF8Encoding $false))

Mac / Linux:
mkdir -p ~/Library/Application\ Support/Claude
echo '{"mcpServers":{"arcana":{"command":"node","args":["/full/path/to/ARCANA/server/dist/index.js"],"timeout":30000}}}' > ~/Library/Application\ Support/Claude/claude_desktop_config.json

パスは実際のARCANAディレクトリに置き換えてください。保存後、Claude Desktop を完全に再起動してください（ウィンドウを閉じるだけでなく、終了して再度開く）。

確認: 新しいチャットを開いて ARCANAの接続状態を確認して と入力。Blenderが接続済みと表示されれば成功です。

トラブルシューティング:

設定ファイル読み込みエラー: BOMが含まれています。上記のPowerShellコマンドを使ってください。
「Unexpected token」エラー: ソース変更後に npm run build を再実行してください。
MCPツールが表示されない: パスが dist/index.js（src/index.ts ではない）を指しているか確認。絶対パスを使用してください。

#### Step 4: エディタにプラグインをインストール
<details>
<summary><strong>Blender（初心者おすすめ）</strong></summary>

> **シンプルインストール:** 1ファイルをダウンロードしてインストールするだけ。フォルダコピー不要です。

#### ディスクからインストール（全バージョン対応）

1. このリポジトリから [`addon.py`](addon.py) をダウンロード
2. Blender を開く
3. **Edit > Preferences > Add-ons** を開く
   - **Blender 4.2+/5.x:** ドロップダウン矢印をクリック → **「ディスクからインストール」** を選択
   - **Blender 3.6-4.1:** **「インストール...」** をクリック
4. ダウンロードした `addon.py` を選択

   ![ディスクからインストール 手順1](image/install-from-disk-1.png)
   ![ディスクからインストール 手順2](image/install-from-disk-2.png)
5. **ARCANA Bridge** のチェックボックスをONにして有効化
   - **Blender 4.2+/5.x:** **「旧アドオン（Legacy Add-ons）」** セクションを探す

   ![ARCANA Bridge を有効化](image/install-from-disk-3.png)
6. 3Dビューポートで **Nキー** → **ARCANA** タブ → **接続（Connect）**

   ![ARCANA タブ](image/arcana-tab.png)


> **注意:** 接続するには ARCANA の MCP サーバーが起動している必要があります。AIクライアントが自動起動する場合はそのままで。それ以外は `cd ARCANA/server && node dist/index.js` を実行してください。

</details>

<details>
<summary><strong>Unity</strong></summary>

1. Unity でプロジェクトを開く
2. `unity-plugin` フォルダを Assets にドラッグ＆ドロップ
3. メニューの **Tools > ARCANA > Setup** をクリック

</details>

<details>
<summary><strong>Unreal Engine</strong></summary>

1. `ue-plugin/ARCANA` フォルダをプロジェクトの Plugins ディレクトリにコピー
2. UE を起動 → **Edit > Plugins** → ARCANA を有効化
3. エディタを再起動

</details>

#### Step 5: 話しかけるだけ！

Claude Desktop で新しいチャットを開いて話しかけるだけ:
```
> 座標(2,0,0)に赤いキューブを作って
> 雪原と夕焼けのFPSシーンを作って
> 160cmのアニメ風女性キャラを作って、目は大きめ、髪はアッシュブロンド
```

> **ヒント: AI がファイルを読みにいって MCP ツールを使わない場合は、明示的に指示してください:
> arcana_execute を使って bl_object_create を実行して。パラメータは {"type": "CUBE", "name": "MyCube", "location": [2, 0, 0]}
> ```

**無料AI + 無料エディタ + 無料ARCANA = 無限の創造力。**

---

### Option B: 他のAIクライアントで使う

> Cursor、VS Code、Gemini CLI など、MCP対応の他のAIクライアントをお使いの方向け。

#### Step 1: ARCANA をダウンロード＆ビルド

```bash
git clone https://github.com/matrix9neonebuchadnezzar2199-sketch/ARCANA.git
cd ARCANA/server
npm install
npm run build
```

#### Step 2: AIクライアントの設定

お使いのクライアントの設定ファイルに以下を追加。`PATH_TO` は実際のARCANAパスに置き換えてください。

**Cursor** (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "arcana": {
      "command": "node",
      "args": ["./server/dist/index.js"],
      "cwd": "PATH_TO/ARCANA"
    }
  }
}
```

**VS Code** (`.vscode/settings.json`):

```json
{
  "mcp": {
    "servers": {
      "arcana": {
        "command": "node",
        "args": ["./server/dist/index.js"],
        "cwd": "PATH_TO/ARCANA"
      }
    }
  }
}
```
Gemini CLI:
gemini mcp add arcana -- node /full/path/to/ARCANA/server/dist/index.js
---
設定例はリポジトリのルートにもあります: `claude_desktop_config.example.json`, `cursor_mcp_config.example.json`, `vscode_mcp_config.example.json`

#### Step 3: エディタにプラグインをインストール

Option A の Step 5 と同じ手順です。

#### Step 4: 試してみる

**シーン生成:**

```
"雪のテレインとドラマチックなライティングでFPSシーンを作って"
"氷テーマのRPGダンジョンを10部屋、ボス部屋付きで作って"
```

**キャラクター作成:**

```
"身長175cm、アスレチック体型のキャラクターを作って"
"髪をウェーブ、30cm、アッシュカラーにラベンダーのハイライトで"
```

**2Dから3D:**

```
"[イラストを貼り付けて] このシーンを3Dで作って"
"[キャラクターの絵を貼り付けて] このキャラクターを作って"
```


## ロードマップ

| フェーズ | 状態 | 内容 |
| --- | --- | --- |
| 1 | 完了 | コアMCPサーバー、SuperSave、ブリッジアーキテクチャ |
| 2 | 完了 | Unity 302ツール（46カテゴリ） |
| 3 | 完了 | Unreal Engine 136ツール（20カテゴリ） |
| 4 | 完了 | Blender 140ツール（15カテゴリ） |
| 5 | **完了** | **832ツール、レシピシステム、キャラクリエイト、クロスエディタパイプライン** |
| 6 | **完了** | **UE C++プラグイン、Blender Pythonアドオン、WebSocketブリッジ、AIクライアント設定** |
| 7 | 次 | E2Eテスト、CI/CD、コミュニティレシピ |

## コントリビュート

ガイドラインは [CONTRIBUTING.md](CONTRIBUTING.md) を参照。すべてのスキルレベル歓迎。

## ライセンス

MIT License. 詳細は [LICENSE](LICENSE) を参照。
