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
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Filter,
  MapPin,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

interface ProjectAnalyticsProps {
  project: any;
  userRole?: string;
}

export default function ProjectAnalytics({
  project,
  userRole = "SITE_ENGINEER",
}: ProjectAnalyticsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30days");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PG", {
      style: "currency",
      currency: "PGK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Project Analytics
          </h2>
          <p className="text-gray-600 mt-1">
            Comprehensive analytics and performance insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Schedule Performance
                </p>
                <p className="text-2xl font-bold text-green-600">95%</p>
                <p className="text-xs text-gray-500">On track</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Cost Performance
                </p>
                <p className="text-2xl font-bold text-red-600">108%</p>
                <p className="text-xs text-gray-500">Over budget</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Quality Score
                </p>
                <p className="text-2xl font-bold text-blue-600">87%</p>
                <p className="text-xs text-gray-500">Good quality</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Productivity
                </p>
                <p className="text-2xl font-bold text-purple-600">0.8</p>
                <p className="text-xs text-gray-500">km/day</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progress Trend</CardTitle>
            <CardDescription>
              Physical vs financial progress over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <BarChart3 className="h-12 w-12 text-gray-400 mb-2" />
              <p>Progress chart placeholder</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Analysis</CardTitle>
            <CardDescription>
              Budget allocation vs actual spending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total Budget</span>
                  <span>{formatCurrency(project.budget)}</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    Spent ({((project.spent / project.budget) * 100).toFixed(1)}
                    %)
                  </span>
                  <span>{formatCurrency(project.spent)}</span>
                </div>
                <Progress
                  value={(project.spent / project.budget) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Remaining</span>
                  <span>{formatCurrency(project.budget - project.spent)}</span>
                </div>
                <Progress
                  value={
                    ((project.budget - project.spent) / project.budget) * 100
                  }
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>
            Detailed project performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">
                Schedule Performance
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Planned Progress</span>
                  <span>75%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Actual Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Variance</span>
                  <span className="text-green-600">
                    +{(project.progress - 75).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Cost Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budgeted Cost</span>
                  <span>{formatCurrency(project.budget * 0.75)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Actual Cost</span>
                  <span>{formatCurrency(project.spent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Variance</span>
                  <span className="text-red-600">
                    +{formatCurrency(project.spent - project.budget * 0.75)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Quality Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Inspections Passed</span>
                  <span>87%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rework Required</span>
                  <span>13%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quality Score</span>
                  <span className="text-blue-600">Good</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
