// Real-time Synchronization Service for PNG Road Construction Monitor
// Handles WebSocket connections, live updates, and cross-device synchronization

import React from "react";
import type { RealtimeUpdate } from "./productionDatabase";

// WebSocket connection manager
class RealtimeSyncService {
  private connections: Set<WebSocket> = new Set();
  private updateQueue: RealtimeUpdate[] = [];
  private isConnected = false;

  // Initialize real-time service
  init() {
    if (typeof window === "undefined") return; // Server-side

    // Connect to WebSocket server
    this.connectWebSocket();

    // Setup periodic sync for offline updates
    setInterval(() => {
      this.syncOfflineUpdates();
    }, 30000); // Every 30 seconds

    console.log("Real-time sync service initialized");
  }

  // WebSocket connection
  private connectWebSocket() {
    if (typeof window === "undefined") return;

    try {
      const wsUrl =
        process.env.NEXT_PUBLIC_WS_URL ||
        `wss://${window.location.host}/api/ws`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected for real-time sync");
        this.isConnected = true;
        this.flushUpdateQueue();
      };

      ws.onmessage = (event) => {
        try {
          const update: RealtimeUpdate = JSON.parse(event.data);
          this.handleIncomingUpdate(update);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected, attempting reconnect...");
        this.isConnected = false;
        setTimeout(() => this.connectWebSocket(), 5000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      this.connections.add(ws);
    } catch (error) {
      console.error("WebSocket connection failed:", error);
    }
  }

  // Broadcast update to all connected clients
  broadcastUpdate(update: RealtimeUpdate) {
    if (!this.isConnected) {
      this.updateQueue.push(update);
      return;
    }

    const message = JSON.stringify(update);

    this.connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(message);
        } catch (error) {
          console.error("Error sending WebSocket message:", error);
          this.connections.delete(ws);
        }
      }
    });

    // Also trigger local event listeners
    this.triggerLocalListeners(update);
  }

  // Handle incoming real-time updates
  private handleIncomingUpdate(update: RealtimeUpdate) {
    console.log("Received real-time update:", update);

    // Update local cache/state
    this.updateLocalData(update);

    // Trigger UI updates
    this.triggerLocalListeners(update);

    // Show user notification if needed
    this.showNotification(update);
  }

  // Update local data based on real-time update
  private updateLocalData(update: RealtimeUpdate) {
    const { type, action, data } = update;

    try {
      // Update localStorage cache
      const cacheKey = `realtime_${type}`;
      const cachedData = localStorage.getItem(cacheKey);
      let cache = cachedData ? JSON.parse(cachedData) : [];

      switch (action) {
        case "create":
          cache.push(data);
          break;
        case "update":
          const updateIndex = cache.findIndex(
            (item: any) => item.id === data.id,
          );
          if (updateIndex !== -1) {
            cache[updateIndex] = { ...cache[updateIndex], ...data };
          }
          break;
        case "delete":
          cache = cache.filter((item: any) => item.id !== data.id);
          break;
      }

      localStorage.setItem(cacheKey, JSON.stringify(cache));
    } catch (error) {
      console.error("Error updating local data:", error);
    }
  }

  // Local event listeners for UI updates
  private listeners: ((update: RealtimeUpdate) => void)[] = [];

  addListener(callback: (update: RealtimeUpdate) => void) {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private triggerLocalListeners(update: RealtimeUpdate) {
    this.listeners.forEach((callback) => {
      try {
        callback(update);
      } catch (error) {
        console.error("Error in real-time listener:", error);
      }
    });
  }

  // Show user notifications for important updates
  private showNotification(update: RealtimeUpdate) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      const { type, action, data } = update;
      let title = "";
      let body = "";

      switch (type) {
        case "project":
          title = `Project ${action}d`;
          body = `Project "${data.name}" has been ${action}d`;
          break;
        case "gps":
          title = "New GPS Entry";
          body = `GPS coordinates updated for ${data.taskName}`;
          break;
        case "financial":
          title = "Financial Update";
          body = `New financial entry: ${data.description}`;
          break;
      }

      if (title) {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
          tag: `png-road-monitor-${type}-${update.id}`,
        });
      }
    }
  }

  // Flush queued updates when connection is restored
  private flushUpdateQueue() {
    while (this.updateQueue.length > 0) {
      const update = this.updateQueue.shift();
      if (update) {
        this.broadcastUpdate(update);
      }
    }
  }

  // Sync offline updates when connection is restored
  private async syncOfflineUpdates() {
    try {
      const offlineUpdates = localStorage.getItem("offline_updates");
      if (!offlineUpdates) return;

      const updates: RealtimeUpdate[] = JSON.parse(offlineUpdates);

      for (const update of updates) {
        // Send to server
        await this.syncUpdateToServer(update);
      }

      // Clear offline updates
      localStorage.removeItem("offline_updates");
      console.log(`Synced ${updates.length} offline updates`);
    } catch (error) {
      console.error("Error syncing offline updates:", error);
    }
  }

  // Send update to server when offline
  private async syncUpdateToServer(update: RealtimeUpdate) {
    try {
      const response = await fetch("/api/realtime/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(update),
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error syncing to server:", error);
    }
  }

  // Save update for offline sync
  saveOfflineUpdate(update: RealtimeUpdate) {
    try {
      const offlineUpdates = localStorage.getItem("offline_updates");
      const updates = offlineUpdates ? JSON.parse(offlineUpdates) : [];

      updates.push({
        ...update,
        offlineTimestamp: new Date().toISOString(),
      });

      localStorage.setItem("offline_updates", JSON.stringify(updates));
    } catch (error) {
      console.error("Error saving offline update:", error);
    }
  }

  // Request notification permission
  static async requestNotificationPermission() {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }

  // Connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      activeConnections: this.connections.size,
      queuedUpdates: this.updateQueue.length,
      listeners: this.listeners.length,
    };
  }
}

// React hook for real-time updates
export function useRealtimeUpdates(type?: string) {
  const [updates, setUpdates] = React.useState<RealtimeUpdate[]>([]);

  React.useEffect(() => {
    const unsubscribe = realtimeSyncService.addListener((update) => {
      if (!type || update.type === type) {
        setUpdates((prev) => [update, ...prev].slice(0, 100)); // Keep last 100 updates
      }
    });

    return unsubscribe;
  }, [type]);

  return updates;
}

// Singleton instance
export const realtimeSyncService = new RealtimeSyncService();

// Auto-initialize on client side
if (typeof window !== "undefined") {
  realtimeSyncService.init();

  // Request notification permission on first visit
  RealtimeSyncService.requestNotificationPermission();
}

export default realtimeSyncService;
