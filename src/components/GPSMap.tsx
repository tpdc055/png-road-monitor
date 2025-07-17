"use client";

import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Satellite, ZoomIn, ZoomOut } from "lucide-react";
import { useState, useCallback, useRef } from "react";

interface GPSPoint {
  id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
  workType?: string;
  status?: string;
  comments?: string;
  chainage?: number;
}

interface GPSMapProps {
  gpsPoints: GPSPoint[];
  currentPosition?: { lat: number; lng: number };
  onMapClick?: (lat: number, lng: number) => void;
  showAccuracyCircles?: boolean;
  showRoute?: boolean;
  projectBounds?: {
    startPoint: { lat: number; lng: number };
    endPoint: { lat: number; lng: number };
  };
}

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

// PNG default center (Port Moresby area)
const defaultCenter = {
  lat: -9.4438,
  lng: 147.1803
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
};

export default function GPSMap({
  gpsPoints,
  currentPosition,
  onMapClick,
  showAccuracyCircles = true,
  showRoute = true,
  projectBounds
}: GPSMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<GPSPoint | null>(null);
  const [mapCenter, setMapCenter] = useState(currentPosition || defaultCenter);
  const [zoom, setZoom] = useState(13);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    // Fit bounds to include all GPS points
    if (gpsPoints.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      gpsPoints.forEach(point => {
        bounds.extend({ lat: point.latitude, lng: point.longitude });
      });

      // Include project bounds if available
      if (projectBounds) {
        bounds.extend(projectBounds.startPoint);
        bounds.extend(projectBounds.endPoint);
      }

      map.fitBounds(bounds);
    }
  }, [gpsPoints, projectBounds]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng && onMapClick) {
      onMapClick(e.latLng.lat(), e.latLng.lng());
    }
  }, [onMapClick]);

  const getMarkerIcon = (point: GPSPoint) => {
    let color = '#3B82F6'; // Default blue

    if (point.status === 'COMPLETED') color = '#10B981'; // Green
    else if (point.status === 'IN_PROGRESS') color = '#F59E0B'; // Yellow
    else if (point.status === 'INSPECTION_REQUIRED') color = '#EF4444'; // Red

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 0.8,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 8,
    };
  };

  const getAccuracyCircle = (point: GPSPoint) => {
    if (!showAccuracyCircles || !point.accuracy) return null;

    return {
      center: { lat: point.latitude, lng: point.longitude },
      radius: point.accuracy,
      fillColor: '#3B82F6',
      fillOpacity: 0.1,
      strokeColor: '#3B82F6',
      strokeOpacity: 0.3,
      strokeWeight: 1,
    };
  };

  const routePath = showRoute ? gpsPoints.map(point => ({
    lat: point.latitude,
    lng: point.longitude
  })) : [];

  const zoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom() || 13;
      map.setZoom(currentZoom + 1);
      setZoom(currentZoom + 1);
    }
  };

  const zoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() || 13;
      map.setZoom(currentZoom - 1);
      setZoom(currentZoom - 1);
    }
  };

  const centerOnCurrent = () => {
    if (map && currentPosition) {
      map.setCenter(currentPosition);
      map.setZoom(16);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              GPS Data Map View
            </CardTitle>
            <CardDescription>
              Interactive map showing GPS data points and road progress
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={zoomIn}
              disabled={zoom >= 20}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={zoomOut}
              disabled={zoom <= 1}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            {currentPosition && (
              <Button
                variant="outline"
                size="sm"
                onClick={centerOnCurrent}
              >
                <Navigation className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map Legend */}
          <div className="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs">Needs Inspection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">Other</span>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
                options={mapOptions}
              >
                {/* Current Position Marker */}
                {currentPosition && (
                  <Marker
                    position={currentPosition}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      fillColor: '#EF4444',
                      fillOpacity: 1,
                      strokeColor: '#FFFFFF',
                      strokeWeight: 3,
                      scale: 10,
                    }}
                    title="Current Position"
                  />
                )}

                {/* Project Bounds Markers */}
                {projectBounds && (
                  <>
                    <Marker
                      position={projectBounds.startPoint}
                      icon={{
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        fillColor: '#10B981',
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 2,
                        scale: 12,
                      }}
                      title="Project Start"
                    />
                    <Marker
                      position={projectBounds.endPoint}
                      icon={{
                        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                        fillColor: '#EF4444',
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 2,
                        scale: 12,
                      }}
                      title="Project End"
                    />
                  </>
                )}

                {/* GPS Data Points */}
                {gpsPoints.map((point) => (
                  <Marker
                    key={point.id}
                    position={{ lat: point.latitude, lng: point.longitude }}
                    icon={getMarkerIcon(point)}
                    onClick={() => setSelectedPoint(point)}
                    title={`${point.workType || 'GPS Point'} - ${point.status}`}
                  />
                ))}

                {/* Accuracy Circles */}
                {showAccuracyCircles && gpsPoints.map((point) => {
                  const circle = getAccuracyCircle(point);
                  return circle ? (
                    <div key={`circle-${point.id}`}>
                      {/* Note: react-google-maps doesn't have Circle component,
                          would need to use google.maps.Circle directly */}
                    </div>
                  ) : null;
                })}

                {/* Route Polyline */}
                {showRoute && routePath.length > 1 && (
                  <Polyline
                    path={routePath}
                    options={{
                      strokeColor: '#3B82F6',
                      strokeOpacity: 0.8,
                      strokeWeight: 3,
                    }}
                  />
                )}

                {/* Info Window for Selected Point */}
                {selectedPoint && (
                  <InfoWindow
                    position={{ lat: selectedPoint.latitude, lng: selectedPoint.longitude }}
                    onCloseClick={() => setSelectedPoint(null)}
                  >
                    <div className="p-2 max-w-xs">
                      <h3 className="font-semibold text-sm mb-2">
                        {selectedPoint.workType || 'GPS Data Point'}
                      </h3>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {selectedPoint.status || 'Unknown'}
                          </Badge>
                        </div>
                        <p><strong>Coordinates:</strong> {selectedPoint.latitude.toFixed(6)}, {selectedPoint.longitude.toFixed(6)}</p>
                        {selectedPoint.chainage && (
                          <p><strong>Chainage:</strong> {selectedPoint.chainage.toFixed(3)} km</p>
                        )}
                        {selectedPoint.accuracy && (
                          <p><strong>Accuracy:</strong> ±{selectedPoint.accuracy.toFixed(1)}m</p>
                        )}
                        <p><strong>Time:</strong> {new Date(selectedPoint.timestamp).toLocaleString()}</p>
                        {selectedPoint.comments && (
                          <p><strong>Comments:</strong> {selectedPoint.comments}</p>
                        )}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Map Statistics */}
          <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold">{gpsPoints.length}</div>
              <div className="text-xs text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">
                {gpsPoints.filter(p => p.status === 'COMPLETED').length}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">
                {routePath.length > 1 ?
                  (google.maps.geometry?.spherical?.computeLength(routePath) / 1000).toFixed(2) || 'N/A'
                  : 'N/A'} km
              </div>
              <div className="text-xs text-gray-600">Total Distance</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
