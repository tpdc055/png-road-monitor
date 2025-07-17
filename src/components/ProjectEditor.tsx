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
import { MockAPIService } from "@/lib/mockApiService";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  DollarSign,
  Edit,
  Loader2,
  MapPin,
  Save,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  location: string;
  province: {
    id: string;
    name: string;
    code: string;
  };
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED";
  progress: number;
  budget: number;
  spent: number;
  startDate: string | null;
  endDate: string | null;
  contractor: string | null;
  manager: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  fundingSource: "GOVERNMENT" | "WORLD_BANK" | "ADB" | "JOINT";
  createdAt: string;
  updatedAt: string;
}

interface Province {
  id: string;
  name: string;
  code: string;
  region: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProjectEditorProps {
  projectId: string;
  onClose: () => void;
  onSave: () => void;
}

const statusOptions = [
  { value: "PLANNING", label: "Planning", color: "bg-blue-100 text-blue-800" },
  { value: "ACTIVE", label: "Active", color: "bg-green-100 text-green-800" },
  {
    value: "ON_HOLD",
    label: "On Hold",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    color: "bg-gray-100 text-gray-800",
  },
];

const fundingOptions = [
  { value: "GOVERNMENT", label: "PNG Government" },
  { value: "WORLD_BANK", label: "World Bank" },
  { value: "ADB", label: "Asian Development Bank" },
  { value: "JOINT", label: "Joint Funding" },
];

export default function ProjectEditor({
  projectId,
  onClose,
  onSave,
}: ProjectEditorProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    provinceId: "",
    status: "PLANNING" as Project["status"],
    budget: "",
    startDate: "",
    endDate: "",
    contractor: "",
    managerId: "",
    fundingSource: "GOVERNMENT" as Project["fundingSource"],
  });

  // Fetch project data and other required data
  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use MockAPIService for immediate functionality
      const [projectData, provincesData, usersData] = await Promise.all([
        MockAPIService.getProject(projectId),
        MockAPIService.getProvinces(),
        MockAPIService.getUsers(),
      ]);

      if (!projectData.success) {
        setError("Failed to load project");
        return;
      }

      if (provincesData.success) {
        setProvinces(provincesData.data);
      }

      if (usersData.success) {
        setUsers(
          usersData.data.filter(
            (user: User) =>
              user.role === "PROJECT_MANAGER" || user.role === "ADMIN",
          ),
        );
      }

      // Set project data
      const proj = projectData.data;
      setProject(proj);

      // Populate form with existing data
      setFormData({
        name: proj.name,
        description: proj.description || "",
        location: proj.location,
        provinceId: proj.province.id,
        status: proj.status,
        budget: proj.budget.toString(),
        startDate: proj.startDate ? proj.startDate.split("T")[0] : "",
        endDate: proj.endDate ? proj.endDate.split("T")[0] : "",
        contractor: proj.contractor || "",
        managerId: proj.manager?.id || "unassigned",
        fundingSource: proj.fundingSource,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load project data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.location ||
      !formData.provinceId ||
      !formData.budget
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Use MockAPIService for immediate functionality
      const data = await MockAPIService.updateProject(projectId, {
        name: formData.name,
        description: formData.description || null,
        location: formData.location,
        provinceId: formData.provinceId,
        status: formData.status,
        budget: Number.parseFloat(formData.budget),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        contractor: formData.contractor || null,
        managerId:
          formData.managerId !== "unassigned" ? formData.managerId : null,
        fundingSource: formData.fundingSource,
      });

      if (data.success) {
        onSave(); // Refresh parent component
        onClose(); // Close editor
      } else {
        setError(data.error || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      setError("Failed to update project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `K ${(amount / 1000000).toFixed(1)}M`;
  };

  const getStatusBadge = (status: Project["status"]) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return statusOption ? (
      <Badge className={statusOption.color}>{statusOption.label}</Badge>
    ) : null;
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading project details...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-12 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Project</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={onClose} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Edit className="h-6 w-6" />
              Edit Project
            </h2>
            <p className="text-gray-600">Modify project details and settings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(project.status)}
          <span className="text-sm text-gray-500">
            Progress: {project.progress}%
          </span>
        </div>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Project Information</CardTitle>
          <CardDescription>
            Overview of the existing project before making changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Budget:</span>
              <span className="ml-2 font-semibold">
                {formatCurrency(project.budget)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Spent:</span>
              <span className="ml-2 font-semibold">
                {formatCurrency(project.spent)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Province:</span>
              <span className="ml-2 font-semibold">
                {project.province.name}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Manager:</span>
              <span className="ml-2 font-semibold">
                {project.manager?.name || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Contractor:</span>
              <span className="ml-2 font-semibold">
                {project.contractor || "Not assigned"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 font-semibold">
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Project Details</CardTitle>
          <CardDescription>
            Update the project information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <Label htmlFor="province">Province *</Label>
                <Select
                  value={formData.provinceId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, provinceId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.id} value={province.id}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Specific Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter specific location details"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter project description"
                rows={3}
              />
            </div>

            {/* Project Status and Budget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status">Project Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as Project["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budget">Budget (Kina) *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="funding">Funding Source</Label>
                <Select
                  value={formData.fundingSource}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      fundingSource: value as Project["fundingSource"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fundingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Team Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contractor">Contractor</Label>
                <Input
                  id="contractor"
                  value={formData.contractor}
                  onChange={(e) =>
                    setFormData({ ...formData, contractor: e.target.value })
                  }
                  placeholder="Contractor name"
                />
              </div>

              <div>
                <Label htmlFor="manager">Project Manager</Label>
                <Select
                  value={formData.managerId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, managerId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">
                      No manager assigned
                    </SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-6 border-t">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Project
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
