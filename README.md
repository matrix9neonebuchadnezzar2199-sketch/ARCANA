# ARCANA

**Advanced Runtime for Creative AI & Natural-language Automation**

Control Unity and Blender with natural language. Free and open source, forever.

---

## What is ARCANA?

ARCANA connects AI assistants (Claude, ChatGPT, Gemini, Copilot, etc.) to Unity Editor and Blender via the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/). Instead of clicking through menus and adjusting parameters manually, you describe what you want in plain language and ARCANA executes it.

## Features

- **Natural Language Control** - Describe what you want, AI executes it in Unity/Blender
- **Any AI Client** - Works with Claude Desktop, Cursor, VS Code, ChatGPT, Gemini CLI
- **SuperSave Mode** - 4 meta-tools dynamically load 400+ tools, reducing token usage by ~98%
- **Unity + Blender** - One server controls both editors simultaneously
- **Open Source** - MIT License, free forever, community-driven
- **Bilingual** - English and Japanese support

## Architecture

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

Then import the `unity-plugin` folder into your Unity project, or install the `blender-addon`.

Open Unity > Tools > ARCANA > Setup to configure your AI client automatically.

### Test It

Tell your AI assistant:

```
"List all GameObjects in the current Unity scene"
"Create a red cube at position (0, 5, 0)"
```

## SuperSave Mode

Instead of registering 400+ tools in the AI context, SuperSave exposes only 4 meta-tools:

| Meta-Tool | Purpose |
|-----------|---------|
| `arcana.discover` | Search available tools by keyword or category |
| `arcana.inspect` | Get full schema for a specific tool |
| `arcana.execute` | Run any tool with parameters |
| `arcana.compose` | Chain multiple tools in a pipeline |

This reduces token consumption by approximately 98% (1/50th of full registration).

## Roadmap

| Phase | Status | Content |
|-------|--------|---------|
| 1 | In Progress | Core server, 10 Unity tools, setup wizard |
| 2 | Planned | 50 Unity tools, VRChat optimization |
| 3 | Planned | Blender addon, 50 Blender tools |
| 4 | Planned | SuperSave mode, compose pipelines |
| 5 | Planned | 400+ tools, community contributions |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. All skill levels welcome.

## Acknowledgements

- [Synaptic AI Pro](https://synaptic-ai.net/) - Inspiration and proof of concept
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol standard
- [Unity-MCP](https://github.com/IvanMurzak/Unity-MCP) - Architecture reference

## License

MIT License. See [LICENSE](LICENSE) for details.