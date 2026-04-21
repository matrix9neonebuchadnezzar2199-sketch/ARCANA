import { globalRegistry, ToolResult } from "./registry";

/**
 * Handlers that return the raw editor payload (legacy) are wrapped so MCP / SuperSave always expose {@link ToolResult}.
 */
function coerceToolResult(result: unknown, toolId: string): ToolResult {
  if (result !== null && typeof result === "object" && typeof (result as ToolResult).success === "boolean") {
    return result as ToolResult;
  }
  return {
    success: true,
    message: `${toolId} completed`,
    data: result as any,
  };
}

export interface DiscoverParams {
  query?: string;
  category?: string;
}

export interface InspectParams {
  toolId: string;
}

export interface ExecuteParams {
  toolId: string;
  params: Record<string, any>;
}

export interface ComposeStep {
  toolId: string;
  params: Record<string, any>;
}

export interface ComposeParams {
  steps: ComposeStep[];
}

export class SuperSaveEngine {

  async discover(params: DiscoverParams): Promise<ToolResult> {
    let tools;
    if (params.category) {
      tools = globalRegistry.getByCategory(params.category);
    } else if (params.query) {
      tools = globalRegistry.search(params.query);
    } else {
      tools = globalRegistry.getAll();
    }

    const summary = tools.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      description: t.description
    }));

    return {
      success: true,
      message: `Found ${summary.length} tools.`,
      data: {
        tools: summary,
        categories: globalRegistry.getCategories(),
        totalRegistered: globalRegistry.count()
      }
    };
  }

  async inspect(params: InspectParams): Promise<ToolResult> {
    const tool = globalRegistry.get(params.toolId);
    if (!tool) {
      return {
        success: false,
        message: `Tool not found: ${params.toolId}`
      };
    }

    return {
      success: true,
      message: `Schema for ${tool.id}`,
      data: {
        id: tool.id,
        name: tool.name,
        description: tool.description,
        descriptionJa: tool.descriptionJa,
        category: tool.category,
        inputSchema: JSON.parse(JSON.stringify(tool.inputSchema))
      }
    };
  }

  async execute(params: ExecuteParams): Promise<ToolResult> {
    const tool = globalRegistry.get(params.toolId);
    if (!tool) {
      return {
        success: false,
        message: `Tool not found: ${params.toolId}`
      };
    }

    try {
      const result = await tool.handler(params.params);
      return coerceToolResult(result, params.toolId);
    } catch (error: any) {
      return {
        success: false,
        message: `Error executing ${params.toolId}: ${error.message}`
      };
    }
  }

  async compose(params: ComposeParams): Promise<ToolResult> {
    const results: any[] = [];
    let lastResult: any = null;

    for (const step of params.steps) {
      const tool = globalRegistry.get(step.toolId);
      if (!tool) {
        return {
          success: false,
          message: `Tool not found in pipeline: ${step.toolId}`,
          data: { completedSteps: results }
        };
      }

      try {
        lastResult = coerceToolResult(await tool.handler(step.params), step.toolId);
        results.push({
          toolId: step.toolId,
          result: lastResult
        });

        if (!lastResult.success) {
          return {
            success: false,
            message: `Pipeline failed at step ${step.toolId}`,
            data: { completedSteps: results }
          };
        }
      } catch (error: any) {
        return {
          success: false,
          message: `Pipeline error at ${step.toolId}: ${error.message}`,
          data: { completedSteps: results }
        };
      }
    }

    return {
      success: true,
      message: `Pipeline completed: ${results.length} steps executed.`,
      data: { steps: results }
    };
  }
}

export const superSave = new SuperSaveEngine();