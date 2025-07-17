"use client";

import AlertsPanel from "@/components/financial/AlertsPanel";
import BudgetVsActualChart from "@/components/financial/BudgetVsActualChart";
import CashFlowChart from "@/components/financial/CashFlowChart";
import ChangeOrdersManager from "@/components/financial/ChangeOrdersManager";
import FinancialReports from "@/components/financial/FinancialReports";
import FundingSourcesManager from "@/components/financial/FundingSourcesManager";
import ProgressMonitor from "@/components/financial/ProgressMonitor";
import UnplannedCostsLog from "@/components/financial/UnplannedCostsLog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChangeOrder,
  type FinancialAlert,
  type FinancialSummary,
  FinancialTransaction,
  UnplannedCost,
} from "@/types/financial";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building,
  Calculator,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  PieChart,
  Target,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface FinancialDashboardProps {
  projectId: string;
  projectName: string;
  projectBudget: number;
  projectProgress: number;
}

export default function FinancialDashboard({
  projectId,
  projectName,
  projectBudget,
  projectProgress,
}: FinancialDashboardProps) {
  const [financialSummary, setFinancialSummary] =
    useState<FinancialSummary | null>(null);
  const [alerts, setAlerts] = useState<FinancialAlert[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadFinancialData();
  }, [projectId]);

  const loadFinancialData = () => {
    // Mock financial summary data
    const mockSummary: FinancialSummary = {
      projectId,
      totalBudget: projectBudget,
      totalSpent: projectBudget * (projectProgress / 100) * 1.05, // Slightly over budget
      totalCommitted: projectBudget * 0.15,
      remainingBudget:
        projectBudget - projectBudget * (projectProgress / 100) * 1.05,
      percentageSpent: (projectProgress / 100) * 105,
      forecastFinalCost: projectBudget * 1.08,
      varianceAmount: projectBudget * 0.08,
      variancePercentage: 8,
      contingencyUsed: projectBudget * 0.03,
      contingencyRemaining: projectBudget * 0.07,
      unplannedCosts: projectBudget * 0.025,
      changeOrdersCost: projectBudget * 0.015,
      costPerformanceIndex: 0.95,
      schedulePerformanceIndex: 1.02,
    };

    setFinancialSummary(mockSummary);

    // Mock alerts
    const mockAlerts: FinancialAlert[] = [
      {
        id: "alert1",
        projectId,
        type: "budget-threshold",
        severity: "high",
        message: "Earthworks category has exceeded 90% of allocated budget",
        createdAt: new Date(),
        acknowledged: false,
      },
      {
        id: "alert2",
        projectId,
        type: "payment-overdue",
        severity: "medium",
        message:
          "Invoice #INV-2024-0234 from Pacific Construction is 15 days overdue",
        createdAt: new Date(),
        acknowledged: false,
      },
    ];

    setAlerts(mockAlerts);
  };

  const formatCurrency = (amount: number) => {
    return `K ${(amount / 1000000).toFixed(2)}M`;
  };

  const getVarianceColor = (variance: number) => {
    if (variance <= 0) return "text-green-600";
    if (variance <= 5) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceColor = (index: number) => {
    if (index >= 1.0) return "text-green-600";
    if (index >= 0.9) return "text-yellow-600";
    return "text-red-600";
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              acknowledged: true,
              acknowledgedBy: "Current User",
              acknowledgedAt: new Date(),
            }
          : alert,
      ),
    );
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, acknowledged: true, resolvedAt: new Date() }
          : alert,
      ),
    );
  };

  if (!financialSummary) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Loading Financial Data</h3>
          <p className="text-gray-600">
            Analyzing financial performance for {projectName}...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Financial Dashboard
          </h3>
          <p className="text-gray-600">
            {projectName} - Financial Monitoring & Reporting
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Alerts ({alerts.filter((a) => !a.acknowledged).length})
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(financialSummary.totalBudget)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Amount Spent</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(financialSummary.totalSpent)}
                </p>
                <p className="text-xs text-gray-500">
                  {financialSummary.percentageSpent.toFixed(1)}% of budget
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget Variance</p>
                <p
                  className={`text-2xl font-bold ${getVarianceColor(financialSummary.variancePercentage)}`}
                >
                  {financialSummary.variancePercentage > 0 ? "+" : ""}
                  {financialSummary.variancePercentage.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(Math.abs(financialSummary.varianceAmount))}
                </p>
              </div>
              {financialSummary.variancePercentage > 0 ? (
                <TrendingUp className="h-8 w-8 text-red-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-green-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Forecast Final Cost</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(financialSummary.forecastFinalCost)}
                </p>
                <p className="text-xs text-gray-500">Based on current trends</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cost Performance Index</p>
                <p
                  className={`text-xl font-bold ${getPerformanceColor(financialSummary.costPerformanceIndex)}`}
                >
                  {financialSummary.costPerformanceIndex.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {financialSummary.costPerformanceIndex >= 1.0
                    ? "Under budget"
                    : "Over budget"}
                </p>
              </div>
              <Calculator className="h-6 w-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Schedule Performance Index
                </p>
                <p
                  className={`text-xl font-bold ${getPerformanceColor(financialSummary.schedulePerformanceIndex)}`}
                >
                  {financialSummary.schedulePerformanceIndex.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {financialSummary.schedulePerformanceIndex >= 1.0
                    ? "Ahead of schedule"
                    : "Behind schedule"}
                </p>
              </div>
              <Clock className="h-6 w-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unplanned Costs</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(financialSummary.unplannedCosts)}
                </p>
                <p className="text-xs text-gray-500">External factors impact</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Summary */}
      {alerts.filter((a) => !a.acknowledged).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Active Financial Alerts (
              {alerts.filter((a) => !a.acknowledged).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts
                .filter((a) => !a.acknowledged)
                .slice(0, 3)
                .map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          alert.severity === "high"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <span className="text-sm">{alert.message}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                ))}
              {alerts.filter((a) => !a.acknowledged).length > 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("alerts")}
                >
                  View All {alerts.filter((a) => !a.acknowledged).length} Alerts
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-9 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="budget-actual">Budget vs Actual</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="unplanned">Unplanned Costs</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="change-orders">Change Orders</TabsTrigger>
          <TabsTrigger value="funding">Funding Sources</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Breakdown</CardTitle>
                <CardDescription>
                  Current allocation vs spending by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <PieChart className="h-8 w-8 mr-2" />
                  Budget breakdown chart will be displayed here
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spending Trend</CardTitle>
                <CardDescription>
                  Monthly expenditure vs planned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="h-8 w-8 mr-2" />
                  Spending trend chart will be displayed here
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(financialSummary.remainingBudget)}
                  </div>
                  <div className="text-sm text-gray-600">Remaining Budget</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(financialSummary.contingencyRemaining)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Contingency Remaining
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(financialSummary.totalCommitted)}
                  </div>
                  <div className="text-sm text-gray-600">Committed Funds</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(financialSummary.changeOrdersCost)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Change Orders Cost
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget-actual">
          <BudgetVsActualChart projectId={projectId} />
        </TabsContent>

        <TabsContent value="progress">
          <ProgressMonitor
            projectId={projectId}
            financialSummary={financialSummary}
          />
        </TabsContent>

        <TabsContent value="unplanned">
          <UnplannedCostsLog projectId={projectId} />
        </TabsContent>

        <TabsContent value="cashflow">
          <CashFlowChart projectId={projectId} />
        </TabsContent>

        <TabsContent value="change-orders">
          <ChangeOrdersManager projectId={projectId} />
        </TabsContent>

        <TabsContent value="funding">
          <FundingSourcesManager
            projectId={projectId}
            projectName={projectName}
          />
        </TabsContent>

        <TabsContent value="reports">
          <FinancialReports projectId={projectId} projectName={projectName} />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsPanel
            projectId={projectId}
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onResolveAlert={handleResolveAlert}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Actions for Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" onClick={() => setActiveTab("reports")}>
              <FileText className="h-4 w-4 mr-2" />
              Financial Reports
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Dashboard
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("funding")}>
              <Building className="h-4 w-4 mr-2" />
              Funding Sources
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("alerts")}>
              <Bell className="h-4 w-4 mr-2" />
              Manage Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
