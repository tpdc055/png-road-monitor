"use client";

import RoadProgressMapper from "@/components/RoadProgressMapper";
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
import { useAuth } from "@/contexts/AuthContext";
import { MockAPIService } from "@/lib/mockApiService";
import {
  Building2,
  Check,
  Clock,
  Edit,
  Info,
  Loader2,
  MapPin,
  Navigation,
  Plus,
  Route,
  Save,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface GPSCoordinate {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  timestamp: string;
  isEditing?: boolean;
}

interface GPSTask {
  id: string;
  taskName: string;
  workType: string;
  roadSide: string;
  startChainage: string;
  endChainage: string;
  description: string;
  coordinates: GPSCoordinate[];
  createdAt: string;
  status: "draft" | "saved";
}

interface Project {
  id: string;
  name: string;
  location: string;
  province: {
    name: string;
  };
}

interface WorkType {
  id: string;
  name: string;
  category: string | null;
}

// PNG road work types
const roadSides = ["Left Side", "Right Side", "Both Sides", "Center"];

export default function GPSTaskEntry() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [currentTask, setCurrentTask] = useState<{
    taskName: string;
    workType: string;
    roadSide: string;
    startChainage: string;
    endChainage: string;
    description: string;
    coordinates: GPSCoordinate[];
  }>({
    taskName: "",
    workType: "",
    roadSide: "Both Sides",
    startChainage: "",
    endChainage: "",
    description: "",
    coordinates: [],
  });

  const [savedTasks, setSavedTasks] = useState<GPSTask[]>([]);
  const [newCoordinate, setNewCoordinate] = useState({
    latitude: "",
    longitude: "",
    description: "",
  });

  const [editingCoordinate, setEditingCoordinate] = useState<string | null>(
    null,
  );
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Use MockAPIService for immediate functionality
      const [projectsData, workTypesData] = await Promise.all([
        MockAPIService.getProjects(),
        MockAPIService.getWorkTypes(),
      ]);

      if (projectsData.success) {
        setProjects(projectsData.data);
      }

      if (workTypesData.success) {
        setWorkTypes(workTypesData.data);
        // Set default work type if available
        if (workTypesData.data.length > 0) {
          setCurrentTask((prev) => ({
            ...prev,
            workType: workTypesData.data[0].name,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addGPSPoint = () => {
    // Validate inputs - allow negative numbers for latitude (PNG is in Southern Hemisphere)
    const lat = Number.parseFloat(newCoordinate.latitude);
    const lng = Number.parseFloat(newCoordinate.longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      alert("Please enter valid latitude and longitude coordinates");
      return;
    }

    // Validate PNG coordinate ranges
    if (lat > 0 || lat < -12) {
      alert(
        "Latitude should be negative for PNG (typically -2 to -12 degrees)",
      );
      return;
    }

    if (lng < 140 || lng > 160) {
      alert("Longitude should be between 140 and 160 degrees for PNG");
      return;
    }

    const coordinate: GPSCoordinate = {
      id: `gps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      latitude: lat,
      longitude: lng,
      description:
        newCoordinate.description ||
        `Point ${(currentTask.coordinates?.length || 0) + 1}`,
      timestamp: new Date().toLocaleTimeString(),
    };

    setCurrentTask((prev) => ({
      ...prev,
      coordinates: [...(prev.coordinates || []), coordinate],
    }));

    // Clear the input form
    setNewCoordinate({
      latitude: "",
      longitude: "",
      description: "",
    });
  };

  const deleteCoordinate = (id: string) => {
    setCurrentTask((prev) => ({
      ...prev,
      coordinates: prev.coordinates?.filter((coord) => coord.id !== id) || [],
    }));
  };

  const startEditing = (coordinate: GPSCoordinate) => {
    setEditingCoordinate(coordinate.id);
    setEditValues({
      latitude: coordinate.latitude.toString(),
      longitude: coordinate.longitude.toString(),
      description: coordinate.description,
    });
  };

  const saveEdit = (id: string) => {
    const lat = Number.parseFloat(editValues.latitude);
    const lng = Number.parseFloat(editValues.longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      alert("Please enter valid coordinates");
      return;
    }

    // Validate PNG coordinate ranges
    if (lat > 0 || lat < -12) {
      alert(
        "Latitude should be negative for PNG (typically -2 to -12 degrees)",
      );
      return;
    }

    if (lng < 140 || lng > 160) {
      alert("Longitude should be between 140 and 160 degrees for PNG");
      return;
    }

    setCurrentTask((prev) => ({
      ...prev,
      coordinates:
        prev.coordinates?.map((coord) =>
          coord.id === id
            ? {
                ...coord,
                latitude: lat,
                longitude: lng,
                description: editValues.description,
              }
            : coord,
        ) || [],
    }));

    setEditingCoordinate(null);
    setEditValues({});
  };

  const cancelEdit = () => {
    setEditingCoordinate(null);
    setEditValues({});
  };

  const saveTask = async () => {
    if (
      !currentTask.taskName ||
      !currentTask.workType ||
      !currentTask.coordinates?.length
    ) {
      alert("Please fill in task details and add at least one GPS coordinate");
      return;
    }

    if (!selectedProjectId) {
      alert("Please select a project");
      return;
    }

    if (!user) {
      alert("User not authenticated");
      return;
    }

    try {
      setIsSaving(true);

      // Use MockAPIService for immediate functionality
      const savePromises = currentTask.coordinates.map((coord) =>
        MockAPIService.createGPSEntry({
          latitude: coord.latitude,
          longitude: coord.longitude,
          description: coord.description,
          projectId: selectedProjectId,
          userId: user.id,
          taskName: currentTask.taskName,
          workType: currentTask.workType,
          roadSide: currentTask.roadSide,
          startChainage: currentTask.startChainage,
          endChainage: currentTask.endChainage,
          taskDescription: currentTask.description,
        }),
      );

      const results = await Promise.all(savePromises);

      const failedSaves = results.filter((r) => !r.success);
      if (failedSaves.length > 0) {
        alert(
          `Failed to save ${failedSaves.length} GPS coordinates. Please try again.`,
        );
        return;
      }

      // Create a saved task record for display
      const task: GPSTask = {
        id: `task_${Date.now()}`,
        taskName: currentTask.taskName,
        workType: currentTask.workType,
        roadSide: currentTask.roadSide,
        startChainage: currentTask.startChainage,
        endChainage: currentTask.endChainage,
        description: currentTask.description,
        coordinates: currentTask.coordinates,
        createdAt: new Date().toLocaleString(),
        status: "saved",
      };

      setSavedTasks((prev) => [task, ...prev]);

      // Reset current task
      setCurrentTask({
        taskName: "",
        workType: workTypes.length > 0 ? workTypes[0].name : "",
        roadSide: "Both Sides",
        startChainage: "",
        endChainage: "",
        description: "",
        coordinates: [],
      });

      alert("GPS task saved successfully to the database!");
    } catch (error) {
      console.error("Error saving GPS task:", error);
      alert("Failed to save GPS task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addGPSPoint();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading GPS entry form...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          GPS Data Entry
        </h2>
        <p className="text-gray-600">
          Enter GPS coordinates for PNG road construction work tasks
        </p>
      </div>

      {/* Project Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Select Project
          </CardTitle>
          <CardDescription>
            Choose the project for this GPS data entry session
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

      {/* Task Details Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Task Details
          </CardTitle>
          <CardDescription>
            Enter work task information once, then add multiple GPS coordinates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-name">Task Name *</Label>
              <Input
                id="task-name"
                placeholder="e.g., Highlands Highway Pothole Repair"
                value={currentTask.taskName}
                onChange={(e) =>
                  setCurrentTask((prev) => ({
                    ...prev,
                    taskName: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="work-type">Work Type *</Label>
              <Select
                value={currentTask.workType}
                onValueChange={(value) =>
                  setCurrentTask((prev) => ({ ...prev, workType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  {workTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name} {type.category && `(${type.category})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="road-side">Road Side</Label>
              <Select
                value={currentTask.roadSide}
                onValueChange={(value) =>
                  setCurrentTask((prev) => ({ ...prev, roadSide: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select road side" />
                </SelectTrigger>
                <SelectContent>
                  {roadSides.map((side) => (
                    <SelectItem key={side} value={side}>
                      {side}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="start-chainage">Start Chainage</Label>
              <Input
                id="start-chainage"
                placeholder="e.g., 12+500"
                value={currentTask.startChainage}
                onChange={(e) =>
                  setCurrentTask((prev) => ({
                    ...prev,
                    startChainage: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="end-chainage">End Chainage</Label>
              <Input
                id="end-chainage"
                placeholder="e.g., 12+600"
                value={currentTask.endChainage}
                onChange={(e) =>
                  setCurrentTask((prev) => ({
                    ...prev,
                    endChainage: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="task-description">Task Description</Label>
            <Textarea
              id="task-description"
              placeholder="Additional details about the work being performed..."
              value={currentTask.description}
              onChange={(e) =>
                setCurrentTask((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* GPS Coordinate Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            GPS Coordinates (Add Multiple Points)
          </CardTitle>
          <CardDescription>
            Add GPS coordinates as you progress through the work
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="-6.314993"
                value={newCoordinate.latitude}
                onChange={(e) =>
                  setNewCoordinate((prev) => ({
                    ...prev,
                    latitude: e.target.value,
                  }))
                }
                onKeyPress={handleKeyPress}
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="143.95555"
                value={newCoordinate.longitude}
                onChange={(e) =>
                  setNewCoordinate((prev) => ({
                    ...prev,
                    longitude: e.target.value,
                  }))
                }
                onKeyPress={handleKeyPress}
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Point description"
                value={newCoordinate.description}
                onChange={(e) =>
                  setNewCoordinate((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                onKeyPress={handleKeyPress}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={addGPSPoint}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!selectedProjectId}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add GPS Point
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p>
                  <strong>Tip:</strong> Press Enter in any field to quickly add
                  the GPS point
                </p>
                <p>
                  <strong>PNG Coordinates:</strong> Latitude should be negative
                  (e.g., -6.314993), Longitude positive (e.g., 143.95555)
                </p>
                {!selectedProjectId && (
                  <p>
                    <strong>Note:</strong> Please select a project before adding
                    GPS points
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GPS Coordinates Table */}
      {currentTask.coordinates && currentTask.coordinates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              GPS Coordinates for This Task ({currentTask.coordinates.length}{" "}
              points)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTask.coordinates.map((coord, index) => (
                  <TableRow key={coord.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {editingCoordinate === coord.id ? (
                        <Input
                          type="number"
                          step="any"
                          value={editValues.latitude}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              latitude: e.target.value,
                            }))
                          }
                          className="w-24"
                        />
                      ) : (
                        coord.latitude.toFixed(6)
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCoordinate === coord.id ? (
                        <Input
                          type="number"
                          step="any"
                          value={editValues.longitude}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              longitude: e.target.value,
                            }))
                          }
                          className="w-24"
                        />
                      ) : (
                        coord.longitude.toFixed(6)
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCoordinate === coord.id ? (
                        <Input
                          value={editValues.description}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="w-32"
                        />
                      ) : (
                        coord.description
                      )}
                    </TableCell>
                    <TableCell>{coord.timestamp}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {editingCoordinate === coord.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => saveEdit(coord.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(coord)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteCoordinate(coord.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Road Progress Visualization */}
      {currentTask.coordinates?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Road Progress Visualization
            </CardTitle>
            <CardDescription>
              View your GPS points connected to show road construction progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoadProgressMapper />
          </CardContent>
        </Card>
      )}

      {/* Save/Cancel Buttons */}
      {(currentTask.taskName || currentTask.coordinates?.length) && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button
                onClick={saveTask}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSaving || !selectedProjectId}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving to Database...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Task to Database
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentTask({
                    taskName: "",
                    workType: workTypes.length > 0 ? workTypes[0].name : "",
                    roadSide: "Both Sides",
                    startChainage: "",
                    endChainage: "",
                    description: "",
                    coordinates: [],
                  })
                }
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Tasks */}
      {savedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Saved GPS Tasks ({savedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{task.taskName}</h4>
                    <Badge className="bg-green-100 text-green-800">
                      {task.coordinates.length} GPS points saved to database
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Work Type:</strong> {task.workType}
                    </p>
                    <p>
                      <strong>Road Side:</strong> {task.roadSide}
                    </p>
                    {task.startChainage && (
                      <p>
                        <strong>Chainage:</strong> {task.startChainage} -{" "}
                        {task.endChainage}
                      </p>
                    )}
                    <p>
                      <strong>Created:</strong> {task.createdAt}
                    </p>
                    {task.description && (
                      <p>
                        <strong>Description:</strong> {task.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
