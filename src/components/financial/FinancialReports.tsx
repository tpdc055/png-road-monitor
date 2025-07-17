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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileSpreadsheet,
  FileText,
  PieChart,
  Plus,
  Printer,
  Send,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: "financial" | "progress" | "variance" | "cash-flow" | "donor" | "audit";
  frequency: "weekly" | "monthly" | "quarterly" | "annual" | "on-demand";
  lastGenerated?: Date;
  recipients: string[];
}

interface FinancialReportsProps {
  projectId: string;
  projectName: string;
}

export default function FinancialReports({
  projectId,
  projectName,
}: FinancialReportsProps) {
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [activeTab, setActiveTab] = useState("standard");

  useEffect(() => {
    loadReportTemplates();
  }, [projectId]);

  const loadReportTemplates = () => {
    // Mock report templates
    const mockTemplates: ReportTemplate[] = [
      {
        id: "rpt1",
        name: "Monthly Financial Summary",
        description: "Comprehensive monthly financial performance report",
        type: "financial",
        frequency: "monthly",
        lastGenerated: new Date("2023-07-01"),
        recipients: [
          "project.manager@connectpng.com",
          "finance@connectpng.com",
        ],
      },
      {
        id: "rpt2",
        name: "Budget Variance Analysis",
        description: "Detailed analysis of budget vs actual spending",
        type: "variance",
        frequency: "monthly",
        lastGenerated: new Date("2023-07-01"),
        recipients: ["project.director@connectpng.com"],
      },
      {
        id: "rpt3",
        name: "Cash Flow Statement",
        description: "Monthly cash flow analysis and forecast",
        type: "cash-flow",
        frequency: "monthly",
        lastGenerated: new Date("2023-07-01"),
        recipients: ["finance@connectpng.com", "treasury@gov.pg"],
      },
      {
        id: "rpt4",
        name: "Donor Progress Report",
        description: "Progress and financial report for donor agencies",
        type: "donor",
        frequency: "quarterly",
        lastGenerated: new Date("2023-06-30"),
        recipients: ["adb@connectpng.com", "worldbank@connectpng.com"],
      },
      {
        id: "rpt5",
        name: "Physical vs Financial Progress",
        description: "Comparison of physical and financial progress",
        type: "progress",
        frequency: "monthly",
        lastGenerated: new Date("2023-07-01"),
        recipients: ["project.manager@connectpng.com"],
      },
      {
        id: "rpt6",
        name: "Audit Trail Report",
        description: "Detailed transaction and approval audit trail",
        type: "audit",
        frequency: "quarterly",
        lastGenerated: new Date("2023-06-30"),
        recipients: ["audit@gov.pg", "compliance@connectpng.com"],
      },
    ];

    setReportTemplates(mockTemplates);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "financial":
        return "bg-blue-100 text-blue-800";
      case "progress":
        return "bg-green-100 text-green-800";
      case "variance":
        return "bg-orange-100 text-orange-800";
      case "cash-flow":
        return "bg-purple-100 text-purple-800";
      case "donor":
        return "bg-indigo-100 text-indigo-800";
      case "audit":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "financial":
        return <DollarSign className="h-4 w-4" />;
      case "progress":
        return <TrendingUp className="h-4 w-4" />;
      case "variance":
        return <BarChart3 className="h-4 w-4" />;
      case "cash-flow":
        return <TrendingUp className="h-4 w-4" />;
      case "donor":
        return <FileText className="h-4 w-4" />;
      case "audit":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const generateReport = (reportId: string) => {
    const template = reportTemplates.find((t) => t.id === reportId);
    if (template) {
      // Update last generated date
      setReportTemplates((prev) =>
        prev.map((t) =>
          t.id === reportId ? { ...t, lastGenerated: new Date() } : t,
        ),
      );

      alert(`Generating ${template.name} for ${projectName}...`);
    }
  };

  const standardReports = [
    {
      title: "Executive Summary",
      description: "High-level financial overview for management",
      icon: <FileText className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Budget Performance Report",
      description: "Detailed budget vs actual analysis",
      icon: <BarChart3 className="h-8 w-8 text-green-500" />,
    },
    {
      title: "Cash Flow Analysis",
      description: "Comprehensive cash flow statement and forecast",
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
    },
    {
      title: "Variance Analysis Report",
      description: "Detailed variance analysis by category",
      icon: <PieChart className="h-8 w-8 text-orange-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Financial Reports</h3>
          <p className="text-gray-600">
            Generate and manage financial reports for {projectName}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="current-quarter">Current Quarter</SelectItem>
              <SelectItem value="current-year">Current Year</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="custom">Custom Period</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="standard">Standard Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {standardReports.map((report, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {report.icon}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {report.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {report.description}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Automated reports generated on a regular schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getTypeIcon(template.type)}
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-gray-600">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTypeColor(template.type)}>
                            {template.type}
                          </Badge>
                          <Badge variant="outline">{template.frequency}</Badge>
                          {template.lastGenerated && (
                            <span className="text-xs text-gray-500">
                              Last:{" "}
                              {template.lastGenerated.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => generateReport(template.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generate Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>
                Create custom reports with specific data and formatting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Custom Report Builder
                </h3>
                <p className="text-gray-600 mb-4">
                  Advanced report builder with custom data selection and
                  formatting options
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Build Custom Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Send className="h-6 w-6" />
              <span>Email Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Printer className="h-6 w-6" />
              <span>Print Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span>Schedule Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Recently generated reports and download history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Monthly Financial Summary - July 2023
                </span>
                <Badge variant="outline" className="text-xs">
                  PDF
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">2 hours ago</span>
                <Button size="sm" variant="outline" className="h-6 px-2">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Budget Variance Analysis - Q2 2023
                </span>
                <Badge variant="outline" className="text-xs">
                  Excel
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">1 day ago</span>
                <Button size="sm" variant="outline" className="h-6 px-2">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Donor Progress Report - ADB</span>
                <Badge variant="outline" className="text-xs">
                  PDF
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">3 days ago</span>
                <Button size="sm" variant="outline" className="h-6 px-2">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
