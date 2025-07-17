"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
  AlertTriangle,
  CheckCircle,
  Clock,
  Crosshair,
  MapPin,
  Navigation,
  RefreshCw,
  Satellite,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

interface GPSLocationCaptureProps {
  onLocationUpdate: (location: GPSLocation) => void;
  autoCapture?: boolean;
  showMap?: boolean;
  className?: string;
}

export default function GPSLocationCapture({
  onLocationUpdate,
  autoCapture = false,
  showMap = false,
  className = "",
}: GPSLocationCaptureProps) {
  const [currentLocation, setCurrentLocation] = useState<GPSLocation | null>(
    null,
  );
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [locationHistory, setLocationHistory] = useState<GPSLocation[]>([]);

  useEffect(() => {
    if (autoCapture) {
      startLocationTracking();
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [autoCapture]);

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setIsCapturing(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000, // 30 seconds
    };

    const successCallback = (position: GeolocationPosition) => {
      const location: GPSLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude || undefined,
        heading: position.coords.heading || undefined,
        speed: position.coords.speed || undefined,
        timestamp: position.timestamp,
      };

      setCurrentLocation(location);
      setLastUpdate(new Date());
      setLocationHistory((prev) => [...prev.slice(-9), location]); // Keep last 10 locations
      onLocationUpdate(location);
      setError(null);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      setIsCapturing(false);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError("Location access denied. Please enable GPS permissions.");
          break;
        case error.POSITION_UNAVAILABLE:
          setError("Location information unavailable. Check GPS signal.");
          break;
        case error.TIMEOUT:
          setError("Location request timed out. Try again.");
          break;
        default:
          setError("An unknown error occurred while retrieving location.");
          break;
      }
    };

    if (autoCapture) {
      const id = navigator.geolocation.watchPosition(
        successCallback,
        errorCallback,
        options,
      );
      setWatchId(id);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          successCallback(position);
          setIsCapturing(false);
        },
        (error) => {
          errorCallback(error);
          setIsCapturing(false);
        },
        options,
      );
    }
  };

  const stopLocationTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsCapturing(false);
  };

  const captureCurrentLocation = () => {
    if (autoCapture && isCapturing) {
      stopLocationTracking();
    } else {
      startLocationTracking();
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 5) return "text-green-600 bg-green-100";
    if (accuracy <= 10) return "text-blue-600 bg-blue-100";
    if (accuracy <= 20) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getAccuracyText = (accuracy: number) => {
    if (accuracy <= 5) return "Excellent";
    if (accuracy <= 10) return "Good";
    if (accuracy <= 20) return "Fair";
    return "Poor";
  };

  const formatCoordinate = (coord: number, isLongitude = false) => {
    const direction = isLongitude
      ? coord >= 0
        ? "E"
        : "W"
      : coord >= 0
        ? "N"
        : "S";
    return `${Math.abs(coord).toFixed(6)}° ${direction}`;
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Satellite className="h-5 w-5" />
            GPS Location Capture
          </CardTitle>
          <CardDescription>
            Real-time GPS coordinates for field data collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Location Display */}
            {currentLocation && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      Current Location
                    </span>
                  </div>
                  <Badge
                    className={`text-xs ${getAccuracyColor(currentLocation.accuracy)}`}
                  >
                    ±{currentLocation.accuracy.toFixed(1)}m •{" "}
                    {getAccuracyText(currentLocation.accuracy)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Latitude
                    </label>
                    <div className="text-sm font-mono text-gray-900">
                      {formatCoordinate(currentLocation.latitude)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Longitude
                    </label>
                    <div className="text-sm font-mono text-gray-900">
                      {formatCoordinate(currentLocation.longitude, true)}
                    </div>
                  </div>

                  {currentLocation.altitude && (
                    <div>
                      <label className="text-xs font-medium text-gray-600">
                        Altitude
                      </label>
                      <div className="text-sm text-gray-900">
                        {currentLocation.altitude.toFixed(1)}m
                      </div>
                    </div>
                  )}

                  {currentLocation.speed !== undefined &&
                    currentLocation.speed > 0 && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">
                          Speed
                        </label>
                        <div className="text-sm text-gray-900">
                          {(currentLocation.speed * 3.6).toFixed(1)} km/h
                        </div>
                      </div>
                    )}
                </div>

                {lastUpdate && (
                  <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last updated {formatTimeAgo(lastUpdate)}
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Control Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={captureCurrentLocation}
                disabled={isCapturing && !autoCapture}
                className="flex-1"
              >
                {isCapturing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {autoCapture ? "Stop Tracking" : "Capturing..."}
                  </>
                ) : (
                  <>
                    <Crosshair className="h-4 w-4 mr-2" />
                    {autoCapture ? "Start Tracking" : "Capture Location"}
                  </>
                )}
              </Button>

              {currentLocation && (
                <Button
                  variant="outline"
                  onClick={() => onLocationUpdate(currentLocation)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Use Location
                </Button>
              )}
            </div>

            {/* Location History */}
            {locationHistory.length > 1 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Navigation className="h-4 w-4" />
                  Recent Locations ({locationHistory.length})
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {locationHistory
                    .slice(-5)
                    .reverse()
                    .map((location, index) => (
                      <div
                        key={location.timestamp}
                        className="text-xs text-gray-600 p-2 bg-gray-50 rounded"
                      >
                        <div className="flex justify-between">
                          <span>
                            {location.latitude.toFixed(6)},{" "}
                            {location.longitude.toFixed(6)}
                          </span>
                          <span>±{location.accuracy.toFixed(1)}m</span>
                        </div>
                        <div className="text-gray-500">
                          {formatTimeAgo(new Date(location.timestamp))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* GPS Tips */}
            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded border border-blue-200">
              <strong>GPS Tips:</strong>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>For best accuracy, use outdoors with clear sky view</li>
                <li>Wait for accuracy better than 10m before recording</li>
                <li>Enable high accuracy mode in device settings</li>
                <li>Avoid recording near tall buildings or dense forest</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
