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
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Edit3,
  Eye,
  FileImage,
  FileSpreadsheet,
  FileText,
  Filter,
  Mail,
  MapPin,
  PieChart,
  Plus,
  RefreshCw,
  Send,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Report {
  id: string;
  title: string;
  type: "progress" | "financial" | "quality" | "safety" | "summary" | "custom";
  description: string;
  template: string;
  frequency: "manual" | "daily" | "weekly" | "monthly" | "quarterly";
  format: "pdf" | "excel" | "word" | "html";
  recipients: string[];
  lastGenerated: string;
  nextDue: string;
  status: "active" | "inactive" | "generating" | "failed";
  projectFilter?: string;
  dateRange: {
    start: string;
    end: string;
  };
  parameters: Record<string, any>;
}

interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  fields: string[];
  chartTypes: string[];
  defaultFormat: string;
  isCustomizable: boolean;
}

interface GeneratedReport {
  id: string;
  reportId: string;
  title: string;
  generatedDate: string;
  format: string;
  size: string;
  downloadUrl: string;
  status: "ready" | "expired" | "generating" | "failed";
}

export default function ReportsGenerator() {
  const [activeTab, setActiveTab] = useState("overview");
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(
    [],
  );
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = () => {
    // Mock reports data for PNG road construction
    const mockReports: Report[] = [
      {
        id: "RPT001",
        title: "Weekly Progress Report",
        type: "progress",
        description:
          "Comprehensive weekly progress report for all active projects",
        template: "TEMP001",
        frequency: "weekly",
        format: "pdf",
        recipients: ["manager@doworks.gov.pg", "director@doworks.gov.pg"],
        lastGenerated: "2025-01-06",
        nextDue: "2025-01-13",
        status: "active",
        dateRange: {
          start: "2024-12-30",
          end: "2025-01-06",
        },
        parameters: {
          includePhotos: true,
          includeFinancials: true,
          detailLevel: "summary",
        },
      },
      {
        id: "RPT002",
        title: "Monthly Financial Summary",
        type: "financial",
        description: "Monthly financial performance and budget analysis",
        template: "TEMP002",
        frequency: "monthly",
        format: "excel",
        recipients: ["finance@doworks.gov.pg", "treasury@doworks.gov.pg"],
        lastGenerated: "2025-01-01",
        nextDue: "2025-02-01",
        status: "active",
        dateRange: {
          start: "2024-12-01",
          end: "2024-12-31",
        },
        parameters: {
          includeBudgetVariance: true,
          includeForecast: true,
          currencyFormat: "PGK",
        },
      },
      {
        id: "RPT003",
        title: "Quality Assurance Report",
        type: "quality",
        description: "Quality control inspections and test results summary",
        template: "TEMP003",
        frequency: "monthly",
        format: "pdf",
        recipients: ["quality@doworks.gov.pg"],
        lastGenerated: "2025-01-01",
        nextDue: "2025-02-01",
        status: "generating",
        dateRange: {
          start: "2024-12-01",
          end: "2024-12-31",
        },
        parameters: {
          includeTestResults: true,
          includeNonCompliance: true,
          detailLevel: "detailed",
        },
      },
    ];

    const mockTemplates: ReportTemplate[] = [
      {
        id: "TEMP001",
        name: "Project Progress Template",
        category: "Progress Reports",
        description: "Standard template for project progress reporting",
        fields: [
          "Project Status",
          "Physical Progress",
          "Financial Progress",
          "Issues",
          "Next Actions",
        ],
        chartTypes: ["Progress Charts", "Gantt Charts", "Photos"],
        defaultFormat: "pdf",
        isCustomizable: true,
      },
      {
        id: "TEMP002",
        name: "Financial Analysis Template",
        category: "Financial Reports",
        description: "Comprehensive financial analysis and budget tracking",
        fields: [
          "Budget vs Actual",
          "Cash Flow",
          "Variance Analysis",
          "Forecasts",
        ],
        chartTypes: ["Bar Charts", "Line Charts", "Pie Charts"],
        defaultFormat: "excel",
        isCustomizable: true,
      },
      {
        id: "TEMP003",
        name: "Quality Control Template",
        category: "Quality Reports",
        description: "Quality inspections, test results, and compliance status",
        fields: [
          "Inspection Results",
          "Test Data",
          "Compliance Status",
          "Recommendations",
        ],
        chartTypes: [
          "Quality Trends",
          "Pass/Fail Charts",
          "Compliance Metrics",
        ],
        defaultFormat: "pdf",
        isCustomizable: false,
      },
      {
        id: "TEMP004",
        name: "Safety Performance Template",
        category: "Safety Reports",
        description: "Safety incidents, training, and compliance tracking",
        fields: [
          "Incident Reports",
          "Training Records",
          "Safety Metrics",
          "Action Items",
        ],
        chartTypes: [
          "Safety Trends",
          "Incident Analytics",
          "Training Progress",
        ],
        defaultFormat: "pdf",
        isCustomizable: true,
      },
    ];

    const mockGeneratedReports: GeneratedReport[] = [
      {
        id: "GEN001",
        reportId: "RPT001",
        title: "Weekly Progress Report - Week 1 2025",
        generatedDate: "2025-01-06",
        format: "pdf",
        size: "2.4 MB",
        downloadUrl: "/reports/weekly-progress-2025-w1.pdf",
        status: "ready",
      },
      {
        id: "GEN002",
        reportId: "RPT002",
        title: "Monthly Financial Summary - December 2024",
        generatedDate: "2025-01-01",
        format: "excel",
        size: "1.8 MB",
        downloadUrl: "/reports/financial-summary-2024-12.xlsx",
        status: "ready",
      },
      {
        id: "GEN003",
        reportId: "RPT003",
        title: "Quality Assurance Report - December 2024",
        generatedDate: "2025-01-08",
        format: "pdf",
        size: "3.2 MB",
        downloadUrl: "/reports/quality-assurance-2024-12.pdf",
        status: "generating",
      },
    ];

    setReports(mockReports);
    setTemplates(mockTemplates);
    setGeneratedReports(mockGeneratedReports);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "ready":
        return "bg-green-100 text-green-800";
      case "inactive":
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "generating":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "generating":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case "failed":
        return <Shield className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "progress":
        return <BarChart3 className="h-4 w-4" />;
      case "financial":
        return <DollarSign className="h-4 w-4" />;
      case "quality":
        return <CheckCircle className="h-4 w-4" />;
      case "safety":
        return <Shield className="h-4 w-4" />;
      case "summary":
        return <PieChart className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "excel":
        return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
      case "pdf":
        return <FileText className="h-4 w-4 text-red-600" />;
      case "word":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "html":
        return <FileImage className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "templates", label: "Templates", icon: Edit3 },
    { id: "generated", label: "Generated", icon: Download },
    { id: "schedule", label: "Schedule", icon: Calendar },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {reports.filter((r) => r.status === "active").length}
                </div>
                <div className="text-sm text-gray-600">Active Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {generatedReports.filter((r) => r.status === "ready").length}
                </div>
                <div className="text-sm text-gray-600">Ready for Download</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {
                    reports.filter(
                      (r) =>
                        new Date(r.nextDue) <=
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Due This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Edit3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{templates.length}</div>
                <div className="text-sm text-gray-600">Report Templates</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {["progress", "financial", "quality", "safety"].map((category) => {
          const categoryReports = reports.filter((r) => r.type === category);
          return (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {getReportTypeIcon(category)}
                  {category.charAt(0).toUpperCase() + category.slice(1)} Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Reports:</span>
                    <span className="font-medium">
                      {categoryReports.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active:</span>
                    <span className="font-medium text-green-600">
                      {
                        categoryReports.filter((r) => r.status === "active")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Generated:</span>
                    <span className="font-medium">
                      {categoryReports.length > 0
                        ? categoryReports[0].lastGenerated
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Generated Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Generated Reports</CardTitle>
          <CardDescription>
            Latest reports available for download
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generatedReports.slice(0, 5).map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {getFormatIcon(report.format)}
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Generated: {report.generatedDate}</span>
                      <span>Size: {report.size}</span>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {report.status === "ready" && (
                    <>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {report.status === "generating" && (
                    <Button variant="outline" size="sm" disabled>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Report Configuration</h3>
          <p className="text-gray-600">
            Configure and manage automated report generation
          </p>
        </div>
        <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Report</DialogTitle>
              <DialogDescription>
                Set up a new automated report
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Report Title</Label>
                <Input placeholder="Enter report title" />
              </div>
              <div>
                <Label>Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="progress">Progress Report</SelectItem>
                    <SelectItem value="financial">Financial Report</SelectItem>
                    <SelectItem value="quality">Quality Report</SelectItem>
                    <SelectItem value="safety">Safety Report</SelectItem>
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="custom">Custom Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Template</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Output Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="word">Word</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Recipients</Label>
                <Input placeholder="email1@example.com, email2@example.com" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Report description" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Create Report</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReportDialog(false)}
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
                <TableHead>Report</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Last Generated</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-gray-600">
                        {report.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getReportTypeIcon(report.type)}
                      <span className="capitalize">{report.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    {report.frequency}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFormatIcon(report.format)}
                      <span className="uppercase">{report.format}</span>
                    </div>
                  </TableCell>
                  <TableCell>{report.lastGenerated}</TableCell>
                  <TableCell>{report.nextDue}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Project Progress Report</h3>
                <p className="text-sm text-gray-600">
                  Weekly status across all projects
                </p>
                <Button
                  size="sm"
                  className="mt-2 bg-blue-600 hover:bg-blue-700"
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Financial Summary</h3>
                <p className="text-sm text-gray-600">
                  Budget utilization and expenditure
                </p>
                <Button
                  size="sm"
                  className="mt-2 bg-green-600 hover:bg-green-700"
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="font-semibold">HSE Compliance</h3>
                <p className="text-sm text-gray-600">
                  Safety and environmental metrics
                </p>
                <Button
                  size="sm"
                  className="mt-2 bg-orange-600 hover:bg-orange-700"
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "reports":
        return renderReports();
      case "templates":
        return renderPlaceholder(
          "Report Templates",
          "Manage report templates, customize layouts, and create new formats",
        );
      case "generated":
        return renderPlaceholder(
          "Generated Reports",
          "Browse, download, and manage previously generated reports",
        );
      case "schedule":
        return renderPlaceholder(
          "Report Scheduling",
          "Configure automated report generation schedules and notifications",
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
            Reports Generator
          </h2>
          <p className="text-gray-600">
            Generate comprehensive reports for project monitoring and analysis
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
