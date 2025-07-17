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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  Edit,
  Plus,
  Save,
  Target,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface ProjectPhase {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget: number;
  spent: number;
  progress: number;
  order: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
  tasks: ProjectTask[];
  isExpanded?: boolean;
  isEditing?: boolean;
  isNew?: boolean;
}

interface ProjectTask {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget: number;
  spent: number;
  progress: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE" | "ON_HOLD";
  assigneeId?: string;
  assigneeName?: string;
  targetQuantity?: number;
  completedQuantity?: number;
  unit?: string;
  isEditing?: boolean;
  isNew?: boolean;
}

interface ProjectPhasesManagerProps {
  projectId: string;
  projectName: string;
  userRole?: string;
}

const DEFAULT_PHASES = [
  {
    name: "Preliminary/Survey Phase",
    description: "Initial survey and site preparation activities",
    order: 1,
    defaultTasks: [
      "Survey & Pegging",
      "Soil and Materials Investigation",
      "Environmental Assessment",
      "Site Clearance & Demarcation",
    ],
  },
  {
    name: "Earthworks Phase",
    description: "Ground preparation and earthwork activities",
    order: 2,
    defaultTasks: [
      "Clearing & Grubbing",
      "Topsoil Stripping",
      "Embankment & Subgrade Preparation",
    ],
  },
  {
    name: "Subbase & Base Construction",
    description: "Road foundation construction",
    order: 3,
    defaultTasks: ["Subbase Laying", "Basecourse Placement"],
  },
  {
    name: "Pavement & Sealing Phase",
    description: "Road surface construction and sealing",
    order: 4,
    defaultTasks: [
      "Bitumen/Asphalt Laying",
      "Surface Sealing",
      "Drainage Construction",
      "Culvert & Gabion Installation",
    ],
  },
  {
    name: "Ancillary Works",
    description: "Additional road infrastructure and features",
    order: 5,
    defaultTasks: [
      "Road Furniture (signs, guardrails)",
      "Road Markings",
      "Landscaping",
    ],
  },
  {
    name: "Quality Assurance and Handover",
    description: "Final inspections and project handover",
    order: 6,
    defaultTasks: [
      "Inspection & Testing",
      "Rectification of Defects",
      "Final Approval & Handover",
    ],
  },
];

export default function ProjectPhasesManager({
  projectId,
  projectName,
  userRole = "SITE_ENGINEER",
}: ProjectPhasesManagerProps) {
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectPhases();
  }, [projectId]);

  const fetchProjectPhases = async () => {
    try {
      setLoading(true);

      // Mock data for now - in production, this would fetch from API
      const mockPhases: ProjectPhase[] = DEFAULT_PHASES.map(
        (defaultPhase, index) => ({
          id: `phase-${index + 1}`,
          name: defaultPhase.name,
          description: defaultPhase.description,
          startDate: index === 0 ? "2024-01-15" : undefined,
          endDate: index === 0 ? "2024-02-15" : undefined,
          budget: 500000 + Math.random() * 1000000,
          spent: Math.random() * 300000,
          progress: index === 0 ? 85 : index === 1 ? 45 : Math.random() * 30,
          order: defaultPhase.order,
          status:
            index === 0
              ? "IN_PROGRESS"
              : index === 1
                ? "IN_PROGRESS"
                : "NOT_STARTED",
          isExpanded: index < 2,
          tasks: defaultPhase.defaultTasks.map((taskName, taskIndex) => ({
            id: `task-${index + 1}-${taskIndex + 1}`,
            name: taskName,
            description: `${taskName} for ${projectName}`,
            startDate: index === 0 ? "2024-01-15" : undefined,
            endDate: index === 0 ? "2024-02-01" : undefined,
            budget: 50000 + Math.random() * 200000,
            spent: Math.random() * 100000,
            progress:
              index === 0 ? 80 + Math.random() * 20 : Math.random() * 50,
            status:
              index === 0 && taskIndex < 2
                ? "COMPLETED"
                : index === 0
                  ? "IN_PROGRESS"
                  : "NOT_STARTED",
            assigneeId: "user-1",
            assigneeName: "James Peter",
            targetQuantity: Math.random() * 10 + 1,
            completedQuantity: Math.random() * 8,
            unit: "km",
          })),
        }),
      );

      setPhases(mockPhases);
    } catch (error) {
      console.error("Error fetching project phases:", error);
      setError("Failed to load project phases");
    } finally {
      setLoading(false);
    }
  };

  const addNewPhase = () => {
    const newPhase: ProjectPhase = {
      id: `new-phase-${Date.now()}`,
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      budget: 0,
      spent: 0,
      progress: 0,
      order: phases.length + 1,
      status: "NOT_STARTED",
      tasks: [],
      isExpanded: true,
      isEditing: true,
      isNew: true,
    };

    setPhases([...phases, newPhase]);
  };

  const addNewTask = (phaseId: string) => {
    const newTask: ProjectTask = {
      id: `new-task-${Date.now()}`,
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      budget: 0,
      spent: 0,
      progress: 0,
      status: "NOT_STARTED",
      assigneeId: "",
      assigneeName: "",
      targetQuantity: 0,
      completedQuantity: 0,
      unit: "km",
      isEditing: true,
      isNew: true,
    };

    setPhases(
      phases.map((phase) =>
        phase.id === phaseId
          ? { ...phase, tasks: [...phase.tasks, newTask], isExpanded: true }
          : phase,
      ),
    );
  };

  const savePhase = async (phase: ProjectPhase) => {
    try {
      setSaving(true);

      if (!phase.name.trim()) {
        setError("Phase name is required");
        return;
      }

      // Mock save - in production, this would call the API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPhases(
        phases.map((p) =>
          p.id === phase.id ? { ...phase, isEditing: false, isNew: false } : p,
        ),
      );

      setSuccess("Phase saved successfully");
      setError(null);
    } catch (error) {
      console.error("Error saving phase:", error);
      setError("Failed to save phase");
    } finally {
      setSaving(false);
    }
  };

  const saveTask = async (phaseId: string, task: ProjectTask) => {
    try {
      setSaving(true);

      if (!task.name.trim()) {
        setError("Task name is required");
        return;
      }

      // Mock save - in production, this would call the API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPhases(
        phases.map((phase) =>
          phase.id === phaseId
            ? {
                ...phase,
                tasks: phase.tasks.map((t) =>
                  t.id === task.id
                    ? { ...task, isEditing: false, isNew: false }
                    : t,
                ),
              }
            : phase,
        ),
      );

      setSuccess("Task saved successfully");
      setError(null);
    } catch (error) {
      console.error("Error saving task:", error);
      setError("Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  const deletePhase = async (phaseId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this phase? All associated tasks will also be deleted.",
      )
    ) {
      return;
    }

    try {
      const phase = phases.find((p) => p.id === phaseId);

      if (phase?.isNew) {
        setPhases(phases.filter((p) => p.id !== phaseId));
        return;
      }

      // Mock delete - in production, this would call the API
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPhases(phases.filter((p) => p.id !== phaseId));
      setSuccess("Phase deleted successfully");
    } catch (error) {
      console.error("Error deleting phase:", error);
      setError("Failed to delete phase");
    }
  };

  const deleteTask = async (phaseId: string, taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setPhases(
        phases.map((phase) =>
          phase.id === phaseId
            ? { ...phase, tasks: phase.tasks.filter((t) => t.id !== taskId) }
            : phase,
        ),
      );

      setSuccess("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task");
    }
  };

  const updatePhase = (
    phaseId: string,
    field: keyof ProjectPhase,
    value: any,
  ) => {
    setPhases(
      phases.map((phase) =>
        phase.id === phaseId ? { ...phase, [field]: value } : phase,
      ),
    );
  };

  const updateTask = (
    phaseId: string,
    taskId: string,
    field: keyof ProjectTask,
    value: any,
  ) => {
    setPhases(
      phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              tasks: phase.tasks.map((task) =>
                task.id === taskId ? { ...task, [field]: value } : task,
              ),
            }
          : phase,
      ),
    );
  };

  const togglePhaseExpansion = (phaseId: string) => {
    setPhases(
      phases.map((phase) =>
        phase.id === phaseId
          ? { ...phase, isExpanded: !phase.isExpanded }
          : phase,
      ),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "OVERDUE":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PG", {
      style: "currency",
      currency: "PGK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculatePhaseProgress = (phase: ProjectPhase) => {
    if (phase.tasks.length === 0) return phase.progress;
    const avgTaskProgress =
      phase.tasks.reduce((sum, task) => sum + task.progress, 0) /
      phase.tasks.length;
    return avgTaskProgress;
  };

  const calculateTotalProgress = () => {
    if (phases.length === 0) return 0;
    const totalProgress = phases.reduce(
      (sum, phase) => sum + calculatePhaseProgress(phase),
      0,
    );
    return totalProgress / phases.length;
  };

  const calculateTotalBudget = () => {
    return phases.reduce((sum, phase) => sum + phase.budget, 0);
  };

  const calculateTotalSpent = () => {
    return phases.reduce((sum, phase) => sum + phase.spent, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project phases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Project Phases & Tasks
          </h2>
          <p className="text-gray-600 mt-1">
            Manage construction phases and track task progress
          </p>
        </div>
        <Button onClick={addNewPhase}>
          <Plus className="h-4 w-4 mr-2" />
          Add Phase
        </Button>
      </div>

      {/* Project Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Overall Progress
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {calculateTotalProgress().toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={calculateTotalProgress()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Budget
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculateTotalBudget())}
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
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(calculateTotalSpent())}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Phases
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {phases.filter((p) => p.status === "IN_PROGRESS").length}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-red-800">{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-800">{success}</span>
            <Button variant="ghost" size="sm" onClick={() => setSuccess(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Phases List */}
      <div className="space-y-4">
        {phases.map((phase) => (
          <Card
            key={phase.id}
            className={phase.isNew ? "border-blue-300 bg-blue-50" : ""}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePhaseExpansion(phase.id)}
                    className="p-1"
                  >
                    {phase.isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">
                      Phase {phase.order}
                    </span>
                    {getStatusIcon(phase.status)}
                  </div>

                  <div>
                    {phase.isEditing ? (
                      <Input
                        value={phase.name}
                        onChange={(e) =>
                          updatePhase(phase.id, "name", e.target.value)
                        }
                        placeholder="Phase name"
                        className="font-medium"
                      />
                    ) : (
                      <CardTitle className="text-lg">{phase.name}</CardTitle>
                    )}

                    {!phase.isEditing && phase.description && (
                      <CardDescription className="mt-1">
                        {phase.description}
                      </CardDescription>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(phase.status)}>
                    {phase.status.replace("_", " ")}
                  </Badge>

                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {calculatePhaseProgress(phase).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(phase.spent)} /{" "}
                      {formatCurrency(phase.budget)}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {phase.isEditing ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => savePhase(phase)}
                          disabled={saving}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            updatePhase(phase.id, "isEditing", false)
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            updatePhase(phase.id, "isEditing", true)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deletePhase(phase.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Progress
                value={calculatePhaseProgress(phase)}
                className="mt-3"
              />
            </CardHeader>

            {phase.isExpanded && (
              <CardContent className="pt-0">
                {phase.isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Description
                      </label>
                      <Textarea
                        value={phase.description || ""}
                        onChange={(e) =>
                          updatePhase(phase.id, "description", e.target.value)
                        }
                        placeholder="Phase description"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={phase.startDate || ""}
                          onChange={(e) =>
                            updatePhase(phase.id, "startDate", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          End Date
                        </label>
                        <Input
                          type="date"
                          value={phase.endDate || ""}
                          onChange={(e) =>
                            updatePhase(phase.id, "endDate", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Budget (PGK)
                        </label>
                        <Input
                          type="number"
                          value={phase.budget}
                          onChange={(e) =>
                            updatePhase(
                              phase.id,
                              "budget",
                              Number.parseFloat(e.target.value) || 0,
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Status
                        </label>
                        <Select
                          value={phase.status}
                          onValueChange={(value) =>
                            updatePhase(phase.id, "status", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NOT_STARTED">
                              Not Started
                            </SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              In Progress
                            </SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="ON_HOLD">On Hold</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tasks */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      Tasks ({phase.tasks.length})
                    </h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addNewTask(phase.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>

                  {phase.tasks.length > 0 ? (
                    <div className="space-y-2">
                      {phase.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-3 border rounded-lg ${task.isNew ? "border-blue-300 bg-blue-50" : "border-gray-200"}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              {getStatusIcon(task.status)}

                              <div className="flex-1">
                                {task.isEditing ? (
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <Input
                                      value={task.name}
                                      onChange={(e) =>
                                        updateTask(
                                          phase.id,
                                          task.id,
                                          "name",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Task name"
                                    />
                                    <Input
                                      type="number"
                                      value={task.budget}
                                      onChange={(e) =>
                                        updateTask(
                                          phase.id,
                                          task.id,
                                          "budget",
                                          Number.parseFloat(e.target.value) ||
                                            0,
                                        )
                                      }
                                      placeholder="Budget (PGK)"
                                    />
                                    <Select
                                      value={task.status}
                                      onValueChange={(value) =>
                                        updateTask(
                                          phase.id,
                                          task.id,
                                          "status",
                                          value,
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="NOT_STARTED">
                                          Not Started
                                        </SelectItem>
                                        <SelectItem value="IN_PROGRESS">
                                          In Progress
                                        </SelectItem>
                                        <SelectItem value="COMPLETED">
                                          Completed
                                        </SelectItem>
                                        <SelectItem value="OVERDUE">
                                          Overdue
                                        </SelectItem>
                                        <SelectItem value="ON_HOLD">
                                          On Hold
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="font-medium">
                                      {task.name}
                                    </div>
                                    <div className="text-sm text-gray-600 flex items-center gap-4">
                                      <span>
                                        Budget: {formatCurrency(task.budget)}
                                      </span>
                                      <span>
                                        Progress: {task.progress.toFixed(1)}%
                                      </span>
                                      {task.assigneeName && (
                                        <span>
                                          Assigned: {task.assigneeName}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(task.status)}>
                                {task.status.replace("_", " ")}
                              </Badge>

                              <div className="flex gap-1">
                                {task.isEditing ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => saveTask(phase.id, task)}
                                      disabled={saving}
                                    >
                                      <Save className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        updateTask(
                                          phase.id,
                                          task.id,
                                          "isEditing",
                                          false,
                                        )
                                      }
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        updateTask(
                                          phase.id,
                                          task.id,
                                          "isEditing",
                                          true,
                                        )
                                      }
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        deleteTask(phase.id, task.id)
                                      }
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {!task.isEditing && (
                            <div className="mt-2">
                              <Progress value={task.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No tasks added yet</p>
                      <p className="text-sm">
                        Click "Add Task" to create tasks for this phase
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {phases.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Phases Found
            </h3>
            <p className="text-gray-600 mb-4">
              Start by adding construction phases for this project.
            </p>
            <Button onClick={addNewPhase}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Phase
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
