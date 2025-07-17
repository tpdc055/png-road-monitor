"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, MapPin, Navigation, Satellite, Target } from "lucide-react";
import { useEffect, useState } from "react";

interface GPSPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

interface GPSCaptureProps {
  onLocationCapture: (position: GPSPosition) => void;
  isCapturing?: boolean;
  showAccuracy?: boolean;
  minAccuracy?: number;
}

export default function GPSCapture({
  onLocationCapture,
  isCapturing = false,
  showAccuracy = true,
  minAccuracy = 10
}: GPSCaptureProps) {
  const [position, setPosition] = useState<GPSPosition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  // Check for GPS permission status
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
        setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
      });
    }
  }, []);

  const startCapture = () => {
    if (!navigator.geolocation) {
      setError('GPS not supported by this device');
      return;
    }

    setIsLoading(true);
    setError(null);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    // Get immediate position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const gpsPosition: GPSPosition = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude || undefined,
          heading: pos.coords.heading || undefined,
          speed: pos.coords.speed || undefined,
          timestamp: pos.timestamp
        };

        setPosition(gpsPosition);
        setIsLoading(false);
        onLocationCapture(gpsPosition);
      },
      (err) => {
        setError(getErrorMessage(err));
        setIsLoading(false);
      },
      options
    );

    // Start continuous tracking if requested
    if (isCapturing) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const gpsPosition: GPSPosition = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude || undefined,
            heading: pos.coords.heading || undefined,
            speed: pos.coords.speed || undefined,
            timestamp: pos.timestamp
          };

          setPosition(gpsPosition);
          onLocationCapture(gpsPosition);
        },
        (err) => {
          setError(getErrorMessage(err));
        },
        options
      );
      setWatchId(id);
    }
  };

  const stopCapture = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsLoading(false);
  };

  const getErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'GPS access denied. Please enable location services.';
      case error.POSITION_UNAVAILABLE:
        return 'GPS position unavailable. Check your device settings.';
      case error.TIMEOUT:
        return 'GPS request timed out. Please try again.';
      default:
        return 'Unknown GPS error occurred.';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 5) return 'bg-green-500';
    if (accuracy <= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAccuracyText = (accuracy: number) => {
    if (accuracy <= 5) return 'Excellent';
    if (accuracy <= 10) return 'Good';
    if (accuracy <= 20) return 'Fair';
    return 'Poor';
  };

  const isGoodAccuracy = position ? position.accuracy <= minAccuracy : false;

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          GPS Location Capture
        </CardTitle>
        <CardDescription>
          High-accuracy GPS positioning for road construction monitoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* GPS Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">GPS Status:</span>
          <Badge variant={position ? 'default' : 'secondary'}>
            {isLoading ? 'Acquiring...' : position ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Permission Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Permission:</span>
          <Badge variant={permissionStatus === 'granted' ? 'default' : 'destructive'}>
            {permissionStatus}
          </Badge>
        </div>

        {/* Current Position */}
        {position && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Latitude:</span>
                <p className="font-mono">{position.latitude.toFixed(6)}</p>
              </div>
              <div>
                <span className="font-medium">Longitude:</span>
                <p className="font-mono">{position.longitude.toFixed(6)}</p>
              </div>
            </div>

            {showAccuracy && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Accuracy:</span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getAccuracyColor(position.accuracy)}`} />
                  <span className="text-sm">
                    ±{position.accuracy.toFixed(1)}m ({getAccuracyText(position.accuracy)})
                  </span>
                  {isGoodAccuracy ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
            )}

            {position.altitude && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Altitude:</span>
                <span className="text-sm">{position.altitude.toFixed(1)}m</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Timestamp:</span>
              <span className="text-sm">{new Date(position.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={startCapture}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Target className="mr-2 h-4 w-4 animate-spin" />
                Acquiring GPS...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                {isCapturing ? 'Update Position' : 'Capture GPS'}
              </>
            )}
          </Button>

          {watchId !== null && (
            <Button
              onClick={stopCapture}
              variant="outline"
            >
              Stop Tracking
            </Button>
          )}
        </div>

        {/* Accuracy Warning */}
        {position && !isGoodAccuracy && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-700">
              GPS accuracy is {position.accuracy.toFixed(1)}m. For better precision, ensure clear sky visibility and wait for better signal.
            </span>
          </div>
        )}

        {/* GPS Tips */}
        <div className="text-xs text-gray-600 space-y-1">
          <p className="font-medium">GPS Tips:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Move to an open area with clear sky view</li>
            <li>Wait 30-60 seconds for optimal accuracy</li>
            <li>Accuracy under 10m is recommended for construction monitoring</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
