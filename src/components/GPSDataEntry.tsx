"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Save,
  Upload,
  Download,
  Eye,
  Camera,
  Database,
  AlertTriangle,
  CheckCircle,
  Map as MapIcon,
  FileText,
  Plus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Import our enhanced components
import GPSCapture from './GPSCapture';
import GPSMap from './GPSMap';
import BulkImport from './BulkImport';
import PhotoCapture from './PhotoCapture';
import DataViewer from './DataViewer';

interface GPSPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

interface GPSDataEntry {
  id: string;
  latitude: number;
  longitude: number;
  chainage: number;
  workType: string;
  status: string;
  comments?: string;
  entryDate: string;
  accuracy?: number;
  userId: string;
  userName?: string;
  projectId: string;
  projectName?: string;
  phaseId?: string;
  taskId?: string;
}

interface PhotoData {
  id: string;
  file: File;
  preview: string;
  timestamp: string;
  gpsData?: GPSPosition;
  description?: string;
  category?: string;
}

interface Project {
  id: string;
  name: string;
  location: string;
  status: string;
}

const workTypes = [
  'Earthworks',
  'Pavement',
  'Bridges',
  'Drainage',
  'Utilities',
  'Landscaping',
  'Quality Control',
  'Safety Inspection',
  'Other'
];

const statusOptions = [
  'IN_PROGRESS',
  'COMPLETED',
  'INSPECTION_REQUIRED',
  'APPROVED',
  'REJECTED'
];

export default function GPSDataEntry() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('capture');
  const [currentPosition, setCurrentPosition] = useState<GPSPosition | null>(null);
  const [gpsEntries, setGpsEntries] = useState<GPSDataEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    projectId: '',
    phaseId: '',
    taskId: '',
    workType: '',
    status: 'IN_PROGRESS',
    chainage: '',
    comments: ''
  });

  const [capturedPhotos, setCapturedPhotos] = useState<PhotoData[]>([]);

  // Load initial data
  useEffect(() => {
    loadProjects();
    loadGPSEntries();
  }, []);

  const loadProjects = async () => {
    try {
      // Mock API call - replace with actual API
      const response = await fetch('/api/v1/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const loadGPSEntries = async () => {
    try {
      setIsLoading(true);
      // Mock API call - replace with actual API
      const response = await fetch('/api/v1/gps-data-entries');
      if (response.ok) {
        const data = await response.json();
        setGpsEntries(data);
      }
    } catch (err) {
      console.error('Failed to load GPS entries:', err);
      setError('Failed to load GPS data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationCapture = (position: GPSPosition) => {
    setCurrentPosition(position);
    setError(null);
  };

  const handleFormSubmit = async () => {
    if (!currentPosition) {
      setError('Please capture GPS location first');
      return;
    }

    if (!formData.projectId || !formData.workType || !formData.chainage) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);

      const newEntry: Omit<GPSDataEntry, 'id' | 'entryDate' | 'userName' | 'projectName'> = {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        chainage: Number.parseFloat(formData.chainage),
        workType: formData.workType,
        status: formData.status,
        comments: formData.comments,
        accuracy: currentPosition.accuracy,
        userId: user?.id || '',
        projectId: formData.projectId,
        phaseId: formData.phaseId || undefined,
        taskId: formData.taskId || undefined
      };

      // Mock API call - replace with actual API
      const response = await fetch('/api/v1/gps-data-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry)
      });

      if (response.ok) {
        const savedEntry = await response.json();
        setGpsEntries(prev => [savedEntry, ...prev]);

        // Reset form
        setFormData({
          projectId: formData.projectId, // Keep project selected
          phaseId: '',
          taskId: '',
          workType: '',
          status: 'IN_PROGRESS',
          chainage: '',
          comments: ''
        });

        // Clear photos after successful save
        setCapturedPhotos([]);

        setError(null);
        alert('GPS data entry saved successfully!');
      } else {
        throw new Error('Failed to save GPS entry');
      }
    } catch (err) {
      console.error('Save failed:', err);
      setError('Failed to save GPS data entry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkImport = async (data: any[]) => {
    try {
      setIsLoading(true);

      // Mock API call - replace with actual API
      const response = await fetch('/api/v1/gps-data-entries/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const importedEntries = await response.json();
        setGpsEntries(prev => [...importedEntries, ...prev]);
        alert(`Successfully imported ${data.length} GPS entries!`);
        setActiveTab('view'); // Switch to view tab to see imported data
      } else {
        throw new Error('Bulk import failed');
      }
    } catch (err) {
      console.error('Bulk import failed:', err);
      setError('Failed to import GPS data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotosCapture = (photos: PhotoData[]) => {
    setCapturedPhotos(photos);
    alert(`Captured ${photos.length} photos with GPS coordinates!`);
  };

  const handleEditEntry = (entry: GPSDataEntry) => {
    setFormData({
      projectId: entry.projectId,
      phaseId: entry.phaseId || '',
      taskId: entry.taskId || '',
      workType: entry.workType,
      status: entry.status,
      chainage: entry.chainage.toString(),
      comments: entry.comments || ''
    });

    setCurrentPosition({
      latitude: entry.latitude,
      longitude: entry.longitude,
      accuracy: entry.accuracy || 10,
      timestamp: Date.now()
    });

    setActiveTab('capture');
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this GPS entry?')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/gps-data-entries/${entryId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setGpsEntries(prev => prev.filter(entry => entry.id !== entryId));
        alert('GPS entry deleted successfully');
      } else {
        throw new Error('Failed to delete entry');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete GPS entry');
    }
  };

  const handleViewEntry = (entry: GPSDataEntry) => {
    setCurrentPosition({
      latitude: entry.latitude,
      longitude: entry.longitude,
      accuracy: entry.accuracy || 10,
      timestamp: Date.now()
    });
    setActiveTab('map');
  };

  const mapCenter = currentPosition ? {
    lat: currentPosition.latitude,
    lng: currentPosition.longitude
  } : undefined;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-6 w-6" />
            Enhanced GPS Data Entry System
          </CardTitle>
          <CardDescription>
            Comprehensive GPS data collection with real-time positioning, mapping, bulk import, and photo documentation
          </CardDescription>
        </CardHeader>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="capture" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            GPS Capture
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapIcon className="h-4 w-4" />
            Map View
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Import
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Photos
          </TabsTrigger>
          <TabsTrigger value="view" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Viewer
          </TabsTrigger>
        </TabsList>

        {/* GPS Capture Tab */}
        <TabsContent value="capture" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <GPSCapture
                onLocationCapture={handleLocationCapture}
                isCapturing={false}
                showAccuracy={true}
                minAccuracy={10}
              />

              {/* Data Entry Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    GPS Data Entry Form
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project">Project *</Label>
                      <Select
                        value={formData.projectId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map(project => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="workType">Work Type *</Label>
                      <Select
                        value={formData.workType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, workType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select work type" />
                        </SelectTrigger>
                        <SelectContent>
                          {workTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="chainage">Chainage (km) *</Label>
                      <Input
                        id="chainage"
                        type="number"
                        step="0.001"
                        placeholder="e.g., 1.500"
                        value={formData.chainage}
                        onChange={(e) => setFormData(prev => ({ ...prev, chainage: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status} value={status}>
                              {status.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      placeholder="Additional notes about this GPS point..."
                      value={formData.comments}
                      onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                    />
                  </div>

                  {currentPosition && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">GPS Position Captured</span>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <div>Coordinates: {currentPosition.latitude.toFixed(6)}, {currentPosition.longitude.toFixed(6)}</div>
                        <div>Accuracy: ±{currentPosition.accuracy.toFixed(1)}m</div>
                        <div>Time: {new Date(currentPosition.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleFormSubmit}
                    disabled={!currentPosition || isLoading}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save GPS Entry'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div>
              {/* Quick Stats */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{gpsEntries.length}</div>
                      <div className="text-sm text-gray-600">Total Entries</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {gpsEntries.filter(e => e.status === 'COMPLETED').length}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {gpsEntries.filter(e => e.status === 'IN_PROGRESS').length}
                      </div>
                      <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Entries */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent GPS Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {gpsEntries.slice(0, 10).map(entry => (
                      <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{entry.workType}</div>
                          <div className="text-sm text-gray-600">
                            {entry.chainage.toFixed(3)} km • {new Date(entry.entryDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{entry.status}</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewEntry(entry)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Map View Tab */}
        <TabsContent value="map">
          <GPSMap
            gpsPoints={gpsEntries.map(entry => ({
              id: entry.id,
              latitude: entry.latitude,
              longitude: entry.longitude,
              accuracy: entry.accuracy,
              timestamp: entry.entryDate,
              workType: entry.workType,
              status: entry.status,
              comments: entry.comments,
              chainage: entry.chainage
            }))}
            currentPosition={mapCenter}
            showAccuracyCircles={true}
            showRoute={true}
          />
        </TabsContent>

        {/* Bulk Import Tab */}
        <TabsContent value="import">
          <BulkImport
            projectId={formData.projectId}
            userId={user?.id || ''}
            onImport={handleBulkImport}
            onCancel={() => setActiveTab('capture')}
          />
        </TabsContent>

        {/* Photo Capture Tab */}
        <TabsContent value="photos">
          <PhotoCapture
            gpsPosition={currentPosition || undefined}
            onPhotosCapture={handlePhotosCapture}
            maxPhotos={10}
          />
        </TabsContent>

        {/* Data Viewer Tab */}
        <TabsContent value="view">
          <DataViewer
            data={gpsEntries}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
            onView={handleViewEntry}
            onRefresh={loadGPSEntries}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
