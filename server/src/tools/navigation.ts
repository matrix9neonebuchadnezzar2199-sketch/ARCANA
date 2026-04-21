import { ToolDefinition } from "../core/registry";
import { bridgeSendAsToolResult } from "../core/bridgeToolResult";
import { z } from "zod";
const navBake: ToolDefinition = {
  id: "nav_bake",
  name: "Bake NavMesh",
  description: "Bake the navigation mesh for the current scene",
  descriptionJa: "現在のシーンのNavMeshをベイクする",
  category: "navigation",
  inputSchema: z.object({}),
  handler: async () => {
    return bridgeSendAsToolResult("unity", "NavBake", {}, { successMessage: "NavMesh baked successfully" });
  }
};

const navAddAgent: ToolDefinition = {
  id: "nav_add_agent",
  name: "Add NavMesh Agent",
  description: "Add a NavMeshAgent component to a GameObject",
  descriptionJa: "GameObjectにNavMeshAgentを追加する",
  category: "navigation",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    speed: z.number().optional().default(3.5).describe("Agent speed"),
    radius: z.number().optional().default(0.5).describe("Agent radius"),
    height: z.number().optional().default(2).describe("Agent height")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "NavAddAgent", params, { successMessage: (_, params) => `NavMeshAgent added to ${params.name}` });
  }
};

const navAddObstacle: ToolDefinition = {
  id: "nav_add_obstacle",
  name: "Add NavMesh Obstacle",
  description: "Add a NavMeshObstacle to a GameObject",
  descriptionJa: "GameObjectにNavMeshObstacleを追加する",
  category: "navigation",
  inputSchema: z.object({
    name: z.string().describe("Target GameObject name"),
    carve: z.boolean().optional().default(true).describe("Enable carving"),
    sizeX: z.number().optional().default(1).describe("Obstacle size X"),
    sizeY: z.number().optional().default(1).describe("Obstacle size Y"),
    sizeZ: z.number().optional().default(1).describe("Obstacle size Z")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "NavAddObstacle", params, { successMessage: (_, params) => `NavMeshObstacle added to ${params.name}` });
  }
};

const navAddLink: ToolDefinition = {
  id: "nav_add_link",
  name: "Add OffMesh Link",
  description: "Add an OffMeshLink between two points",
  descriptionJa: "2点間にOffMeshLinkを追加する",
  category: "navigation",
  inputSchema: z.object({
    name: z.string().describe("GameObject to attach the link to"),
    startX: z.number().describe("Start X"), startY: z.number().describe("Start Y"), startZ: z.number().describe("Start Z"),
    endX: z.number().describe("End X"), endY: z.number().describe("End Y"), endZ: z.number().describe("End Z"),
    bidirectional: z.boolean().optional().default(true).describe("Bidirectional link")
  }),
  handler: async (params) => {
    return bridgeSendAsToolResult("unity", "NavAddLink", params, { successMessage: (_, params) => `OffMeshLink added to ${params.name}` });
  }
};

export const navigationTools: ToolDefinition[] = [navBake, navAddAgent, navAddObstacle, navAddLink];