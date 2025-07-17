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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  MapPin,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
  Upload,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import BOQManager from "./BOQManager";
import DataExportComponent from "./DataExportComponent";
import GPSDataEntrySpreadsheet from "./GPSDataEntrySpreadsheet";
import GoogleMapComponent from "./GoogleMapComponent";
import NotificationSystem from "./NotificationSystem";
import ProjectAlerts from "./ProjectAlerts";
import ProjectAnalytics from "./ProjectAnalytics";
import ProjectDashboard from "./ProjectDashboard";
import ProjectPhasesManager from "./ProjectPhasesManager";

interface Project {
  id: string;
  name: string;
  location: string;
  province: string;
  district?: string;
  contractor: string;
  status: string;
  progress: number;
  budget: number;
  spent: number;
  startDate?: string;
  endDate?: string;
  contractValue?: number;
  roadStartPoint?: string;
  roadEndPoint?: string;
  totalDistance?: number;
  completedDistance?: number;
  tenderNumber?: string;
  contractDate?: string;
}

interface ProjectTrackingProps {
  selectedProjectId?: string;
  userRole?: string;
}

export default function ProjectTrackingModule({
  selectedProjectId,
  userRole = "SITE_ENGINEER",
}: ProjectTrackingProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    province: "all",
    district: "all",
    status: "all",
    contractor: "all",
  });

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      const project = projects.find((p) => p.id === selectedProjectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [selectedProjectId, projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);

        // Auto-select first project if none selected
        if (!selectedProject && data.data?.length > 0) {
          setSelectedProject(data.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "planning":
        return "bg-blue-500";
      case "on_hold":
        return "bg-yellow-500";
      case "completed":
        return "bg-purple-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "text-green-600";
    if (progress >= 70) return "text-blue-600";
    if (progress >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PG", {
      style: "currency",
      currency: "PGK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateCompletionPercentage = (project: Project) => {
    if (!project.totalDistance || project.totalDistance === 0)
      return project.progress;
    return ((project.completedDistance || 0) / project.totalDistance) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Project Tracking Module
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Comprehensive road construction monitoring and management system
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          <NotificationSystem projects={projects} />
          <Button size="sm" className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Project Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedProject?.id === project.id
                ? "ring-2 ring-blue-500 shadow-md"
                : ""
            }`}
            onClick={() => setSelectedProject(project)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-semibold line-clamp-2">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {project.location}
                  </CardDescription>
                </div>
                <Badge
                  className={`text-xs ${getStatusColor(project.status)} text-white`}
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span
                      className={`font-medium ${getProgressColor(calculateCompletionPercentage(project))}`}
                    >
                      {calculateCompletionPercentage(project).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        calculateCompletionPercentage(project) >= 70
                          ? "bg-green-500"
                          : calculateCompletionPercentage(project) >= 40
                            ? "bg-blue-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(calculateCompletionPercentage(project), 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Distance */}
                {project.totalDistance && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-medium">
                      {(project.completedDistance || 0).toFixed(1)}km /{" "}
                      {project.totalDistance.toFixed(1)}km
                    </span>
                  </div>
                )}

                {/* Budget */}
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium">
                    {formatCurrency(project.spent)} /{" "}
                    {formatCurrency(project.budget)}
                  </span>
                </div>

                {/* Contractor */}
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Contractor:</span>
                  <span className="font-medium text-right flex-1 ml-2 line-clamp-1">
                    {project.contractor}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Project Details */}
      {selectedProject && (
        <>
          {/* Project Summary Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {selectedProject.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {selectedProject.location} •{" "}
                    {typeof selectedProject.province === "object"
                      ? selectedProject.province?.name
                      : selectedProject.province}
                    {selectedProject.district &&
                      ` • ${selectedProject.district}`}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    className={`${getStatusColor(selectedProject.status)} text-white`}
                  >
                    {selectedProject.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Project
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Progress</span>
                    <span className="sm:hidden">%</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {calculateCompletionPercentage(selectedProject).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">
                    {(selectedProject.completedDistance || 0).toFixed(1)}km of{" "}
                    {(selectedProject.totalDistance || 0).toFixed(1)}km
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <DollarSign className="h-4 w-4" />
                    <span className="hidden sm:inline">Financial</span>
                    <span className="sm:hidden">Budget</span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-green-600">
                    {formatCurrency(
                      selectedProject.contractValue || selectedProject.budget,
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    Spent: {formatCurrency(selectedProject.spent)} (
                    {(
                      (selectedProject.spent / selectedProject.budget) *
                      100
                    ).toFixed(1)}
                    %)
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Timeline</span>
                    <span className="sm:hidden">Days</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">
                    {selectedProject.startDate
                      ? Math.ceil(
                          (new Date(selectedProject.endDate!).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24),
                        )
                      : "TBD"}
                  </div>
                  <div className="text-xs text-gray-600">Days remaining</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <span className="hidden sm:inline">Contractor</span>
                    <span className="sm:hidden">Contractor</span>
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-gray-800 line-clamp-2">
                    {selectedProject.contractor}
                  </div>
                  <div className="text-xs text-gray-600">
                    Contract: {selectedProject.tenderNumber || "N/A"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Tracking Interface */}
          <Card>
            <CardContent className="p-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="border-b overflow-x-auto">
                  <TabsList className="w-full min-w-max justify-start rounded-none h-12 bg-transparent">
                    <TabsTrigger
                      value="dashboard"
                      className="gap-1 sm:gap-2 px-2 sm:px-4"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                      <span className="sm:hidden text-xs">Home</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="gps-entry"
                      className="gap-1 sm:gap-2 px-2 sm:px-4"
                    >
                      <MapPin className="h-4 w-4" />
                      <span className="hidden sm:inline">GPS Data Entry</span>
                      <span className="sm:hidden text-xs">GPS</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="phases"
                      className="gap-1 sm:gap-2 px-2 sm:px-4"
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">Phases & Tasks</span>
                      <span className="sm:hidden text-xs">Tasks</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="boq"
                      className="gap-1 sm:gap-2 px-2 sm:px-4"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">BOQ Management</span>
                      <span className="sm:hidden text-xs">BOQ</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="analytics"
                      className="gap-1 sm:gap-2 px-2 sm:px-4"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span className="hidden sm:inline">Analytics</span>
                      <span className="sm:hidden text-xs">Stats</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="alerts"
                      className="gap-1 sm:gap-2 px-2 sm:px-4"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span className="hidden sm:inline">Alerts</span>
                      <span className="sm:hidden text-xs">⚠️</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="maps"
                      className="gap-1 sm:gap-2 px-2 sm:px-4"
                    >
                      <MapPin className="h-4 w-4" />
                      <span className="hidden sm:inline">Maps & GPS</span>
                      <span className="sm:hidden text-xs">Maps</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="export"
                      className="gap-1 sm:gap-2 px-2 sm:px-4"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Data Export</span>
                      <span className="sm:hidden text-xs">Export</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="dashboard" className="p-6">
                  <ProjectDashboard
                    project={selectedProject}
                    userRole={userRole}
                  />
                </TabsContent>

                <TabsContent value="gps-entry" className="p-6">
                  <GPSDataEntrySpreadsheet
                    projectId={selectedProject.id}
                    projectName={selectedProject.name}
                    userRole={userRole}
                  />
                </TabsContent>

                <TabsContent value="phases" className="p-6">
                  <ProjectPhasesManager
                    projectId={selectedProject.id}
                    projectName={selectedProject.name}
                    userRole={userRole}
                  />
                </TabsContent>

                <TabsContent value="boq" className="p-6">
                  <BOQManager
                    projectId={selectedProject.id}
                    projectName={selectedProject.name}
                    budget={selectedProject.budget}
                    userRole={userRole}
                  />
                </TabsContent>

                <TabsContent value="analytics" className="p-6">
                  <ProjectAnalytics
                    project={selectedProject}
                    userRole={userRole}
                  />
                </TabsContent>

                <TabsContent value="alerts" className="p-6">
                  <ProjectAlerts
                    projectId={selectedProject.id}
                    userRole={userRole}
                  />
                </TabsContent>

                <TabsContent value="maps" className="p-6">
                  <GoogleMapComponent
                    projects={projects}
                    selectedProject={selectedProject}
                    onProjectSelect={setSelectedProject}
                    showGPSPoints={true}
                    showProjectRoutes={true}
                  />
                </TabsContent>

                <TabsContent value="export" className="p-6">
                  <DataExportComponent
                    projects={projects}
                    selectedProject={selectedProject}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}

      {projects.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Projects Found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first road construction project.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
