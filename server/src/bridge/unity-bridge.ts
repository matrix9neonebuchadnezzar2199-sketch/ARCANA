import WebSocket from "ws";

export class UnityBridge {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number = 3000;
  private pendingRequests: Map<string, {
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = new Map();

  constructor(url: string = "ws://localhost:8765") {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.on("open", () => {
          console.log("[ARCANA] Unity bridge connected");
          resolve();
        });

        this.ws.on("message", (data: WebSocket.Data) => {
          try {
            const msg = JSON.parse(data.toString());
            const pending = this.pendingRequests.get(msg.requestId);
            if (pending) {
              this.pendingRequests.delete(msg.requestId);
              pending.resolve(msg);
            }
          } catch (e) {
            console.error("[ARCANA] Failed to parse Unity message:", e);
          }
        });

        this.ws.on("close", () => {
          console.log("[ARCANA] Unity bridge disconnected, retrying...");
          setTimeout(() => this.connect(), this.reconnectInterval);
        });

        this.ws.on("error", (err) => {
          console.error("[ARCANA] Unity bridge error:", err.message);
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async send(action: string, params: any): Promise<any> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("Unity bridge not connected");
    }

    const requestId = Math.random().toString(36).substring(2, 10);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`Unity request timed out: ${action}`));
      }, 30000);

      this.pendingRequests.set(requestId, {
        resolve: (value) => {
          clearTimeout(timeout);
          resolve(value);
        },
        reject: (reason) => {
          clearTimeout(timeout);
          reject(reason);
        }
      });

      this.ws!.send(JSON.stringify({
        requestId,
        action,
        params
      }));
    });
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const unityBridge = new UnityBridge();