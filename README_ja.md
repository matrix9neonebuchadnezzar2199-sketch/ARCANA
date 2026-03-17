<div align="center">

![ARCANA Banner](image/TOP.png)

**Advanced Runtime for Creative AI & Natural-language Automation**

Unity Blender

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![57 Tools](https://img.shields.io/badge/Tools-302-blue.svg)]()
[![Unity 2022.3+](https://img.shields.io/badge/Unity-2022.3+-black.svg)]()
[![Node 18+](https://img.shields.io/badge/Node.js-18+-339933.svg)]()
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-purple.svg)]()

[English](README.md) | 日本語

</div>

---

## ARCANAとは？

ARCANAは、AIアシスタント（Claude、ChatGPT、Gemini、Copilotなど）を[Model Context Protocol (MCP)](https://modelcontextprotocol.io/)経由でUnity EditorおよびBlenderに接続するオープンソースブリッジです。

メニューをクリックしてパラメータを手動調整する代わりに、やりたいことを自然言語で伝えるだけでARCANAが実行します。

## 特徴

- **302ツール** — 46カテゴリをカバー
- **自然言語操作** — やりたいことを言葉で伝えるだけ。AIがUnity/Blenderで実行
- **あらゆるAIクライアント対応** — Claude Desktop、Cursor、VS Code、ChatGPT、Gemini CLI
- **SuperSaveモード** — 4つのメタツールで全ツールを動的ロード、トークン消費を約98%削減
- **Unity + Blender** — 1つのサーバーで両エディタを同時制御
- **オープンソース** — MITライセンス、永久無料、コミュニティ主導
- **バイリンガル** — 英語・日本語対応
- **Undo対応** — すべてのツールがUnityのUndo/Redoに対応
## アーキテクチャ

![ARCANA to Unity and Blender](image/ARCANA%20to%20Unity%26Blender.png)

## ツール一覧（302ツール）

### シーン（3）

| ツールID | 説明 |
|---------|------|
| scene_list_objects | シーン内の全GameObjectを一覧表示 |
| scene_create_gameobject | プリミティブ・座標・色を指定してGameObjectを作成 |
| scene_delete_gameobject | 名前を指定してGameObjectを削除 |

### トランスフォーム（5）

| ツールID | 説明 |
|---------|------|
| transform_set_position | ワールド座標を設定 |
| transform_set_rotation | オイラー角で回転を設定 |
| transform_set_scale | ローカルスケールを設定 |
| transform_set_parent | 親子関係を設定 |
| transform_look_at | 指定座標の方向を向かせる |

### マテリアル（5）

| ツールID | 説明 |
|---------|------|
| material_set_color | メインカラーを設定 |
| material_set_transparency | アルファ値で透明度を自動設定 |
| material_set_emission | 発光の色と強度を設定 |
| material_set_shader | シェーダーを変更 |
| material_set_texture | ファイルからメインテクスチャを設定 |

### ライティング（5）

| ツールID | 説明 |
|---------|------|
| lighting_create_light | Directional/Point/Spot/Areaライトを作成 |
| lighting_set_color | ライトの色を変更 |
| lighting_set_intensity | ライトの強度を変更 |
| lighting_set_shadow | 影モードを設定（None/Hard/Soft） |
| lighting_set_ambient | アンビエントライトの色と強度を設定 |

### 地形（4）

| ツールID | 説明 |
|---------|------|
| terrain_create | カスタムサイズの地形を作成 |
| terrain_set_height | 正規化座標で高さを設定 |
| terrain_add_texture | テクスチャレイヤーを追加 |
| terrain_add_trees | 木のインスタンスを配置 |

### オーディオ（3）

| ツールID | 説明 |
|---------|------|
| audio_add_source | AudioSourceを追加（クリップ、ループ、音量） |
| audio_set_volume | 音量を設定 |
| audio_set_spatial | 3D空間オーディオを設定 |

### カメラ（3）

| ツールID | 説明 |
|---------|------|
| camera_create | 座標とFOVを指定してカメラを作成 |
| camera_set_fov | 視野角を設定 |
| camera_set_background | 背景色とクリアフラグを設定 |

### 物理（3）

| ツールID | 説明 |
|---------|------|
| physics_add_rigidbody | Rigidbodyを追加（質量、重力、キネマティック） |
| physics_add_collider | Box/Sphere/Capsule/Meshコライダーを追加 |
| physics_set_gravity | シーン全体の重力を設定 |
### VFX（4）

| ツールID | 説明 |
|---------|------|
| vfx_create_particle | パーティクルシステムを作成 |
| vfx_set_color | パーティクルの開始色を設定 |
| vfx_set_speed | パーティクルの速度と寿命を設定 |
| vfx_set_shape | 発射形状を設定 |

### アニメーション（4）

| ツールID | 説明 |
|---------|------|
| anim_add_animator | Animatorをコントローラー付きで追加 |
| anim_set_parameter | Animatorパラメータを設定（float/int/bool/trigger） |
| anim_play | アニメーションステートを再生 |
| anim_create_clip | 位置キーフレーム付きアニメーションクリップを作成 |

### UI（4）

| ツールID | 説明 |
|---------|------|
| ui_create_canvas | レンダーモード指定でCanvasを作成 |
| ui_create_text | テキスト要素を作成 |
| ui_create_button | ラベル付きボタンを作成 |
| ui_create_image | 画像要素を作成 |

### 最適化（4）

| ツールID | 説明 |
|---------|------|
| opt_get_scene_stats | オブジェクト/三角形/マテリアル数を取得 |
| opt_set_static | バッチング用にStaticフラグを設定 |
| opt_add_lod_group | LOD Groupを追加 |
| opt_remove_missing_scripts | 欠落スクリプトをすべて除去 |

### コンポーネント（4）

| ツールID | 説明 |
|---------|------|
| component_add | タイプ名で任意のコンポーネントを追加 |
| component_remove | タイプ名でコンポーネントを削除 |
| component_set_enabled | コンポーネントの有効/無効を切り替え |
| component_list | オブジェクトの全コンポーネントを一覧表示 |

### プレハブ（3）

| ツールID | 説明 |
|---------|------|
| prefab_create | GameObjectをプレハブとして保存 |
| prefab_instantiate | プレハブをシーンにインスタンス化 |
| prefab_unpack | プレハブインスタンスをアンパック |

### レイヤー / タグ（3）

| ツールID | 説明 |
|---------|------|
| layertag_set_layer | レイヤーを設定（子オブジェクト含むオプション） |
| layertag_set_tag | タグを設定 |
| layertag_rename | GameObjectの名前を変更 |

### 環境（3）

| ツールID | 説明 |
|---------|------|
| env_set_skybox | スカイボックスマテリアルを設定 |
| env_set_fog | フォグを設定（リニア/エクスポネンシャル） |
| env_set_reflection | 反射ソースと強度を設定 |

### ナビゲーション（4）
| ツールID | 説明 |
|---------|------|
| nav_bake | NavMeshをベイク |
| nav_add_agent | NavMeshAgentを追加 |
| nav_add_obstacle | NavMeshObstacleを追加 |
| nav_add_link | OffMeshLinkを追加 |

### ポストプロセシング（5）
| ツールID | 説明 |
|---------|------|
| post_set_bloom | Bloom効果を設定 |
| post_set_color_adjust | カラー調整を設定 |
| post_set_dof | 被写界深度を設定 |
| post_set_vignette | ビネットを設定 |
| post_set_motion_blur | モーションブラーを設定 |

### スクリプト（4）
| ツールID | 説明 |
|---------|------|
| script_create | 新しいC#スクリプトを作成 |
| script_attach | GameObjectにスクリプトをアタッチ |
| script_set_variable | スクリプトのpublic変数を設定 |
| script_invoke_method | スクリプトのメソッドを呼び出し |

### セレクション（4）
| ツールID | 説明 |
|---------|------|
| select_object | エディタでGameObjectを選択 |
| select_all | 全GameObjectを選択 |
| select_none | 選択を解除 |
| select_invert | 選択を反転 |

### コンストレイント（4）
| ツールID | 説明 |
|---------|------|
| constraint_position | Position Constraintを追加 |
| constraint_rotation | Rotation Constraintを追加 |
| constraint_scale | Scale Constraintを追加 |
| constraint_aim | Aim Constraintを追加 |

### ビルド（6）
| ツールID | 説明 |
|---------|------|
| build_set_platform | ビルドターゲットプラットフォームを設定 |
| build_add_scene | ビルド設定にシーンを追加 |
| build_set_player | プレイヤー設定を変更 |
| build_execute | ビルドを実行 |
| build_get_settings | 現在のビルド設定を取得 |
| build_clean | ビルドキャッシュをクリア |

### レンダー（4）
| ツールID | 説明 |
|---------|------|
| render_screenshot | スクリーンショットを撮影 |
| render_set_resolution | ゲーム解像度を設定 |
| render_set_quality | クオリティレベルを設定 |
| render_capture_cubemap | キューブマップをキャプチャ |

### アセット（5）
| ツールID | 説明 |
|---------|------|
| asset_import | ファイルからアセットをインポート |
| asset_delete | アセットを削除 |
| asset_rename | アセット名を変更 |
| asset_move | アセットをフォルダに移動 |
| asset_refresh | AssetDatabaseを更新 |

### エディタ（5）
| ツールID | 説明 |
|---------|------|
| editor_play_mode | 再生/停止を切り替え |
| editor_save_scene | 現在のシーンを保存 |
| editor_load_scene | シーンを読み込み |
| editor_undo_redo | Undo/Redoを実行 |
| editor_clear_console | コンソールをクリア |

### メッシュ（6）
| ツールID | 説明 |
|---------|------|
| mesh_combine | メッシュを結合 |
| mesh_separate | メッシュを分離 |
| mesh_set_vertices | 頂点位置を設定 |
| mesh_recalculate | 法線/バウンズを再計算 |
| mesh_export | OBJ/FBXにエクスポート |
| mesh_get_info | メッシュ情報を取得 |

### タイムライン（6）
| ツールID | 説明 |
|---------|------|
| timeline_create | Timelineアセットを作成 |
| timeline_add_track | トラックを追加 |
| timeline_add_clip | クリップを追加 |
| timeline_set_duration | 再生時間を設定 |
| timeline_bind_object | オブジェクトをバインド |
| timeline_play | タイムラインを再生 |

### Cinemachine（6）
| ツールID | 説明 |
|---------|------|
| cm_create | 仮想カメラを作成 |
| cm_set_follow | フォロー対象を設定 |
| cm_set_look_at | ルックアット対象を設定 |
| cm_set_blend | カメラブレンドを設定 |
| cm_set_noise | ノイズプロファイルを設定 |
| cm_create_freelook | FreeLookカメラを作成 |

### ProBuilder（6）
| ツールID | 説明 |
|---------|------|
| pb_create_shape | ProBuilderシェイプを作成 |
| pb_extrude_face | フェイスを押し出し |
| pb_set_material | フェイスにマテリアルを設定 |
| pb_merge | オブジェクトを結合 |
| pb_subdivide | メッシュを細分化 |
| pb_export | OBJにエクスポート |

### Input System（6）
| ツールID | 説明 |
|---------|------|
| input_create_action | 入力アクションを作成 |
| input_add_binding | バインディングを追加 |
| input_enable | アクションの有効/無効 |
| input_create_map | アクションマップを作成 |
| input_read_value | 入力値を読み取り |
| input_remove_binding | バインディングを削除 |

### シェーダー（6）
| ツールID | 説明 |
|---------|------|
| shader_create_graph | Shader Graphを作成 |
| shader_add_node | ノードを追加 |
| shader_connect | ノードを接続 |
| shader_set_property | プロパティを設定 |
| shader_compile | シェーダーをコンパイル |
| shader_assign | マテリアルに割り当て |

### ネットワーキング（6）
| ツールID | 説明 |
|---------|------|
| net_setup | ネットワークをセットアップ |
| net_spawn | ネットワークオブジェクトをスポーン |
| net_send_rpc | RPCを送信 |
| net_sync_var | 変数を同期 |
| net_connect | サーバーに接続 |
| net_disconnect | 切断 |

### 2D（6）
| ツールID | 説明 |
|---------|------|
| 2d_create_sprite | スプライトオブジェクトを作成 |
| 2d_set_sorting_layer | ソートレイヤーとオーダーを設定 |
| 2d_create_tilemap | タイルマップを作成 |
| 2d_set_tile | タイルを配置 |
| 2d_add_collider | 2Dコライダーを追加 |
| 2d_add_animator | 2Dアニメーターを追加 |

### VRChat（10）
| ツールID | 説明 |
|---------|------|
| vrc_setup_avatar | VRChatアバターをセットアップ |
| vrc_add_mirror | VRCミラーを追加 |
| vrc_add_pickup | VRCピックアップを追加 |
| vrc_set_spawn | スポーンポイントを設定 |
| vrc_add_portal | ワールドポータルを追加 |
| vrc_setup_station | ステーション/椅子をセットアップ |
| vrc_add_trigger | VRCトリガーを追加 |
| vrc_set_layer | VRCレイヤーを設定 |
| vrc_optimize | VRChat用に最適化 |
| vrc_validate | アバター/ワールドを検証 |

### Addressables（6）
| ツールID | 説明 |
|---------|------|
| addr_mark | アセットをAddressableに設定 |
| addr_create_group | Addressableグループを作成 |
| addr_set_address | アセットアドレスを設定 |
| addr_build | Addressablesをビルド |
| addr_load | 実行時にAddressableをロード |
| addr_release | Addressableを解放 |

### ローカライゼーション（6）
| ツールID | 説明 |
|---------|------|
| loc_create_table | 文字列テーブルを作成 |
| loc_add_entry | ローカライズエントリを追加 |
| loc_add_locale | ロケールを追加 |
| loc_set_active | アクティブロケールを設定 |
| loc_export | ローカライゼーションをエクスポート |
| loc_import | ローカライゼーションをインポート |

### デバッグ（10）
| ツールID | 説明 |
|---------|------|
| debug_log | メッセージをログ出力 |
| debug_draw_ray | デバッグレイを描画 |
| debug_draw_line | デバッグラインを描画 |
| debug_draw_sphere | デバッグスフィアを描画 |
| debug_break | エディタを一時停止 |
| debug_clear | デバッグ描画をクリア |
| debug_time_scale | タイムスケールを設定 |
| debug_fps | FPSオーバーレイを表示 |
| debug_bounds | オブジェクトバウンズを表示 |
| debug_hierarchy | ヒエラルキーツリーを出力 |

### テスティング（8）
| ツールID | 説明 |
|---------|------|
| test_create | テストクラスを作成 |
| test_run | テストを実行 |
| test_assert | アサーションを追加 |
| test_mock | モックオブジェクトを作成 |
| test_perf | パフォーマンステスト |
| test_coverage | カバレッジを確認 |
| test_report | レポートを生成 |
| test_cleanup | テストデータをクリーンアップ |

### プロファイラー（10）
| ツールID | 説明 |
|---------|------|
| prof_cpu_start | CPUプロファイリングを開始 |
| prof_cpu_stop | CPUプロファイリングを停止 |
| prof_mem_snapshot | メモリスナップショット |
| prof_gpu | GPUプロファイリング |
| prof_frame | フレーム分析 |
| prof_bottleneck | ボトルネックを検出 |
| prof_drawcalls | ドローコールを分析 |
| prof_batches | バッチを分析 |
| prof_heap | ヒープ分析 |
| prof_save | プロファイラーデータを保存 |

### XR / VR（10）
| ツールID | 説明 |
|---------|------|
| xr_setup | XR環境をセットアップ |
| xr_tracking | トラッキングを設定 |
| xr_controller | コントローラーをセットアップ |
| xr_haptics | ハプティクスフィードバック |
| xr_teleport | テレポートをセットアップ |
| xr_grab | グラブインタラクションを有効化 |
| xr_ray_interaction | レイインタラクションをセットアップ |
| xr_ui | XR UIキャンバスをセットアップ |
| xr_passthrough | パススルーを切り替え |
| xr_boundary | プレイ境界を設定 |

### AI / NavAgent（8）
| ツールID | 説明 |
|---------|------|
| ai_set_destination | エージェントの目的地を設定 |
| ai_patrol | パトロール経路を設定 |
| ai_chase | ターゲットを追跡 |
| ai_flee | 脅威から逃走 |
| ai_idle | アイドル状態にする |
| ai_set_speed | エージェント速度を設定 |
| ai_avoidance | 回避優先度を設定 |
| ai_visualize_path | ナビパスを可視化 |

### スプライン（8）
| ツールID | 説明 |
|---------|------|
| spline_create | スプラインコンテナを作成 |
| spline_add_knot | 制御点を追加 |
| spline_remove_knot | 制御点を削除 |
| spline_set_tangent | ノットのタンジェントを設定 |
| spline_animate | スプラインに沿ってアニメーション |
| spline_extrude | スプラインに沿ってメッシュ押し出し |
| spline_evaluate | スプライン上の点を評価 |
| spline_get_length | スプラインの長さを取得 |

### Visual Scripting（8）
| ツールID | 説明 |
|---------|------|
| vs_create_graph | ビジュアルスクリプトグラフを作成 |
| vs_add_node | グラフにノードを追加 |
| vs_connect_nodes | ノードを接続 |
| vs_set_variable | グラフ変数を設定 |
| vs_add_event | イベントノードを追加 |
| vs_remove_node | ノードを削除 |
| vs_add_subgraph | サブグラフを埋め込み |
| vs_list_nodes | 全ノードを一覧表示 |

### ラグドール（6）
| ツールID | 説明 |
|---------|------|
| ragdoll_create | ラグドールをセットアップ |
| ragdoll_enable | ラグドールの有効/無効 |
| ragdoll_set_joint_limits | ジョイント制限を設定 |
| ragdoll_add_force | ボーンに力を加える |
| ragdoll_set_collision | 衝突モードを設定 |
| ragdoll_remove | ラグドールを除去 |

### クロス（5）
| ツールID | 説明 |
|---------|------|
| cloth_add | Clothコンポーネントを追加 |
| cloth_set_params | クロスパラメータを設定 |
| cloth_set_gravity | クロス重力を設定 |
| cloth_add_collider | クロスコライダーを追加 |
| cloth_remove | クロスを除去 |

### デカール（5）
| ツールID | 説明 |
|---------|------|
| decal_create | デカールプロジェクターを作成 |
| decal_set_size | デカールサイズを設定 |
| decal_set_material | デカールマテリアルを設定 |
| decal_set_opacity | デカール不透明度を設定 |
| decal_remove | デカールを除去 |

### LOD（6）
| ツールID | 説明 |
|---------|------|
| lod_create_group | LOD Groupコンポーネントを作成 |
| lod_set_transitions | LOD遷移距離を設定 |
| lod_assign_renderer | LODレベルにレンダラーを割り当て |
| lod_set_fade_mode | フェードモードを設定（None/CrossFade/SpeedTree） |
| lod_get_info | LOD Group情報を取得 |
| lod_remove | LOD Groupを除去 |

### ギズモ（6）
| ツールID | 説明 |
|---------|------|
| gizmo_draw_sphere | ワイヤースフィアギズモを描画 |
| gizmo_draw_cube | ワイヤーキューブギズモを描画 |
| gizmo_draw_line | ラインギズモを描画 |
| gizmo_draw_ray | レイギズモを描画 |
| gizmo_draw_label | シーンにテキストラベルを描画 |
| gizmo_clear_all | 全カスタムギズモをクリア |

### Reflection Probe（6）
| ツールID | 説明 |
|---------|------|
| probe_create | Reflection Probeを作成 |
| probe_set_size | バウンディングボックスサイズを設定 |
| probe_set_resolution | キューブマップ解像度を設定 |
| probe_set_intensity | 反射強度を設定 |
| probe_bake | Reflection Probeをベイク |
| probe_remove | Reflection Probeを除去 |

### ライトマップ（6）
| ツールID | 説明 |
|---------|------|
| lightmap_bake | ライトマップをベイク |
| lightmap_set_resolution | テクセル/ユニットを設定 |
| lightmap_set_max_size | アトラス最大サイズを設定 |
| lightmap_set_object_scale | オブジェクトのライトマップスケールを設定 |
| lightmap_clear | ベイク済みライトマップをクリア |
| lightmap_get_info | ライトマップ設定を取得 |

### オクルージョンカリング（6）
| ツールID | 説明 |
|---------|------|
| occlusion_bake | オクルージョンカリングをベイク |
| occlusion_set_occluder | Occluder Staticを設定 |
| occlusion_set_occludee | Occludee Staticを設定 |
| occlusion_set_params | オクルージョンパラメータを設定 |
| occlusion_clear | オクルージョンデータをクリア |
| occlusion_visualize | オクルージョン可視化を切り替え |

### ストリーミング（6）
| ツールID | 説明 |
|---------|------|
| streaming_load_scene | シーンを非同期ロード |
| streaming_unload_scene | シーンを非同期アンロード |
| streaming_set_active_scene | アクティブシーンを設定 |
| streaming_get_loaded_scenes | ロード済みシーンを一覧表示 |
| streaming_preload | シーンをプリロード |
| streaming_get_progress | ロード進捗を取得 |

### タグマネージャー（4）
| ツールID | 説明 |
|---------|------|
| tagmgr_add_tag | カスタムタグを追加 |
| tagmgr_add_layer | カスタムレイヤーを追加 |
| tagmgr_add_sorting_layer | ソーティングレイヤーを追加 |
| tagmgr_list_all | 全タグ・レイヤーを一覧表示 |

### スクリーンショット（4）
| ツールID | 説明 |
|---------|------|
| screenshot_game_view | Game Viewをキャプチャ |
| screenshot_scene_view | Scene Viewをキャプチャ |
| screenshot_camera | 特定カメラからキャプチャ |
| screenshot_360 | 360度パノラマをキャプチャ |

## SuperSaveモード

302ツールすべてをAIコンテキストに登録する代わりに、SuperSaveは4つのメタツールのみを公開します：

| メタツール | 用途 |
|-----------|------|
| arcana.discover | キーワードやカテゴリでツールを検索 |
| arcana.inspect | 特定ツールの完全なスキーマを取得 |
| arcana.execute | パラメータを指定してツールを実行 |
| arcana.compose | 複数ツールをパイプラインで連鎖実行 |

これによりトークン消費を約 **98%** 削減できます。

## クイックスタート

### 必要環境

- Node.js 18+
- Unity 2022.3+ または Blender 3.6+
- MCP対応のAIクライアント

### インストール

git clone https://github.com/matrix9neonebuchadnezzar2199-sketch/ARCANA.git
cd ARCANA/server
npm install
npm run build

Unityプロジェクトに unity-plugin フォルダをインポートしてください。

Unity > Tools > ARCANA > Setup を開くと、AIクライアントの設定が自動で行われます。

### テストしてみよう

AIアシスタントに話しかけてください：

- 「現在のUnityシーンにあるGameObjectを全部リストして」
- 「赤いキューブを座標(0, 5, 0)に作って」
- 「キューブの上にソフトシャドウ付きのポイントライトを追加して」
- 「500x500の地形を作って、草のテクスチャと200本の木を配置して」

## ロードマップ

| フェーズ | 状況 | 内容 |
|---------|------|------|
| 1 | 完了 | コアサーバー、SuperSave、Unity 302ツール |
| 2 | 完了 | Navigation、PostProcessing、Script、Selection、Constraint、Build、Render、Asset、Editor、Mesh、Timeline、Cinemachine、ProBuilder、Input、Shader、Networking、2D、VRChat、Addressables、Localization、Debug、Testing、Profiler、XR、AI、Spline、VisualScripting、Ragdoll、Cloth、Decal、LOD、Gizmo、ReflectionProbe、Lightmap、OcclusionCulling、Streaming、TagManager、Screenshot |
| 3 | 予定 | Blenderアドオン、50+ツール |
| 4 | 予定 | Unreal Engine対応 |
| 5 | 予定 | 400+ツール、コミュニティ貢献 |

## コントリビュート

ガイドラインは [CONTRIBUTING.md](CONTRIBUTING.md) をご覧ください。スキルレベル問わず歓迎します。

## 謝辞

- [Synaptic AI Pro](https://synaptic-ai.net/) — インスピレーションと概念実証
- [Model Context Protocol](https://modelcontextprotocol.io/) — プロトコル標準
- [Unity-MCP](https://github.com/IvanMurzak/Unity-MCP) — アーキテクチャ参考

## ライセンス

MITライセンス。詳細は [LICENSE](LICENSE) をご覧ください。