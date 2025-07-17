"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FinancialSummary } from "@/types/financial";
import { Activity, CheckCircle, Clock, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ProgressItem {
  category: string;
  physicalProgress: number;
  financialProgress: number;
  plannedProgress: number;
  variance: number;
  status: "ahead" | "on-track" | "behind" | "critical";
  milestones: {
    name: string;
    planned: Date;
    actual?: Date;
    status: "completed" | "in-progress" | "delayed" | "pending";
  }[];
}

interface ProgressMonitorProps {
  projectId: string;
  financialSummary: FinancialSummary;
}

export default function ProgressMonitor({
  projectId,
  financialSummary,
}: ProgressMonitorProps) {
  const [progressData, setProgressData] = useState<ProgressItem[]>([]);

  useEffect(() => {
    loadProgressData();
  }, [projectId]);

  const loadProgressData = () => {
    // Mock progress data
    const mockData: ProgressItem[] = [
      {
        category: "Site Preparation",
        physicalProgress: 100,
        financialProgress: 95,
        plannedProgress: 100,
        variance: 0,
        status: "on-track",
        milestones: [
          {
            name: "Land Acquisition",
            planned: new Date("2023-01-15"),
            actual: new Date("2023-01-20"),
            status: "completed",
          },
          {
            name: "Site Clearing",
            planned: new Date("2023-02-01"),
            actual: new Date("2023-01-28"),
            status: "completed",
          },
        ],
      },
      {
        category: "Earthworks",
        physicalProgress: 85,
        financialProgress: 78,
        plannedProgress: 80,
        variance: 5,
        status: "ahead",
        milestones: [
          {
            name: "Cut & Fill Operations",
            planned: new Date("2023-03-01"),
            actual: new Date("2023-02-25"),
            status: "completed",
          },
          {
            name: "Subgrade Preparation",
            planned: new Date("2023-04-15"),
            status: "in-progress",
          },
        ],
      },
      {
        category: "Drainage",
        physicalProgress: 45,
        financialProgress: 52,
        plannedProgress: 60,
        variance: -15,
        status: "behind",
        milestones: [
          {
            name: "Culvert Installation",
            planned: new Date("2023-05-01"),
            status: "delayed",
          },
          {
            name: "Roadside Drains",
            planned: new Date("2023-06-01"),
            status: "pending",
          },
        ],
      },
      {
        category: "Pavement",
        physicalProgress: 25,
        financialProgress: 35,
        plannedProgress: 40,
        variance: -15,
        status: "behind",
        milestones: [
          {
            name: "Base Course",
            planned: new Date("2023-07-01"),
            status: "in-progress",
          },
          {
            name: "Asphalt Laying",
            planned: new Date("2023-08-15"),
            status: "pending",
          },
        ],
      },
      {
        category: "Bridges",
        physicalProgress: 15,
        financialProgress: 25,
        plannedProgress: 30,
        variance: -15,
        status: "critical",
        milestones: [
          {
            name: "Foundation Work",
            planned: new Date("2023-06-01"),
            status: "delayed",
          },
          {
            name: "Superstructure",
            planned: new Date("2023-09-01"),
            status: "pending",
          },
        ],
      },
    ];

    setProgressData(mockData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ahead":
        return "bg-green-100 text-green-800";
      case "on-track":
        return "bg-blue-100 text-blue-800";
      case "behind":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressBarColor = (physical: number, planned: number) => {
    if (physical >= planned) return "bg-green-500";
    if (physical >= planned * 0.9) return "bg-yellow-500";
    return "bg-red-500";
  };

  const overallPhysicalProgress =
    progressData.reduce((sum, item) => sum + item.physicalProgress, 0) /
    progressData.length;
  const overallFinancialProgress =
    progressData.reduce((sum, item) => sum + item.financialProgress, 0) /
    progressData.length;
  const overallPlannedProgress =
    progressData.reduce((sum, item) => sum + item.plannedProgress, 0) /
    progressData.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Physical Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {overallPhysicalProgress.toFixed(1)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Financial Progress</p>
                <p className="text-2xl font-bold text-green-600">
                  {overallFinancialProgress.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Planned Progress</p>
                <p className="text-2xl font-bold text-purple-600">
                  {overallPlannedProgress.toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Schedule Variance</p>
                <p
                  className={`text-2xl font-bold ${(overallPhysicalProgress - overallPlannedProgress) >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {overallPhysicalProgress - overallPlannedProgress >= 0
                    ? "+"
                    : ""}
                  {(overallPhysicalProgress - overallPlannedProgress).toFixed(
                    1,
                  )}
                  %
                </p>
              </div>
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indices */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Indices</CardTitle>
          <CardDescription>
            Key performance indicators from financial summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {financialSummary.costPerformanceIndex.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Cost Performance Index (CPI)
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {financialSummary.costPerformanceIndex >= 1.0
                  ? "Under budget"
                  : "Over budget"}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {financialSummary.schedulePerformanceIndex.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Schedule Performance Index (SPI)
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {financialSummary.schedulePerformanceIndex >= 1.0
                  ? "Ahead of schedule"
                  : "Behind schedule"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Progress by Work Category</CardTitle>
          <CardDescription>
            Physical vs financial progress comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Physical</TableHead>
                <TableHead>Financial</TableHead>
                <TableHead>Planned</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progressData.map((item) => (
                <TableRow key={item.category}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressBarColor(item.physicalProgress, item.plannedProgress)}`}
                          style={{
                            width: `${Math.min(item.physicalProgress, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">
                        {item.physicalProgress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{
                            width: `${Math.min(item.financialProgress, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">
                        {item.financialProgress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {item.plannedProgress}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm font-medium ${item.variance >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {item.variance >= 0 ? "+" : ""}
                      {item.variance}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upcoming Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Milestones</CardTitle>
          <CardDescription>
            Key project milestones and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData.map((category) => (
              <div key={category.category}>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle
                          className={`h-4 w-4 ${milestone.status === "completed" ? "text-green-500" : "text-gray-400"}`}
                        />
                        <span className="text-sm font-medium">
                          {milestone.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Planned: {milestone.planned.toLocaleDateString()}
                        </span>
                        {milestone.actual && (
                          <span className="text-xs text-gray-500">
                            Actual: {milestone.actual.toLocaleDateString()}
                          </span>
                        )}
                        <Badge
                          className={getMilestoneStatusColor(milestone.status)}
                        >
                          {milestone.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
