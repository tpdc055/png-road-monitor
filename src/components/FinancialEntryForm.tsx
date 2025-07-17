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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { MockAPIService } from "@/lib/mockApiService";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
  location: string;
  province: {
    name: string;
  };
}

interface FinancialEntry {
  id: string;
  category: string;
  type: string;
  amount: number;
  description: string | null;
  date: string;
  invoiceNumber: string | null;
  vendor: string | null;
  isApproved: boolean;
  project: {
    name: string;
  };
  user: {
    name: string;
    role: string;
  };
  createdAt: string;
}

const financialCategories = [
  "MATERIALS",
  "LABOR",
  "EQUIPMENT",
  "FUEL",
  "TRANSPORT",
  "OVERHEAD",
  "CONTINGENCY",
  "OTHER",
];

const financialTypes = ["EXPENSE", "INCOME", "TRANSFER", "ADJUSTMENT"];

export default function FinancialEntryForm() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>(
    [],
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    category: "MATERIALS",
    type: "EXPENSE",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    invoiceNumber: "",
    vendor: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Use MockAPIService for immediate functionality
      const projectsData = await MockAPIService.getProjects();

      if (projectsData.success) {
        setProjects(projectsData.data);
      }

      // Fetch financial entries if project is selected
      if (selectedProjectId) {
        const financialData = await MockAPIService.getFinancialEntries();

        if (financialData.success) {
          setFinancialEntries(
            financialData.data.filter(
              (entry) => entry.projectId === selectedProjectId,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch financial entries when project changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchFinancialEntries();
    }
  }, [selectedProjectId]);

  const fetchFinancialEntries = async () => {
    try {
      // Use MockAPIService for immediate functionality
      const data = await MockAPIService.getFinancialEntries();

      if (data.success) {
        setFinancialEntries(
          data.data.filter((entry) => entry.projectId === selectedProjectId),
        );
      }
    } catch (error) {
      console.error("Error fetching financial entries:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProjectId || !user) {
      alert("Please select a project and ensure you're logged in");
      return;
    }

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setIsSaving(true);

      // Use MockAPIService for immediate functionality
      const data = await MockAPIService.createFinancialEntry({
        projectId: selectedProjectId,
        userId: user.id,
        category: formData.category,
        type: formData.type,
        amount: Number.parseFloat(formData.amount),
        description: formData.description || null,
        date: formData.date,
        invoiceNumber: formData.invoiceNumber || null,
        vendor: formData.vendor || null,
      });

      if (data.success) {
        // Reset form
        setFormData({
          category: "MATERIALS",
          type: "EXPENSE",
          amount: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
          invoiceNumber: "",
          vendor: "",
        });
        setShowForm(false);

        // Refresh financial entries
        await fetchFinancialEntries();

        alert("Financial entry created successfully!");
      } else {
        alert(data.error || "Failed to create financial entry");
      }
    } catch (error) {
      console.error("Error creating financial entry:", error);
      alert("Failed to create financial entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `K ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      MATERIALS: "bg-blue-100 text-blue-800",
      LABOR: "bg-green-100 text-green-800",
      EQUIPMENT: "bg-orange-100 text-orange-800",
      FUEL: "bg-red-100 text-red-800",
      TRANSPORT: "bg-purple-100 text-purple-800",
      OVERHEAD: "bg-gray-100 text-gray-800",
      CONTINGENCY: "bg-yellow-100 text-yellow-800",
      OTHER: "bg-pink-100 text-pink-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      EXPENSE: "bg-red-100 text-red-800",
      INCOME: "bg-green-100 text-green-800",
      TRANSFER: "bg-blue-100 text-blue-800",
      ADJUSTMENT: "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading financial data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Financial Entry Management
          </h2>
          <p className="text-gray-600">
            Track project expenses, income, and financial transactions
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Financial Entry
        </Button>
      </div>

      {/* Project Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Select Project
          </CardTitle>
          <CardDescription>
            Choose the project for financial tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="project-select">Project *</Label>
              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name} - {project.location},{" "}
                      {project.province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Entry Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Add Financial Entry
            </CardTitle>
            <CardDescription>
              Record a new financial transaction for the selected project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {financialCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0) + category.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {financialTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount (Kina) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter description of the financial transaction..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoice">Invoice Number</Label>
                  <Input
                    id="invoice"
                    placeholder="INV-2024-001"
                    value={formData.invoiceNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        invoiceNumber: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="vendor">Vendor/Supplier</Label>
                  <Input
                    id="vendor"
                    placeholder="Vendor or supplier name"
                    value={formData.vendor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vendor: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSaving || !selectedProjectId}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Entry
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Financial Entries List */}
      {selectedProjectId && financialEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Financial Entries ({financialEntries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(entry.category)}>
                        {entry.category.charAt(0) +
                          entry.category.slice(1).toLowerCase()}
                      </Badge>
                      <Badge className={getTypeColor(entry.type)}>
                        {entry.type.charAt(0) +
                          entry.type.slice(1).toLowerCase()}
                      </Badge>
                      {entry.isApproved ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {formatCurrency(entry.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(entry.date)}
                      </div>
                    </div>
                  </div>

                  {entry.description && (
                    <p className="text-gray-600">{entry.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {entry.invoiceNumber && (
                      <div>
                        <span className="text-gray-500">Invoice:</span>
                        <span className="ml-1 font-medium">
                          {entry.invoiceNumber}
                        </span>
                      </div>
                    )}
                    {entry.vendor && (
                      <div>
                        <span className="text-gray-500">Vendor:</span>
                        <span className="ml-1 font-medium">{entry.vendor}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Created by:</span>
                      <span className="ml-1 font-medium">
                        {entry.user.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Role:</span>
                      <span className="ml-1 font-medium">
                        {entry.user.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedProjectId && financialEntries.length === 0 && !showForm && (
        <Card>
          <CardContent className="p-12 text-center">
            <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No financial entries found
            </h3>
            <p className="text-gray-600 mb-4">
              Start tracking project finances by adding your first entry.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Entry
            </Button>
          </CardContent>
        </Card>
      )}

      {!selectedProjectId && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a project</h3>
            <p className="text-gray-600">
              Choose a project above to view and manage its financial entries.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
