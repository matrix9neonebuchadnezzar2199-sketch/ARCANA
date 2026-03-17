import { z } from "zod";

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  descriptionJa: string;
  category: string;
  inputSchema: z.ZodType<any>;
  handler: (params: any) => Promise<ToolResult>;
}

export interface ToolResult {
  success: boolean;
  message: string;
  data?: any;
}

export class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();

  register(tool: ToolDefinition): void {
    if (this.tools.has(tool.id)) {
      throw new Error(`Tool already registered: ${tool.id}`);
    }
    this.tools.set(tool.id, tool);
    console.log(`[ARCANA] Registered tool: ${tool.id}`);
  }

  get(id: string): ToolDefinition | undefined {
    return this.tools.get(id);
  }

  getAll(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  search(query: string): ToolDefinition[] {
    const q = query.toLowerCase();
    return this.getAll().filter((t) =>
      t.id.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.descriptionJa.includes(query) ||
      t.category.toLowerCase().includes(q)
    );
  }

  getByCategory(category: string): ToolDefinition[] {
    return this.getAll().filter(
      (t) => t.category.toLowerCase() === category.toLowerCase()
    );
  }

  getCategories(): string[] {
    const cats = new Set(this.getAll().map((t) => t.category));
    return Array.from(cats).sort();
  }

  count(): number {
    return this.tools.size;
  }
}

export const globalRegistry = new ToolRegistry();