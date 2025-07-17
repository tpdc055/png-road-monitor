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
  Battery,
  Camera,
  Clock,
  MapPin,
  Navigation,
  Pause,
  Play,
  RefreshCw,
  Save,
  Signal,
  Square,
  Target,
  Upload,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  timestamp: number;
}

interface GPSTrackingEntry {
  id: string;
  location: GPSLocation;
  taskName: string;
  workType: string;
  description: string;
  photos: string[];
  isSubmitted: boolean;
  offlineEntry: boolean;
  timestamp: number;
}

export default function MobileGPSTracker() {
  const [currentLocation, setCurrentLocation] = useState<GPSLocation | null>(
    null,
  );
  const [isTracking, setIsTracking] = useState(false);
  const [trackingEntries, setTrackingEntries] = useState<GPSTrackingEntry[]>(
    [],
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<
    "high" | "medium" | "low"
  >("medium");
  const [trackingMode, setTrackingMode] = useState<
    "manual" | "automatic" | "continuous"
  >("manual");
  const [unsyncedEntries, setUnsyncedEntries] = useState(0);

  // Form state
  const [taskName, setTaskName] = useState("");
  const [workType, setWorkType] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const watchIdRef = useRef<number | null>(null);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize GPS tracking and setup listeners
  useEffect(() => {
    // Check GPS availability
    if (!navigator.geolocation) {
      alert("GPS is not supported by this device");
      return;
    }

    // Setup online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Get battery status if available
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    // Load offline entries from localStorage
    loadOfflineEntries();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      stopTracking();
    };
  }, []);

  const loadOfflineEntries = () => {
    try {
      const stored = localStorage.getItem("gps-tracking-entries");
      if (stored) {
        const entries: GPSTrackingEntry[] = JSON.parse(stored);
        const unsynced = entries.filter((e) => !e.isSubmitted).length;
        setUnsyncedEntries(unsynced);
      }
    } catch (error) {
      console.error("Error loading offline entries:", error);
    }
  };

  const saveOfflineEntry = (entry: GPSTrackingEntry) => {
    try {
      const stored = localStorage.getItem("gps-tracking-entries") || "[]";
      const entries: GPSTrackingEntry[] = JSON.parse(stored);
      entries.push(entry);
      localStorage.setItem("gps-tracking-entries", JSON.stringify(entries));
      setUnsyncedEntries((prev) => prev + 1);
    } catch (error) {
      console.error("Error saving offline entry:", error);
    }
  };

  const getCurrentLocation = (): Promise<GPSLocation> => {
    return new Promise((resolve, reject) => {
      const options: PositionOptions = {
        enableHighAccuracy: locationAccuracy === "high",
        timeout: locationAccuracy === "high" ? 30000 : 10000,
        maximumAge: locationAccuracy === "high" ? 0 : 30000,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: GPSLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
            timestamp: Date.now(),
          };
          setCurrentLocation(location);
          resolve(location);
        },
        (error) => {
          console.error("GPS Error:", error);
          reject(error);
        },
        options,
      );
    });
  };

  const startTracking = async () => {
    if (!navigator.geolocation) return;

    try {
      await getCurrentLocation();
      setIsTracking(true);

      const options: PositionOptions = {
        enableHighAccuracy: locationAccuracy === "high",
        timeout: 10000,
        maximumAge: 5000,
      };

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const location: GPSLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
            timestamp: Date.now(),
          };
          setCurrentLocation(location);

          // Auto-save location in continuous mode
          if (trackingMode === "continuous") {
            const entry: GPSTrackingEntry = {
              id: `auto-${Date.now()}`,
              location,
              taskName: "Continuous Tracking",
              workType: "Movement",
              description: "Automatic location recording",
              photos: [],
              isSubmitted: false,
              offlineEntry: !isOnline,
              timestamp: Date.now(),
            };

            if (isOnline) {
              // TODO: Submit to server
              console.log("Submitting GPS entry:", entry);
            } else {
              saveOfflineEntry(entry);
            }
          }
        },
        (error) => console.error("GPS tracking error:", error),
        options,
      );
    } catch (error) {
      console.error("Failed to start tracking:", error);
      alert("Failed to get GPS location. Please check your GPS settings.");
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
    setIsTracking(false);
  };

  const handleSubmitEntry = async () => {
    if (!currentLocation || !taskName || !workType) {
      alert(
        "Please fill in all required fields and ensure GPS location is available",
      );
      return;
    }

    const entry: GPSTrackingEntry = {
      id: `entry-${Date.now()}`,
      location: currentLocation,
      taskName,
      workType,
      description,
      photos,
      isSubmitted: false,
      offlineEntry: !isOnline,
      timestamp: Date.now(),
    };

    if (isOnline) {
      // TODO: Submit to server
      try {
        console.log("Submitting GPS entry to server:", entry);
        // Simulate API call
        entry.isSubmitted = true;
        alert("Entry submitted successfully!");
      } catch (error) {
        console.error("Failed to submit entry:", error);
        saveOfflineEntry(entry);
        alert("Saved offline - will sync when connection is restored");
      }
    } else {
      saveOfflineEntry(entry);
      alert("Saved offline - will sync when connection is restored");
    }

    // Reset form
    setTaskName("");
    setWorkType("");
    setDescription("");
    setPhotos([]);
  };

  const capturePhoto = async () => {
    if (!("camera" in navigator.mediaDevices)) {
      alert("Camera not available on this device");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      // Create video element for preview
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      // TODO: Implement photo capture UI
      alert("Photo capture UI - Implementation needed");

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Camera access error:", error);
      alert("Could not access camera");
    }
  };

  const syncOfflineData = async () => {
    if (!isOnline) {
      alert("No internet connection available");
      return;
    }

    try {
      const stored = localStorage.getItem("gps-tracking-entries");
      if (!stored) return;

      const entries: GPSTrackingEntry[] = JSON.parse(stored);
      const unsyncedEntries = entries.filter((e) => !e.isSubmitted);

      for (const entry of unsyncedEntries) {
        // TODO: Submit to server
        console.log("Syncing entry:", entry);
        entry.isSubmitted = true;
      }

      localStorage.setItem("gps-tracking-entries", JSON.stringify(entries));
      setUnsyncedEntries(0);
      alert(`Synced ${unsyncedEntries.length} entries successfully!`);
    } catch (error) {
      console.error("Sync error:", error);
      alert("Failed to sync offline data");
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 5) return "text-green-600";
    if (accuracy <= 10) return "text-yellow-600";
    return "text-red-600";
  };

  const formatCoordinate = (value: number, type: "lat" | "lng") => {
    const abs = Math.abs(value);
    const degrees = Math.floor(abs);
    const minutes = Math.floor((abs - degrees) * 60);
    const seconds = ((abs - degrees) * 60 - minutes) * 60;
    const direction =
      type === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";
    return `${degrees}°${minutes}'${seconds.toFixed(2)}"${direction}`;
  };

  return (
    <div className="space-y-4 p-4 max-w-md mx-auto bg-white min-h-screen">
      {/* Status Bar */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-lg">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {batteryLevel && (
            <div className="flex items-center gap-1">
              <Battery className="h-4 w-4" />
              <span className="text-sm">{batteryLevel}%</span>
            </div>
          )}

          {unsyncedEntries > 0 && (
            <Badge className="bg-yellow-500 text-yellow-900">
              {unsyncedEntries} pending
            </Badge>
          )}
        </div>
      </div>

      {/* GPS Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            GPS Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentLocation ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-gray-600">Latitude</Label>
                  <div className="font-mono text-sm">
                    {formatCoordinate(currentLocation.latitude, "lat")}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Longitude</Label>
                  <div className="font-mono text-sm">
                    {formatCoordinate(currentLocation.longitude, "lng")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className={getAccuracyColor(currentLocation.accuracy)}>
                    ±{currentLocation.accuracy.toFixed(1)}m
                  </span>
                </div>

                {currentLocation.speed && (
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    <span>{(currentLocation.speed * 3.6).toFixed(1)} km/h</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500">
                Last updated:{" "}
                {new Date(currentLocation.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No GPS location available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tracking Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tracking Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => setLocationAccuracy("high")}
              variant={locationAccuracy === "high" ? "default" : "outline"}
              size="sm"
              className="text-xs"
            >
              High Accuracy
            </Button>
            <Button
              onClick={() => setLocationAccuracy("medium")}
              variant={locationAccuracy === "medium" ? "default" : "outline"}
              size="sm"
              className="text-xs"
            >
              Medium
            </Button>
            <Button
              onClick={() => setLocationAccuracy("low")}
              variant={locationAccuracy === "low" ? "default" : "outline"}
              size="sm"
              className="text-xs"
            >
              Battery Save
            </Button>
          </div>

          <div className="flex gap-2">
            {!isTracking ? (
              <Button
                onClick={startTracking}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Tracking
              </Button>
            ) : (
              <Button
                onClick={stopTracking}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Tracking
              </Button>
            )}

            <Button onClick={getCurrentLocation} variant="outline">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Entry Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Task Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Task Name *</Label>
            <Input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g., Road surface inspection"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Work Type *</Label>
            <Select value={workType} onValueChange={setWorkType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="surveying">Surveying</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="quality-check">Quality Check</SelectItem>
                <SelectItem value="safety-assessment">
                  Safety Assessment
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of work performed..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={capturePhoto} variant="outline" className="flex-1">
              <Camera className="h-4 w-4 mr-2" />
              Add Photo
            </Button>

            <Button
              onClick={handleSubmitEntry}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={!currentLocation || !taskName || !workType}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Entry
            </Button>
          </div>

          {photos.length > 0 && (
            <div className="text-sm text-gray-600">
              {photos.length} photo(s) attached
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Controls */}
      {unsyncedEntries > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Offline Data</div>
                <div className="text-sm text-gray-600">
                  {unsyncedEntries} entries waiting to sync
                </div>
              </div>
              <Button onClick={syncOfflineData} disabled={!isOnline} size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
