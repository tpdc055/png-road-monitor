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
import {
  Calendar,
  Camera,
  CheckCircle,
  Circle,
  Clock,
  Download,
  Eye,
  FileText,
  Image,
  MapPin,
  Navigation,
  Plus,
  RotateCcw,
  Route,
  Ruler,
  Save,
  Target,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface GPSPoint {
  id: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  description: string;
  workType: string;
  status: "planned" | "in_progress" | "completed" | "quality_checked";
  timestamp: string;
  photos?: {
    id: string;
    filename: string;
    url: string;
    timestamp: string;
    description?: string;
  }[];
  sequence: number;
  chainage: number; // Distance from start in meters
}

interface RoadSegment {
  id: string;
  name: string;
  startPoint: GPSPoint;
  endPoint: GPSPoint;
  totalLength: number;
  completedLength: number;
  status: "planned" | "in_progress" | "completed";
  workType: string;
}

interface Project {
  id: string;
  name: string;
  location: string;
  totalLength: number;
  completedLength: number;
}

const WORK_TYPES = [
  { id: "clearing", name: "Land Clearing", color: "#8B4513" },
  { id: "earthworks", name: "Earthworks & Excavation", color: "#D2691E" },
  { id: "drainage", name: "Drainage Installation", color: "#4682B4" },
  { id: "base_course", name: "Base Course", color: "#696969" },
  { id: "surfacing", name: "Road Surfacing", color: "#2F4F4F" },
  { id: "line_marking", name: "Line Marking", color: "#FFFF00" },
  { id: "bridge", name: "Bridge Construction", color: "#8B0000" },
];

const STATUS_COLORS = {
  planned: "#9CA3AF",
  in_progress: "#F59E0B",
  completed: "#10B981",
  quality_checked: "#3B82F6",
};

export default function RoadProgressMapper() {
  const [project, setProject] = useState<Project>({
    id: "PNG001",
    name: "Mt. Hagen-Kagamuga Road Upgrade",
    location: "Western Highlands Province",
    totalLength: 25000, // 25km
    completedLength: 16250, // 16.25km (65% complete)
  });

  const [gpsPoints, setGpsPoints] = useState<GPSPoint[]>([]);
  const [selectedWorkType, setSelectedWorkType] =
    useState<string>("earthworks");
  const [newPoint, setNewPoint] = useState({
    latitude: "",
    longitude: "",
    description: "",
    elevation: "",
  });

  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedPointForPhotos, setSelectedPointForPhotos] = useState<
    string | null
  >(null);

  const [viewMode, setViewMode] = useState<"map" | "linear">("map");
  const [showCompleted, setShowCompleted] = useState(true);
  const [showPlanned, setShowPlanned] = useState(true);
  const [showInProgress, setShowInProgress] = useState(true);

  const mapCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initialize with sample GPS points for a curved road
    const samplePoints: GPSPoint[] = [
      {
        id: "1",
        latitude: -6.31499,
        longitude: 143.95555,
        description: "Start Point - Road Junction",
        workType: "completed",
        status: "completed",
        timestamp: "2024-01-15T08:00:00Z",
        sequence: 1,
        chainage: 0,
      },
      {
        id: "2",
        latitude: -6.3152,
        longitude: 143.9558,
        description: "Clearing Section 1",
        workType: "clearing",
        status: "completed",
        timestamp: "2024-01-16T09:00:00Z",
        sequence: 2,
        chainage: 250,
      },
      {
        id: "3",
        latitude: -6.31545,
        longitude: 143.9561,
        description: "Excavation Point A",
        workType: "earthworks",
        status: "completed",
        timestamp: "2024-01-18T10:00:00Z",
        sequence: 3,
        chainage: 500,
      },
      {
        id: "4",
        latitude: -6.31575,
        longitude: 143.9564,
        description: "Drainage Culvert 1",
        workType: "drainage",
        status: "completed",
        timestamp: "2024-01-20T11:00:00Z",
        sequence: 4,
        chainage: 750,
      },
      {
        id: "5",
        latitude: -6.3161,
        longitude: 143.95665,
        description: "Base Course Section 1",
        workType: "base_course",
        status: "completed",
        timestamp: "2024-01-22T08:30:00Z",
        sequence: 5,
        chainage: 1000,
      },
      {
        id: "6",
        latitude: -6.3165,
        longitude: 143.9568,
        description: "Curve Section Start",
        workType: "earthworks",
        status: "completed",
        timestamp: "2024-01-24T09:15:00Z",
        sequence: 6,
        chainage: 1250,
      },
      {
        id: "7",
        latitude: -6.3169,
        longitude: 143.95695,
        description: "Curve Midpoint",
        workType: "earthworks",
        status: "completed",
        timestamp: "2024-01-26T10:45:00Z",
        sequence: 7,
        chainage: 1500,
      },
      {
        id: "8",
        latitude: -6.31725,
        longitude: 143.9572,
        description: "Curve End",
        workType: "base_course",
        status: "completed",
        timestamp: "2024-01-28T14:20:00Z",
        sequence: 8,
        chainage: 1750,
      },
      {
        id: "9",
        latitude: -6.31755,
        longitude: 143.9575,
        description: "Straight Section",
        workType: "base_course",
        status: "completed",
        timestamp: "2024-01-30T08:00:00Z",
        sequence: 9,
        chainage: 2000,
      },
      {
        id: "10",
        latitude: -6.31785,
        longitude: 143.95785,
        description: "Bridge Approach",
        workType: "bridge",
        status: "in_progress",
        timestamp: "2024-02-01T09:30:00Z",
        sequence: 10,
        chainage: 2250,
      },
      {
        id: "11",
        latitude: -6.31815,
        longitude: 143.9582,
        description: "Bridge Structure",
        workType: "bridge",
        status: "in_progress",
        timestamp: "2024-02-03T11:00:00Z",
        sequence: 11,
        chainage: 2500,
      },
      {
        id: "12",
        latitude: -6.31845,
        longitude: 143.95855,
        description: "Bridge Exit",
        workType: "bridge",
        status: "planned",
        timestamp: "2024-02-05T12:00:00Z",
        sequence: 12,
        chainage: 2750,
      },
      {
        id: "13",
        latitude: -6.31875,
        longitude: 143.9589,
        description: "Next Section",
        workType: "earthworks",
        status: "planned",
        timestamp: "2024-02-07T10:00:00Z",
        sequence: 13,
        chainage: 3000,
      },
      {
        id: "14",
        latitude: -6.319,
        longitude: 143.95925,
        description: "Future Point 1",
        workType: "clearing",
        status: "planned",
        timestamp: "2024-02-10T08:00:00Z",
        sequence: 14,
        chainage: 3250,
      },
      {
        id: "15",
        latitude: -6.31925,
        longitude: 143.9596,
        description: "Future Point 2",
        workType: "clearing",
        status: "planned",
        timestamp: "2024-02-12T09:00:00Z",
        sequence: 15,
        chainage: 3500,
      },
    ];
    setGpsPoints(samplePoints);
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedPhotos((prev) => [...prev, ...files]);
  };

  const addPhotosToPoint = (pointId: string) => {
    if (selectedPhotos.length === 0) return;

    const newPhotos = selectedPhotos.map((file, index) => ({
      id: `photo-${Date.now()}-${index}`,
      filename: file.name,
      url: typeof window !== "undefined" ? URL.createObjectURL(file) : "",
      timestamp: new Date().toISOString(),
      description: `Photo ${index + 1} for GPS point`,
    }));

    setGpsPoints((points) =>
      points.map((point) =>
        point.id === pointId
          ? { ...point, photos: [...(point.photos || []), ...newPhotos] }
          : point,
      ),
    );

    setSelectedPhotos([]);
    setShowPhotoUpload(false);
    setSelectedPointForPhotos(null);
  };

  const removePhotoFromPoint = (pointId: string, photoId: string) => {
    setGpsPoints((points) =>
      points.map((point) =>
        point.id === pointId
          ? { ...point, photos: point.photos?.filter((p) => p.id !== photoId) }
          : point,
      ),
    );
  };

  const addGPSPoint = () => {
    if (!newPoint.latitude || !newPoint.longitude) return;

    const point: GPSPoint = {
      id: Date.now().toString(),
      latitude: Number.parseFloat(newPoint.latitude),
      longitude: Number.parseFloat(newPoint.longitude),
      elevation: newPoint.elevation
        ? Number.parseFloat(newPoint.elevation)
        : undefined,
      description: newPoint.description || "GPS Point",
      workType: selectedWorkType,
      status: "planned",
      timestamp: new Date().toISOString(),
      sequence: gpsPoints.length + 1,
      chainage: (gpsPoints.length + 1) * 250, // Approximate 250m intervals
    };

    setGpsPoints([...gpsPoints, point]);
    setNewPoint({
      latitude: "",
      longitude: "",
      description: "",
      elevation: "",
    });
  };

  const updatePointStatus = (pointId: string, status: GPSPoint["status"]) => {
    setGpsPoints(
      gpsPoints.map((point) =>
        point.id === pointId ? { ...point, status } : point,
      ),
    );
  };

  const deletePoint = (pointId: string) => {
    setGpsPoints(gpsPoints.filter((point) => point.id !== pointId));
  };

  const drawRoadProgress = () => {
    const canvas = mapCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Background
    ctx.fillStyle = "#F3F4F6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Filter visible points
    const visiblePoints = gpsPoints.filter((point) => {
      if (point.status === "completed" && !showCompleted) return false;
      if (point.status === "in_progress" && !showInProgress) return false;
      if (point.status === "planned" && !showPlanned) return false;
      return true;
    });

    if (visiblePoints.length === 0) return;

    // Calculate bounds for the GPS points
    const lats = visiblePoints.map((p) => p.latitude);
    const lngs = visiblePoints.map((p) => p.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Add padding
    const padding = 50;
    const latRange = maxLat - minLat || 0.001;
    const lngRange = maxLng - minLng || 0.001;

    // Convert GPS to canvas coordinates
    const toCanvasCoords = (lat: number, lng: number) => {
      const x =
        padding + ((lng - minLng) / lngRange) * (canvas.width - 2 * padding);
      const y =
        padding + ((maxLat - lat) / latRange) * (canvas.height - 2 * padding);
      return { x, y };
    };

    // Draw connections between points (road path)
    if (visiblePoints.length > 1) {
      ctx.lineWidth = 4;

      for (let i = 0; i < visiblePoints.length - 1; i++) {
        const currentPoint = visiblePoints[i];
        const nextPoint = visiblePoints[i + 1];

        const start = toCanvasCoords(
          currentPoint.latitude,
          currentPoint.longitude,
        );
        const end = toCanvasCoords(nextPoint.latitude, nextPoint.longitude);

        // Set line color based on completion status
        if (
          currentPoint.status === "completed" &&
          nextPoint.status === "completed"
        ) {
          ctx.strokeStyle = "#10B981"; // Green for completed
        } else if (
          currentPoint.status === "in_progress" ||
          nextPoint.status === "in_progress"
        ) {
          ctx.strokeStyle = "#F59E0B"; // Orange for in progress
        } else {
          ctx.strokeStyle = "#9CA3AF"; // Gray for planned
          ctx.setLineDash([10, 5]); // Dashed line for planned
        }

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);

        // Create smooth curves using quadratic curves
        if (i < visiblePoints.length - 2) {
          const nextNextPoint = visiblePoints[i + 2];
          const nextNext = toCanvasCoords(
            nextNextPoint.latitude,
            nextNextPoint.longitude,
          );

          // Control point for curve
          const cpX = (start.x + end.x + nextNext.x) / 3;
          const cpY = (start.y + end.y + nextNext.y) / 3;

          ctx.quadraticCurveTo(cpX, cpY, end.x, end.y);
        } else {
          ctx.lineTo(end.x, end.y);
        }

        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash

        // Draw direction arrows
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const arrowLength = 12;
        const arrowWidth = 6;

        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(
          midX - arrowLength * Math.cos(angle - arrowWidth / 2),
          midY - arrowLength * Math.sin(angle - arrowWidth / 2),
        );
        ctx.lineTo(
          midX - arrowLength * Math.cos(angle + arrowWidth / 2),
          midY - arrowLength * Math.sin(angle + arrowWidth / 2),
        );
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw GPS points
    visiblePoints.forEach((point, index) => {
      const coords = toCanvasCoords(point.latitude, point.longitude);

      // Point background
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, 12, 0, 2 * Math.PI);
      ctx.fill();

      // Point border
      ctx.strokeStyle = STATUS_COLORS[point.status];
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, 12, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw X marker
      ctx.strokeStyle = STATUS_COLORS[point.status];
      ctx.lineWidth = 2;
      const xSize = 6;
      ctx.beginPath();
      ctx.moveTo(coords.x - xSize, coords.y - xSize);
      ctx.lineTo(coords.x + xSize, coords.y + xSize);
      ctx.moveTo(coords.x + xSize, coords.y - xSize);
      ctx.lineTo(coords.x - xSize, coords.y + xSize);
      ctx.stroke();

      // Point label
      ctx.fillStyle = "#1F2937";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(point.sequence.toString(), coords.x, coords.y + 25);
    });

    // Draw legend
    const legendY = 20;
    const legendItems = [
      { label: "Completed", color: "#10B981" },
      { label: "In Progress", color: "#F59E0B" },
      { label: "Planned", color: "#9CA3AF" },
    ];

    legendItems.forEach((item, index) => {
      const x = canvas.width - 150 + index * 45;
      ctx.fillStyle = item.color;
      ctx.fillRect(x, legendY, 12, 12);
      ctx.fillStyle = "#1F2937";
      ctx.font = "10px Arial";
      ctx.textAlign = "left";
      ctx.fillText(item.label, x, legendY + 25);
    });
  };

  useEffect(() => {
    drawRoadProgress();
  }, [gpsPoints, showCompleted, showPlanned, showInProgress]);

  const getCompletionPercentage = () => {
    const completedPoints = gpsPoints.filter(
      (p) => p.status === "completed",
    ).length;
    return gpsPoints.length > 0
      ? Math.round((completedPoints / gpsPoints.length) * 100)
      : 0;
  };

  const getCurrentChainage = () => {
    const completedPoints = gpsPoints.filter((p) => p.status === "completed");
    return completedPoints.length > 0
      ? Math.max(...completedPoints.map((p) => p.chainage))
      : 0;
  };

  const exportProgressReport = () => {
    try {
      // Create CSV data
      const csvData = [
        [
          "Sequence",
          "Latitude",
          "Longitude",
          "Description",
          "Work Type",
          "Status",
          "Chainage (m)",
          "Photos Count",
          "Timestamp",
        ],
        ...gpsPoints.map((point) => [
          point.sequence,
          point.latitude.toFixed(6),
          point.longitude.toFixed(6),
          point.description,
          WORK_TYPES.find((w) => w.id === point.workType)?.name ||
            point.workType,
          point.status,
          point.chainage,
          point.photos?.length || 0,
          new Date(point.timestamp).toLocaleDateString(),
        ]),
      ];

      const csvContent = csvData.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });

      if (typeof window !== "undefined") {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `road-progress-report-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting progress report:", error);
      alert("Error exporting report. Please try again.");
    }
  };

  const exportMapImage = () => {
    try {
      const canvas = mapCanvasRef.current;
      if (!canvas || typeof window === "undefined") {
        alert("Map canvas not available for export");
        return;
      }

      const link = document.createElement("a");
      link.download = `road-progress-map-${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Error exporting map image:", error);
      alert("Error exporting map. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with project info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-6 w-6 text-blue-600" />
            Road Progress Mapper - {project.name}
          </CardTitle>
          <CardDescription>
            Track road construction progress using connected GPS coordinates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {gpsPoints.length}
              </div>
              <div className="text-sm text-gray-600">GPS Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getCompletionPercentage()}%
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {getCurrentChainage()}m
              </div>
              <div className="text-sm text-gray-600">Current Chainage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {project.totalLength}m
              </div>
              <div className="text-sm text-gray-600">Total Length</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPS Point Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add GPS Point
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  placeholder="-6.31499"
                  value={newPoint.latitude}
                  onChange={(e) =>
                    setNewPoint((prev) => ({
                      ...prev,
                      latitude: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  placeholder="143.95555"
                  value={newPoint.longitude}
                  onChange={(e) =>
                    setNewPoint((prev) => ({
                      ...prev,
                      longitude: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="elevation">Elevation (m)</Label>
              <Input
                id="elevation"
                placeholder="1200"
                value={newPoint.elevation}
                onChange={(e) =>
                  setNewPoint((prev) => ({
                    ...prev,
                    elevation: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="workType">Work Type</Label>
              <Select
                value={selectedWorkType}
                onValueChange={setSelectedWorkType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORK_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this GPS point..."
                value={newPoint.description}
                onChange={(e) =>
                  setNewPoint((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <Button onClick={addGPSPoint} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add GPS Point
            </Button>

            {/* Photo Upload Section */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium">
                Attach Photos (Optional)
              </Label>
              <div className="mt-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
                >
                  <div className="text-center">
                    <Camera className="h-6 w-6 mx-auto text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to add photos
                    </span>
                  </div>
                </label>
              </div>

              {selectedPhotos.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {selectedPhotos.length} photo(s) selected
                  </p>
                  <div className="flex gap-1 mt-1">
                    {selectedPhotos.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-12 h-12 object-cover rounded border"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-4 w-4 p-0"
                          onClick={() =>
                            setSelectedPhotos((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Road Progress Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Road Progress Map
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={showCompleted ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowCompleted(!showCompleted)}
                >
                  Completed
                </Button>
                <Button
                  variant={showInProgress ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowInProgress(!showInProgress)}
                >
                  In Progress
                </Button>
                <Button
                  variant={showPlanned ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowPlanned(!showPlanned)}
                >
                  Planned
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportProgressReport}
                  className="ml-2"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={exportMapImage}>
                  <Image className="h-4 w-4 mr-1" />
                  Export Map
                </Button>
              </div>
            </div>
            <CardDescription>
              Connected GPS points showing road construction progress with
              curves and directions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <canvas
                ref={mapCanvasRef}
                className="w-full h-96"
                style={{ maxWidth: "100%", height: "400px" }}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>
                • X markers represent GPS points connected by the actual road
                path
              </p>
              <p>
                • Green lines: Completed sections | Orange lines: In progress |
                Gray dashed: Planned
              </p>
              <p>• Arrows show construction direction and progress flow</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GPS Points List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            GPS Points & Progress Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Seq</th>
                  <th className="text-left p-2">Coordinates</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Work Type</th>
                  <th className="text-left p-2">Chainage</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Photos</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gpsPoints.map((point) => (
                  <tr key={point.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono text-sm">{point.sequence}</td>
                    <td className="p-2 font-mono text-sm">
                      {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}
                    </td>
                    <td className="p-2 text-sm">{point.description}</td>
                    <td className="p-2">
                      <Badge variant="outline">
                        {WORK_TYPES.find((w) => w.id === point.workType)?.name}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm">{point.chainage}m</td>
                    <td className="p-2">
                      <Select
                        value={point.status}
                        onValueChange={(status) =>
                          updatePointStatus(
                            point.id,
                            status as GPSPoint["status"],
                          )
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planned">
                            <span className="flex items-center gap-2">
                              <Circle className="h-3 w-3 text-gray-500" />
                              Planned
                            </span>
                          </SelectItem>
                          <SelectItem value="in_progress">
                            <span className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-orange-500" />
                              In Progress
                            </span>
                          </SelectItem>
                          <SelectItem value="completed">
                            <span className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              Completed
                            </span>
                          </SelectItem>
                          <SelectItem value="quality_checked">
                            <span className="flex items-center gap-2">
                              <Target className="h-3 w-3 text-blue-500" />
                              Quality Checked
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {point.photos?.length || 0} photo(s)
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPointForPhotos(point.id);
                            setShowPhotoUpload(true);
                          }}
                          className="h-6 px-2"
                        >
                          <Camera className="h-3 w-3" />
                        </Button>
                        {point.photos && point.photos.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Show photos in a modal or gallery
                              alert(
                                `View ${point.photos?.length} photos for this GPS point`,
                              );
                            }}
                            className="h-6 px-2"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePoint(point.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
