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
import { PNG_BUDGET_CATEGORIES } from "@/types/financial";
import {
  AlertTriangle,
  BarChart3,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

interface BudgetCategory {
  category: string;
  budgetedAmount: number;
  actualAmount: number;
  commitments: number;
  variance: number;
  variancePercentage: number;
  status: "on-track" | "over-budget" | "under-budget" | "critical";
}

interface BudgetVsActualChartProps {
  projectId: string;
}

export default function BudgetVsActualChart({
  projectId,
}: BudgetVsActualChartProps) {
  const [budgetData, setBudgetData] = useState<BudgetCategory[]>([]);

  useEffect(() => {
    loadBudgetData();
  }, [projectId]);

  const loadBudgetData = () => {
    // Mock budget data
    const mockData: BudgetCategory[] = [
      {
        category: "Earthworks",
        budgetedAmount: 45000000,
        actualAmount: 42000000,
        commitments: 2000000,
        variance: -3000000,
        variancePercentage: -6.7,
        status: "under-budget",
      },
      {
        category: "Pavement",
        budgetedAmount: 35000000,
        actualAmount: 38000000,
        commitments: 1500000,
        variance: 3000000,
        variancePercentage: 8.6,
        status: "over-budget",
      },
      {
        category: "Drainage",
        budgetedAmount: 18000000,
        actualAmount: 19500000,
        commitments: 500000,
        variance: 1500000,
        variancePercentage: 8.3,
        status: "over-budget",
      },
      {
        category: "Bridges",
        budgetedAmount: 25000000,
        actualAmount: 28000000,
        commitments: 2000000,
        variance: 3000000,
        variancePercentage: 12.0,
        status: "critical",
      },
      {
        category: "Project Management",
        budgetedAmount: 8000000,
        actualAmount: 7500000,
        commitments: 500000,
        variance: -500000,
        variancePercentage: -6.3,
        status: "under-budget",
      },
      {
        category: "Contingency",
        budgetedAmount: 15000000,
        actualAmount: 3500000,
        commitments: 1000000,
        variance: -11500000,
        variancePercentage: -76.7,
        status: "on-track",
      },
    ];

    setBudgetData(mockData);
  };

  const formatCurrency = (amount: number) => {
    return `K ${(amount / 1000000).toFixed(1)}M`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "bg-green-100 text-green-800";
      case "under-budget":
        return "bg-blue-100 text-blue-800";
      case "over-budget":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (variance < 0)
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    return null;
  };

  const totalBudget = budgetData.reduce(
    (sum, item) => sum + item.budgetedAmount,
    0,
  );
  const totalActual = budgetData.reduce(
    (sum, item) => sum + item.actualAmount,
    0,
  );
  const totalCommitments = budgetData.reduce(
    (sum, item) => sum + item.commitments,
    0,
  );
  const totalVariance = totalActual - totalBudget;
  const totalVariancePercentage = (totalVariance / totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalBudget)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Actual Spent</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(totalActual)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Commitments</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(totalCommitments)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Variance</p>
              <p
                className={`text-2xl font-bold ${totalVariance >= 0 ? "text-red-600" : "text-green-600"}`}
              >
                {totalVariance >= 0 ? "+" : ""}
                {totalVariancePercentage.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">
                {formatCurrency(Math.abs(totalVariance))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual by Category</CardTitle>
          <CardDescription>
            Visual comparison of budgeted vs actual spending
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Budget vs Actual Chart</p>
              <p className="text-sm">
                Interactive chart will be displayed here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Breakdown by Category</CardTitle>
          <CardDescription>Detailed budget vs actual analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Budgeted</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Commitments</TableHead>
                <TableHead className="text-right">Variance</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetData.map((item) => (
                <TableRow key={item.category}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.budgetedAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.actualAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.commitments)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getVarianceIcon(item.variance)}
                      <span
                        className={
                          item.variance >= 0 ? "text-red-600" : "text-green-600"
                        }
                      >
                        {item.variance >= 0 ? "+" : ""}
                        {item.variancePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(Math.abs(item.variance))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
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

      {/* Alerts for Critical Categories */}
      {budgetData.some((item) => item.status === "critical") && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Critical Budget Variances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {budgetData
                .filter((item) => item.status === "critical")
                .map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <span className="font-medium">{item.category}</span>
                    <span className="text-red-600 font-semibold">
                      {item.variancePercentage.toFixed(1)}% over budget
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
