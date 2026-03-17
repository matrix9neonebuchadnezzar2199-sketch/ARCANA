<p align="center">
  <img src="TOP.png" alt="ARCANA Banner" width="100%">
</p>

<h1 align="center">ARCANA</h1>
<p align="center"><strong>Advanced Runtime for Creative AI & Natural-language Automation</strong></p>
<p align="center">Control Unity and Blender with natural language. Free and open source, forever.</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/tools-57-brightgreen.svg" alt="57 Tools">
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

- **57 Tools** across 16 categories, covering scene, transform, material, lighting, terrain, audio, camera, physics, VFX, animation, UI, optimization, component, prefab, layer/tag, and environment
- **Natural Language Control** - Describe what you want, AI executes it in Unity/Blender
- **Any AI Client** - Works with Claude Desktop, Cursor, VS Code, ChatGPT, Gemini CLI
- **SuperSave Mode** - 4 meta-tools dynamically load all tools, reducing token usage by ~98%
- **Unity + Blender** - One server controls both editors simultaneously
- **Open Source** - MIT License, free forever, community-driven
- **Bilingual** - English and Japanese support
- **Undo Safe** - Every tool supports Unity Undo/Redo

## Architecture

```
AI Client (Claude, ChatGPT, etc.)
        |
    MCP JSON-RPC (stdio / HTTP)
        |
ARCANA MCP Server (Node.js)
    /           \
WebSocket     WebSocket
  |               |
Unity Plugin   Blender Addon
(C# Editor)   (Python bpy)
```

## Tool List (57 tools)

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

## SuperSave Mode

Instead of registering all 57 tools in the AI context, SuperSave exposes only 4 meta-tools:

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
| 1 | Done | Core server, SuperSave, 57 Unity tools |
| 2 | Next | Navigation, PostProcessing, Script generation |
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