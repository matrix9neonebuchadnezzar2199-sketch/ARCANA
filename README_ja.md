<p align="center">
  <img src="image/TOP.png" alt="ARCANA Banner" width="100%">
</p>

<h1 align="center">ARCANA</h1>
<p align="center"><strong>Advanced Runtime for Creative AI & Natural-language Automation</strong></p>
<p align="center"><b>Unity</b>・<b>Unreal Engine</b>・<b>Blender</b> を自然言語で操作。<br>オープンソース、永久無料。</p>

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

<p align="center">日本語 | <a href="README.md">English</a></p>

---

## なぜ ARCANA？

既存のMCPエディタツールは1エディタ・20〜60ツール程度です。
ARCANAは **3エディタ・66カテゴリ・438ツール** を1つのサーバーで提供します。

| | ARCANA | Unity-MCP | Blender-MCP | Unreal-MCP |
|---|---|---|---|---|
| **ツール数** | **438** | ~20 | ~15 | ~30 |
| **エディタ** | Unity + UE + Blender | Unity | Blender | UE |
| **SuperSave** | 4メタツール | - | - | - |

## ARCANA とは？

ARCANAはAIアシスタント（Claude, ChatGPT, Gemini, Copilot, Cursor）を [Model Context Protocol](https://modelcontextprotocol.io/) 経由で **Unity**・**Unreal Engine**・**Blender** に接続します。メニュー操作やパラメータ調整の代わりに、自然言語で指示するだけでARCANAが実行します。

## 主な特徴

- **438ツール / 66カテゴリ** - Unity 302、Unreal Engine 136、Blender 予定
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
ChatGPT 等       stdio/SSE    438ツール/66カテゴリ ----> UE 5    :9878
                                                  ----> Blender :9879
```

## ツール一覧

Unityツール（302）とUnreal Engineツール（136）の詳細は [英語版 README](README.md) を参照してください。

## SuperSave モード

438ツール全てを登録する代わりに、**4つのメタツール**のみ公開：

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
| 4 | 次 | Blenderアドオン + 100〜200 Blenderツール |
| 5 | 予定 | クロスエディタワークフロー、600+ツール、レシピシステム |

## コントリビュート

[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。全てのスキルレベル歓迎です。

## 謝辞

- [Synaptic AI Pro](https://synaptic-ai.net/) - インスピレーションと概念実証
- [Model Context Protocol](https://modelcontextprotocol.io/) - プロトコル標準
- [Unity-MCP](https://github.com/IvanMurzak/Unity-MCP) - アーキテクチャ参考

## ライセンス

MIT License. [LICENSE](LICENSE) を参照してください。