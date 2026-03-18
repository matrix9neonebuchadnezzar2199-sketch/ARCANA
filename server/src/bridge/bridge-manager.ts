export interface EditorBridge {
  readonly name: string;
  readonly connected: boolean;
  send(command: string, params: Record<string, any>): Promise<any>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export class BridgeManager {
  private bridges: Map<string, EditorBridge> = new Map();

  register(bridge: EditorBridge): void {
    this.bridges.set(bridge.name, bridge);
  }

  get(name: string): EditorBridge | undefined {
    return this.bridges.get(name);
  }

  getConnected(): EditorBridge[] {
    return Array.from(this.bridges.values()).filter(b => b.connected);
  }

  async sendToAll(command: string, params: Record<string, any>): Promise<Map<string, any>> {
    const results = new Map<string, any>();
    for (const bridge of this.getConnected()) {
      try {
        const result = await bridge.send(command, params);
        results.set(bridge.name, result);
      } catch (e) {
        results.set(bridge.name, null);
      }
    }
    return results;
  }

  async sendTo(target: string, command: string, params: Record<string, any>): Promise<any> {
    const bridge = this.bridges.get(target);
    if (!bridge || !bridge.connected) return null;
    return bridge.send(command, params);
  }

  getAvailableEditors(): string[] {
    return Array.from(this.bridges.keys());
  }

  getConnectedEditors(): string[] {
    return this.getConnected().map(b => b.name);
  }
}

export const bridgeManager = new BridgeManager();