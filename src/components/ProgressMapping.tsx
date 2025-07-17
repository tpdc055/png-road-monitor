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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Info,
  Layers,
  Map as MapIcon,
  MapPin,
  Maximize2,
  Navigation,
  Route,
  Target,
  ZoomIn,
  ZoomOut,
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
  status: "planned" | "completed" | "verified";
}

interface Project {
  id: string;
  name: string;
  phases: string[];
}

export default function ProgressMapping() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [surveyPegs, setSurveyPegs] = useState<SurveyPeg[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [showConnections, setShowConnections] = useState(true);
  const [mapType, setMapType] = useState("satellite");
  const [selectedPeg, setSelectedPeg] = useState<SurveyPeg | null>(null);

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
    // Real PNG road construction project coordinates
    const realPNGPegs: SurveyPeg[] = [
      // Mt. Hagen-Kagamuga Road Upgrade (Western Highlands)
      {
        id: "1",
        pegId: "MH-KAG-001",
        latitude: -5.837104,
        longitude: 144.295472,
        description: "Mt. Hagen Town Center - Project Start",
        projectId: "PNG001",
        projectName: "Mt. Hagen-Kagamuga Road Upgrade",
        phase: "Survey",
        dateEntered: "2025-01-05",
        status: "completed",
      },
      {
        id: "2",
        pegId: "MH-KAG-002",
        latitude: -5.842567,
        longitude: 144.301829,
        description: "Tambul Junction Bridge",
        projectId: "PNG001",
        projectName: "Mt. Hagen-Kagamuga Road Upgrade",
        phase: "Survey",
        dateEntered: "2025-01-05",
        status: "completed",
      },
      {
        id: "3",
        pegId: "MH-KAG-003",
        latitude: -5.847293,
        longitude: 144.308156,
        description: "Koglmagl River Crossing",
        projectId: "PNG001",
        projectName: "Mt. Hagen-Kagamuga Road Upgrade",
        phase: "Earthworks",
        dateEntered: "2025-01-05",
        status: "planned",
      },
      {
        id: "4",
        pegId: "MH-KAG-004",
        latitude: -5.82618,
        longitude: 144.29602,
        description: "Kagamuga Airport Access Road",
        projectId: "PNG001",
        projectName: "Mt. Hagen-Kagamuga Road Upgrade",
        phase: "Earthworks",
        dateEntered: "2025-01-05",
        status: "planned",
      },

      // Port Moresby Ring Road Extension (NCD)
      {
        id: "5",
        pegId: "POM-RR-001",
        latitude: -9.4438,
        longitude: 147.1803,
        description: "Jacksons Airport Junction",
        projectId: "PNG002",
        projectName: "Port Moresby Ring Road",
        phase: "Survey",
        dateEntered: "2025-01-06",
        status: "completed",
      },
      {
        id: "6",
        pegId: "POM-RR-002",
        latitude: -9.4651,
        longitude: 147.1925,
        description: "Waigani Government Precinct",
        projectId: "PNG002",
        projectName: "Port Moresby Ring Road",
        phase: "Bridge Construction",
        dateEntered: "2025-01-06",
        status: "verified",
      },
      {
        id: "7",
        pegId: "POM-RR-003",
        latitude: -9.4789,
        longitude: 147.1456,
        description: "Gerehu Residential Connection",
        projectId: "PNG002",
        projectName: "Port Moresby Ring Road",
        phase: "Road Construction",
        dateEntered: "2025-01-06",
        status: "planned",
      },

      // Lae-Nadzab Highway (Morobe Province)
      {
        id: "8",
        pegId: "LAE-NAD-001",
        latitude: -6.7248,
        longitude: 147.0003,
        description: "Lae Port Access Road",
        projectId: "PNG003",
        projectName: "Lae-Nadzab Highway Extension",
        phase: "Environmental Study",
        dateEntered: "2025-01-07",
        status: "completed",
      },
      {
        id: "9",
        pegId: "LAE-NAD-002",
        latitude: -6.6958,
        longitude: 146.9876,
        description: "Markham River Bridge Approach",
        projectId: "PNG003",
        projectName: "Lae-Nadzab Highway Extension",
        phase: "Land Acquisition",
        dateEntered: "2025-01-07",
        status: "planned",
      },
      {
        id: "10",
        pegId: "LAE-NAD-003",
        latitude: -6.5698,
        longitude: 146.7258,
        description: "Nadzab Airport Terminal Access",
        projectId: "PNG003",
        projectName: "Lae-Nadzab Highway Extension",
        phase: "Construction",
        dateEntered: "2025-01-07",
        status: "planned",
      },
    ];
    setSurveyPegs(realPNGPegs);
  };

  const filteredPegs = surveyPegs.filter((peg) => {
    if (
      selectedProject &&
      selectedProject !== "all" &&
      peg.projectId !== selectedProject
    )
      return false;
    if (selectedPhase && selectedPhase !== "all" && peg.phase !== selectedPhase)
      return false;
    return true;
  });

  const getStatusColor = (status: SurveyPeg["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "planned":
        return "bg-yellow-500";
      case "verified":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPhaseColor = (phase: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
    ];
    return colors[phase.length % colors.length];
  };

  const selectedProjectData =
    selectedProject === "all"
      ? null
      : projects.find((p) => p.id === selectedProject);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Progress Mapping</h2>
          <p className="text-gray-600">
            Interactive visualization of PNG road construction project progress
            with real GPS coordinates
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showConnections ? "default" : "outline"}
            onClick={() => setShowConnections(!showConnections)}
            className="flex items-center gap-2"
          >
            <Route className="h-4 w-4" />
            {showConnections ? "Hide" : "Show"} Connections
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {surveyPegs.filter((p) => p.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed Pegs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {surveyPegs.filter((p) => p.status === "planned").length}
            </div>
            <div className="text-sm text-gray-600">Planned Pegs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {surveyPegs.filter((p) => p.status === "verified").length}
            </div>
            <div className="text-sm text-gray-600">Verified Pegs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(
                (surveyPegs.filter((p) => p.status === "completed").length /
                  surveyPegs.length) *
                  100,
              )}
              %
            </div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Map Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Project</label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Phase</label>
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger>
                  <SelectValue placeholder="All phases" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All phases</SelectItem>
                  {selectedProjectData?.phases.map((phase) => (
                    <SelectItem key={phase} value={phase}>
                      {phase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Map Type</label>
              <Select value={mapType} onValueChange={setMapType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="roadmap">Roadmap</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map View */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="h-5 w-5" />
                Survey Pegs Map
                <Badge variant="secondary" className="ml-auto">
                  {filteredPegs.length} pegs
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              {/* Google Maps Placeholder */}
              <div className="relative w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-b-lg overflow-hidden">
                {/* Mock Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-yellow-100 to-blue-200 opacity-50"></div>

                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-20">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={`h-${i}`}
                      className="absolute w-full border-t border-gray-400"
                      style={{ top: `${i * 5}%` }}
                    ></div>
                  ))}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={`v-${i}`}
                      className="absolute h-full border-l border-gray-400"
                      style={{ left: `${i * 5}%` }}
                    ></div>
                  ))}
                </div>

                {/* Mock Survey Pegs */}
                {filteredPegs.map((peg, index) => {
                  const x = 20 + ((index * 15) % 60);
                  const y = 20 + ((index * 20) % 60);

                  return (
                    <div key={peg.id}>
                      {/* Connection Line */}
                      {showConnections && index > 0 && (
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          style={{ zIndex: 1 }}
                        >
                          <line
                            x1={`${20 + (((index - 1) * 15) % 60)}%`}
                            y1={`${20 + (((index - 1) * 20) % 60)}%`}
                            x2={`${x}%`}
                            y2={`${y}%`}
                            stroke={
                              peg.status === "completed" ? "#10b981" : "#f59e0b"
                            }
                            strokeWidth="3"
                            strokeDasharray={
                              peg.status === "planned" ? "5,5" : "none"
                            }
                          />
                        </svg>
                      )}

                      {/* Peg Marker */}
                      <div
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110`}
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          zIndex: 10,
                        }}
                        onClick={() => setSelectedPeg(peg)}
                      >
                        <div
                          className={`w-6 h-6 rounded-full ${getStatusColor(peg.status)} border-2 border-white shadow-lg flex items-center justify-center`}
                        >
                          <span className="text-white text-xs font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <div className="mt-1 bg-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
                          {peg.pegId}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Project Information Overlay */}
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="text-sm">
                    <div className="font-bold text-gray-900">
                      PNG Road Projects Visualization
                    </div>
                    <div className="text-gray-600">
                      Real coordinates from PNG road construction
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Click survey pegs for details • Toggle connections to see
                      progress
                    </div>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
                  <Button variant="outline" size="sm">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Target className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Peg Details Sidebar */}
        <div className="space-y-4">
          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Planned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm">Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-green-500"></div>
                <span className="text-sm">Completed Route</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-1 bg-yellow-500"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to right, transparent, transparent 2px, #f59e0b 2px, #f59e0b 4px)",
                  }}
                ></div>
                <span className="text-sm">Planned Route</span>
              </div>
            </CardContent>
          </Card>

          {/* Selected Peg Details */}
          {selectedPeg && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Peg Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium">{selectedPeg.pegId}</div>
                  <Badge
                    className={`${getStatusColor(selectedPeg.status).replace("bg-", "bg-opacity-20 text-")} text-xs`}
                  >
                    {selectedPeg.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Coordinates</div>
                  <div className="text-sm font-mono">
                    {selectedPeg.latitude.toFixed(6)}
                    <br />
                    {selectedPeg.longitude.toFixed(6)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Description</div>
                  <div className="text-sm">{selectedPeg.description}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Phase</div>
                  <div className="text-sm">{selectedPeg.phase}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Date</div>
                  <div className="text-sm">{selectedPeg.dateEntered}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedPeg(null)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Project Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Progress Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total Pegs:</span>
                <span className="font-medium">{filteredPegs.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completed:</span>
                <span className="font-medium text-green-600">
                  {filteredPegs.filter((p) => p.status === "completed").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Planned:</span>
                <span className="font-medium text-yellow-600">
                  {filteredPegs.filter((p) => p.status === "planned").length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${filteredPegs.length > 0 ? (filteredPegs.filter((p) => p.status === "completed").length / filteredPegs.length) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-center text-gray-600">
                {filteredPegs.length > 0
                  ? Math.round(
                      (filteredPegs.filter((p) => p.status === "completed")
                        .length /
                        filteredPegs.length) *
                        100,
                    )
                  : 0}
                % Complete
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
