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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Filter,
  Map,
  MapPin,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import GPSLocationCapture from "./GPSLocationCapture";

interface GPSDataEntry {
  id?: string;
  date: string;
  project: string;
  province: string;
  district: string;
  phase: string;
  task: string;
  chainage: number;
  latitude: number;
  longitude: number;
  status: string;
  comments: string;
  userId?: string;
  isEditing?: boolean;
  isNew?: boolean;
}

interface GPSDataEntrySpreadsheetProps {
  projectId: string;
  projectName: string;
  userRole?: string;
}

const CONSTRUCTION_PHASES = [
  "Preliminary/Survey",
  "Earthworks",
  "Subbase & Base Construction",
  "Pavement & Sealing",
  "Ancillary Works",
  "Quality Assurance",
];

const PHASE_TASKS = {
  "Preliminary/Survey": [
    "Survey & Pegging",
    "Soil and Materials Investigation",
    "Environmental Assessment",
    "Site Clearance & Demarcation",
  ],
  Earthworks: [
    "Clearing & Grubbing",
    "Topsoil Stripping",
    "Embankment & Subgrade Preparation",
  ],
  "Subbase & Base Construction": ["Subbase Laying", "Basecourse Placement"],
  "Pavement & Sealing": [
    "Bitumen/Asphalt Laying",
    "Surface Sealing",
    "Drainage Construction",
    "Culvert & Gabion Installation",
  ],
  "Ancillary Works": [
    "Road Furniture Installation",
    "Road Markings",
    "Landscaping",
  ],
  "Quality Assurance": [
    "Inspection & Testing",
    "Rectification of Defects",
    "Final Approval & Handover",
  ],
};

const STATUS_OPTIONS = [
  "Completed",
  "In Progress",
  "Inspection Required",
  "Approved",
  "Rejected",
];

export default function GPSDataEntrySpreadsheet({
  projectId,
  projectName,
  userRole = "SITE_ENGINEER",
}: GPSDataEntrySpreadsheetProps) {
  const [entries, setEntries] = useState<GPSDataEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<GPSDataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: -6.314993,
    lng: 143.95555,
  }); // Mount Hagen default
  const [filters, setFilters] = useState({
    phase: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showGPSCapture, setShowGPSCapture] = useState(false);
  const [currentEditingEntry, setCurrentEditingEntry] = useState<string | null>(
    null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGPSEntries();
  }, [projectId]);

  useEffect(() => {
    applyFilters();
  }, [entries, filters]);

  const fetchGPSEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/gps-data-entries?projectId=${projectId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setEntries(data.data || []);
      } else {
        throw new Error("Failed to fetch GPS data entries");
      }
    } catch (error) {
      console.error("Error fetching GPS entries:", error);
      setError("Failed to load GPS data entries");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...entries];

    if (filters.phase !== "all") {
      filtered = filtered.filter((entry) => entry.phase === filters.phase);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((entry) => entry.status === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((entry) => entry.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter((entry) => entry.date <= filters.dateTo);
    }

    setFilteredEntries(filtered);
  };

  const addNewRow = () => {
    const newEntry: GPSDataEntry = {
      id: `new-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      project: projectName,
      province: "",
      district: "",
      phase: "",
      task: "",
      chainage: 0,
      latitude: 0,
      longitude: 0,
      status: "In Progress",
      comments: "",
      isEditing: true,
      isNew: true,
    };

    setEntries([newEntry, ...entries]);
    setEditingId(newEntry.id!);
  };

  const saveEntry = async (entry: GPSDataEntry) => {
    try {
      setSaving(true);

      // Validate required fields
      if (!entry.latitude || !entry.longitude || !entry.phase || !entry.task) {
        setError(
          "Please fill in all required fields (GPS coordinates, phase, and task)",
        );
        return;
      }

      const url = entry.isNew
        ? "/api/v1/gps-data-entries"
        : `/api/v1/gps-data-entries/${entry.id}`;
      const method = entry.isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          latitude: entry.latitude,
          longitude: entry.longitude,
          chainage: entry.chainage,
          workType: entry.task,
          status: entry.status,
          comments: entry.comments,
          entryDate: entry.date,
          phaseId: entry.phase, // This would need to be mapped to actual phase ID
          taskId: entry.task, // This would need to be mapped to actual task ID
        }),
      });

      if (response.ok) {
        const savedEntry = await response.json();

        if (entry.isNew) {
          // Replace the temporary entry with the saved one
          setEntries((prev) =>
            prev.map((e) =>
              e.id === entry.id
                ? { ...savedEntry.data, isEditing: false, isNew: false }
                : e,
            ),
          );
        } else {
          // Update existing entry
          setEntries((prev) =>
            prev.map((e) =>
              e.id === entry.id ? { ...entry, isEditing: false } : e,
            ),
          );
        }

        setEditingId(null);
        setSuccess("GPS entry saved successfully");
        setError(null);
      } else {
        throw new Error("Failed to save GPS entry");
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      setError("Failed to save GPS entry. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this GPS entry?")) {
      return;
    }

    try {
      const entry = entries.find((e) => e.id === entryId);

      if (entry?.isNew) {
        // Just remove from local state if it's a new unsaved entry
        setEntries((prev) => prev.filter((e) => e.id !== entryId));
        setEditingId(null);
        return;
      }

      const response = await fetch(`/api/v1/gps-data-entries/${entryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== entryId));
        setSuccess("GPS entry deleted successfully");
        setError(null);
      } else {
        throw new Error("Failed to delete GPS entry");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      setError("Failed to delete GPS entry. Please try again.");
    }
  };

  const updateEntry = (
    entryId: string,
    field: keyof GPSDataEntry,
    value: any,
  ) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const startEditing = (entryId: string) => {
    setEditingId(entryId);
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, isEditing: true } : entry,
      ),
    );
  };

  const cancelEditing = (entryId: string) => {
    const entry = entries.find((e) => e.id === entryId);

    if (entry?.isNew) {
      // Remove new unsaved entries
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
    } else {
      // Revert changes for existing entries
      setEntries((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, isEditing: false } : e)),
      );
    }

    setEditingId(null);
  };

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Project",
      "Province",
      "District",
      "Phase",
      "Task",
      "Chainage (km)",
      "Latitude",
      "Longitude",
      "Status",
      "Comments",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredEntries.map((entry) =>
        [
          entry.date,
          `"${entry.project}"`,
          `"${entry.province}"`,
          `"${entry.district}"`,
          `"${entry.phase}"`,
          `"${entry.task}"`,
          entry.chainage,
          entry.latitude,
          entry.longitude,
          `"${entry.status}"`,
          `"${entry.comments}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName}-gps-data-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split("\n");
        const headers = lines[0].split(",");

        // Basic CSV parsing - would need more robust parsing in production
        const newEntries: GPSDataEntry[] = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line, index) => {
            const values = line.split(",");
            return {
              id: `upload-${Date.now()}-${index}`,
              date: values[0] || new Date().toISOString().split("T")[0],
              project: projectName,
              province: values[2]?.replace(/"/g, "") || "",
              district: values[3]?.replace(/"/g, "") || "",
              phase: values[4]?.replace(/"/g, "") || "",
              task: values[5]?.replace(/"/g, "") || "",
              chainage: Number.parseFloat(values[6]) || 0,
              latitude: Number.parseFloat(values[7]) || 0,
              longitude: Number.parseFloat(values[8]) || 0,
              status: values[9]?.replace(/"/g, "") || "In Progress",
              comments: values[10]?.replace(/"/g, "") || "",
              isNew: true,
            };
          });

        setEntries((prev) => [...newEntries, ...prev]);
        setSuccess(`Uploaded ${newEntries.length} GPS entries from CSV`);
      } catch (error) {
        setError("Failed to parse CSV file. Please check the format.");
      }
    };

    reader.readAsText(file);
    event.target.value = ""; // Reset file input
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "inspection required":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleGPSLocationUpdate = (location: any) => {
    if (currentEditingEntry) {
      updateEntry(currentEditingEntry, "latitude", location.latitude);
      updateEntry(currentEditingEntry, "longitude", location.longitude);
      setSuccess(
        `GPS coordinates updated: ±${location.accuracy.toFixed(1)}m accuracy`,
      );
      setShowGPSCapture(false);
      setCurrentEditingEntry(null);
    }
  };

  const openGPSCapture = (entryId: string) => {
    setCurrentEditingEntry(entryId);
    setShowGPSCapture(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GPS data entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">GPS Data Entry</h2>
          <p className="text-gray-600 mt-1">
            Spreadsheet-style interface for daily GPS data entry and tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGPSCapture(!showGPSCapture)}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {showGPSCapture ? "Hide GPS" : "GPS Capture"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMap(!showMap)}
          >
            <Map className="h-4 w-4 mr-2" />
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button size="sm" onClick={addNewRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => setError(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => setSuccess(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Phase
              </label>
              <Select
                value={filters.phase}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, phase: value }))
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  {CONSTRUCTION_PHASES.map((phase) => (
                    <SelectItem key={phase} value={phase}>
                      {phase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                From Date
              </label>
              <Input
                type="date"
                className="h-8"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                To Date
              </label>
              <Input
                type="date"
                className="h-8"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GPS Location Capture */}
      {showGPSCapture && (
        <GPSLocationCapture
          onLocationUpdate={handleGPSLocationUpdate}
          autoCapture={false}
          showMap={false}
        />
      )}

      {/* Map View */}
      {showMap && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              GPS Points Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Map View
                </h3>
                <p className="text-gray-500">
                  Interactive map showing GPS points and road progress
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {
                    filteredEntries.filter((e) => e.latitude && e.longitude)
                      .length
                  }{" "}
                  GPS points recorded
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spreadsheet Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              GPS Data Entries ({filteredEntries.length} records)
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchGPSEntries}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Province
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    District
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Phase
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Chainage (km)
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Latitude
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Longitude
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Comments
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className={entry.isNew ? "bg-blue-50" : ""}
                  >
                    {/* Date */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {entry.isEditing ? (
                        <Input
                          type="date"
                          value={entry.date}
                          onChange={(e) =>
                            updateEntry(entry.id!, "date", e.target.value)
                          }
                          className="h-7 text-xs"
                        />
                      ) : (
                        entry.date
                      )}
                    </td>

                    {/* Province */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {entry.isEditing ? (
                        <Input
                          value={entry.province}
                          onChange={(e) =>
                            updateEntry(entry.id!, "province", e.target.value)
                          }
                          className="h-7 text-xs"
                          placeholder="Province"
                        />
                      ) : (
                        entry.province || "-"
                      )}
                    </td>

                    {/* District */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {entry.isEditing ? (
                        <Input
                          value={entry.district}
                          onChange={(e) =>
                            updateEntry(entry.id!, "district", e.target.value)
                          }
                          className="h-7 text-xs"
                          placeholder="District"
                        />
                      ) : (
                        entry.district || "-"
                      )}
                    </td>

                    {/* Phase */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {entry.isEditing ? (
                        <Select
                          value={entry.phase}
                          onValueChange={(value) => {
                            updateEntry(entry.id!, "phase", value);
                            updateEntry(entry.id!, "task", ""); // Reset task when phase changes
                          }}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder="Select phase" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONSTRUCTION_PHASES.map((phase) => (
                              <SelectItem key={phase} value={phase}>
                                {phase}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        entry.phase || "-"
                      )}
                    </td>

                    {/* Task */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {entry.isEditing ? (
                        <Select
                          value={entry.task}
                          onValueChange={(value) =>
                            updateEntry(entry.id!, "task", value)
                          }
                          disabled={!entry.phase}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder="Select task" />
                          </SelectTrigger>
                          <SelectContent>
                            {entry.phase &&
                              PHASE_TASKS[
                                entry.phase as keyof typeof PHASE_TASKS
                              ]?.map((task) => (
                                <SelectItem key={task} value={task}>
                                  {task}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        entry.task || "-"
                      )}
                    </td>

                    {/* Chainage */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {entry.isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.chainage}
                          onChange={(e) =>
                            updateEntry(
                              entry.id!,
                              "chainage",
                              Number.parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-7 text-xs"
                          placeholder="0.00"
                        />
                      ) : (
                        entry.chainage.toFixed(2)
                      )}
                    </td>

                    {/* Latitude */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {entry.isEditing ? (
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            step="0.000001"
                            value={entry.latitude}
                            onChange={(e) =>
                              updateEntry(
                                entry.id!,
                                "latitude",
                                Number.parseFloat(e.target.value) || 0,
                              )
                            }
                            className="h-7 text-xs"
                            placeholder="-6.314993"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openGPSCapture(entry.id!)}
                            className="h-7 w-7 p-0"
                            title="Capture GPS"
                          >
                            <MapPin className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        entry.latitude.toFixed(6)
                      )}
                    </td>

                    {/* Longitude */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {entry.isEditing ? (
                        <Input
                          type="number"
                          step="0.000001"
                          value={entry.longitude}
                          onChange={(e) =>
                            updateEntry(
                              entry.id!,
                              "longitude",
                              Number.parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-7 text-xs"
                          placeholder="143.95555"
                        />
                      ) : (
                        entry.longitude.toFixed(6)
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {entry.isEditing ? (
                        <Select
                          value={entry.status}
                          onValueChange={(value) =>
                            updateEntry(entry.id!, "status", value)
                          }
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          className={`text-xs ${getStatusColor(entry.status)}`}
                        >
                          {entry.status}
                        </Badge>
                      )}
                    </td>

                    {/* Comments */}
                    <td className="px-3 py-2 text-sm">
                      {entry.isEditing ? (
                        <Input
                          value={entry.comments}
                          onChange={(e) =>
                            updateEntry(entry.id!, "comments", e.target.value)
                          }
                          className="h-7 text-xs"
                          placeholder="Add comments..."
                        />
                      ) : (
                        <div
                          className="max-w-32 truncate"
                          title={entry.comments}
                        >
                          {entry.comments || "-"}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <div className="flex gap-1">
                        {entry.isEditing ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => saveEntry(entry)}
                              disabled={saving}
                              className="h-6 w-6 p-0"
                            >
                              {saving ? (
                                <Clock className="h-3 w-3" />
                              ) : (
                                <Save className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => cancelEditing(entry.id!)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(entry.id!)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteEntry(entry.id!)}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No GPS data entries found</p>
                <p className="text-sm">
                  Click "Add Row" to create your first entry
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
