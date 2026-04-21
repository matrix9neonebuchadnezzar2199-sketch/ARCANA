import WebSocket from "ws";

export type FakeEditorId = "unity" | "unreal" | "blender";

/**
 * Connects to the ARCANA bridge as an editor plugin would: register, then reply to tool calls.
 */
export function connectFakeEditor(
  editor: FakeEditorId,
  port: number,
  options?: { connectTimeoutMs?: number }
): Promise<WebSocket> {
  const connectTimeoutMs = options?.connectTimeoutMs ?? 8000;
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://127.0.0.1:${port}`);
    const timer = setTimeout(() => {
      ws.close();
      reject(new Error(`Fake ${editor}: connect timeout (${connectTimeoutMs}ms)`));
    }, connectTimeoutMs);

    ws.on("open", () => {
      ws.send(
        JSON.stringify({
          type: "register",
          version: "integration-test",
          tools: 1,
        })
      );
    });

    ws.on("message", (raw) => {
      let msg: any;
      try {
        msg = JSON.parse(String(raw));
      } catch {
        return;
      }
      if (msg.type === "registered") {
        clearTimeout(timer);
        resolve(ws);
        return;
      }
      if (msg.id != null && msg.tool !== undefined) {
        ws.send(
          JSON.stringify({
            id: msg.id,
            success: true,
            result: { mock: true, editor, tool: msg.tool, params: msg.params },
          })
        );
      }
    });

    ws.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

export function closeWs(ws: WebSocket): Promise<void> {
  return new Promise((res) => {
    if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
      res();
      return;
    }
    ws.once("close", () => res());
    ws.close();
  });
}
