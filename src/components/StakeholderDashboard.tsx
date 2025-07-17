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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Briefcase,
  Building,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Flag,
  Globe,
  Mail,
  MapPin,
  Network,
  Phone,
  PieChart,
  Plus,
  Search,
  Send,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface StakeholderDashboardProps {
  userRole: string;
  entityType: string;
  entityId: string;
  userName: string;
}

// Dashboard configurations for different stakeholder types
const STAKEHOLDER_DASHBOARDS = {
  CENTRAL_GOVERNMENT: {
    title: "Central Government Dashboard",
    subtitle: "Connect PNG Program Overview and Management",
    primaryColor: "bg-blue-600",
    metrics: [
      {
        label: "Total Program Budget",
        value: "K 1.85B",
        change: "+12%",
        icon: DollarSign,
      },
      { label: "Active Projects", value: "47", change: "+8%", icon: Building2 },
      {
        label: "Provinces Covered",
        value: "22/22",
        change: "100%",
        icon: MapPin,
      },
      {
        label: "Overall Progress",
        value: "68%",
        change: "+5%",
        icon: TrendingUp,
      },
    ],
    quickActions: [
      {
        label: "View Program Summary",
        action: "program-summary",
        icon: BarChart3,
      },
      {
        label: "Generate Executive Report",
        action: "executive-report",
        icon: FileText,
      },
      {
        label: "Review Budget Status",
        action: "budget-status",
        icon: DollarSign,
      },
      {
        label: "Provincial Updates",
        action: "provincial-updates",
        icon: MapPin,
      },
    ],
    views: [
      "Program Overview",
      "Financial Summary",
      "Provincial Status",
      "Donor Relations",
      "Parliamentary Reports",
      "Cabinet Submissions",
    ],
  },
  PROVINCIAL_DISTRICT: {
    title: "Provincial/District Dashboard",
    subtitle: "Local Infrastructure Development and Community Engagement",
    primaryColor: "bg-green-600",
    metrics: [
      { label: "Local Projects", value: "8", change: "+2%", icon: Building2 },
      {
        label: "Budget Allocated",
        value: "K 125M",
        change: "+15%",
        icon: DollarSign,
      },
      { label: "Completion Rate", value: "72%", change: "+8%", icon: Target },
      {
        label: "Community Feedback",
        value: "156",
        change: "+12%",
        icon: Users,
      },
    ],
    quickActions: [
      {
        label: "Project Progress Update",
        action: "progress-update",
        icon: TrendingUp,
      },
      {
        label: "Community Feedback",
        action: "community-feedback",
        icon: Users,
      },
      {
        label: "Contractor Coordination",
        action: "contractor-coord",
        icon: Building,
      },
      {
        label: "Maintenance Planning",
        action: "maintenance-plan",
        icon: Settings,
      },
    ],
    views: [
      "Project Progress",
      "Local Contractors",
      "Community Engagement",
      "Maintenance Needs",
      "District Reports",
      "Local Workforce",
    ],
  },
  INTERNATIONAL_DONORS: {
    title: "Development Partner Dashboard",
    subtitle: "Portfolio Monitoring and Results Framework",
    primaryColor: "bg-purple-600",
    metrics: [
      {
        label: "Portfolio Value",
        value: "K 890M",
        change: "+18%",
        icon: DollarSign,
      },
      {
        label: "Disbursement Rate",
        value: "76%",
        change: "+12%",
        icon: TrendingUp,
      },
      {
        label: "Active Investments",
        value: "23",
        change: "+5%",
        icon: Building2,
      },
      { label: "Impact Score", value: "4.2/5", change: "+0.3", icon: Target },
    ],
    quickActions: [
      {
        label: "Portfolio Review",
        action: "portfolio-review",
        icon: BarChart3,
      },
      {
        label: "Disbursement Request",
        action: "disbursement-request",
        icon: DollarSign,
      },
      {
        label: "Results Measurement",
        action: "results-measurement",
        icon: Target,
      },
      {
        label: "Safeguards Monitoring",
        action: "safeguards-monitor",
        icon: Shield,
      },
    ],
    views: [
      "Portfolio Overview",
      "Disbursement Tracking",
      "Results Framework",
      "Risk Management",
      "Safeguards Compliance",
      "Impact Assessment",
    ],
  },
  BILATERAL_PARTNERS: {
    title: "Bilateral Partnership Dashboard",
    subtitle: "Technical Cooperation and Development Programs",
    primaryColor: "bg-orange-600",
    metrics: [
      { label: "Partnership Programs", value: "12", change: "+3%", icon: Flag },
      {
        label: "Technical Assistance",
        value: "K 45M",
        change: "+22%",
        icon: Users,
      },
      {
        label: "Capacity Building",
        value: "89%",
        change: "+15%",
        icon: TrendingUp,
      },
      {
        label: "Knowledge Transfer",
        value: "156",
        change: "+28%",
        icon: Network,
      },
    ],
    quickActions: [
      { label: "Program Coordination", action: "program-coord", icon: Network },
      { label: "Technical Support", action: "tech-support", icon: Users },
      { label: "Partnership Review", action: "partnership-review", icon: Flag },
      { label: "Diplomatic Brief", action: "diplomatic-brief", icon: FileText },
    ],
    views: [
      "Partnership Programs",
      "Technical Support",
      "Knowledge Transfer",
      "Diplomatic Relations",
      "Cooperation Reports",
      "Joint Initiatives",
    ],
  },
  CONTRACTORS_CONSULTANTS: {
    title: "Contractor Dashboard",
    subtitle: "Project Execution and Quality Management",
    primaryColor: "bg-yellow-600",
    metrics: [
      { label: "Active Contracts", value: "5", change: "+1%", icon: Building2 },
      {
        label: "Progress Score",
        value: "84%",
        change: "+6%",
        icon: TrendingUp,
      },
      {
        label: "Payment Status",
        value: "Current",
        change: "On-time",
        icon: DollarSign,
      },
      {
        label: "Quality Rating",
        value: "4.6/5",
        change: "+0.2",
        icon: CheckCircle,
      },
    ],
    quickActions: [
      {
        label: "Submit Progress Report",
        action: "progress-report",
        icon: FileText,
      },
      { label: "Upload Work Photos", action: "upload-photos", icon: Upload },
      { label: "Request Payment", action: "payment-request", icon: DollarSign },
      {
        label: "Quality Documentation",
        action: "quality-docs",
        icon: CheckCircle,
      },
    ],
    views: [
      "Contract Management",
      "Site Progress",
      "Resource Planning",
      "Quality Control",
      "Financial Claims",
      "Equipment Management",
    ],
  },
  COMMUNITY_STAKEHOLDERS: {
    title: "Community Engagement Dashboard",
    subtitle: "Local Participation and Feedback Management",
    primaryColor: "bg-pink-600",
    metrics: [
      { label: "Community Projects", value: "24", change: "+6%", icon: Users },
      { label: "Feedback Submitted", value: "342", change: "+18%", icon: Bell },
      {
        label: "Grievances Resolved",
        value: "97%",
        change: "+8%",
        icon: CheckCircle,
      },
      {
        label: "Local Employment",
        value: "1,247",
        change: "+25%",
        icon: Briefcase,
      },
    ],
    quickActions: [
      { label: "Submit Feedback", action: "submit-feedback", icon: Send },
      { label: "Report Issue", action: "report-issue", icon: AlertTriangle },
      { label: "View Benefits", action: "view-benefits", icon: Eye },
      { label: "Community Meeting", action: "community-meeting", icon: Users },
    ],
    views: [
      "Community Benefits",
      "Feedback System",
      "Grievance Mechanism",
      "Local Employment",
      "Social Impact",
      "Cultural Preservation",
    ],
  },
};

// Stakeholder-specific report templates
const STAKEHOLDER_REPORTS = {
  CENTRAL_GOVERNMENT: [
    {
      name: "Executive Summary Report",
      description: "High-level program overview for executive leadership",
      format: "PDF",
    },
    {
      name: "Parliamentary Brief",
      description: "Detailed briefing for parliamentary sessions",
      format: "Word",
    },
    {
      name: "Cabinet Submission",
      description: "Policy recommendations and program updates",
      format: "PDF",
    },
    {
      name: "Donor Coordination Report",
      description: "Multi-donor program coordination summary",
      format: "Excel",
    },
    {
      name: "Provincial Performance Report",
      description: "Provincial-level implementation analysis",
      format: "PDF",
    },
  ],
  PROVINCIAL_DISTRICT: [
    {
      name: "Provincial Summary Report",
      description: "Comprehensive provincial infrastructure status",
      format: "PDF",
    },
    {
      name: "District Implementation Report",
      description: "District-level project progress and challenges",
      format: "Word",
    },
    {
      name: "Community Engagement Report",
      description: "Local community participation and feedback",
      format: "PDF",
    },
    {
      name: "Maintenance Schedule Report",
      description: "Infrastructure maintenance planning and status",
      format: "Excel",
    },
    {
      name: "Local Contractor Performance",
      description: "Assessment of local contractor capabilities",
      format: "PDF",
    },
  ],
  INTERNATIONAL_DONORS: [
    {
      name: "Donor Portfolio Report",
      description: "Comprehensive investment portfolio performance",
      format: "PDF",
    },
    {
      name: "Results Measurement Report",
      description: "Outcome and impact assessment",
      format: "Excel",
    },
    {
      name: "Fiduciary Compliance Report",
      description: "Financial management and compliance status",
      format: "PDF",
    },
    {
      name: "Safeguards Monitoring Report",
      description: "Environmental and social safeguards compliance",
      format: "PDF",
    },
    {
      name: "Disbursement Tracking Report",
      description: "Fund utilization and disbursement analysis",
      format: "Excel",
    },
  ],
  BILATERAL_PARTNERS: [
    {
      name: "Partnership Report",
      description: "Bilateral cooperation program overview",
      format: "PDF",
    },
    {
      name: "Technical Progress Report",
      description: "Technical assistance and capacity building progress",
      format: "Word",
    },
    {
      name: "Diplomatic Brief",
      description: "High-level diplomatic engagement summary",
      format: "PDF",
    },
    {
      name: "Cooperation Summary",
      description: "Multi-sectoral cooperation achievements",
      format: "PDF",
    },
    {
      name: "Knowledge Transfer Report",
      description: "Skills and knowledge transfer activities",
      format: "Excel",
    },
  ],
  CONTRACTORS_CONSULTANTS: [
    {
      name: "Progress Report",
      description: "Detailed project progress and milestone updates",
      format: "PDF",
    },
    {
      name: "Financial Claims Report",
      description: "Payment requests and financial reconciliation",
      format: "Excel",
    },
    {
      name: "Quality Assurance Report",
      description: "Quality control and compliance documentation",
      format: "PDF",
    },
    {
      name: "Completion Certificate",
      description: "Project completion and handover documentation",
      format: "PDF",
    },
    {
      name: "Resource Utilization Report",
      description: "Equipment, materials, and workforce utilization",
      format: "Excel",
    },
  ],
  COMMUNITY_STAKEHOLDERS: [
    {
      name: "Community Benefits Report",
      description: "Infrastructure benefits and local impact assessment",
      format: "PDF",
    },
    {
      name: "Feedback Summary Report",
      description: "Community feedback compilation and analysis",
      format: "Word",
    },
    {
      name: "Grievance Status Report",
      description: "Grievance mechanism performance and resolution",
      format: "PDF",
    },
    {
      name: "Local Employment Report",
      description: "Employment generation and skills development",
      format: "Excel",
    },
    {
      name: "Social Impact Assessment",
      description: "Community social and cultural impact evaluation",
      format: "PDF",
    },
  ],
};

export default function StakeholderDashboard({
  userRole,
  entityType,
  entityId,
  userName,
}: StakeholderDashboardProps) {
  const [activeView, setActiveView] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [selectedReport, setSelectedReport] = useState("");
  const [reportDateRange, setReportDateRange] = useState({
    start: "",
    end: "",
  });

  const dashboardConfig =
    STAKEHOLDER_DASHBOARDS[entityType] ||
    STAKEHOLDER_DASHBOARDS["CENTRAL_GOVERNMENT"];
  const availableReports =
    STAKEHOLDER_REPORTS[entityType] ||
    STAKEHOLDER_REPORTS["CENTRAL_GOVERNMENT"];

  useEffect(() => {
    loadDashboardData();
  }, [entityType, entityId]);

  const loadDashboardData = async () => {
    // Mock data loading based on stakeholder type
    try {
      const mockNotifications = [
        {
          id: 1,
          type: "info",
          title: "Project Update Available",
          message: "New progress report for Mt. Hagen-Kagamuga Road project",
          timestamp: new Date(),
          read: false,
        },
        {
          id: 2,
          type: "warning",
          title: "Budget Alert",
          message: "Monthly budget review required for provincial projects",
          timestamp: new Date(Date.now() - 3600000),
          read: false,
        },
        {
          id: 3,
          type: "success",
          title: "Milestone Achieved",
          message: "Lae-Nadzab Highway Phase 1 completed ahead of schedule",
          timestamp: new Date(Date.now() - 7200000),
          read: true,
        },
      ];

      const mockActivity = [
        {
          id: 1,
          action: "Document uploaded",
          description: "Progress report submitted for Port Moresby Ring Road",
          user: "John Kila",
          timestamp: new Date(Date.now() - 1800000),
        },
        {
          id: 2,
          action: "Payment processed",
          description: "Monthly contractor payment approved",
          user: "Finance Team",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: 3,
          action: "Quality inspection",
          description: "Site inspection completed at Highlands Highway",
          user: "Quality Assurance",
          timestamp: new Date(Date.now() - 5400000),
        },
      ];

      setNotifications(mockNotifications);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleQuickAction = (action: string) => {
    console.log(`Executing action: ${action}`);
    // Implement specific actions based on stakeholder type
    switch (action) {
      case "program-summary":
        window.open("/reports/program-summary", "_blank");
        break;
      case "progress-update":
        setActiveView(1);
        break;
      case "portfolio-review":
        window.open("/reports/portfolio-review", "_blank");
        break;
      case "submit-feedback":
        window.open("/feedback/submit", "_blank");
        break;
      default:
        alert(`Action ${action} will be implemented soon`);
    }
  };

  const generateReport = () => {
    if (!selectedReport) {
      alert("Please select a report type");
      return;
    }

    const report = availableReports.find((r) => r.name === selectedReport);
    if (report) {
      alert(`Generating ${report.name} in ${report.format} format...`);
      // Implement actual report generation
    }
  };

  const renderMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {dashboardConfig.metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <p
                    className={`text-sm ${
                      metric.change.startsWith("+")
                        ? "text-green-600"
                        : metric.change.startsWith("-")
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {metric.change} from last period
                  </p>
                </div>
                <div
                  className={`p-3 rounded-full ${dashboardConfig.primaryColor} bg-opacity-10`}
                >
                  <IconComponent
                    className={`h-6 w-6 ${dashboardConfig.primaryColor.replace("bg-", "text-")}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderQuickActions = () => (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used actions for your role</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {dashboardConfig.quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
                onClick={() => handleQuickAction(action.action)}
              >
                <IconComponent className="h-6 w-6" />
                <span className="text-xs text-center">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const renderNotifications = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.slice(0, 5).map((notification: any) => (
            <div
              key={notification.id}
              className={`p-3 border-l-4 rounded-r-lg ${
                notification.type === "warning"
                  ? "border-yellow-500 bg-yellow-50"
                  : notification.type === "success"
                    ? "border-green-500 bg-green-50"
                    : "border-blue-500 bg-blue-50"
              } ${notification.read ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {notification.timestamp.toLocaleDateString()} at{" "}
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderRecentActivity = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity: any) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Activity className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderReportsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Reports
        </CardTitle>
        <CardDescription>
          Create stakeholder-specific reports and documentation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {availableReports.map((report, index) => (
                  <SelectItem key={index} value={report.name}>
                    {report.name} ({report.format})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date Range</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={reportDateRange.start}
                onChange={(e) =>
                  setReportDateRange((prev) => ({
                    ...prev,
                    start: e.target.value,
                  }))
                }
                className="flex-1"
              />
              <Input
                type="date"
                value={reportDateRange.end}
                onChange={(e) =>
                  setReportDateRange((prev) => ({
                    ...prev,
                    end: e.target.value,
                  }))
                }
                className="flex-1"
              />
            </div>
          </div>
        </div>
        <Button onClick={generateReport} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Generate Report
        </Button>

        {selectedReport && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900">
              {availableReports.find((r) => r.name === selectedReport)?.name}
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              {
                availableReports.find((r) => r.name === selectedReport)
                  ?.description
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {dashboardConfig.title}
          </h1>
          <p className="text-gray-600 mt-1">{dashboardConfig.subtitle}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">Welcome, {userName}</Badge>
            <Badge className={`${dashboardConfig.primaryColor} text-white`}>
              {entityType.replace("_", " ").toLowerCase()}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {notifications.filter((n: any) => !n.read).length > 0 && (
              <Badge className="bg-red-500 text-white">
                {notifications.filter((n: any) => !n.read).length}
              </Badge>
            )}
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {renderMetrics()}

      {/* Main Content Tabs */}
      <Tabs
        value={activeView.toString()}
        onValueChange={(value) => setActiveView(Number.parseInt(value))}
      >
        <TabsList className="grid w-full grid-cols-6">
          {dashboardConfig.views.map((view, index) => (
            <TabsTrigger
              key={index}
              value={index.toString()}
              className="text-xs"
            >
              {view}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="0" className="space-y-6">
          {/* Overview Tab */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderQuickActions()}
            {renderNotifications()}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderRecentActivity()}
            {renderReportsSection()}
          </div>
        </TabsContent>

        <TabsContent value="1" className="space-y-6">
          {/* Content for other tabs would be implemented based on stakeholder type */}
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {dashboardConfig.views[1]}
              </h3>
              <p className="text-gray-600 mb-4">
                Detailed {dashboardConfig.views[1].toLowerCase()} view for{" "}
                {entityType.replace("_", " ").toLowerCase()} stakeholders
              </p>
              <Button className={dashboardConfig.primaryColor}>
                Access {dashboardConfig.views[1]}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {dashboardConfig.views[2]}
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive {dashboardConfig.views[2].toLowerCase()}{" "}
                management and analysis
              </p>
              <Button className={dashboardConfig.primaryColor}>
                Access {dashboardConfig.views[2]}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="3" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {dashboardConfig.views[3]}
              </h3>
              <p className="text-gray-600 mb-4">
                Advanced {dashboardConfig.views[3].toLowerCase()} tools and
                resources
              </p>
              <Button className={dashboardConfig.primaryColor}>
                Access {dashboardConfig.views[3]}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="4" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {dashboardConfig.views[4]}
              </h3>
              <p className="text-gray-600 mb-4">
                Specialized {dashboardConfig.views[4].toLowerCase()}{" "}
                functionality
              </p>
              <Button className={dashboardConfig.primaryColor}>
                Access {dashboardConfig.views[4]}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="5" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {dashboardConfig.views[5]}
              </h3>
              <p className="text-gray-600 mb-4">
                Strategic {dashboardConfig.views[5].toLowerCase()} planning and
                execution
              </p>
              <Button className={dashboardConfig.primaryColor}>
                Access {dashboardConfig.views[5]}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
