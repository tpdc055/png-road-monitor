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
import type { ChangeOrder } from "@/types/financial";
import {
  CheckCircle,
  Clock,
  Edit,
  Eye,
  FileText,
  Plus,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ChangeOrdersManagerProps {
  projectId: string;
}

export default function ChangeOrdersManager({
  projectId,
}: ChangeOrdersManagerProps) {
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ChangeOrder | null>(null);
  const [newOrder, setNewOrder] = useState<Partial<ChangeOrder>>({
    title: "",
    description: "",
    reason: "",
    costImpact: 0,
    timeImpact: 0,
    requestedBy: "",
  });

  useEffect(() => {
    loadChangeOrders();
  }, [projectId]);

  const loadChangeOrders = () => {
    // Mock change orders data
    const mockOrders: ChangeOrder[] = [
      {
        id: "co1",
        projectId,
        title: "Additional Drainage Culverts",
        description:
          "Install 5 additional culverts at chainage 15+500 to 16+200 due to increased water flow",
        reason:
          "Heavy rainfall analysis shows need for enhanced drainage capacity",
        costImpact: 2500000,
        timeImpact: 14,
        requestedBy: "Hydraulic Engineer",
        requestDate: new Date("2023-04-15"),
        status: "approved",
        approvedBy: "Project Director",
        approvalDate: new Date("2023-04-22"),
        implementation: {
          startDate: new Date("2023-05-01"),
          endDate: new Date("2023-05-15"),
          actualCost: 2650000,
          notes:
            "Completed on schedule with minor cost overrun due to equipment mobilization",
        },
      },
      {
        id: "co2",
        projectId,
        title: "Pavement Design Upgrade",
        description:
          "Upgrade pavement thickness from 150mm to 200mm for heavy vehicle sections",
        reason:
          "Traffic study indicates higher heavy vehicle loads than originally designed",
        costImpact: 4200000,
        timeImpact: 21,
        requestedBy: "Pavement Engineer",
        requestDate: new Date("2023-05-10"),
        status: "under-review",
        approvedBy: undefined,
        approvalDate: undefined,
      },
      {
        id: "co3",
        projectId,
        title: "Environmental Mitigation Enhancement",
        description:
          "Additional sediment control measures and wildlife crossing",
        reason:
          "Environmental compliance requirements updated during construction",
        costImpact: 1800000,
        timeImpact: 10,
        requestedBy: "Environmental Officer",
        requestDate: new Date("2023-06-01"),
        status: "submitted",
      },
      {
        id: "co4",
        projectId,
        title: "Bridge Foundation Modification",
        description:
          "Modify bridge foundation design due to unexpected soil conditions",
        reason:
          "Geotechnical investigation revealed soft clay layer requiring deeper foundations",
        costImpact: 5500000,
        timeImpact: 30,
        requestedBy: "Structural Engineer",
        requestDate: new Date("2023-06-15"),
        status: "draft",
      },
      {
        id: "co5",
        projectId,
        title: "Safety Barrier Extension",
        description:
          "Extend safety barriers by 2km due to updated safety standards",
        reason:
          "PNG safety standards updated requiring additional barrier protection",
        costImpact: 800000,
        timeImpact: 7,
        requestedBy: "Safety Engineer",
        requestDate: new Date("2023-07-01"),
        status: "rejected",
        approvedBy: "Project Director",
        approvalDate: new Date("2023-07-08"),
      },
    ];

    setChangeOrders(mockOrders);
  };

  const formatCurrency = (amount: number) => {
    return `K ${(amount / 1000000).toFixed(2)}M`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "under-review":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "implemented":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4" />;
      case "submitted":
      case "under-review":
        return <Clock className="h-4 w-4" />;
      case "approved":
      case "implemented":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const addChangeOrder = () => {
    if (!newOrder.title || !newOrder.description || !newOrder.reason) {
      alert("Please fill in all required fields");
      return;
    }

    const order: ChangeOrder = {
      id: `co_${Date.now()}`,
      projectId,
      title: newOrder.title || "",
      description: newOrder.description || "",
      reason: newOrder.reason || "",
      costImpact: Number(newOrder.costImpact || 0),
      timeImpact: Number(newOrder.timeImpact || 0),
      requestedBy: newOrder.requestedBy || "Current User",
      requestDate: new Date(),
      status: "draft",
    };

    setChangeOrders((prev) => [order, ...prev]);
    setNewOrder({
      title: "",
      description: "",
      reason: "",
      costImpact: 0,
      timeImpact: 0,
      requestedBy: "",
    });
    setShowAddForm(false);
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: ChangeOrder["status"],
  ) => {
    setChangeOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              ...(newStatus === "approved" && {
                approvedBy: "Current User",
                approvalDate: new Date(),
              }),
            }
          : order,
      ),
    );
  };

  const totalCostImpact = changeOrders
    .filter(
      (order) => order.status === "approved" || order.status === "implemented",
    )
    .reduce((sum, order) => sum + order.costImpact, 0);

  const totalTimeImpact = changeOrders
    .filter(
      (order) => order.status === "approved" || order.status === "implemented",
    )
    .reduce((sum, order) => sum + order.timeImpact, 0);

  const pendingOrders = changeOrders.filter(
    (order) => order.status === "submitted" || order.status === "under-review",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Change Orders Management
          </h3>
          <p className="text-gray-600">
            Track and manage project scope changes
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Change Order
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Change Orders</p>
                <p className="text-2xl font-bold text-blue-600">
                  {changeOrders.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cost Impact</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalCostImpact)}
                </p>
              </div>
              <FileText className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Time Impact</p>
                <p className="text-2xl font-bold text-orange-600">
                  {totalTimeImpact} days
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingOrders}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Change Order Form */}
      {showAddForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">
              Create New Change Order
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Change Order Title</Label>
              <Input
                id="title"
                placeholder="Brief title describing the change"
                value={newOrder.title}
                onChange={(e) =>
                  setNewOrder((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the proposed change"
                value={newOrder.description}
                onChange={(e) =>
                  setNewOrder((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="reason">Reason for Change</Label>
              <Textarea
                id="reason"
                placeholder="Justification and reason for this change"
                value={newOrder.reason}
                onChange={(e) =>
                  setNewOrder((prev) => ({ ...prev, reason: e.target.value }))
                }
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="costImpact">Cost Impact (PGK)</Label>
                <Input
                  id="costImpact"
                  type="number"
                  placeholder="0"
                  value={newOrder.costImpact || ""}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      costImpact: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="timeImpact">Time Impact (Days)</Label>
                <Input
                  id="timeImpact"
                  type="number"
                  placeholder="0"
                  value={newOrder.timeImpact || ""}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      timeImpact: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="requestedBy">Requested By</Label>
                <Input
                  id="requestedBy"
                  placeholder="Your name/position"
                  value={newOrder.requestedBy}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      requestedBy: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={addChangeOrder}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Change Order
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Change Orders List</CardTitle>
          <CardDescription>
            All project change orders and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID & Title</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Cost Impact</TableHead>
                <TableHead>Time Impact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changeOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.title}</div>
                      <div className="text-sm text-gray-500">#{order.id}</div>
                      <div className="text-xs text-gray-400">
                        Requested: {order.requestDate.toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.requestedBy}</TableCell>
                  <TableCell>
                    <span
                      className={`font-semibold ${order.costImpact > 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {order.costImpact > 0 ? "+" : ""}
                      {formatCurrency(order.costImpact)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-semibold ${order.timeImpact > 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {order.timeImpact > 0 ? "+" : ""}
                      {order.timeImpact} days
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
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
                      {order.status === "submitted" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2"
                          onClick={() =>
                            updateOrderStatus(order.id, "approved")
                          }
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Change Orders by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "draft",
              "submitted",
              "under-review",
              "approved",
              "rejected",
              "implemented",
            ].map((status) => {
              const count = changeOrders.filter(
                (order) => order.status === status,
              ).length;
              return (
                <div
                  key={status}
                  className="text-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl font-bold text-gray-900">
                    {count}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {status.replace("-", " ")}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
