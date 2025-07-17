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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Activity,
  Calendar,
  Edit3,
  Map as MapIcon,
  MapPin,
  Navigation,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SurveyPeg {
  id: string;
  pegId: string;
  latitude: number;
  longitude: number;
  description: string;
  projectId: string;
  projectName: string;
  phase: string;
  dateEntered: string;
  enteredBy: string;
  status: "planned" | "completed" | "verified";
}

interface Project {
  id: string;
  name: string;
  phases: string[];
}

export default function ProjectProgressMonitoring() {
  const [surveyPegs, setSurveyPegs] = useState<SurveyPeg[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPeg, setEditingPeg] = useState<SurveyPeg | null>(null);
  const [newPeg, setNewPeg] = useState({
    pegId: "",
    latitude: "",
    longitude: "",
    description: "",
    phase: "",
  });

  useEffect(() => {
    loadProjects();
    loadSurveyPegs();
  }, []);

  const loadProjects = () => {
    // Mock data - replace with API call
    const mockProjects: Project[] = [
      {
        id: "PNG001",
        name: "Mt. Hagen-Kagamuga Road Upgrade",
        phases: [
          "Survey",
          "Clearing",
          "Earthworks",
          "Base Course",
          "Surfacing",
        ],
      },
      {
        id: "PNG002",
        name: "Port Moresby Ring Road",
        phases: [
          "Survey",
          "Bridge Construction",
          "Road Construction",
          "Drainage",
          "Finishing",
        ],
      },
      {
        id: "PNG003",
        name: "Lae-Nadzab Highway Extension",
        phases: [
          "Environmental Study",
          "Land Acquisition",
          "Construction",
          "Testing",
        ],
      },
    ];
    setProjects(mockProjects);
  };

  const loadSurveyPegs = () => {
    // Mock data - replace with API call
    const mockPegs: SurveyPeg[] = [
      {
        id: "1",
        pegId: "PEG-001",
        latitude: -5.2083,
        longitude: 145.7781,
        description: "Start point - Highway intersection",
        projectId: "PNG001",
        projectName: "Mt. Hagen-Kagamuga Road Upgrade",
        phase: "Survey",
        dateEntered: "2025-01-05",
        enteredBy: "John Kila",
        status: "completed",
      },
      {
        id: "2",
        pegId: "PEG-002",
        latitude: -5.2089,
        longitude: 145.7785,
        description: "Bridge foundation point",
        projectId: "PNG001",
        projectName: "Mt. Hagen-Kagamuga Road Upgrade",
        phase: "Survey",
        dateEntered: "2025-01-05",
        enteredBy: "John Kila",
        status: "completed",
      },
      {
        id: "3",
        pegId: "PEG-003",
        latitude: -5.2095,
        longitude: 145.779,
        description: "Culvert installation point",
        projectId: "PNG001",
        projectName: "Mt. Hagen-Kagamuga Road Upgrade",
        phase: "Earthworks",
        dateEntered: "2025-01-05",
        enteredBy: "Maria Temu",
        status: "planned",
      },
    ];
    setSurveyPegs(mockPegs);
  };

  const handleAddPeg = () => {
    if (
      !newPeg.pegId ||
      !newPeg.latitude ||
      !newPeg.longitude ||
      !selectedProject ||
      !newPeg.phase
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const project = projects.find((p) => p.id === selectedProject);
    if (!project) return;

    const peg: SurveyPeg = {
      id: Date.now().toString(),
      pegId: newPeg.pegId,
      latitude: Number.parseFloat(newPeg.latitude),
      longitude: Number.parseFloat(newPeg.longitude),
      description: newPeg.description,
      projectId: selectedProject,
      projectName: project.name,
      phase: newPeg.phase,
      dateEntered: new Date().toISOString().split("T")[0],
      enteredBy: "Current User", // Replace with actual user
      status: "planned",
    };

    setSurveyPegs([...surveyPegs, peg]);
    setNewPeg({
      pegId: "",
      latitude: "",
      longitude: "",
      description: "",
      phase: "",
    });
    setShowAddDialog(false);
  };

  const handleDeletePeg = (id: string) => {
    if (confirm("Are you sure you want to delete this survey peg?")) {
      setSurveyPegs(surveyPegs.filter((peg) => peg.id !== id));
    }
  };

  const getStatusColor = (status: SurveyPeg["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "planned":
        return "bg-yellow-100 text-yellow-800";
      case "verified":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPegs = surveyPegs.filter((peg) => {
    if (selectedProject && peg.projectId !== selectedProject) return false;
    if (selectedPhase && peg.phase !== selectedPhase) return false;
    return true;
  });

  const selectedProjectData = projects.find((p) => p.id === selectedProject);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Project Progress Monitoring
          </h2>
          <p className="text-gray-600">
            Track project progress using survey peg coordinates
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Survey Peg
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Survey Peg</DialogTitle>
              <DialogDescription>
                Enter the GPS coordinates of a new survey peg
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project">Project</Label>
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phase">Project Phase</Label>
                <Select
                  value={newPeg.phase}
                  onValueChange={(value) =>
                    setNewPeg({ ...newPeg, phase: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProjectData?.phases.map((phase) => (
                      <SelectItem key={phase} value={phase}>
                        {phase}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pegId">Peg ID</Label>
                <Input
                  id="pegId"
                  value={newPeg.pegId}
                  onChange={(e) =>
                    setNewPeg({ ...newPeg, pegId: e.target.value })
                  }
                  placeholder="e.g., PEG-001"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={newPeg.latitude}
                    onChange={(e) =>
                      setNewPeg({ ...newPeg, latitude: e.target.value })
                    }
                    placeholder="e.g., -5.2083"
                    type="number"
                    step="any"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={newPeg.longitude}
                    onChange={(e) =>
                      setNewPeg({ ...newPeg, longitude: e.target.value })
                    }
                    placeholder="e.g., 145.7781"
                    type="number"
                    step="any"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newPeg.description}
                  onChange={(e) =>
                    setNewPeg({ ...newPeg, description: e.target.value })
                  }
                  placeholder="Brief description of the peg location"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddPeg} className="flex-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  Add Peg
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Project</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Phase</Label>
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger>
                  <SelectValue placeholder="All phases" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All phases</SelectItem>
                  {selectedProjectData?.phases.map((phase) => (
                    <SelectItem key={phase} value={phase}>
                      {phase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {filteredPegs.length}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Target className="h-4 w-4" />
              Total Pegs
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {filteredPegs.filter((p) => p.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Activity className="h-4 w-4" />
              Completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {filteredPegs.filter((p) => p.status === "planned").length}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Calendar className="h-4 w-4" />
              Planned
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {selectedProject
                ? selectedProjectData?.phases.length || 0
                : projects.length}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <MapIcon className="h-4 w-4" />
              {selectedProject ? "Phases" : "Projects"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Survey Pegs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Pegs</CardTitle>
          <CardDescription>
            GPS coordinates of survey pegs for project progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Peg ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Coordinates</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPegs.map((peg) => (
                  <TableRow key={peg.id}>
                    <TableCell className="font-medium">{peg.pegId}</TableCell>
                    <TableCell>{peg.projectName}</TableCell>
                    <TableCell>{peg.phase}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {peg.latitude.toFixed(6)}, {peg.longitude.toFixed(6)}
                    </TableCell>
                    <TableCell>{peg.description}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(peg.status)}>
                        {peg.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{peg.dateEntered}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPeg(peg)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePeg(peg.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPegs.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      No survey pegs found. Add your first peg to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
