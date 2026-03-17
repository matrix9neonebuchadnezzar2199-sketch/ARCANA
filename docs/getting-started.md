# Getting Started with ARCANA

## Prerequisites

- Node.js 18 or later (https://nodejs.org/)
- Unity 2022.3 LTS or later
- An MCP-compatible AI client (Claude Desktop recommended)

## Step 1: Clone the Repository

```bash
git clone https://github.com/matrix9neonebuchadnezzar2199-sketch/ARCANA.git
```

## Step 2: Build the Server

```bash
cd ARCANA/server
npm install
npm run build
```

## Step 3: Import Unity Plugin

Copy the `unity-plugin` folder into your Unity project Assets folder,
or add it as a local package in Package Manager.

## Step 4: Run Setup

In Unity, go to Tools > ARCANA > Setup. Select your AI client and
click "Complete MCP Setup". This generates the config JSON.

## Step 5: Configure AI Client

Copy the generated JSON into your AI client config file:

- Claude Desktop: Settings > Developer > Edit Config
- Cursor: ~/.cursor/mcp.json
- VS Code: .vscode/mcp.json

## Step 6: Restart and Test

Restart your AI client and try:

```
"List all objects in the Unity scene"
"Create a red cube at (0, 3, 0)"
```

## Troubleshooting

- Verify Node.js: run `node -v` in terminal
- Ensure Unity is running with the project open
- Check the Unity Console for ARCANA log messages
- Rebuild server if you update TypeScript files