"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { Layers, MapPin, Navigation, ZoomIn, ZoomOut } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  location: string;
  province: string;
  contractor: string;
  status: string;
  progress: number;
  budget: number;
  spent: number;
  latitude?: number;
  longitude?: number;
  roadStartPoint?: string;
  roadEndPoint?: string;
}

interface GPSPoint {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  projectId: string;
  timestamp: string;
  taskName?: string;
  workType?: string;
}

interface GoogleMapComponentProps {
  projects: Project[];
  gpsPoints?: GPSPoint[];
  selectedProject?: Project | null;
  onProjectSelect?: (project: Project) => void;
  height?: string;
  showGPSPoints?: boolean;
  showProjectRoutes?: boolean;
}

// PNG center coordinates
const PNG_CENTER = {
  lat: -6.314993,
  lng: 143.95555,
};

// Project coordinates for major PNG locations
const PROJECT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "proj-1": { lat: -5.837104, lng: 144.295472 }, // Mt. Hagen-Kagamuga
  "proj-2": { lat: -9.4438, lng: 147.1803 }, // Port Moresby Ring Road
  "proj-3": { lat: -6.7248, lng: 147.0003 }, // Lae-Nadzab Highway
  "proj-4": { lat: -6.0847, lng: 145.3933 }, // Highlands Highway
  "proj-5": { lat: -2.6816, lng: 141.3031 }, // Vanimo-Green River
};

const STATUS_COLORS = {
  ACTIVE: "#10b981", // Green
  PLANNING: "#3b82f6", // Blue
  ON_HOLD: "#f59e0b", // Yellow
  COMPLETED: "#8b5cf6", // Purple
  CANCELLED: "#ef4444", // Red
};

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
  styles: [
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#987284" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#34d399" }],
    },
  ],
};

export default function GoogleMapComponent({
  projects,
  gpsPoints = [],
  selectedProject,
  onProjectSelect,
  height = "600px",
  showGPSPoints = true,
  showProjectRoutes = false,
}: GoogleMapComponentProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Project | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoom, setZoom] = useState(6);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setMapLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Get project coordinates
  const getProjectCoordinates = (project: Project) => {
    if (project.latitude && project.longitude) {
      return { lat: project.latitude, lng: project.longitude };
    }
    return PROJECT_COORDINATES[project.id] || PNG_CENTER;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#6b7280";
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PG", {
      style: "currency",
      currency: "PGK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Center map on selected project
  useEffect(() => {
    if (map && selectedProject) {
      const coords = getProjectCoordinates(selectedProject);
      map.panTo(coords);
      map.setZoom(10);
    }
  }, [map, selectedProject]);

  // Handle marker click
  const handleMarkerClick = (project: Project) => {
    setSelectedMarker(project);
    if (onProjectSelect) {
      onProjectSelect(project);
    }
  };

  // Handle map zoom
  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom() || 6;
      map.setZoom(currentZoom + 1);
      setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() || 6;
      map.setZoom(Math.max(currentZoom - 1, 1));
      setZoom(Math.max(currentZoom - 1, 1));
    }
  };

  // GPS points for selected project
  const projectGPSPoints = gpsPoints.filter((point) =>
    selectedProject ? point.projectId === selectedProject.id : true,
  );

  const mapStyle = {
    ...mapContainerStyle,
    height: height,
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            PNG Road Construction Projects Map
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Planning</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>On Hold</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Completed</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <LoadScript
          googleMapsApiKey={
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "demo_key"
          }
          onLoad={() => setMapLoaded(true)}
        >
          <GoogleMap
            mapContainerStyle={mapStyle}
            center={
              selectedProject
                ? getProjectCoordinates(selectedProject)
                : PNG_CENTER
            }
            zoom={selectedProject ? 10 : 6}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={defaultMapOptions}
          >
            {/* Project Markers */}
            {projects.map((project) => {
              const position = getProjectCoordinates(project);
              return (
                <Marker
                  key={project.id}
                  position={position}
                  title={project.name}
                  onClick={() => handleMarkerClick(project)}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: getStatusColor(project.status),
                    fillOpacity: 0.8,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                    scale: 8,
                  }}
                />
              );
            })}

            {/* GPS Points */}
            {showGPSPoints &&
              projectGPSPoints.map((point) => (
                <Marker
                  key={point.id}
                  position={{ lat: point.latitude, lng: point.longitude }}
                  title={`${point.taskName || "GPS Point"} - ${point.description}`}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: "#ef4444",
                    fillOpacity: 0.6,
                    strokeColor: "#ffffff",
                    strokeWeight: 1,
                    scale: 4,
                  }}
                />
              ))}

            {/* Project Routes */}
            {showProjectRoutes &&
              selectedProject &&
              projectGPSPoints.length > 1 && (
                <Polyline
                  path={projectGPSPoints.map((point) => ({
                    lat: point.latitude,
                    lng: point.longitude,
                  }))}
                  options={{
                    strokeColor: getStatusColor(selectedProject.status),
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                  }}
                />
              )}

            {/* Info Window */}
            {selectedMarker && (
              <InfoWindow
                position={getProjectCoordinates(selectedMarker)}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2 max-w-sm">
                  <h3 className="font-semibold text-sm mb-2">
                    {selectedMarker.name}
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">
                        {selectedMarker.location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge
                        className="text-xs px-1 py-0"
                        style={{
                          backgroundColor: getStatusColor(
                            selectedMarker.status,
                          ),
                        }}
                      >
                        {selectedMarker.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <span className="font-medium">
                        {selectedMarker.progress}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedMarker.budget)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contractor:</span>
                      <span className="font-medium text-right flex-1 ml-2">
                        {selectedMarker.contractor}
                      </span>
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>

        {!mapLoaded && (
          <div className="flex items-center justify-center h-96 bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Google Maps...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
