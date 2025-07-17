"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Camera,
  Download,
  Eye,
  Grid,
  Image as ImageIcon,
  List,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface PhotoFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  projectId?: string;
  gpsEntryId?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
}

interface PhotoUploadProps {
  onPhotosChange?: (photos: PhotoFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
  projectId?: string;
  gpsEntryId?: string;
  latitude?: number;
  longitude?: number;
  existingPhotos?: PhotoFile[];
}

export default function PhotoUploadComponent({
  onPhotosChange,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = {
    "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
  },
  projectId,
  gpsEntryId,
  latitude,
  longitude,
  existingPhotos = [],
}: PhotoUploadProps) {
  const [photos, setPhotos] = useState<PhotoFile[]>(existingPhotos);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoFile | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPhotos: PhotoFile[] = acceptedFiles.map((file) => ({
        id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        projectId,
        gpsEntryId,
        latitude,
        longitude,
      }));

      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);

      if (onPhotosChange) {
        onPhotosChange(updatedPhotos);
      }

      // Simulate upload progress
      newPhotos.forEach((photo) => {
        simulateUpload(photo.id);
      });
    },
    [photos, onPhotosChange, projectId, gpsEntryId, latitude, longitude],
  );

  const simulateUpload = (photoId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[photoId];
          return newProgress;
        });
      } else {
        setUploadProgress((prev) => ({
          ...prev,
          [photoId]: progress,
        }));
      }
    }, 200);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - photos.length,
    maxSize,
    multiple: true,
  });

  const removePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter((photo) => photo.id !== photoId);
    setPhotos(updatedPhotos);

    if (onPhotosChange) {
      onPhotosChange(updatedPhotos);
    }

    // Clean up object URL
    const photo = photos.find((p) => p.id === photoId);
    if (photo) {
      URL.revokeObjectURL(photo.preview);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const downloadPhoto = (photo: PhotoFile) => {
    const link = document.createElement("a");
    link.href = photo.preview;
    link.download = photo.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photo Upload & Management
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>
              {photos.length} / {maxFiles} photos
            </span>
            <span>Max size: {formatFileSize(maxSize)}</span>
          </div>
        </CardHeader>
        <CardContent>
          {photos.length < maxFiles && (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-600" />
                </div>
                {isDragActive ? (
                  <p className="text-blue-600 font-medium">
                    Drop photos here...
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-700 font-medium">
                      Drag & drop photos here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports JPEG, PNG, GIF, WebP • Max{" "}
                      {formatFileSize(maxSize)} per file
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Photo Gallery ({photos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={photo.preview}
                        alt={photo.name}
                        className="w-full h-full object-cover"
                      />
                      {uploadProgress[photo.id] && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <div className="text-sm">
                              {Math.round(uploadProgress[photo.id])}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => downloadPhoto(photo)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removePhoto(photo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium truncate">
                        {photo.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(photo.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={photo.preview}
                        alt={photo.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{photo.name}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>{formatFileSize(photo.size)}</span>
                        <span>{photo.type}</span>
                        <span>{photo.uploadedAt.toLocaleDateString()}</span>
                      </div>
                      {photo.latitude && photo.longitude && (
                        <p className="text-xs text-blue-600">
                          GPS: {photo.latitude.toFixed(6)},{" "}
                          {photo.longitude.toFixed(6)}
                        </p>
                      )}
                    </div>
                    {uploadProgress[photo.id] ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">
                          {Math.round(uploadProgress[photo.id])}%
                        </span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadPhoto(photo)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removePhoto(photo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">{selectedPhoto.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <img
                src={selectedPhoto.preview}
                alt={selectedPhoto.name}
                className="max-w-full max-h-96 mx-auto"
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Size:</strong> {formatFileSize(selectedPhoto.size)}
                </div>
                <div>
                  <strong>Type:</strong> {selectedPhoto.type}
                </div>
                <div>
                  <strong>Uploaded:</strong>{" "}
                  {selectedPhoto.uploadedAt.toLocaleDateString()}
                </div>
                {selectedPhoto.latitude && selectedPhoto.longitude && (
                  <div>
                    <strong>GPS:</strong> {selectedPhoto.latitude.toFixed(6)},{" "}
                    {selectedPhoto.longitude.toFixed(6)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
