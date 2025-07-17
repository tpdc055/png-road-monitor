"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  Target,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  location: string;
  province: string;
  district?: string;
  contractor: string;
  status: string;
  progress: number;
  budget: number;
  spent: number;
  startDate?: string;
  endDate?: string;
  contractValue?: number;
  roadStartPoint?: string;
  roadEndPoint?: string;
  totalDistance?: number;
  completedDistance?: number;
  tenderNumber?: string;
  contractDate?: string;
}

interface ProjectDashboardProps {
  project: Project;
  userRole?: string;
}

interface ProjectMetrics {
  physicalProgress: number;
  financialProgress: number;
  scheduleProgress: number;
  qualityScore: number;
  activeWorkers: number;
  equipmentCount: number;
  completedTasks: number;
  totalTasks: number;
  milestonesCompleted: number;
  totalMilestones: number;
  averageGPSAccuracy: number;
  recentGPSEntries: number;
  budgetVariance: number;
  scheduleVariance: number;
  riskLevel: "low" | "medium" | "high";
  weatherImpact: number;
}

export default function ProjectDashboard({
  project,
  userRole = "SITE_ENGINEER",
}: ProjectDashboardProps) {
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchProjectMetrics();
    fetchProjectAlerts();
    fetchRecentActivities();
  }, [project.id]);

  const fetchProjectMetrics = async () => {
    try {
      setLoading(true);

      // Mock comprehensive metrics for now
      const mockMetrics: ProjectMetrics = {
        physicalProgress: project.progress,
        financialProgress: (project.spent / project.budget) * 100,
        scheduleProgress: calculateScheduleProgress(),
        qualityScore: 85 + Math.random() * 10,
        activeWorkers: Math.floor(Math.random() * 50) + 20,
        equipmentCount: Math.floor(Math.random() * 15) + 5,
        completedTasks: Math.floor(Math.random() * 25) + 15,
        totalTasks: 45,
        milestonesCompleted: Math.floor(Math.random() * 8) + 3,
        totalMilestones: 12,
        averageGPSAccuracy: 3.5 + Math.random() * 2,
        recentGPSEntries: Math.floor(Math.random() * 20) + 10,
        budgetVariance:
          (project.spent / project.budget - project.progress / 100) * 100,
        scheduleVariance: project.progress - calculateScheduleProgress(),
        riskLevel:
          getBudgetVariance() > 10
            ? "high"
            : getBudgetVariance() > 5
              ? "medium"
              : "low",
        weatherImpact: Math.random() * 20,
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error("Error fetching project metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectAlerts = async () => {
    // Mock alerts
    const mockAlerts = [
      {
        id: 1,
        type: "BUDGET_EXCEEDED",
        severity: "high",
        title: "Budget Variance Alert",
        message:
          "Project spending is 8% above planned budget for current progress",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
      },
      {
        id: 2,
        type: "SCHEDULE_DELAY",
        severity: "medium",
        title: "Schedule Variance",
        message: "Earthworks phase is 3 days behind schedule due to weather",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isRead: false,
      },
      {
        id: 3,
        type: "MILESTONE_APPROACHING",
        severity: "low",
        title: "Upcoming Milestone",
        message: "Subbase completion milestone due in 5 days",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        isRead: true,
      },
    ];

    setAlerts(mockAlerts);
  };

  const fetchRecentActivities = async () => {
    // Mock recent activities
    const mockActivities = [
      {
        id: 1,
        type: "gps_entry",
        description: "GPS data entry recorded at chainage 25.5km",
        user: "James Peter",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: 2,
        type: "phase_update",
        description: "Earthworks phase progress updated to 75%",
        user: "Michael Kila",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 3,
        type: "financial_entry",
        description: "Equipment rental expense recorded - PGK 45,000",
        user: "Mary Thomas",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: 4,
        type: "milestone_completed",
        description: "Site clearance milestone completed",
        user: "System",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
    ];

    setRecentActivities(mockActivities);
  };

  const calculateScheduleProgress = () => {
    if (!project.startDate || !project.endDate) return project.progress;

    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const now = new Date();

    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const getBudgetVariance = () => {
    return (project.spent / project.budget - project.progress / 100) * 100;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "text-green-600";
    if (progress >= 70) return "text-blue-600";
    if (progress >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PG", {
      style: "currency",
      currency: "PGK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDistance = (distance: number) => {
    return `${distance.toFixed(1)} km`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-PG", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Physical Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Physical Progress
                </p>
                <p
                  className={`text-2xl font-bold ${getProgressColor(project.progress)}`}
                >
                  {project.progress.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistance(project.completedDistance || 0)} of{" "}
                  {formatDistance(project.totalDistance || 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={project.progress} className="mt-2" />
          </CardContent>
        </Card>

        {/* Financial Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Financial Progress
                </p>
                <p
                  className={`text-2xl font-bold ${getProgressColor(metrics?.financialProgress || 0)}`}
                >
                  {((project.spent / project.budget) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(project.spent)} of{" "}
                  {formatCurrency(project.budget)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <Progress
              value={(project.spent / project.budget) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        {/* Schedule Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Schedule Progress
                </p>
                <p
                  className={`text-2xl font-bold ${getProgressColor(metrics?.scheduleProgress || 0)}`}
                >
                  {(metrics?.scheduleProgress || 0).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">
                  {project.endDate
                    ? `Due ${new Date(project.endDate).toLocaleDateString()}`
                    : "No end date set"}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={metrics?.scheduleProgress || 0} className="mt-2" />
          </CardContent>
        </Card>

        {/* Quality Score */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Quality Score
                </p>
                <p
                  className={`text-2xl font-bold ${getProgressColor(metrics?.qualityScore || 0)}`}
                >
                  {(metrics?.qualityScore || 0).toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500">Based on inspections</p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
            <Progress value={metrics?.qualityScore || 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tasks Completed</span>
                  <span className="font-medium">
                    {metrics?.completedTasks} / {metrics?.totalTasks}
                  </span>
                </div>
                <Progress
                  value={
                    ((metrics?.completedTasks || 0) /
                      (metrics?.totalTasks || 1)) *
                    100
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Milestones</span>
                  <span className="font-medium">
                    {metrics?.milestonesCompleted} / {metrics?.totalMilestones}
                  </span>
                </div>
                <Progress
                  value={
                    ((metrics?.milestonesCompleted || 0) /
                      (metrics?.totalMilestones || 1)) *
                    100
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics?.activeWorkers}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Users className="h-4 w-4" />
                  Active Workers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {metrics?.equipmentCount}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Truck className="h-4 w-4" />
                  Equipment Units
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GPS Tracking Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              GPS Tracking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics?.recentGPSEntries}
                </div>
                <div className="text-sm text-gray-600">Recent Entries</div>
                <div className="text-xs text-gray-500 mt-1">Last 24 hours</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ±{(metrics?.averageGPSAccuracy || 0).toFixed(1)}m
                </div>
                <div className="text-sm text-gray-600">Avg Accuracy</div>
                <div className="text-xs text-gray-500 mt-1">GPS precision</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Coverage Progress</span>
                <span className="font-medium">
                  {formatDistance(project.completedDistance || 0)} mapped
                </span>
              </div>
              <Progress
                value={
                  ((project.completedDistance || 0) /
                    (project.totalDistance || 1)) *
                  100
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Project Alerts
              </CardTitle>
              <Badge className={getRiskColor(metrics?.riskLevel || "low")}>
                {metrics?.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${alert.isRead ? "bg-gray-50" : "bg-white border-l-4 border-l-orange-500"}`}
                  >
                    <div className="flex items-start gap-2">
                      {getAlertIcon(alert.severity)}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{alert.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(alert.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>No active alerts</p>
                  <p className="text-xs">Project is running smoothly</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        by {activity.user}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Variance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div
                className={`text-2xl font-bold ${getBudgetVariance() > 0 ? "text-red-600" : "text-green-600"}`}
              >
                {getBudgetVariance() > 0 ? "+" : ""}
                {getBudgetVariance().toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Budget Variance</div>
              <div className="text-xs text-gray-500 mt-1">
                {getBudgetVariance() > 0 ? "Over budget" : "Under budget"}
              </div>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div
                className={`text-2xl font-bold ${(metrics?.scheduleVariance || 0) > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {(metrics?.scheduleVariance || 0) > 0 ? "+" : ""}
                {(metrics?.scheduleVariance || 0).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Schedule Variance</div>
              <div className="text-xs text-gray-500 mt-1">
                {(metrics?.scheduleVariance || 0) > 0
                  ? "Ahead of schedule"
                  : "Behind schedule"}
              </div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {(metrics?.weatherImpact || 0).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Weather Impact</div>
              <div className="text-xs text-gray-500 mt-1">
                Productivity affected
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
