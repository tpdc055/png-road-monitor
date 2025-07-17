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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  AlertTriangle,
  Calendar,
  Edit3,
  Eye,
  FileText,
  Heart,
  Leaf,
  Plus,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface HSEIncident {
  id: string;
  type: "safety" | "health" | "environmental";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  location: string;
  projectId: string;
  reportedBy: string;
  reportedDate: string;
  status: "open" | "investigating" | "resolved" | "closed";
  actions: string[];
}

interface SafetyMetric {
  id: string;
  metric: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  period: string;
}

export default function HSEReports() {
  const [activeTab, setActiveTab] = useState("overview");
  const [incidents, setIncidents] = useState<HSEIncident[]>([]);
  const [metrics, setMetrics] = useState<SafetyMetric[]>([]);
  const [showIncidentDialog, setShowIncidentDialog] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<HSEIncident | null>(
    null,
  );

  useEffect(() => {
    loadHSEData();
  }, []);

  const loadHSEData = () => {
    // Mock HSE data for PNG road construction
    const mockIncidents: HSEIncident[] = [
      {
        id: "HSE001",
        type: "safety",
        severity: "high",
        title: "Worker Fall from Height",
        description:
          "Worker fell from scaffolding during bridge construction work",
        location: "Mt. Hagen-Kagamuga Bridge Site",
        projectId: "PNG001",
        reportedBy: "John Kila",
        reportedDate: "2025-01-08",
        status: "investigating",
        actions: [
          "Site cordoned off",
          "Investigation team assigned",
          "Safety briefing scheduled",
        ],
      },
      {
        id: "HSE002",
        type: "environmental",
        severity: "medium",
        title: "Fuel Spill Near River",
        description:
          "Small diesel spill during equipment refueling near Markham River",
        location: "Lae-Nadzab Highway, km 15",
        projectId: "PNG003",
        reportedBy: "Maria Temu",
        reportedDate: "2025-01-07",
        status: "resolved",
        actions: [
          "Spill contained",
          "Cleanup completed",
          "Environmental assessment done",
        ],
      },
      {
        id: "HSE003",
        type: "health",
        severity: "low",
        title: "Heat Exhaustion Case",
        description:
          "Worker experienced heat exhaustion during afternoon shift",
        location: "Port Moresby Ring Road",
        projectId: "PNG002",
        reportedBy: "Peter Namaliu",
        reportedDate: "2025-01-06",
        status: "closed",
        actions: [
          "First aid provided",
          "Worker sent to clinic",
          "Additional shade structures installed",
        ],
      },
    ];

    const mockMetrics: SafetyMetric[] = [
      {
        id: "1",
        metric: "Lost Time Injury Rate",
        value: 2.3,
        target: 1.5,
        unit: "per 100,000 hours",
        trend: "down",
        period: "Q4 2024",
      },
      {
        id: "2",
        metric: "Near Miss Reports",
        value: 45,
        target: 40,
        unit: "reports",
        trend: "up",
        period: "December 2024",
      },
      {
        id: "3",
        metric: "Safety Training Hours",
        value: 1250,
        target: 1000,
        unit: "hours",
        trend: "up",
        period: "December 2024",
      },
      {
        id: "4",
        metric: "Environmental Compliance",
        value: 98,
        target: 95,
        unit: "%",
        trend: "stable",
        period: "Q4 2024",
      },
      {
        id: "5",
        metric: "PPE Compliance Rate",
        value: 94,
        target: 98,
        unit: "%",
        trend: "down",
        period: "December 2024",
      },
      {
        id: "6",
        metric: "Health Screenings Completed",
        value: 156,
        target: 150,
        unit: "screenings",
        trend: "up",
        period: "December 2024",
      },
    ];

    setIncidents(mockIncidents);
    setMetrics(mockMetrics);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "investigating":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up")
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down")
      return (
        <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />
      );
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "incidents", label: "Incidents", icon: AlertTriangle },
    { id: "safety", label: "Safety", icon: Shield },
    { id: "health", label: "Health", icon: Heart },
    { id: "environment", label: "Environment", icon: Leaf },
    { id: "training", label: "Training", icon: Users },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-gray-600">Open Incidents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-gray-600">
                  Days Without Accident
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-gray-600">Workers Trained</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Performance Metrics</CardTitle>
          <CardDescription>
            Key performance indicators for health, safety, and environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">{metric.metric}</div>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="text-2xl font-bold mb-1">
                  {metric.value} {metric.unit}
                </div>
                <div className="text-sm text-gray-600">
                  Target: {metric.target} {metric.unit}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {metric.period}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>
            Latest health, safety, and environmental incidents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidents.slice(0, 3).map((incident) => (
              <div key={incident.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium">{incident.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {incident.description}
                    </p>
                    <div className="text-xs text-gray-500 mt-2">
                      {incident.location} • {incident.reportedDate}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Incident Management</h3>
          <p className="text-gray-600">
            Track and manage health, safety, and environmental incidents
          </p>
        </div>
        <Dialog open={showIncidentDialog} onOpenChange={setShowIncidentDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Report New Incident</DialogTitle>
              <DialogDescription>
                Submit a new health, safety, or environmental incident report
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Incident Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="environmental">Environmental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Severity</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title</Label>
                <Input placeholder="Brief incident title" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Detailed description of the incident" />
              </div>
              <div>
                <Label>Location</Label>
                <Input placeholder="Incident location" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Submit Report</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowIncidentDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{incident.type}</Badge>
                  </TableCell>
                  <TableCell>{incident.title}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{incident.reportedDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderPlaceholder = (title: string, description: string) => (
    <Card>
      <CardContent className="p-12 text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Safety Incidents</div>
              <div className="text-xs text-green-600 mt-1">Target: 0</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">245</div>
              <div className="text-sm text-gray-600">Safety Training Hours</div>
              <div className="text-xs text-blue-600 mt-1">This month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-gray-600">PPE Compliance</div>
              <div className="text-xs text-orange-600 mt-1">Target: 95%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">15</div>
              <div className="text-sm text-gray-600">Environmental Audits</div>
              <div className="text-xs text-purple-600 mt-1">Completed</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "incidents":
        return renderIncidents();
      case "safety":
        return renderPlaceholder(
          "Safety Management",
          "Safety protocols, training records, and compliance tracking",
        );
      case "health":
        return renderPlaceholder(
          "Health Monitoring",
          "Worker health screenings, medical records, and wellness programs",
        );
      case "environment":
        return renderPlaceholder(
          "Environmental Management",
          "Environmental impact monitoring and compliance",
        );
      case "training":
        return renderPlaceholder(
          "Training Records",
          "Safety training schedules, certifications, and competency tracking",
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">HSE Reports</h2>
          <p className="text-gray-600">
            Health, Safety & Environment monitoring and reporting
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
