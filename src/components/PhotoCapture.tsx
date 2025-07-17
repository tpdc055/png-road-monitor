"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  Image,
  Download,
  Trash2,
  MapPin,
  Clock,
  FileImage,
  Upload,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface PhotoData {
  id: string;
  file: File;
  preview: string;
  timestamp: string;
  gpsData?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  description?: string;
  category?: string;
}

interface PhotoCaptureProps {
  gpsPosition?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  onPhotosCapture: (photos: PhotoData[]) => void;
  maxPhotos?: number;
  categories?: string[];
}

export default function PhotoCapture({
  gpsPosition,
  onPhotosCapture,
  maxPhotos = 5,
  categories = ['Before Work', 'During Work', 'After Work', 'Quality Check', 'Issue/Problem', 'Equipment', 'Other']
}: PhotoCaptureProps) {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        addPhoto(file);
      }
    }, 'image/jpeg', 0.9);
  };

  const addPhoto = (file: File) => {
    if (photos.length >= maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    const preview = URL.createObjectURL(file);
    const photoData: PhotoData = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview,
      timestamp: new Date().toISOString(),
      gpsData: gpsPosition,
      description: '',
      category: categories[0]
    };

    setPhotos(prev => [...prev, photoData]);
    setSelectedPhoto(photoData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        addPhoto(file);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => {
      const updated = prev.filter(p => p.id !== photoId);
      const removedPhoto = prev.find(p => p.id === photoId);
      if (removedPhoto) {
        URL.revokeObjectURL(removedPhoto.preview);
      }
      return updated;
    });

    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null);
    }
  };

  const updatePhotoData = (photoId: string, updates: Partial<PhotoData>) => {
    setPhotos(prev => prev.map(photo =>
      photo.id === photoId ? { ...photo, ...updates } : photo
    ));

    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const downloadPhoto = (photo: PhotoData) => {
    const link = document.createElement('a');
    link.href = photo.preview;
    link.download = `${photo.category || 'photo'}_${photo.timestamp.split('T')[0]}.jpg`;
    link.click();
  };

  const handleSavePhotos = () => {
    if (photos.length === 0) {
      alert('No photos to save');
      return;
    }

    onPhotosCapture(photos);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Site Photo Documentation
        </CardTitle>
        <CardDescription>
          Capture photos with GPS coordinates for construction progress documentation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* GPS Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">GPS Status:</span>
          </div>
          {gpsPosition ? (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="mr-1 h-3 w-3" />
              GPS Active (±{gpsPosition.accuracy.toFixed(1)}m)
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertTriangle className="mr-1 h-3 w-3" />
              No GPS Data
            </Badge>
          )}
        </div>

        {/* Camera Controls */}
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {!isCameraActive ? (
              <Button onClick={startCamera} className="flex-1">
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </Button>
            ) : (
              <>
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  Stop Camera
                </Button>
              </>
            )}

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Photos
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Camera Preview */}
        {isCameraActive && (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-64 bg-black rounded-lg object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Captured Photos ({photos.length}/{maxPhotos})</h3>
              <Button onClick={handleSavePhotos} size="sm">
                <FileImage className="mr-2 h-4 w-4" />
                Save All Photos
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className={`relative cursor-pointer border-2 rounded-lg overflow-hidden ${
                    selectedPhoto?.id === photo.id ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.preview}
                    alt="Captured"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(photo.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2">
                    <div className="text-xs truncate">{photo.category}</div>
                    <div className="text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(photo.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photo Details Editor */}
        {selectedPhoto && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Photo Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <img
                    src={selectedPhoto.preview}
                    alt="Selected"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={selectedPhoto.category}
                      onChange={(e) => updatePhotoData(selectedPhoto.id, { category: e.target.value })}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={selectedPhoto.description}
                      onChange={(e) => updatePhotoData(selectedPhoto.id, { description: e.target.value })}
                      placeholder="Describe what this photo shows..."
                      className="mt-1"
                    />
                  </div>

                  {selectedPhoto.gpsData && (
                    <div className="text-sm space-y-1">
                      <div className="font-medium">GPS Coordinates:</div>
                      <div className="font-mono">
                        {selectedPhoto.gpsData.latitude.toFixed(6)}, {selectedPhoto.gpsData.longitude.toFixed(6)}
                      </div>
                      <div>Accuracy: ±{selectedPhoto.gpsData.accuracy.toFixed(1)}m</div>
                    </div>
                  )}

                  <div className="text-sm">
                    <div className="font-medium">Timestamp:</div>
                    <div>{new Date(selectedPhoto.timestamp).toLocaleString()}</div>
                  </div>

                  <Button
                    onClick={() => downloadPhoto(selectedPhoto)}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Photo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">Photo Documentation Tips:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Ensure GPS is active before taking photos for accurate location data</li>
              <li>Take photos from multiple angles to document progress thoroughly</li>
              <li>Add clear descriptions to help with later identification</li>
              <li>Use appropriate categories for better organization</li>
              <li>Photos are automatically timestamped and geo-tagged</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
