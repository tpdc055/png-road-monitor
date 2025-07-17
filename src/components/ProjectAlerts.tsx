"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  RefreshCw,
  TrendingDown,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface ProjectAlert {
  id: string;
  type:
    | "SCHEDULE_DELAY"
    | "BUDGET_EXCEEDED"
    | "QUALITY_ISSUE"
    | "SAFETY_CONCERN"
    | "MILESTONE_APPROACHING"
    | "TASK_OVERDUE"
    | "WEATHER_DELAY";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  message: string;
  isRead: boolean;
  isResolved: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

interface ProjectAlertsProps {
  projectId: string;
  userRole?: string;
}

export default function ProjectAlerts({
  projectId,
  userRole = "SITE_ENGINEER",
}: ProjectAlertsProps) {
  const [alerts, setAlerts] = useState<ProjectAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");

  useEffect(() => {
    fetchAlerts();
  }, [projectId]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      // Mock alerts data
      const mockAlerts: ProjectAlert[] = [
        {
          id: "1",
          type: "BUDGET_EXCEEDED",
          severity: "HIGH",
          title: "Budget Variance Alert",
          message:
            "Project spending is 8% above planned budget for current progress level. Immediate review required.",
          isRead: false,
          isResolved: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
          id: "2",
          type: "SCHEDULE_DELAY",
          severity: "MEDIUM",
          title: "Earthworks Phase Delay",
          message:
            "Earthworks phase is 3 days behind schedule due to equipment breakdown. Estimated recovery time: 5 days.",
          isRead: false,
          isResolved: false,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        },
        {
          id: "3",
          type: "WEATHER_DELAY",
          severity: "MEDIUM",
          title: "Weather Impact",
          message:
            "Heavy rainfall forecast for next 3 days. Consider rescheduling concrete pouring activities.",
          isRead: true,
          isResolved: false,
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        },
        {
          id: "4",
          type: "MILESTONE_APPROACHING",
          severity: "LOW",
          title: "Upcoming Milestone",
          message:
            "Subbase completion milestone is due in 5 days. Current progress: 78%.",
          isRead: true,
          isResolved: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        },
        {
          id: "5",
          type: "QUALITY_ISSUE",
          severity: "HIGH",
          title: "Quality Control Alert",
          message:
            "Material testing at chainage 25.5km failed compaction requirements. Rework needed.",
          isRead: false,
          isResolved: false,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        },
        {
          id: "6",
          type: "SAFETY_CONCERN",
          severity: "CRITICAL",
          title: "Safety Incident Report",
          message:
            "Near-miss incident reported at work site. Safety briefing required for all workers.",
          isRead: true,
          isResolved: true,
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
          resolvedAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
        },
      ];

      setAlerts(mockAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert,
      ),
    );
  };

  const markAsResolved = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId
          ? { ...alert, isResolved: true, resolvedAt: new Date(), isRead: true }
          : alert,
      ),
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "BUDGET_EXCEEDED":
        return <DollarSign className="h-5 w-5" />;
      case "SCHEDULE_DELAY":
        return <Clock className="h-5 w-5" />;
      case "QUALITY_ISSUE":
        return <AlertTriangle className="h-5 w-5" />;
      case "SAFETY_CONCERN":
        return <AlertTriangle className="h-5 w-5" />;
      case "MILESTONE_APPROACHING":
        return <Calendar className="h-5 w-5" />;
      case "TASK_OVERDUE":
        return <TrendingDown className="h-5 w-5" />;
      case "WEATHER_DELAY":
        return <Clock className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "HIGH":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "MEDIUM":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "LOW":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    switch (filter) {
      case "unread":
        return !alert.isRead;
      case "critical":
        return alert.severity === "CRITICAL" || alert.severity === "HIGH";
      default:
        return true;
    }
  });

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;
  const criticalCount = alerts.filter(
    (alert) =>
      (alert.severity === "CRITICAL" || alert.severity === "HIGH") &&
      !alert.isResolved,
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Alerts</h2>
          <p className="text-gray-600 mt-1">
            Monitor project issues and notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchAlerts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Alerts
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {alerts.length}
                </p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-orange-600">
                  {unreadCount}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Critical/High
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {criticalCount}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({alerts.length})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === "critical" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("critical")}
        >
          Critical ({criticalCount})
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`transition-all duration-200 ${
                !alert.isRead
                  ? "border-l-4 border-l-blue-500 bg-blue-50"
                  : alert.isResolved
                    ? "bg-gray-50"
                    : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}
                    >
                      {getAlertIcon(alert.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {alert.title}
                        </h4>
                        <Badge
                          className={`text-xs ${getSeverityColor(alert.severity)}`}
                        >
                          {alert.severity}
                        </Badge>
                        {!alert.isRead && (
                          <Badge variant="outline" className="text-xs">
                            New
                          </Badge>
                        )}
                        {alert.isResolved && (
                          <Badge className="text-xs bg-green-100 text-green-800">
                            Resolved
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {alert.message}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatTimeAgo(alert.createdAt)}</span>
                        <span>•</span>
                        <span>
                          {alert.type.replace("_", " ").toLowerCase()}
                        </span>
                        {alert.resolvedAt && (
                          <>
                            <span>•</span>
                            <span>
                              Resolved {formatTimeAgo(alert.resolvedAt)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1 ml-4">
                    {!alert.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(alert.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Mark Read
                      </Button>
                    )}

                    {!alert.isResolved && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsResolved(alert.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Resolve
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === "all"
                  ? "No Alerts"
                  : filter === "unread"
                    ? "No Unread Alerts"
                    : "No Critical Alerts"}
              </h3>
              <p className="text-gray-600">
                {filter === "all"
                  ? "All systems are running smoothly."
                  : filter === "unread"
                    ? "You're all caught up!"
                    : "No critical issues at the moment."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
