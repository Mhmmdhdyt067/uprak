type EventCallback = (data: unknown) => void;

class RealtimeEventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  public subscribe(channel: string, callback: EventCallback): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    this.listeners.get(channel)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(channel)?.delete(callback);
    };
  }

  public broadcast(channel: string, eventName: string, payload: unknown): void {
    const channelListeners = this.listeners.get(channel);
    if (channelListeners) {
      channelListeners.forEach((callback) => {
        try {
          callback({ event: eventName, payload, timestamp: new Date().toISOString() });
        } catch (e) {
          console.error('Realtime broadcast error:', e);
        }
      });
    }

    // Also notify global wildcard listeners
    const globalListeners = this.listeners.get('*');
    if (globalListeners) {
      globalListeners.forEach((callback) => {
        try {
          callback({ channel, event: eventName, payload, timestamp: new Date().toISOString() });
        } catch (e) {
          console.error('Global realtime error:', e);
        }
      });
    }
  }
}

export const realtime = new RealtimeEventBus();
