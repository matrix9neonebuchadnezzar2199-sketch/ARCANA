# ARCANA

**Advanced Runtime for Creative AI & Natural-language Automation**

Unity と Blender を自然言語で操作。無料・オープンソース、永久に。

---

## ARCANA とは？

ARCANA は AI アシスタント（Claude、ChatGPT、Gemini、Copilot 等）を [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 経由で Unity Editor・Blender に接続します。メニューやパラメータを手動で操作する代わりに、やりたいことを自然言語で伝えるだけで ARCANA が実行します。

## 特徴

- **自然言語操作** - やりたいことを言葉で伝えるだけで Unity/Blender を操作
- **AI クライアント自由** - Claude Desktop、Cursor、VS Code、ChatGPT、Gemini CLI 等に対応
- **SuperSave モード** - 4つのメタツールで 400以上のツールを動的に呼び出し、トークン消費を約98%削減
- **Unity + Blender 同時対応** - 1つのサーバーで両エディタを同時制御
- **オープンソース** - MIT ライセンス、永久無料、コミュニティ駆動
- **日英バイリンガル** - ツール説明・ドキュメントを日英両対応

## アーキテクチャ

```
AI Client (Claude, ChatGPT, etc.)
        |
    MCP JSON-RPC (stdio / HTTP)
        |
ARCANA MCP Server (Node.js)
    /           \
SignalR       WebSocket
  |               |
Unity Plugin   Blender Addon
(C# Editor)   (Python bpy)
```

## クイックスタート

### 必要環境

- Node.js 18+
- Unity 2022.3+ または Blender 3.6+
- MCP 対応 AI クライアント

### インストール

```bash
git clone https://github.com/matrix9neonebuchadnezzar2199-sketch/ARCANA.git
cd ARCANA/server
npm install
npm run build
```

`unity-plugin` フォルダを Unity プロジェクトにインポートするか、`blender-addon` をインストールしてください。

Unity > Tools > ARCANA > Setup から AI クライアントを自動設定できます。

### テスト

AI アシスタントに話しかけてください：

```
「現在のUnityシーンにあるGameObjectを全部リストして」
「位置(0, 5, 0)に赤いキューブを作って」
```

## SuperSave モード

400以上のツールを全て AI に登録する代わりに、4つのメタツールだけを公開します：

| メタツール | 用途 |
|-----------|------|
| `arcana.discover` | キーワードやカテゴリでツールを検索 |
| `arcana.inspect` | 特定ツールの詳細スキーマを取得 |
| `arcana.execute` | 任意のツールをパラメータ付きで実行 |
| `arcana.compose` | 複数ツールをパイプラインで連鎖実行 |

トークン消費を約98%削減（従来の約1/50）できます。

## ロードマップ

| フェーズ | 状態 | 内容 |
|---------|------|------|
| 1 | 進行中 | コアサーバー、Unity 10ツール、セットアップ |
| 2 | 予定 | Unity 50ツール、VRChat最適化 |
| 3 | 予定 | Blender アドオン、Blender 50ツール |
| 4 | 予定 | SuperSave モード、compose パイプライン |
| 5 | 予定 | 400以上のツール、コミュニティ貢献 |

## コントリビュート

[CONTRIBUTING.md](CONTRIBUTING.md) をご覧ください。スキルレベル不問、どなたでも歓迎します。

## 謝辞

- [Synaptic AI Pro](https://synaptic-ai.net/) - インスピレーションと概念実証
- [Model Context Protocol](https://modelcontextprotocol.io/) - プロトコル標準
- [Unity-MCP](https://github.com/IvanMurzak/Unity-MCP) - アーキテクチャ参考

## ライセンス

MIT License。詳細は [LICENSE](LICENSE) をご覧ください。