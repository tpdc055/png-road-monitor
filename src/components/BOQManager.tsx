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
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  DollarSign,
  Download,
  Edit,
  FileText,
  Plus,
  Save,
  Target,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface BOQItem {
  id: string;
  itemCode: string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  totalAmount: number;
  completedQuantity: number;
  phase?: string;
  isEditing?: boolean;
  isNew?: boolean;
}

interface BOQManagerProps {
  projectId: string;
  projectName: string;
  budget: number;
  userRole?: string;
}

export default function BOQManager({
  projectId,
  projectName,
  budget,
  userRole = "SITE_ENGINEER",
}: BOQManagerProps) {
  const [boqItems, setBoqItems] = useState<BOQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBOQItems();
  }, [projectId]);

  const fetchBOQItems = async () => {
    try {
      setLoading(true);

      // Mock BOQ data
      const mockBOQ: BOQItem[] = [
        {
          id: "1",
          itemCode: "SUR001",
          description: "Survey and Pegging",
          unit: "km",
          quantity: 50,
          unitRate: 5000,
          totalAmount: 250000,
          completedQuantity: 35,
          phase: "Preliminary/Survey",
        },
        {
          id: "2",
          itemCode: "EW001",
          description: "Clearing and Grubbing",
          unit: "ha",
          quantity: 25,
          unitRate: 15000,
          totalAmount: 375000,
          completedQuantity: 18,
          phase: "Earthworks",
        },
        {
          id: "3",
          itemCode: "EW002",
          description: "Excavation and Embankment",
          unit: "m3",
          quantity: 10000,
          unitRate: 25,
          totalAmount: 250000,
          completedQuantity: 6500,
          phase: "Earthworks",
        },
        {
          id: "4",
          itemCode: "BC001",
          description: "Subbase Material",
          unit: "m3",
          quantity: 5000,
          unitRate: 45,
          totalAmount: 225000,
          completedQuantity: 0,
          phase: "Subbase & Base Construction",
        },
      ];

      setBoqItems(mockBOQ);
    } catch (error) {
      console.error("Error fetching BOQ items:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNewItem = () => {
    const newItem: BOQItem = {
      id: `new-${Date.now()}`,
      itemCode: "",
      description: "",
      unit: "",
      quantity: 0,
      unitRate: 0,
      totalAmount: 0,
      completedQuantity: 0,
      phase: "",
      isEditing: true,
      isNew: true,
    };

    setBoqItems([newItem, ...boqItems]);
  };

  const updateItem = (id: string, field: keyof BOQItem, value: any) => {
    setBoqItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };

          // Recalculate total amount when quantity or unit rate changes
          if (field === "quantity" || field === "unitRate") {
            updated.totalAmount = updated.quantity * updated.unitRate;
          }

          return updated;
        }
        return item;
      }),
    );
  };

  const saveItem = async (item: BOQItem) => {
    if (!item.itemCode || !item.description || !item.unit) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      // Mock save
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setBoqItems((items) =>
        items.map((i) =>
          i.id === item.id ? { ...item, isEditing: false, isNew: false } : i,
        ),
      );
    } catch (error) {
      console.error("Error saving BOQ item:", error);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this BOQ item?")) {
      setBoqItems((items) => items.filter((item) => item.id !== id));
    }
  };

  const calculateTotals = () => {
    const totalBudget = boqItems.reduce(
      (sum, item) => sum + item.totalAmount,
      0,
    );
    const totalCompleted = boqItems.reduce(
      (sum, item) => sum + item.completedQuantity * item.unitRate,
      0,
    );
    const overallProgress =
      totalBudget > 0 ? (totalCompleted / totalBudget) * 100 : 0;

    return { totalBudget, totalCompleted, overallProgress };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PG", {
      style: "currency",
      currency: "PGK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCompletionPercentage = (item: BOQItem) => {
    return item.quantity > 0
      ? (item.completedQuantity / item.quantity) * 100
      : 0;
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading BOQ data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Bill of Quantities (BOQ)
          </h2>
          <p className="text-gray-600 mt-1">
            Manage project quantities, rates, and track completion progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import BOQ
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export BOQ
          </Button>
          <Button onClick={addNewItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total BOQ Value
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totals.totalBudget)}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Value
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totals.totalCompleted)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  BOQ Progress
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {totals.overallProgress.toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={totals.overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-orange-600">
                  {boqItems.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BOQ Table */}
      <Card>
        <CardHeader>
          <CardTitle>BOQ Items</CardTitle>
          <CardDescription>
            Detailed breakdown of project quantities and costs
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Item Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Unit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Unit Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Total Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Completed
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {boqItems.map((item) => (
                  <tr key={item.id} className={item.isNew ? "bg-blue-50" : ""}>
                    <td className="px-4 py-3 text-sm">
                      {item.isEditing ? (
                        <Input
                          value={item.itemCode}
                          onChange={(e) =>
                            updateItem(item.id, "itemCode", e.target.value)
                          }
                          placeholder="Item code"
                          className="h-8"
                        />
                      ) : (
                        <Badge variant="outline">{item.itemCode}</Badge>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {item.isEditing ? (
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          placeholder="Description"
                          className="h-8"
                        />
                      ) : (
                        <div className="max-w-48">
                          <div className="font-medium">{item.description}</div>
                          {item.phase && (
                            <div className="text-xs text-gray-500">
                              {item.phase}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {item.isEditing ? (
                        <Input
                          value={item.unit}
                          onChange={(e) =>
                            updateItem(item.id, "unit", e.target.value)
                          }
                          placeholder="Unit"
                          className="h-8 w-20"
                        />
                      ) : (
                        item.unit
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {item.isEditing ? (
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "quantity",
                              Number.parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-8 w-24"
                        />
                      ) : (
                        item.quantity.toLocaleString()
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {item.isEditing ? (
                        <Input
                          type="number"
                          value={item.unitRate}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "unitRate",
                              Number.parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-8 w-24"
                        />
                      ) : (
                        formatCurrency(item.unitRate)
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm font-medium">
                      {formatCurrency(item.totalAmount)}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {item.isEditing ? (
                        <Input
                          type="number"
                          value={item.completedQuantity}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "completedQuantity",
                              Number.parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-8 w-24"
                        />
                      ) : (
                        `${item.completedQuantity.toLocaleString()} / ${item.quantity.toLocaleString()}`
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-16">
                          <Progress
                            value={getCompletionPercentage(item)}
                            className="h-2"
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {getCompletionPercentage(item).toFixed(0)}%
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-1">
                        {item.isEditing ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => saveItem(item)}
                              disabled={saving}
                              className="h-6 w-6 p-0"
                            >
                              <Save className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                updateItem(item.id, "isEditing", false)
                              }
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                updateItem(item.id, "isEditing", true)
                              }
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteItem(item.id)}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {boqItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No BOQ Items
              </h3>
              <p className="text-gray-600 mb-4">
                Start by adding items to your Bill of Quantities
              </p>
              <Button onClick={addNewItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
