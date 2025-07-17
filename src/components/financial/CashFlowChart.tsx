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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  Calendar,
  Download,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

interface CashFlowItem {
  month: string;
  plannedInflow: number;
  actualInflow: number;
  plannedOutflow: number;
  actualOutflow: number;
  plannedBalance: number;
  actualBalance: number;
  variance: number;
}

interface CashFlowChartProps {
  projectId: string;
}

export default function CashFlowChart({ projectId }: CashFlowChartProps) {
  const [cashFlowData, setCashFlowData] = useState<CashFlowItem[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("12months");

  useEffect(() => {
    loadCashFlowData();
  }, [projectId, selectedPeriod]);

  const loadCashFlowData = () => {
    // Mock cash flow data
    const mockData: CashFlowItem[] = [
      {
        month: "Jan 2023",
        plannedInflow: 15000000,
        actualInflow: 15000000,
        plannedOutflow: 8000000,
        actualOutflow: 7500000,
        plannedBalance: 7000000,
        actualBalance: 7500000,
        variance: 500000,
      },
      {
        month: "Feb 2023",
        plannedInflow: 12000000,
        actualInflow: 12000000,
        plannedOutflow: 10000000,
        actualOutflow: 11000000,
        plannedBalance: 9000000,
        actualBalance: 8500000,
        variance: -500000,
      },
      {
        month: "Mar 2023",
        plannedInflow: 18000000,
        actualInflow: 16000000,
        plannedOutflow: 15000000,
        actualOutflow: 14000000,
        plannedBalance: 12000000,
        actualBalance: 10500000,
        variance: -1500000,
      },
      {
        month: "Apr 2023",
        plannedInflow: 20000000,
        actualInflow: 20000000,
        plannedOutflow: 18000000,
        actualOutflow: 19000000,
        plannedBalance: 14000000,
        actualBalance: 11500000,
        variance: -2500000,
      },
      {
        month: "May 2023",
        plannedInflow: 16000000,
        actualInflow: 18000000,
        plannedOutflow: 14000000,
        actualOutflow: 15000000,
        plannedBalance: 16000000,
        actualBalance: 14500000,
        variance: -1500000,
      },
      {
        month: "Jun 2023",
        plannedInflow: 22000000,
        actualInflow: 22000000,
        plannedOutflow: 20000000,
        actualOutflow: 21000000,
        plannedBalance: 18000000,
        actualBalance: 15500000,
        variance: -2500000,
      },
    ];

    setCashFlowData(mockData);
  };

  const formatCurrency = (amount: number) => {
    return `K ${(amount / 1000000).toFixed(1)}M`;
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-green-600";
    if (variance < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (variance < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const totalPlannedInflow = cashFlowData.reduce(
    (sum, item) => sum + item.plannedInflow,
    0,
  );
  const totalActualInflow = cashFlowData.reduce(
    (sum, item) => sum + item.actualInflow,
    0,
  );
  const totalPlannedOutflow = cashFlowData.reduce(
    (sum, item) => sum + item.plannedOutflow,
    0,
  );
  const totalActualOutflow = cashFlowData.reduce(
    (sum, item) => sum + item.actualOutflow,
    0,
  );
  const currentBalance =
    cashFlowData.length > 0
      ? cashFlowData[cashFlowData.length - 1].actualBalance
      : 0;
  const totalVariance =
    totalActualInflow -
    totalActualOutflow -
    (totalPlannedInflow - totalPlannedOutflow);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Cash Flow Analysis
          </h3>
          <p className="text-gray-600">
            Monitor project cash inflows and outflows
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Forecast
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inflows</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalActualInflow)}
                </p>
                <p className="text-xs text-gray-500">
                  Planned: {formatCurrency(totalPlannedInflow)}
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
                <p className="text-sm text-gray-600">Total Outflows</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalActualOutflow)}
                </p>
                <p className="text-xs text-gray-500">
                  Planned: {formatCurrency(totalPlannedOutflow)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(currentBalance)}
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
                <p className="text-sm text-gray-600">Net Variance</p>
                <p
                  className={`text-2xl font-bold ${getVarianceColor(totalVariance)}`}
                >
                  {formatCurrency(Math.abs(totalVariance))}
                </p>
                <p className="text-xs text-gray-500">
                  {totalVariance >= 0 ? "Favorable" : "Unfavorable"}
                </p>
              </div>
              {getVarianceIcon(totalVariance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Trend</CardTitle>
          <CardDescription>
            Monthly cash inflows vs outflows comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-2" />
              <p>Cash Flow Chart</p>
              <p className="text-sm">
                Interactive cash flow chart will be displayed here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Cash Flow Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Cash Flow Statement</CardTitle>
          <CardDescription>
            Detailed breakdown of planned vs actual cash flows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Planned Inflow</TableHead>
                <TableHead className="text-right">Actual Inflow</TableHead>
                <TableHead className="text-right">Planned Outflow</TableHead>
                <TableHead className="text-right">Actual Outflow</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Variance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashFlowData.map((item) => (
                <TableRow key={item.month}>
                  <TableCell className="font-medium">{item.month}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.plannedInflow)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        item.actualInflow >= item.plannedInflow
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {formatCurrency(item.actualInflow)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.plannedOutflow)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        item.actualOutflow <= item.plannedOutflow
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {formatCurrency(item.actualOutflow)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(item.actualBalance)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getVarianceIcon(item.variance)}
                      <span className={getVarianceColor(item.variance)}>
                        {formatCurrency(Math.abs(item.variance))}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cash Flow Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>3-Month Cash Flow Forecast</CardTitle>
          <CardDescription>
            Projected cash flows based on current trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">Jul 2023</div>
              <div className="text-sm text-gray-600 mt-1">
                <div>Forecast Inflow: K 24.0M</div>
                <div>Forecast Outflow: K 22.0M</div>
                <div className="font-semibold mt-2">Net: K 2.0M</div>
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">Aug 2023</div>
              <div className="text-sm text-gray-600 mt-1">
                <div>Forecast Inflow: K 26.0M</div>
                <div>Forecast Outflow: K 23.0M</div>
                <div className="font-semibold mt-2">Net: K 3.0M</div>
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">Sep 2023</div>
              <div className="text-sm text-gray-600 mt-1">
                <div>Forecast Inflow: K 28.0M</div>
                <div>Forecast Outflow: K 25.0M</div>
                <div className="font-semibold mt-2">Net: K 3.0M</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Health Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Health Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Key Ratios</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Cash Flow Adequacy
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    Adequate
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Liquidity Position
                  </span>
                  <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Payment Capability
                  </span>
                  <Badge className="bg-green-100 text-green-800">Strong</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Risk Factors</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Seasonal Variations
                  </span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Medium
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Donor Disbursement Risk
                  </span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Medium
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Currency Fluctuation
                  </span>
                  <Badge className="bg-orange-100 text-orange-800">High</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
