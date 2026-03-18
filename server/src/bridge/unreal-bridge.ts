import { EditorBridge } from "./bridge-manager";

export class UnrealBridge implements EditorBridge {
  readonly name = "unreal";
  private _connected = false;
  private ws: any = null;
  private port: number;

  constructor(port: number = 9878) {
    this.port = port;
  }

  get connected(): boolean {
    return this._connected;
  }

  async connect(): Promise<void> {
    try {
      const WebSocket = require("ws");
      this.ws = new WebSocket(`ws://127.0.0.1:${this.port}`);
      await new Promise<void>((resolve, reject) => {
        this.ws.on("open", () => { this._connected = true; resolve(); });
        this.ws.on("error", (e: any) => reject(e));
      });
    } catch {
      this._connected = false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this._connected = false;
    }
  }

  async send(command: string, params: Record<string, any>): Promise<any> {
    if (!this._connected || !this.ws) return null;
    return new Promise((resolve) => {
      const id = Date.now().toString();
      const msg = JSON.stringify({ id, command, params });
      const timeout = setTimeout(() => resolve(null), 10000);
      this.ws.once("message", (data: string) => {
        clearTimeout(timeout);
        try { resolve(JSON.parse(data)); } catch { resolve(null); }
      });
      this.ws.send(msg);
    });
  }
}

export const unrealBridge = new UnrealBridge();