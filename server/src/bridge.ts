/**
 * ARCANA WebSocket Bridge
 * Accepts connections from Unity (:9877), UE (:9878), Blender (:9879)
 * Routes tool execution commands between MCP server and editor plugins.
 */

import { WebSocketServer, WebSocket } from "ws";

interface EditorConnection {
  ws: WebSocket;
  editor: string;
  version: string;
  ready: boolean;
}

class ArcanaBridge {
  private servers: Map<string, WebSocketServer> = new Map();
  private connections: Map<string, EditorConnection> = new Map();
  private pendingRequests: Map<string, {
    resolve: (value: any) => void;
    reject: (reason: any) => void;
    timeout: NodeJS.Timeout;
  }> = new Map();

  private ports: Record<string, number> = {
    unity: 9877,
    unreal: 9878,
    blender: 9879,
  };

  start() {
    for (const [editor, port] of Object.entries(this.ports)) {
      this.startServer(editor, port);
    }
  }

  private startServer(editor: string, port: number) {
    try {
      const wss = new WebSocketServer({ port });
      this.servers.set(editor, wss);

      wss.on("listening", () => {
        console.error(`[ARCANA Bridge] ${editor} listening on ws://localhost:${port}`);
      });

      wss.on("connection", (ws: WebSocket) => {
        console.error(`[ARCANA Bridge] ${editor} client connected`);

        const conn: EditorConnection = {
          ws,
          editor,
          version: "unknown",
          ready: false,
        };

        ws.on("message", (data: Buffer) => {
          try {
            const msg = JSON.parse(data.toString());
            this.handleMessage(editor, conn, msg);
          } catch (e) {
            console.error(`[ARCANA Bridge] ${editor} parse error:`, e);
          }
        });

        ws.on("close", () => {
          console.error(`[ARCANA Bridge] ${editor} disconnected`);
          this.connections.delete(editor);
        });

        ws.on("error", (err) => {
          console.error(`[ARCANA Bridge] ${editor} error:`, err.message);
        });

        this.connections.set(editor, conn);
      });

      wss.on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
          console.warn(`[ARCANA Bridge] Port ${port} in use, ${editor} bridge skipped`);
        } else {
          console.error(`[ARCANA Bridge] ${editor} server error:`, err.message);
        }
      });

    } catch (e) {
      console.error(`[ARCANA Bridge] Failed to start ${editor} on port ${port}:`, e);
    }
  }

  private handleMessage(editor: string, conn: EditorConnection, msg: any) {
    // Registration message from editor plugin
    if (msg.type === "register") {
      conn.version = msg.version || "unknown";
      conn.ready = true;
      console.error(`[ARCANA Bridge] ${editor} registered (v${conn.version}, ${msg.tools || 0} tools)`);
      // Send acknowledgment
      conn.ws.send(JSON.stringify({
        type: "registered",
        server: "arcana-mcp-server",
        serverVersion: "6.0.0",
      }));
      return;
    }

    // Response to a tool execution request
    if (msg.id && this.pendingRequests.has(msg.id)) {
      const pending = this.pendingRequests.get(msg.id)!;
      clearTimeout(pending.timeout);
      this.pendingRequests.delete(msg.id);

      if (msg.success) {
        pending.resolve(msg.result);
      } else {
        pending.reject(new Error(msg.error || "Unknown editor error"));
      }
      return;
    }
  }

  /**
   * Send a tool command to a specific editor and wait for response.
   */
  async send(editor: string, toolId: string, params: any, timeoutMs: number = 30000): Promise<any> {
    const conn = this.connections.get(editor);
    if (!conn || !conn.ready) {
      throw new Error(`${editor} is not connected. Start ${editor} and enable the ARCANA plugin.`);
    }

    if (conn.ws.readyState !== WebSocket.OPEN) {
      throw new Error(`${editor} WebSocket is not open (state: ${conn.ws.readyState})`);
    }

    const id = `${editor}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`${editor} tool '${toolId}' timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      this.pendingRequests.set(id, { resolve, reject, timeout });

      conn.ws.send(JSON.stringify({
        id,
        tool: toolId,
        params: params || {},
      }));
    });
  }

  /**
   * Check which editors are connected.
   */
  getStatus(): Record<string, { connected: boolean; version: string }> {
    const status: Record<string, { connected: boolean; version: string }> = {};
    for (const editor of Object.keys(this.ports)) {
      const conn = this.connections.get(editor);
      status[editor] = {
        connected: !!(conn && conn.ready && conn.ws.readyState === WebSocket.OPEN),
        version: conn?.version || "not connected",
      };
    }
    return status;
  }

  /**
   * Determine which editor a tool belongs to based on its ID prefix.
   */
  resolveEditor(toolId: string): string {
    if (toolId.startsWith("bl_") || toolId.startsWith("bl_char_")) return "blender";
    if (toolId.startsWith("ue_")) return "unreal";
    // Unity tools have no prefix or various prefixes
    if (toolId.startsWith("recipe_") || toolId.startsWith("pipeline_") || toolId.startsWith("project_")) {
      // Cross-editor: pick first connected
      for (const editor of ["unity", "blender", "unreal"]) {
        const conn = this.connections.get(editor);
        if (conn && conn.ready) return editor;
      }
      return "unity";
    }
    if (toolId.startsWith("arcana_")) return "server"; // handled locally
    return "unity";
  }

  stop() {
    for (const [editor, wss] of this.servers) {
      wss.close();
      console.error(`[ARCANA Bridge] ${editor} server stopped`);
    }
    this.servers.clear();
    this.connections.clear();
    for (const [, pending] of this.pendingRequests) {
      clearTimeout(pending.timeout);
      pending.reject(new Error("Bridge stopped"));
    }
    this.pendingRequests.clear();
  }
}

// Singleton
export const bridge = new ArcanaBridge();

