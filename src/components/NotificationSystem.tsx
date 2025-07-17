"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  MapPin,
  Settings,
  TrendingUp,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

interface Notification {
  id: string;
  type: "milestone" | "budget" | "schedule" | "gps" | "system";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  projectId?: string;
  projectName?: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
  milestones: boolean;
  budget: boolean;
  schedule: boolean;
  gps: boolean;
  thresholds: {
    budgetVariance: number;
    scheduleDelay: number;
    progressUpdate: number;
  };
}

interface NotificationSystemProps {
  projects?: any[];
  className?: string;
}

export default function NotificationSystem({
  projects = [],
  className,
}: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
    milestones: true,
    budget: true,
    schedule: true,
    gps: true,
    thresholds: {
      budgetVariance: 10, // 10% budget variance
      scheduleDelay: 3, // 3 days schedule delay
      progressUpdate: 24, // 24 hours since last progress update
    },
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for notifications (using Web Audio API for better performance)
  useEffect(() => {
    // Create a simple beep sound programmatically instead of loading an mp3 file
    const createBeepSound = () => {
      try {
        const audioContext = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800; // frequency in Hz
        gainNode.gain.value = 0.1; // volume

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2); // 200ms beep
      } catch (error) {
        // Fallback for browsers that don't support Web Audio API
        console.log("Audio notification not supported");
      }
    };

    audioRef.current = { play: createBeepSound } as any;
  }, []);

  // Mock notification generator for demonstration
  useEffect(() => {
    if (!settings.enabled) return;

    const generateMockNotifications = () => {
      const mockNotifications: Notification[] = [
        {
          id: `notif-${Date.now()}-1`,
          type: "milestone",
          priority: "high",
          title: "Milestone Completed",
          message:
            "Mt. Hagen-Kagamuga Road bridge construction milestone reached",
          projectId: "proj-1",
          projectName: "Mt. Hagen-Kagamuga Road Upgrade",
          timestamp: new Date(),
          read: false,
          data: { milestone: "Bridge Foundation Complete", progress: 68 },
        },
        {
          id: `notif-${Date.now()}-2`,
          type: "budget",
          priority: "critical",
          title: "Budget Alert",
          message:
            "Port Moresby Ring Road project spending approaching 90% of budget",
          projectId: "proj-2",
          projectName: "Port Moresby Ring Road Extension",
          timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
          read: false,
          data: { budgetUsed: 89.5, budgetRemaining: 10.5 },
        },
        {
          id: `notif-${Date.now()}-3`,
          type: "schedule",
          priority: "medium",
          title: "Schedule Update",
          message:
            "Highlands Highway maintenance is 3 days behind schedule due to weather",
          projectId: "proj-4",
          projectName: "Highlands Highway Maintenance Program",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false,
          data: { delayDays: 3, reason: "Weather conditions" },
        },
        {
          id: `notif-${Date.now()}-4`,
          type: "gps",
          priority: "low",
          title: "GPS Update",
          message:
            "New GPS data points recorded for Lae-Nadzab Highway project",
          projectId: "proj-3",
          projectName: "Lae-Nadzab Highway Reconstruction",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          read: false,
          data: { newPoints: 5, totalPoints: 23 },
        },
      ];

      // Filter notifications based on settings
      const filteredNotifications = mockNotifications.filter((notif) => {
        switch (notif.type) {
          case "milestone":
            return settings.milestones;
          case "budget":
            return settings.budget;
          case "schedule":
            return settings.schedule;
          case "gps":
            return settings.gps;
          default:
            return true;
        }
      });

      setNotifications((prev) => {
        const newNotifications = [...filteredNotifications, ...prev];
        const unread = newNotifications.filter((n) => !n.read).length;
        setUnreadCount(unread);
        return newNotifications.slice(0, 50); // Keep only latest 50 notifications
      });

      // Play sound for new notifications
      if (settings.sound && filteredNotifications.length > 0) {
        audioRef.current?.play().catch(() => {
          // Ignore audio play errors (user interaction required)
        });
      }

      // Show browser notification
      if (
        settings.desktop &&
        filteredNotifications.length > 0 &&
        "Notification" in window
      ) {
        filteredNotifications.forEach((notif) => {
          if (Notification.permission === "granted") {
            new Notification(notif.title, {
              body: notif.message,
              tag: notif.id,
              // Removed icon to prevent 404 errors
            });
          }
        });
      }
    };

    // Generate initial notifications
    generateMockNotifications();

    // Set up periodic notification generation (for demo purposes) - optimized
    const interval = setInterval(() => {
      // Reduce frequency and make it lighter
      if (Math.random() > 0.85) {
        // 15% chance every interval (reduced from 30%)
        // Generate only one notification at a time to reduce processing
        const mockNotifications: Notification[] = [
          {
            id: `notif-${Date.now()}`,
            type: ["milestone", "budget", "schedule", "gps"][
              Math.floor(Math.random() * 4)
            ] as any,
            priority: ["low", "medium", "high"][
              Math.floor(Math.random() * 3)
            ] as any,
            title: "Real-time Update",
            message: "New project status update available",
            timestamp: new Date(),
            read: false,
          },
        ];

        setNotifications((prev) => {
          const newNotifications = [...mockNotifications, ...prev].slice(0, 50);
          const unread = newNotifications.filter((n) => !n.read).length;
          setUnreadCount(unread);
          return newNotifications;
        });

        // Play sound for new notifications (optimized)
        if (settings.sound) {
          audioRef.current?.play().catch(() => {
            // Ignore audio play errors
          });
        }
      }
    }, 60000); // Every 60 seconds (increased from 30 seconds)

    return () => clearInterval(interval);
  }, [settings]);

  // Request desktop notification permission
  useEffect(() => {
    if (
      settings.desktop &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, [settings.desktop]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "milestone":
        return <CheckCircle className="h-4 w-4" />;
      case "budget":
        return <DollarSign className="h-4 w-4" />;
      case "schedule":
        return <Clock className="h-4 w-4" />;
      case "gps":
        return <MapPin className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => {
      const filtered = prev.filter((notif) => notif.id !== notificationId);
      const unread = filtered.filter((n) => !n.read).length;
      setUnreadCount(unread);
      return filtered;
    });
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowPanel(!showPanel)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {showPanel && (
        <Card className="absolute right-0 top-12 w-96 max-h-96 z-50 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPanel(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {unreadCount} unread
                </span>
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {/* Settings Panel */}
            {showSettings && (
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold mb-3">Notification Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enable Notifications</span>
                    <Switch
                      checked={settings.enabled}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, enabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      {settings.sound ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                      Sound
                    </span>
                    <Switch
                      checked={settings.sound}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, sound: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Desktop Notifications</span>
                    <Switch
                      checked={settings.desktop}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, desktop: checked }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Milestones</span>
                      <Switch
                        checked={settings.milestones}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            milestones: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Budget</span>
                      <Switch
                        checked={settings.budget}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({ ...prev, budget: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Schedule</span>
                      <Switch
                        checked={settings.schedule}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            schedule: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>GPS</span>
                      <Switch
                        checked={settings.gps}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({ ...prev, gps: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b hover:bg-gray-50 transition-colors ${
                      notification.read ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getPriorityColor(notification.priority)}`}
                      >
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">
                            {notification.title}
                          </h4>
                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          {notification.projectName && (
                            <Badge variant="outline" className="text-xs">
                              {notification.projectName}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
