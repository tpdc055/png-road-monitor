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
import {
  Activity,
  AlertTriangle,
  Clock,
  Filter,
  Fuel,
  MapPin,
  Navigation,
  RefreshCw,
  Search,
  Truck,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Vehicle {
  id: string;
  name: string;
  type: "excavator" | "truck" | "grader" | "roller" | "bulldozer";
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: "active" | "idle" | "maintenance" | "offline";
  speed: number;
  fuel: number;
  lastUpdate: string;
  driver: string;
  project: string;
}

// Mock GPS data for PNG road construction vehicles
const mockVehicles: Vehicle[] = [
  {
    id: "CAT001",
    name: "Excavator CAT 320",
    type: "excavator",
    location: {
      lat: -6.314993,
      lng: 143.95555,
      address: "Highlands Highway, Mt. Hagen, PNG",
    },
    status: "active",
    speed: 0,
    fuel: 75,
    lastUpdate: "2 minutes ago",
    driver: "John Kila",
    project: "Mt. Hagen-Kagamuga Road",
  },
  {
    id: "TRUCK002",
    name: "Dump Truck Volvo A40G",
    type: "truck",
    location: {
      lat: -9.4438,
      lng: 147.1803,
      address: "Hiritano Highway, Port Moresby, PNG",
    },
    status: "active",
    speed: 45,
    fuel: 60,
    lastUpdate: "1 minute ago",
    driver: "Maria Temu",
    project: "Port Moresby Ring Road",
  },
  {
    id: "GRADE003",
    name: "Motor Grader 140M3",
    type: "grader",
    location: {
      lat: -6.7924,
      lng: 146.997,
      address: "Ramu Highway, Lae, PNG",
    },
    status: "idle",
    speed: 0,
    fuel: 40,
    lastUpdate: "5 minutes ago",
    driver: "Peter Namaliu",
    project: "Lae-Nadzab Road Upgrade",
  },
  {
    id: "ROLL004",
    name: "Road Roller CS74B",
    type: "roller",
    location: {
      lat: -5.2085,
      lng: 145.7887,
      address: "Sepik Highway, Wewak, PNG",
    },
    status: "maintenance",
    speed: 0,
    fuel: 20,
    lastUpdate: "30 minutes ago",
    driver: "Sarah Waigani",
    project: "Wewak Coastal Road",
  },
  {
    id: "BULL005",
    name: "Bulldozer D6T",
    type: "bulldozer",
    location: {
      lat: -4.2599,
      lng: 152.1419,
      address: "Kokoda Track, Popondetta, PNG",
    },
    status: "offline",
    speed: 0,
    fuel: 85,
    lastUpdate: "2 hours ago",
    driver: "David Okuk",
    project: "Kokoda Memorial Road",
  },
];

const getStatusColor = (status: Vehicle["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "idle":
      return "bg-yellow-100 text-yellow-800";
    case "maintenance":
      return "bg-orange-100 text-orange-800";
    case "offline":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getVehicleIcon = (type: Vehicle["type"]) => {
  // Using Truck icon for all vehicle types for now
  return Truck;
};

export default function GPSMonitoring() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simulate real-time updates (optimized for performance)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only update active vehicles to reduce processing
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          if (vehicle.status === "active") {
            return {
              ...vehicle,
              speed: Math.floor(Math.random() * 60),
              fuel: Math.max(0, vehicle.fuel - Math.random() * 1), // Reduced fuel consumption rate
              lastUpdate: "Just now",
            };
          }
          return vehicle; // Return unchanged for inactive vehicles
        }),
      );
      setLastRefresh(new Date());
    }, 15000); // Update every 15 seconds (increased from 10 seconds)

    return () => clearInterval(interval);
  }, []); // Keep empty dependency array

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const refreshData = () => {
    setLastRefresh(new Date());
    // In a real app, this would fetch fresh GPS data
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            GPS Vehicle Tracking
          </h2>
          <p className="text-gray-600">
            Real-time monitoring of PNG road construction equipment
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity className="h-4 w-4 text-green-500" />
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="font-semibold text-green-600">
                  {vehicles.filter((v) => v.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Idle</p>
                <p className="font-semibold text-yellow-600">
                  {vehicles.filter((v) => v.status === "idle").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="font-semibold text-orange-600">
                  {vehicles.filter((v) => v.status === "maintenance").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Offline</p>
                <p className="font-semibold text-red-600">
                  {vehicles.filter((v) => v.status === "offline").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Vehicles</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by vehicle, driver, or project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="sm:w-48">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:w-32 flex items-end">
              <Button
                onClick={refreshData}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVehicles.map((vehicle) => {
          const VehicleIcon = getVehicleIcon(vehicle.type);
          return (
            <Card
              key={vehicle.id}
              className={`cursor-pointer transition-all ${
                selectedVehicle?.id === vehicle.id
                  ? "ring-2 ring-blue-500"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedVehicle(vehicle)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <VehicleIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                      <p className="text-sm text-gray-600">{vehicle.id}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status.charAt(0).toUpperCase() +
                      vehicle.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{vehicle.speed} km/h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{vehicle.fuel.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {vehicle.location.address}
                    </span>
                  </div>
                  <p className="text-sm">
                    <strong>Driver:</strong> {vehicle.driver}
                  </p>
                  <p className="text-sm">
                    <strong>Project:</strong> {vehicle.project}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last update: {vehicle.lastUpdate}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Selected Vehicle Details */}
      {selectedVehicle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {selectedVehicle.name} - Detailed Information
            </CardTitle>
            <CardDescription>
              Real-time GPS tracking and vehicle diagnostics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Location Details</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Coordinates:</strong>{" "}
                    {selectedVehicle.location.lat.toFixed(6)},{" "}
                    {selectedVehicle.location.lng.toFixed(6)}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedVehicle.location.address}
                  </p>
                  <p>
                    <strong>Current Speed:</strong> {selectedVehicle.speed} km/h
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Vehicle Status</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Fuel Level:</strong>{" "}
                    {selectedVehicle.fuel.toFixed(1)}%
                  </p>
                  <p>
                    <strong>Driver:</strong> {selectedVehicle.driver}
                  </p>
                  <p>
                    <strong>Assigned Project:</strong> {selectedVehicle.project}
                  </p>
                  <p>
                    <strong>Last Update:</strong> {selectedVehicle.lastUpdate}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Google Maps integration will be added
                next to show precise vehicle locations and routes on an
                interactive map.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
