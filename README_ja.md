<div align="center">

![ARCANA Banner](TOP.png)

**Advanced Runtime for Creative AI & Natural-language Automation**

Unity Blender

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![57 Tools](https://img.shields.io/badge/Tools-57-blue.svg)]()
[![Unity 2022.3+](https://img.shields.io/badge/Unity-2022.3+-black.svg)]()
[![Node 18+](https://img.shields.io/badge/Node.js-18+-339933.svg)]()
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-purple.svg)]()

[English](README.md) | 日本語

</div>

---

## ARCANAとは？

ARCANAは、AIアシスタント（Claude、ChatGPT、Gemini、Copilotなど）を[Model Context Protocol (MCP)](https://modelcontextprotocol.io/)経由でUnity EditorおよびBlenderに接続するオープンソースブリッジです。

メニューをクリックしてパラメータを手動調整する代わりに、やりたいことを自然言語で伝えるだけでARCANAが実行します。

![ARCANA to Unity and Blender](image/ARCANA%20to%20Unity%26Blender.png)

## 特徴

- **57ツール** — 16カテゴリをカバー
- **自然言語操作** — やりたいことを言葉で伝えるだけ。AIがUnity/Blenderで実行
- **あらゆるAIクライアント対応** — Claude Desktop、Cursor、VS Code、ChatGPT、Gemini CLI
- **SuperSaveモード** — 4つのメタツールで全ツールを動的ロード、トークン消費を約98%削減
- **Unity + Blender** — 1つのサーバーで両エディタを同時制御
- **オープンソース** — MITライセンス、永久無料、コミュニティ主導
- **バイリンガル** — 英語・日本語対応
- **Undo対応** — すべてのツールがUnityのUndo/Redoに対応
## アーキテクチャ

AIクライアント（Claude、ChatGPTなど） → MCP JSON-RPC (stdio/HTTP) → ARCANA MCPサーバー (Node.js) → WebSocket → Unityプラグイン (C#) / Blenderアドオン (Python)

## ツール一覧（57ツール）

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

## SuperSaveモード

57ツールすべてをAIコンテキストに登録する代わりに、SuperSaveは4つのメタツールのみを公開します：

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
| 1 | 完了 | コアサーバー、SuperSave、Unity 57ツール |
| 2 | 次 | Navigation、PostProcessing、Script生成 |
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