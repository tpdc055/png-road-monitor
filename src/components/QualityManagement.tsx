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
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Edit3,
  Eye,
  FileText,
  Layers,
  MapPin,
  Plus,
  TestTube,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface QualityInspection {
  id: string;
  inspectionType: "materials" | "workmanship" | "safety" | "environmental";
  title: string;
  description: string;
  location: string;
  projectId: string;
  projectName: string;
  inspector: string;
  date: string;
  status:
    | "scheduled"
    | "in_progress"
    | "completed"
    | "failed"
    | "rework_required";
  score: number;
  maxScore: number;
  findings: string[];
  recommendations: string[];
  photos: string[];
}

interface QualityTest {
  id: string;
  testType:
    | "compaction"
    | "moisture"
    | "strength"
    | "thickness"
    | "density"
    | "gradation";
  material: string;
  location: string;
  projectId: string;
  sampleId: string;
  testDate: string;
  result: "pass" | "fail" | "pending";
  actualValue: number;
  requiredValue: number;
  unit: string;
  technician: string;
  certified: boolean;
}

interface ComplianceItem {
  id: string;
  standard: string;
  category: string;
  description: string;
  status: "compliant" | "non_compliant" | "under_review";
  lastChecked: string;
  nextReview: string;
  responsible: string;
}

export default function QualityManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [inspections, setInspections] = useState<QualityInspection[]>([]);
  const [tests, setTests] = useState<QualityTest[]>([]);
  const [compliance, setCompliance] = useState<ComplianceItem[]>([]);
  const [showInspectionDialog, setShowInspectionDialog] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);

  useEffect(() => {
    loadQualityData();
  }, []);

  const loadQualityData = () => {
    // Mock quality data for PNG road construction
    const mockInspections: QualityInspection[] = [
      {
        id: "QI001",
        inspectionType: "materials",
        title: "Aggregate Quality Inspection",
        description:
          "Base course aggregate quality check for gradation and cleanliness",
        location: "Mt. Hagen-Kagamuga Road, Km 5.2",
        projectId: "PNG001",
        projectName: "Mt. Hagen-Kagamuga Road Upgrade",
        inspector: "James Kerenga",
        date: "2025-01-08",
        status: "completed",
        score: 92,
        maxScore: 100,
        findings: [
          "Aggregate meets PNG Works specification",
          "Minor oversized particles found",
          "Moisture content within limits",
        ],
        recommendations: ["Remove oversized particles", "Continue monitoring"],
        photos: [],
      },
      {
        id: "QI002",
        inspectionType: "workmanship",
        title: "Pavement Layer Compaction",
        description:
          "Check compaction quality and density of base course layer",
        location: "Port Moresby Ring Road, Section A",
        projectId: "PNG002",
        projectName: "Port Moresby Ring Road",
        inspector: "Sarah Mendi",
        date: "2025-01-07",
        status: "rework_required",
        score: 75,
        maxScore: 100,
        findings: [
          "Compaction below specification",
          "Uneven surface finish",
          "Good material quality",
        ],
        recommendations: [
          "Re-compact affected areas",
          "Check roller equipment",
          "Additional quality control",
        ],
        photos: [],
      },
      {
        id: "QI003",
        inspectionType: "safety",
        title: "Work Zone Safety Inspection",
        description:
          "Safety compliance check for traffic management and worker protection",
        location: "Lae-Nadzab Highway, Bridge Site",
        projectId: "PNG003",
        projectName: "Lae-Nadzab Highway Extension",
        inspector: "Peter Waigani",
        date: "2025-01-09",
        status: "in_progress",
        score: 0,
        maxScore: 100,
        findings: [],
        recommendations: [],
        photos: [],
      },
    ];

    const mockTests: QualityTest[] = [
      {
        id: "QT001",
        testType: "compaction",
        material: "Base Course Aggregate",
        location: "Mt. Hagen-Kagamuga Road, Km 5.2",
        projectId: "PNG001",
        sampleId: "MH-BC-001",
        testDate: "2025-01-08",
        result: "pass",
        actualValue: 98.5,
        requiredValue: 95,
        unit: "% Standard Proctor",
        technician: "Michael Popondetta",
        certified: true,
      },
      {
        id: "QT002",
        testType: "strength",
        material: "Concrete Cylinder",
        location: "Port Moresby Ring Road, Bridge",
        projectId: "PNG002",
        sampleId: "POM-CON-015",
        testDate: "2025-01-06",
        result: "fail",
        actualValue: 22.5,
        requiredValue: 25,
        unit: "MPa",
        technician: "Grace Vanimo",
        certified: true,
      },
      {
        id: "QT003",
        testType: "thickness",
        material: "Bituminous Surface",
        location: "Lae-Nadzab Highway, Km 12",
        projectId: "PNG003",
        sampleId: "LAE-BIT-008",
        testDate: "2025-01-07",
        result: "pending",
        actualValue: 0,
        requiredValue: 40,
        unit: "mm",
        technician: "John Kerema",
        certified: false,
      },
    ];

    const mockCompliance: ComplianceItem[] = [
      {
        id: "CP001",
        standard: "PNG Works Specification 2020",
        category: "Materials",
        description: "Aggregate gradation and quality standards",
        status: "compliant",
        lastChecked: "2025-01-05",
        nextReview: "2025-02-05",
        responsible: "Materials Engineer",
      },
      {
        id: "CP002",
        standard: "AS/NZS 3000:2018",
        category: "Safety",
        description: "Electrical installation standards for temporary works",
        status: "under_review",
        lastChecked: "2025-01-03",
        nextReview: "2025-01-17",
        responsible: "Safety Officer",
      },
      {
        id: "CP003",
        standard: "PNG Environmental Guidelines",
        category: "Environmental",
        description: "Waste management and environmental protection",
        status: "non_compliant",
        lastChecked: "2025-01-04",
        nextReview: "2025-01-11",
        responsible: "Environmental Officer",
      },
    ];

    setInspections(mockInspections);
    setTests(mockTests);
    setCompliance(mockCompliance);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "pass":
      case "compliant":
        return "bg-green-100 text-green-800";
      case "failed":
      case "fail":
      case "non_compliant":
        return "bg-red-100 text-red-800";
      case "in_progress":
      case "pending":
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-gray-100 text-gray-800";
      case "rework_required":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "pass":
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
      case "fail":
      case "non_compliant":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "in_progress":
      case "pending":
      case "under_review":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "rework_required":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "inspections", label: "Inspections", icon: CheckCircle },
    { id: "testing", label: "Material Testing", icon: TestTube },
    { id: "compliance", label: "Compliance", icon: Award },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{inspections.length}</div>
                <div className="text-sm text-gray-600">Total Inspections</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TestTube className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {tests.filter((t) => t.result === "pass").length}
                </div>
                <div className="text-sm text-gray-600">Tests Passed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (compliance.filter((c) => c.status === "compliant").length /
                      compliance.length) *
                      100,
                  )}
                  %
                </div>
                <div className="text-sm text-gray-600">Compliance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {inspections.length > 0
                    ? Math.round(
                        (inspections.reduce(
                          (sum, i) => sum + i.score / i.maxScore,
                          0,
                        ) /
                          inspections.length) *
                          100,
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm text-gray-600">Avg Quality Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inspections */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quality Inspections</CardTitle>
          <CardDescription>
            Latest quality control inspections across all projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inspections.slice(0, 3).map((inspection) => (
              <div key={inspection.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(inspection.status)}
                      <Badge className={getStatusColor(inspection.status)}>
                        {inspection.status.replace("_", " ")}
                      </Badge>
                      <Badge variant="secondary">
                        {inspection.inspectionType}
                      </Badge>
                    </div>
                    <h4 className="font-medium">{inspection.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {inspection.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {inspection.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {inspection.date}
                      </span>
                      {inspection.score > 0 && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {inspection.score}/{inspection.maxScore}
                        </span>
                      )}
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

      {/* Test Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Material Testing Summary</CardTitle>
          <CardDescription>
            Recent material test results and compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tests.slice(0, 3).map((test) => (
              <div key={test.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getStatusColor(test.result)}>
                    {test.result}
                  </Badge>
                  {test.certified && (
                    <Award className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <h4 className="font-medium text-sm">
                  {test.testType.toUpperCase()}
                </h4>
                <p className="text-xs text-gray-600">{test.material}</p>
                <div className="mt-2 text-xs">
                  <div>Sample: {test.sampleId}</div>
                  <div>Location: {test.location}</div>
                  {test.result !== "pending" && (
                    <div className="mt-1">
                      Result: {test.actualValue} {test.unit}
                      {test.result === "fail" && (
                        <span className="text-red-600">
                          {" "}
                          (Required: {test.requiredValue})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInspections = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Quality Inspections</h3>
          <p className="text-gray-600">
            Manage quality control inspections and assessments
          </p>
        </div>
        <Dialog
          open={showInspectionDialog}
          onOpenChange={setShowInspectionDialog}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Inspection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Inspection</DialogTitle>
              <DialogDescription>
                Create a new quality control inspection
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Inspection Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="materials">Materials</SelectItem>
                    <SelectItem value="workmanship">Workmanship</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="environmental">Environmental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title</Label>
                <Input placeholder="Inspection title" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Inspection description" />
              </div>
              <div>
                <Label>Location</Label>
                <Input placeholder="Inspection location" />
              </div>
              <div>
                <Label>Inspector</Label>
                <Input placeholder="Inspector name" />
              </div>
              <div>
                <Label>Scheduled Date</Label>
                <Input type="date" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Schedule</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowInspectionDialog(false)}
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
                <TableHead>Location</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">{inspection.id}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {inspection.inspectionType}
                    </Badge>
                  </TableCell>
                  <TableCell>{inspection.title}</TableCell>
                  <TableCell className="text-sm">
                    {inspection.location}
                  </TableCell>
                  <TableCell>{inspection.inspector}</TableCell>
                  <TableCell>{inspection.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(inspection.status)}>
                      {inspection.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {inspection.score > 0
                      ? `${inspection.score}/${inspection.maxScore}`
                      : "-"}
                  </TableCell>
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
              <div className="text-2xl font-bold text-green-600">96%</div>
              <div className="text-sm text-gray-600">Quality Score</div>
              <div className="text-xs text-green-600 mt-1">Above standard</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">23</div>
              <div className="text-sm text-gray-600">Inspections</div>
              <div className="text-xs text-blue-600 mt-1">This month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">Non-conformities</div>
              <div className="text-xs text-orange-600 mt-1">Resolved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Material Tests</div>
              <div className="text-xs text-purple-600 mt-1">Passed</div>
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
      case "inspections":
        return renderInspections();
      case "testing":
        return renderPlaceholder(
          "Material Testing",
          "Laboratory test results, sample tracking, and certification management",
        );
      case "compliance":
        return renderPlaceholder(
          "Compliance Management",
          "Standards compliance tracking, audit reports, and certification management",
        );
      case "reports":
        return renderPlaceholder(
          "Quality Reports",
          "Quality assurance reports, trending analysis, and documentation",
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Quality Management
          </h2>
          <p className="text-gray-600">
            Quality control, testing, and compliance management
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
