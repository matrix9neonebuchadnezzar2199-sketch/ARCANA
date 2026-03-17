import { ToolDefinition } from "../core/registry";
import { z } from "zod";
import { unityBridge } from "../bridge/unity-bridge";

const navBake: ToolDefinition = {
  id: "nav_bake",
  name: "Bake NavMesh",
  description: "Bake the navigation mesh for the current scene",
  descriptionJa: "現在のシーンのNavMeshをベイクする",
  category: "navigation",
  inputSchema: z.object({}),
  handler: async () => {
    try {
      const result = await unityBridge.send("NavBake", {});
      return { success: true, message: "NavMesh baked successfully", data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
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
    try {
      const result = await unityBridge.send("NavAddAgent", params);
      return { success: true, message: `NavMeshAgent added to ${params.name}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
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
    try {
      const result = await unityBridge.send("NavAddObstacle", params);
      return { success: true, message: `NavMeshObstacle added to ${params.name}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
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
    try {
      const result = await unityBridge.send("NavAddLink", params);
      return { success: true, message: `OffMeshLink added to ${params.name}`, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};

export const navigationTools: ToolDefinition[] = [navBake, navAddAgent, navAddObstacle, navAddLink];