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
  AlertTriangle,
  Battery,
  Camera,
  CheckCircle,
  CheckSquare,
  Clock,
  MapPin,
  Mic,
  Navigation,
  Satellite,
  Save,
  Signal,
  Square,
  Target,
  Upload,
  Wifi,
  WifiOff,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

interface GPSReading {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  timestamp: string;
}

interface MobileGPSEntry {
  id: string;
  coordinates: GPSReading;
  workType: string;
  description: string;
  photos: File[];
  audioNote?: File;
  status: "draft" | "synced" | "pending";
  timestamp: string;
}

const WORK_TYPES = [
  { id: "clearing", name: "Land Clearing", icon: "🌳", color: "#8B4513" },
  { id: "earthworks", name: "Earthworks", icon: "⛏️", color: "#D2691E" },
  { id: "drainage", name: "Drainage", icon: "🌊", color: "#4682B4" },
  { id: "base_course", name: "Base Course", icon: "🏗️", color: "#696969" },
  { id: "surfacing", name: "Surfacing", icon: "🛣️", color: "#2F4F4F" },
  { id: "bridge", name: "Bridge Work", icon: "🌉", color: "#8B0000" },
];

function MobileGPSCollectorComponent() {
  const [isMounted, setIsMounted] = useState(false);
  const [isGPSEnabled, setIsGPSEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GPSReading | null>(
    null,
  );
  const [isConnected, setIsConnected] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [gpsEntries, setGpsEntries] = useState<MobileGPSEntry[]>([]);

  useEffect(() => {
    setIsMounted(true);

    // Add global error handlers
    const handleUnhandledRejection = (event: any) => {
      console.error("Unhandled promise rejection:", event.reason);
      event.preventDefault();
    };

    const handleError = (event: any) => {
      console.error("Global error:", event.error);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("unhandledrejection", handleUnhandledRejection);
      window.addEventListener("error", handleError);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "unhandledrejection",
          handleUnhandledRejection,
        );
        window.removeEventListener("error", handleError);
      }
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 flex items-center justify-center">
        <div>Loading GPS Collector...</div>
      </div>
    );
  }

  const [currentEntry, setCurrentEntry] = useState({
    workType: "",
    description: "",
    photos: [] as File[],
    audioNote: null as File | null,
  });

  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Check GPS and network status
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    const checkGPS = () => {
      if (typeof navigator !== "undefined" && "geolocation" in navigator) {
        setIsGPSEnabled(true);
      }
    };

    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);

    // Set initial online status
    if (typeof navigator !== "undefined") {
      setIsConnected(navigator.onLine);
    }

    // Battery API (if supported)
    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          setBatteryLevel(Math.round(battery.level * 100));
          battery.addEventListener("levelchange", () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
        })
        .catch((error: any) => {
          console.log("Battery API not supported:", error);
        });
    }

    checkGPS();
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const captureCurrentLocation = () => {
    if (typeof navigator === "undefined" || !isGPSEnabled) {
      setLocationError("GPS not available on this device");
      return;
    }

    setIsCapturingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const gpsReading: GPSReading = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          timestamp: new Date().toISOString(),
        };
        setCurrentLocation(gpsReading);
        setIsCapturingLocation(false);
      },
      (error) => {
        setLocationError(`GPS Error: ${error.message}`);
        setIsCapturingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedPhotos((prev) => [...prev, ...files]);
  };

  const startAudioRecording = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      console.error("Media devices not supported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioFile = new File([audioBlob], `audio-${Date.now()}.wav`, {
          type: "audio/wav",
        });
        setCurrentEntry((prev) => ({ ...prev, audioNote: audioFile }));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setIsRecordingAudio(false);
      };

      mediaRecorderRef.current.start();
      setIsRecordingAudio(true);
    } catch (error) {
      console.error("Error starting audio recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
    }
  };

  const saveEntry = () => {
    if (!currentLocation || !currentEntry.workType) {
      alert("Please capture GPS location and select work type");
      return;
    }

    const entry: MobileGPSEntry = {
      id: Date.now().toString(),
      coordinates: currentLocation,
      workType: currentEntry.workType,
      description: currentEntry.description,
      photos: selectedPhotos,
      audioNote: currentEntry.audioNote,
      status: isConnected ? "synced" : "pending",
      timestamp: new Date().toISOString(),
    };

    setGpsEntries((prev) => [entry, ...prev]);

    // Reset form
    setCurrentEntry({
      workType: "",
      description: "",
      photos: [],
      audioNote: null,
    });
    setSelectedPhotos([]);
    setCurrentLocation(null);

    alert(
      `GPS entry saved ${isConnected ? "and synced" : "locally (will sync when online)"}`,
    );
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 5) return "text-green-600";
    if (accuracy <= 15) return "text-yellow-600";
    return "text-red-600";
  };

  const getAccuracyText = (accuracy: number) => {
    if (accuracy <= 5) return "Excellent";
    if (accuracy <= 15) return "Good";
    return "Poor";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 pb-20">
      {/* Mobile Status Bar */}
      <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className={isConnected ? "text-green-600" : "text-red-600"}>
                {isConnected ? "Online" : "Offline"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Satellite className="h-4 w-4 text-blue-600" />
              <span
                className={isGPSEnabled ? "text-green-600" : "text-red-600"}
              >
                {isGPSEnabled ? "GPS Ready" : "No GPS"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {batteryLevel !== null && (
              <div className="flex items-center gap-1">
                <Battery className="h-4 w-4 text-gray-600" />
                <span className="text-gray-600">{batteryLevel}%</span>
              </div>
            )}

            <Badge variant="outline" className="text-xs">
              {gpsEntries.filter((e) => e.status === "pending").length} pending
            </Badge>
          </div>
        </div>
      </div>

      {/* GPS Capture Section */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            GPS Location Capture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={captureCurrentLocation}
            disabled={isCapturingLocation || !isGPSEnabled}
            className="w-full h-12 text-lg"
            variant={currentLocation ? "outline" : "default"}
          >
            {isCapturingLocation ? (
              <>
                <Navigation className="h-5 w-5 mr-2 animate-spin" />
                Capturing Location...
              </>
            ) : currentLocation ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Location Captured
              </>
            ) : (
              <>
                <Target className="h-5 w-5 mr-2" />
                Capture GPS Location
              </>
            )}
          </Button>

          {locationError && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{locationError}</span>
              </div>
            </div>
          )}

          {currentLocation && (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Latitude:</span>
                  <br />
                  <span className="font-mono">
                    {currentLocation.latitude.toFixed(6)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Longitude:</span>
                  <br />
                  <span className="font-mono">
                    {currentLocation.longitude.toFixed(6)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Accuracy:</span>
                  <br />
                  <span
                    className={`font-medium ${getAccuracyColor(currentLocation.accuracy)}`}
                  >
                    ±{currentLocation.accuracy.toFixed(1)}m (
                    {getAccuracyText(currentLocation.accuracy)})
                  </span>
                </div>
                <div>
                  <span className="font-medium">Time:</span>
                  <br />
                  <span className="text-xs">
                    {new Date(currentLocation.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Type Selection */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Work Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {WORK_TYPES.map((type) => (
              <Button
                key={type.id}
                variant={
                  currentEntry.workType === type.id ? "default" : "outline"
                }
                className="h-16 flex-col gap-1"
                onClick={() =>
                  setCurrentEntry((prev) => ({ ...prev, workType: type.id }))
                }
              >
                <span className="text-xl">{type.icon}</span>
                <span className="text-xs">{type.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe the work being performed..."
            value={currentEntry.description}
            onChange={(e) =>
              setCurrentEntry((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={3}
            className="text-base"
          />
        </CardContent>
      </Card>

      {/* Media Capture */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Photo Capture */}
          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              ref={photoInputRef}
              className="hidden"
            />
            <Button
              onClick={() => photoInputRef.current?.click()}
              variant="outline"
              className="w-full h-12"
            >
              <Camera className="h-5 w-5 mr-2" />
              Take Photos ({selectedPhotos.length})
            </Button>

            {selectedPhotos.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {selectedPhotos.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={
                        typeof window !== "undefined"
                          ? URL.createObjectURL(file)
                          : ""
                      }
                      alt={`Photo ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() =>
                        setSelectedPhotos((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audio Recording */}
          <div>
            <Button
              onClick={
                isRecordingAudio ? stopAudioRecording : startAudioRecording
              }
              variant={isRecordingAudio ? "destructive" : "outline"}
              className="w-full h-12"
            >
              <Mic
                className={`h-5 w-5 mr-2 ${isRecordingAudio ? "animate-pulse" : ""}`}
              />
              {isRecordingAudio ? "Stop Recording" : "Record Audio Note"}
              {currentEntry.audioNote && " ✓"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="fixed bottom-4 left-2 right-2">
        <Button
          onClick={saveEntry}
          disabled={!currentLocation || !currentEntry.workType}
          className="w-full h-14 text-lg"
        >
          <Save className="h-5 w-5 mr-2" />
          Save GPS Entry
          {!isConnected && " (Offline)"}
        </Button>
      </div>

      {/* Recent Entries */}
      {gpsEntries.length > 0 && (
        <Card className="mb-20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Recent Entries ({gpsEntries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gpsEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {WORK_TYPES.find((w) => w.id === entry.workType)?.name}
                    </span>
                    <Badge
                      variant={
                        entry.status === "synced" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {entry.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>
                      📍 {entry.coordinates.latitude.toFixed(6)},{" "}
                      {entry.coordinates.longitude.toFixed(6)}
                    </div>
                    <div>
                      📷 {entry.photos.length} photos{" "}
                      {entry.audioNote ? "🎤 Audio" : ""}
                    </div>
                    <div>🕒 {new Date(entry.timestamp).toLocaleString()}</div>
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

// Export with dynamic import to prevent SSR issues
export default dynamic(() => Promise.resolve(MobileGPSCollectorComponent), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 p-2 flex items-center justify-center">
      <div>Loading GPS Collector...</div>
    </div>
  ),
});
