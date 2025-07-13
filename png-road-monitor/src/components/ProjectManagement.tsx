"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  Calculator,
  ArrowLeft,
  BarChart3,
  Loader2
} from "lucide-react";
import FinancialDashboard from "@/components/FinancialDashboard";
import { MockAPIService } from "@/lib/mockApiService";

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

const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "PLANNING":
      return "bg-blue-100 text-blue-800";
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "ON_HOLD":
      return "bg-yellow-100 text-yellow-800";
    case "COMPLETED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getFundingSourceColor = (source: Project["fundingSource"]) => {
  switch (source) {
    case "GOVERNMENT":
      return "bg-blue-100 text-blue-800";
    case "WORLD_BANK":
      return "bg-green-100 text-green-800";
    case "ADB":
      return "bg-orange-100 text-orange-800";
    case "JOINT":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatCurrency = (amount: number) => {
  return `K ${(amount / 1000000).toFixed(1)}M`;
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Not set";
  return new Date(dateString).toLocaleDateString();
};

const getStatusDisplayName = (status: Project["status"]) => {
  switch (status) {
    case "PLANNING": return "Planning";
    case "ACTIVE": return "Active";
    case "ON_HOLD": return "On Hold";
    case "COMPLETED": return "Completed";
    default: return status;
  }
};

const getFundingDisplayName = (source: Project["fundingSource"]) => {
  switch (source) {
    case "GOVERNMENT": return "PNG Government";
    case "WORLD_BANK": return "World Bank";
    case "ADB": return "Asian Development Bank";
    case "JOINT": return "Joint Funding";
    default: return source;
  }
};

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "details" | "financial">("list");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState<{
    name: string;
    description: string;
    location: string;
    provinceId: string;
    budget: number;
    startDate: string;
    endDate: string;
    contractor: string;
    managerId: string;
    fundingSource: string;
  }>({
    name: "",
    description: "",
    location: "",
    provinceId: "",
    budget: 0,
    startDate: "",
    endDate: "",
    contractor: "",
    managerId: "",
    fundingSource: "GOVERNMENT"
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Use MockAPIService for immediate functionality
      const [projectsData, provincesData, usersData] = await Promise.all([
        MockAPIService.getProjects(),
        MockAPIService.getProvinces(),
        MockAPIService.getUsers()
      ]);

      if (projectsData.success) {
        setProjects(projectsData.data);
      }

      if (provincesData.success) {
        setProvinces(provincesData.data);
      }

      if (usersData.success) {
        setUsers(usersData.data.filter((user: User) =>
          user.role === 'PROJECT_MANAGER' || user.role === 'ADMIN'
        ));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.contractor && project.contractor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.provinceId) {
      alert("Please fill in required fields: Project Name and Province");
      return;
    }

    try {
      setIsCreating(true);

      // Use MockAPIService for immediate functionality
      const data = await MockAPIService.createProject({
        name: newProject.name,
        description: newProject.description || null,
        location: newProject.location,
        provinceId: newProject.provinceId,
        budget: newProject.budget,
        startDate: newProject.startDate || null,
        endDate: newProject.endDate || null,
        contractor: newProject.contractor || null,
        managerId: newProject.managerId && newProject.managerId !== "unassigned" ? newProject.managerId : null,
        fundingSource: newProject.fundingSource
      });

      if (data.success) {
        // Refresh the projects list
        await fetchData();

        // Reset form
        setNewProject({
          name: "",
          description: "",
          location: "",
          provinceId: "",
          budget: 0,
          startDate: "",
          endDate: "",
          contractor: "",
          managerId: "",
          fundingSource: "GOVERNMENT"
        });
        setShowCreateForm(false);

        alert("Project created successfully!");
      } else {
        alert(data.error || "Failed to create project");
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // If financial dashboard is selected for a project
  if (viewMode === "financial" && selectedProject) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setViewMode("list");
                setSelectedProject(null);
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
              <p className="text-gray-600">Financial Dashboard & Analysis</p>
            </div>
          </div>
        </div>

        {/* Financial Dashboard */}
        <FinancialDashboard
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          projectBudget={selectedProject.budget}
          projectProgress={selectedProject.progress}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
          <p className="text-gray-600">PNG road construction projects overview and management</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="font-semibold text-blue-600">{projects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="font-semibold text-green-600">
                  {formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="font-semibold text-yellow-600">
                  {projects.filter(p => p.status === "ACTIVE").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Provinces</p>
                <p className="font-semibold text-purple-600">
                  {new Set(projects.map(p => p.province.name)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Projects</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, location, or contractor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="sm:w-48">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PLANNING">Planning</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Project Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>Add a new road construction project to the PNG monitoring system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  placeholder="Enter project name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="project-province">Province *</Label>
                <Select
                  value={newProject.provinceId}
                  onValueChange={(value) => setNewProject({...newProject, provinceId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map(province => (
                      <SelectItem key={province.id} value={province.id}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="project-location">Specific Location</Label>
              <Input
                id="project-location"
                placeholder="Enter specific location details"
                value={newProject.location}
                onChange={(e) => setNewProject({...newProject, location: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                placeholder="Enter project description"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="project-budget">Budget (Kina)</Label>
                <Input
                  id="project-budget"
                  type="number"
                  placeholder="0"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({...newProject, budget: Number(e.target.value)})}
                />
              </div>

              <div>
                <Label htmlFor="project-start">Start Date</Label>
                <Input
                  id="project-start"
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="project-end">End Date</Label>
                <Input
                  id="project-end"
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="project-contractor">Contractor</Label>
                <Input
                  id="project-contractor"
                  placeholder="Contractor name"
                  value={newProject.contractor}
                  onChange={(e) => setNewProject({...newProject, contractor: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="project-manager">Project Manager</Label>
                <Select
                  value={newProject.managerId}
                  onValueChange={(value) => setNewProject({...newProject, managerId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">No manager assigned</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="project-funding">Funding Source</Label>
                <Select
                  value={newProject.fundingSource}
                  onValueChange={(value) => setNewProject({...newProject, fundingSource: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select funding source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOVERNMENT">PNG Government</SelectItem>
                    <SelectItem value="WORLD_BANK">World Bank</SelectItem>
                    <SelectItem value="ADB">Asian Development Bank</SelectItem>
                    <SelectItem value="JOINT">Joint Funding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateProject}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className={`cursor-pointer transition-all ${
              selectedProject?.id === project.id ? "ring-2 ring-blue-500" : "hover:shadow-md"
            }`}
            onClick={() => setSelectedProject(selectedProject?.id === project.id ? null : project)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>{project.location}, {project.province.name}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusDisplayName(project.status)}
                  </Badge>
                  <Badge className={getFundingSourceColor(project.fundingSource)}>
                    {getFundingDisplayName(project.fundingSource)}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">{project.description || "No description provided"}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Budget</p>
                  <p className="font-semibold">{formatCurrency(project.budget)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Spent</p>
                  <p className="font-semibold">{formatCurrency(project.spent)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Progress</p>
                  <p className="font-semibold">{project.progress}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Manager</p>
                  <p className="font-semibold">{project.manager?.name || "Not assigned"}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {selectedProject?.id === project.id && (
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                      setViewMode("financial");
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Financial Dashboard
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    BoQ & Reports
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-gray-600">
              {projects.length === 0
                ? "No projects have been created yet. Create your first project to get started."
                : "Try adjusting your search or filter criteria."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
