# Contributing to ARCANA

Thank you for your interest in contributing to ARCANA!

## How to Contribute

### 1. Report Bugs

- Use the Bug Report issue template
- Include Unity/Blender version, OS, AI client, and steps to reproduce

### 2. Request New Tools

- Use the New Tool Request issue template
- Describe the tool purpose and expected behavior

### 3. Submit Code

#### Adding a New Tool

1. Server side: Copy `server/src/tools/_template.ts` to your new file
2. Unity side: Copy `unity-plugin/Editor/Tools/ToolTemplate.cs` to your new file
3. Register: Add `[ArcanaTool]` attribute to your C# method
4. Test: Verify with `arcana.execute({ tool: "your_tool", params: {...} })`
5. PR: Submit with description, test results, and example prompts

#### Code Style

- TypeScript: ESLint default rules
- C#: Unity conventions (PascalCase public, _camelCase private)
- Python: PEP 8

#### Commit Messages

Use conventional commits:

```
feat(tools): add terrain_create tool
fix(bridge): resolve WebSocket reconnection issue
docs: update adding-tools guide in Japanese
```

### 4. Improve Documentation

- Translations (especially Japanese) are always welcome
- Add usage examples with real AI prompts

## Tool Design Principles

1. **Atomic** - One tool does one clear action
2. **Undo-safe** - All tools must support Unity Undo
3. **Bilingual** - Descriptions in English, examples in EN and JA
4. **Error-rich** - Return meaningful error messages, never fail silently
5. **Token-efficient** - Keep tool schemas minimal for SuperSave mode

## License

By contributing, you agree that your contributions will be licensed under the MIT License.