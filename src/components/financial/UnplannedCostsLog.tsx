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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { UnplannedCost } from "@/types/financial";
import {
  AlertTriangle,
  Edit,
  Eye,
  FileText,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

interface UnplannedCostsLogProps {
  projectId: string;
}

export default function UnplannedCostsLog({
  projectId,
}: UnplannedCostsLogProps) {
  const [unplannedCosts, setUnplannedCosts] = useState<UnplannedCost[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCost, setNewCost] = useState<Partial<UnplannedCost>>({
    category: "",
    description: "",
    amount: 0,
    reason: "",
    impact: "medium",
    reportedBy: "",
  });

  useEffect(() => {
    loadUnplannedCosts();
  }, [projectId]);

  const loadUnplannedCosts = () => {
    // Mock unplanned costs data
    const mockCosts: UnplannedCost[] = [
      {
        id: "uc1",
        projectId,
        category: "Weather Delays",
        description: "Extended wet season causing 3-week delay in earthworks",
        amount: 2500000,
        reason: "Unusually heavy rainfall extended wet season beyond forecasts",
        impact: "high",
        date: new Date("2023-03-15"),
        reportedBy: "Site Engineer",
        approvalStatus: "approved",
        mitigationPlan:
          "Implement drainage improvements and weather monitoring",
      },
      {
        id: "uc2",
        projectId,
        category: "Material Price Increase",
        description: "Cement price increase due to global supply shortage",
        amount: 1800000,
        reason: "Global cement shortage affecting PNG market",
        impact: "medium",
        date: new Date("2023-04-02"),
        reportedBy: "Procurement Manager",
        approvalStatus: "approved",
      },
      {
        id: "uc3",
        projectId,
        category: "Geotechnical Issues",
        description: "Unexpected soft soil requiring additional stabilization",
        amount: 3200000,
        reason:
          "Geotechnical investigation did not identify problematic soil layer",
        impact: "high",
        date: new Date("2023-05-20"),
        reportedBy: "Geotechnical Engineer",
        approvalStatus: "pending",
        mitigationPlan: "Deep soil stabilization and revised foundation design",
      },
      {
        id: "uc4",
        projectId,
        category: "Environmental Compliance",
        description: "Additional environmental monitoring equipment",
        amount: 450000,
        reason: "New environmental regulations requiring enhanced monitoring",
        impact: "low",
        date: new Date("2023-06-10"),
        reportedBy: "Environmental Officer",
        approvalStatus: "approved",
      },
      {
        id: "uc5",
        projectId,
        category: "Security Costs",
        description: "Additional security measures due to local tensions",
        amount: 800000,
        reason: "Community concerns requiring enhanced security presence",
        impact: "medium",
        date: new Date("2023-07-05"),
        reportedBy: "Project Manager",
        approvalStatus: "pending",
      },
    ];

    setUnplannedCosts(mockCosts);
  };

  const formatCurrency = (amount: number) => {
    return `K ${(amount / 1000000).toFixed(2)}M`;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "bg-yellow-100 text-yellow-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const addUnplannedCost = () => {
    if (!newCost.description || !newCost.amount || !newCost.reason) {
      alert("Please fill in all required fields");
      return;
    }

    const cost: UnplannedCost = {
      id: `uc_${Date.now()}`,
      projectId,
      category: newCost.category || "Other",
      description: newCost.description,
      amount: Number(newCost.amount),
      reason: newCost.reason,
      impact: newCost.impact as "low" | "medium" | "high",
      date: new Date(),
      reportedBy: newCost.reportedBy || "Current User",
      approvalStatus: "pending",
    };

    setUnplannedCosts((prev) => [cost, ...prev]);
    setNewCost({
      category: "",
      description: "",
      amount: 0,
      reason: "",
      impact: "medium",
      reportedBy: "",
    });
    setShowAddForm(false);
  };

  const totalUnplannedCosts = unplannedCosts.reduce(
    (sum, cost) => sum + cost.amount,
    0,
  );
  const approvedCosts = unplannedCosts
    .filter((cost) => cost.approvalStatus === "approved")
    .reduce((sum, cost) => sum + cost.amount, 0);
  const pendingCosts = unplannedCosts
    .filter((cost) => cost.approvalStatus === "pending")
    .reduce((sum, cost) => sum + cost.amount, 0);

  const costsByCategory = unplannedCosts.reduce(
    (acc, cost) => {
      acc[cost.category] = (acc[cost.category] || 0) + cost.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Unplanned Costs Log
          </h3>
          <p className="text-gray-600">
            Track and manage unexpected project costs
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Report Unplanned Cost
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Unplanned</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalUnplannedCosts)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Costs</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(approvedCosts)}
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
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(pendingCosts)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Number of Issues</p>
                <p className="text-2xl font-bold text-blue-600">
                  {unplannedCosts.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Costs by Category</CardTitle>
          <CardDescription>
            Breakdown of unplanned costs by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(costsByCategory).map(([category, amount]) => (
              <div
                key={category}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(amount)}
                </div>
                <div className="text-sm text-gray-600">{category}</div>
                <div className="text-xs text-gray-500">
                  {((amount / totalUnplannedCosts) * 100).toFixed(1)}% of total
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Cost Form */}
      {showAddForm && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">
              Report New Unplanned Cost
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newCost.category}
                  onValueChange={(value) =>
                    setNewCost((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weather Delays">
                      Weather Delays
                    </SelectItem>
                    <SelectItem value="Material Price Increase">
                      Material Price Increase
                    </SelectItem>
                    <SelectItem value="Geotechnical Issues">
                      Geotechnical Issues
                    </SelectItem>
                    <SelectItem value="Environmental Compliance">
                      Environmental Compliance
                    </SelectItem>
                    <SelectItem value="Security Costs">
                      Security Costs
                    </SelectItem>
                    <SelectItem value="Design Changes">
                      Design Changes
                    </SelectItem>
                    <SelectItem value="Equipment Failure">
                      Equipment Failure
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Cost Amount (PGK)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={newCost.amount || ""}
                  onChange={(e) =>
                    setNewCost((prev) => ({
                      ...prev,
                      amount: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of the unplanned cost"
                value={newCost.description}
                onChange={(e) =>
                  setNewCost((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="reason">Reason/Cause</Label>
              <Textarea
                id="reason"
                placeholder="Detailed explanation of why this cost occurred"
                value={newCost.reason}
                onChange={(e) =>
                  setNewCost((prev) => ({ ...prev, reason: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="impact">Impact Level</Label>
                <Select
                  value={newCost.impact}
                  onValueChange={(value) =>
                    setNewCost((prev) => ({
                      ...prev,
                      impact: value as "low" | "medium" | "high",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reportedBy">Reported By</Label>
                <Input
                  id="reportedBy"
                  placeholder="Your name/position"
                  value={newCost.reportedBy}
                  onChange={(e) =>
                    setNewCost((prev) => ({
                      ...prev,
                      reportedBy: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={addUnplannedCost}
                className="bg-red-600 hover:bg-red-700"
              >
                Submit Report
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unplanned Costs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Unplanned Costs Log</CardTitle>
          <CardDescription>
            All reported unplanned costs and their approval status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unplannedCosts.map((cost) => (
                <TableRow key={cost.id}>
                  <TableCell>{cost.date.toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{cost.category}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm">{cost.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Reported by: {cost.reportedBy}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      {formatCurrency(cost.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getImpactColor(cost.impact)}>
                      {cost.impact}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getApprovalColor(cost.approvalStatus)}>
                      {cost.approvalStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
