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
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  AlertTriangle,
  Archive,
  BarChart3,
  Bell,
  Briefcase,
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
  Lock,
  Mail,
  MapPin,
  Network,
  PieChart,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  Star,
  Target,
  Trash2,
  TrendingUp,
  Unlock,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface InformationRequest {
  id: string;
  title: string;
  description: string;
  requestedBy: string;
  requestedByEntity: string;
  requestedFrom: string[];
  requestType:
    | "DATA_EXPORT"
    | "REPORT_GENERATION"
    | "DASHBOARD_ACCESS"
    | "DOCUMENT_SHARING"
    | "REAL_TIME_FEED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED" | "EXPIRED";
  dataCategories: string[];
  dateRange: { start: string; end: string };
  format: "PDF" | "EXCEL" | "WORD" | "CSV" | "JSON" | "DASHBOARD";
  scheduledDelivery?: {
    frequency: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY";
    recipients: string[];
    nextDelivery: string;
  };
  securityLevel: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";
  approvalRequired: boolean;
  approvals: Array<{
    entity: string;
    approver: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    timestamp?: string;
    comments?: string;
  }>;
  createdAt: string;
  dueDate: string;
  deliveredAt?: string;
  deliveryMethod:
    | "EMAIL"
    | "PORTAL_DOWNLOAD"
    | "API_ACCESS"
    | "DASHBOARD_SHARE";
}

interface SharedDashboard {
  id: string;
  name: string;
  description: string;
  owner: string;
  ownerEntity: string;
  sharedWith: Array<{
    entity: string;
    accessLevel: "VIEW" | "EDIT" | "ADMIN";
    sharedAt: string;
    expiresAt?: string;
  }>;
  dataScope: string[];
  refreshFrequency: "REAL_TIME" | "HOURLY" | "DAILY" | "WEEKLY";
  lastUpdated: string;
  isActive: boolean;
  accessCount: number;
  securityLevel: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";
}

interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  template: string;
  recipients: Array<{
    entity: string;
    email: string;
    role: string;
  }>;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "ANNUALLY";
  dataScope: string[];
  format: "PDF" | "EXCEL" | "WORD" | "CSV";
  nextRun: string;
  lastRun?: string;
  isActive: boolean;
  generatedCount: number;
  owner: string;
  ownerEntity: string;
}

interface InformationSharingSystemProps {
  userRole: string;
  entityType: string;
  entityId: string;
  userName: string;
}

// Data categories available for sharing
const DATA_CATEGORIES = {
  PROJECT_DATA: {
    label: "Project Information",
    description: "Project status, progress, milestones, and updates",
    icon: Building2,
    examples: [
      "Project progress",
      "Milestone achievements",
      "Timeline updates",
      "Scope changes",
    ],
  },
  FINANCIAL_DATA: {
    label: "Financial Information",
    description: "Budget, expenditure, payments, and financial reports",
    icon: DollarSign,
    examples: [
      "Budget utilization",
      "Payment records",
      "Cost analysis",
      "Financial forecasts",
    ],
  },
  PROCUREMENT_DATA: {
    label: "Procurement Information",
    description:
      "Contract details, vendor information, and procurement processes",
    icon: Briefcase,
    examples: [
      "Contract awards",
      "Vendor performance",
      "Procurement schedules",
      "Bid evaluations",
    ],
  },
  QUALITY_DATA: {
    label: "Quality Assurance",
    description: "Quality control, inspections, testing, and compliance data",
    icon: CheckCircle,
    examples: [
      "Inspection reports",
      "Quality tests",
      "Compliance status",
      "Non-conformities",
    ],
  },
  SAFETY_DATA: {
    label: "Health, Safety & Environment",
    description:
      "Safety incidents, environmental monitoring, and HSE compliance",
    icon: Shield,
    examples: [
      "Safety incidents",
      "Environmental monitoring",
      "HSE training",
      "Compliance audits",
    ],
  },
  COMMUNITY_DATA: {
    label: "Community Engagement",
    description:
      "Community feedback, stakeholder consultation, and social impact",
    icon: Users,
    examples: [
      "Community feedback",
      "Stakeholder meetings",
      "Social impact",
      "Grievances",
    ],
  },
  GEOGRAPHIC_DATA: {
    label: "Geographic Information",
    description: "GPS data, mapping, location tracking, and spatial analysis",
    icon: MapPin,
    examples: [
      "GPS coordinates",
      "Site mapping",
      "Progress tracking",
      "Route optimization",
    ],
  },
  PERFORMANCE_DATA: {
    label: "Performance Metrics",
    description: "KPIs, performance indicators, and analytical reports",
    icon: TrendingUp,
    examples: [
      "KPI dashboards",
      "Performance trends",
      "Comparative analysis",
      "Benchmarking",
    ],
  },
};

// Entity-specific data access permissions
const ENTITY_DATA_ACCESS = {
  CENTRAL_GOVERNMENT: [
    "PROJECT_DATA",
    "FINANCIAL_DATA",
    "PROCUREMENT_DATA",
    "QUALITY_DATA",
    "SAFETY_DATA",
    "COMMUNITY_DATA",
    "GEOGRAPHIC_DATA",
    "PERFORMANCE_DATA",
  ],
  PROVINCIAL_DISTRICT: [
    "PROJECT_DATA",
    "COMMUNITY_DATA",
    "GEOGRAPHIC_DATA",
    "QUALITY_DATA",
    "SAFETY_DATA",
    "PERFORMANCE_DATA",
  ],
  INTERNATIONAL_DONORS: [
    "PROJECT_DATA",
    "FINANCIAL_DATA",
    "PERFORMANCE_DATA",
    "SAFETY_DATA",
    "COMMUNITY_DATA",
  ],
  BILATERAL_PARTNERS: [
    "PROJECT_DATA",
    "PERFORMANCE_DATA",
    "COMMUNITY_DATA",
    "SAFETY_DATA",
  ],
  CONTRACTORS_CONSULTANTS: [
    "PROJECT_DATA",
    "QUALITY_DATA",
    "SAFETY_DATA",
    "GEOGRAPHIC_DATA",
  ],
  COMMUNITY_STAKEHOLDERS: [
    "PROJECT_DATA",
    "COMMUNITY_DATA",
    "SAFETY_DATA",
    "PERFORMANCE_DATA",
  ],
};

export default function InformationSharingSystem({
  userRole,
  entityType,
  entityId,
  userName,
}: InformationSharingSystemProps) {
  const [activeTab, setActiveTab] = useState("requests");
  const [informationRequests, setInformationRequests] = useState<
    InformationRequest[]
  >([]);
  const [sharedDashboards, setSharedDashboards] = useState<SharedDashboard[]>(
    [],
  );
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showDashboardForm, setShowDashboardForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  // Form states
  const [requestForm, setRequestForm] = useState({
    title: "",
    description: "",
    requestType: "REPORT_GENERATION" as any,
    priority: "MEDIUM" as any,
    dataCategories: [] as string[],
    requestedFrom: [] as string[],
    dateRange: { start: "", end: "" },
    format: "PDF" as any,
    deliveryMethod: "EMAIL" as any,
    securityLevel: "INTERNAL" as any,
  });

  const availableDataCategories = ENTITY_DATA_ACCESS[entityType] || [];

  useEffect(() => {
    loadInformationSharingData();
  }, []);

  const loadInformationSharingData = async () => {
    try {
      // Mock data for demonstration
      const mockRequests: InformationRequest[] = [
        {
          id: "REQ001",
          title: "Quarterly Progress Report for ADB Portfolio",
          description:
            "Comprehensive quarterly progress report covering all ADB-funded projects including financial utilization and milestone achievements",
          requestedBy: userName,
          requestedByEntity: entityType,
          requestedFrom: ["CENTRAL_GOVERNMENT", "CONTRACTORS_CONSULTANTS"],
          requestType: "REPORT_GENERATION",
          priority: "HIGH",
          status: "IN_PROGRESS",
          dataCategories: [
            "PROJECT_DATA",
            "FINANCIAL_DATA",
            "PERFORMANCE_DATA",
          ],
          dateRange: { start: "2024-10-01", end: "2024-12-31" },
          format: "PDF",
          securityLevel: "CONFIDENTIAL",
          approvalRequired: true,
          approvals: [
            {
              entity: "CENTRAL_GOVERNMENT",
              approver: "David Wereh",
              status: "APPROVED",
              timestamp: "2025-01-08T10:00:00Z",
            },
            {
              entity: "CONTRACTORS_CONSULTANTS",
              approver: "Project Manager",
              status: "PENDING",
            },
          ],
          createdAt: "2025-01-07T09:00:00Z",
          dueDate: "2025-01-15T17:00:00Z",
          deliveryMethod: "EMAIL",
        },
        {
          id: "REQ002",
          title: "Community Feedback Dashboard Access",
          description:
            "Request for real-time access to community feedback and grievance data for provincial oversight",
          requestedBy: "Provincial Administrator",
          requestedByEntity: "PROVINCIAL_DISTRICT",
          requestedFrom: ["COMMUNITY_STAKEHOLDERS", "CENTRAL_GOVERNMENT"],
          requestType: "DASHBOARD_ACCESS",
          priority: "MEDIUM",
          status: "COMPLETED",
          dataCategories: ["COMMUNITY_DATA", "PROJECT_DATA"],
          dateRange: { start: "2025-01-01", end: "2025-12-31" },
          format: "DASHBOARD",
          securityLevel: "INTERNAL",
          approvalRequired: false,
          approvals: [],
          createdAt: "2025-01-05T14:30:00Z",
          dueDate: "2025-01-10T17:00:00Z",
          deliveredAt: "2025-01-08T11:15:00Z",
          deliveryMethod: "DASHBOARD_SHARE",
        },
        {
          id: "REQ003",
          title: "Weekly Financial Utilization Report",
          description:
            "Automated weekly report on budget utilization and expenditure tracking for bilateral partnership oversight",
          requestedBy: "Program Officer",
          requestedByEntity: "BILATERAL_PARTNERS",
          requestedFrom: ["CENTRAL_GOVERNMENT"],
          requestType: "REPORT_GENERATION",
          priority: "MEDIUM",
          status: "COMPLETED",
          dataCategories: ["FINANCIAL_DATA", "PROJECT_DATA"],
          dateRange: { start: "2025-01-01", end: "2025-12-31" },
          format: "EXCEL",
          scheduledDelivery: {
            frequency: "WEEKLY",
            recipients: [
              "program.officer@bilateral.org",
              "finance.team@bilateral.org",
            ],
            nextDelivery: "2025-01-13T09:00:00Z",
          },
          securityLevel: "CONFIDENTIAL",
          approvalRequired: true,
          approvals: [
            {
              entity: "CENTRAL_GOVERNMENT",
              approver: "Finance Director",
              status: "APPROVED",
              timestamp: "2025-01-06T16:00:00Z",
            },
          ],
          createdAt: "2025-01-04T11:00:00Z",
          dueDate: "2025-01-08T17:00:00Z",
          deliveredAt: "2025-01-07T09:00:00Z",
          deliveryMethod: "EMAIL",
        },
      ];

      const mockDashboards: SharedDashboard[] = [
        {
          id: "DASH001",
          name: "Connect PNG Executive Dashboard",
          description:
            "High-level program overview with key metrics and status indicators",
          owner: "Department of Works",
          ownerEntity: "CENTRAL_GOVERNMENT",
          sharedWith: [
            {
              entity: "INTERNATIONAL_DONORS",
              accessLevel: "VIEW",
              sharedAt: "2025-01-01T00:00:00Z",
            },
            {
              entity: "BILATERAL_PARTNERS",
              accessLevel: "VIEW",
              sharedAt: "2025-01-01T00:00:00Z",
            },
            {
              entity: "PROVINCIAL_DISTRICT",
              accessLevel: "VIEW",
              sharedAt: "2025-01-01T00:00:00Z",
            },
          ],
          dataScope: ["PROJECT_DATA", "FINANCIAL_DATA", "PERFORMANCE_DATA"],
          refreshFrequency: "DAILY",
          lastUpdated: "2025-01-09T08:00:00Z",
          isActive: true,
          accessCount: 1247,
          securityLevel: "INTERNAL",
        },
        {
          id: "DASH002",
          name: "Provincial Infrastructure Status",
          description:
            "Provincial-level project status and community engagement metrics",
          owner: "Provincial Works Office",
          ownerEntity: "PROVINCIAL_DISTRICT",
          sharedWith: [
            {
              entity: "CENTRAL_GOVERNMENT",
              accessLevel: "VIEW",
              sharedAt: "2025-01-01T00:00:00Z",
            },
            {
              entity: "COMMUNITY_STAKEHOLDERS",
              accessLevel: "VIEW",
              sharedAt: "2025-01-01T00:00:00Z",
            },
          ],
          dataScope: ["PROJECT_DATA", "COMMUNITY_DATA", "GEOGRAPHIC_DATA"],
          refreshFrequency: "REAL_TIME",
          lastUpdated: "2025-01-09T10:30:00Z",
          isActive: true,
          accessCount: 678,
          securityLevel: "INTERNAL",
        },
      ];

      const mockScheduledReports: ScheduledReport[] = [
        {
          id: "SCH001",
          name: "Monthly ADB Portfolio Report",
          description:
            "Comprehensive monthly report for ADB portfolio performance and financial status",
          template: "ADB_PORTFOLIO_TEMPLATE",
          recipients: [
            {
              entity: "INTERNATIONAL_DONORS",
              email: "portfolio.manager@adb.org",
              role: "Portfolio Manager",
            },
            {
              entity: "CENTRAL_GOVERNMENT",
              email: "secretary@works.gov.pg",
              role: "Secretary",
            },
          ],
          frequency: "MONTHLY",
          dataScope: [
            "PROJECT_DATA",
            "FINANCIAL_DATA",
            "PERFORMANCE_DATA",
            "SAFETY_DATA",
          ],
          format: "PDF",
          nextRun: "2025-02-01T09:00:00Z",
          lastRun: "2025-01-01T09:00:00Z",
          isActive: true,
          generatedCount: 12,
          owner: "ADB Program Manager",
          ownerEntity: "INTERNATIONAL_DONORS",
        },
        {
          id: "SCH002",
          name: "Weekly Community Feedback Summary",
          description:
            "Weekly compilation of community feedback and grievance resolution status",
          template: "COMMUNITY_FEEDBACK_TEMPLATE",
          recipients: [
            {
              entity: "PROVINCIAL_DISTRICT",
              email: "admin@whp.gov.pg",
              role: "Provincial Administrator",
            },
            {
              entity: "COMMUNITY_STAKEHOLDERS",
              email: "community.liaison@local.org",
              role: "Community Liaison",
            },
          ],
          frequency: "WEEKLY",
          dataScope: ["COMMUNITY_DATA", "PROJECT_DATA"],
          format: "EXCEL",
          nextRun: "2025-01-13T08:00:00Z",
          lastRun: "2025-01-06T08:00:00Z",
          isActive: true,
          generatedCount: 48,
          owner: "Community Engagement Officer",
          ownerEntity: "COMMUNITY_STAKEHOLDERS",
        },
      ];

      setInformationRequests(mockRequests);
      setSharedDashboards(mockDashboards);
      setScheduledReports(mockScheduledReports);
    } catch (error) {
      console.error("Error loading information sharing data:", error);
    }
  };

  const handleSubmitRequest = async () => {
    try {
      const newRequest: InformationRequest = {
        id: `REQ${Date.now().toString().slice(-3)}`,
        ...requestForm,
        requestedBy: userName,
        requestedByEntity: entityType,
        status: "PENDING",
        approvalRequired:
          requestForm.securityLevel === "CONFIDENTIAL" ||
          requestForm.securityLevel === "RESTRICTED",
        approvals: [],
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        deliveryMethod: requestForm.deliveryMethod,
      };

      setInformationRequests((prev) => [newRequest, ...prev]);
      setShowRequestForm(false);
      resetRequestForm();
      alert("Information request submitted successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Error submitting request. Please try again.");
    }
  };

  const resetRequestForm = () => {
    setRequestForm({
      title: "",
      description: "",
      requestType: "REPORT_GENERATION",
      priority: "MEDIUM",
      dataCategories: [],
      requestedFrom: [],
      dateRange: { start: "", end: "" },
      format: "PDF",
      deliveryMethod: "EMAIL",
      securityLevel: "INTERNAL",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "EXPIRED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case "PUBLIC":
        return "bg-green-100 text-green-800";
      case "INTERNAL":
        return "bg-blue-100 text-blue-800";
      case "CONFIDENTIAL":
        return "bg-orange-100 text-orange-800";
      case "RESTRICTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRequests = informationRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderRequestsTab = () => (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Information Requests</h3>
          <p className="text-gray-600">
            Request and manage information sharing across Connect PNG
            stakeholders
          </p>
        </div>
        <Button onClick={() => setShowRequestForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{request.title}</h4>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority}
                    </Badge>
                    <Badge
                      className={getSecurityLevelColor(request.securityLevel)}
                    >
                      {request.securityLevel}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{request.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Requested by:</span>{" "}
                      {request.requestedBy}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {request.requestType.replace("_", " ")}
                    </div>
                    <div>
                      <span className="font-medium">Format:</span>{" "}
                      {request.format}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Due:</span>{" "}
                      {new Date(request.dueDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Data Categories:</span>{" "}
                      {request.dataCategories.length}
                    </div>
                  </div>
                  {request.approvals.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-2">Approvals:</div>
                      <div className="flex flex-wrap gap-2">
                        {request.approvals.map((approval, index) => (
                          <Badge
                            key={index}
                            className={getStatusColor(approval.status)}
                          >
                            {approval.entity}: {approval.status}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {request.status === "COMPLETED" && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDashboardsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Shared Dashboards</h3>
          <p className="text-gray-600">
            Access real-time dashboards shared across stakeholders
          </p>
        </div>
        <Button onClick={() => setShowDashboardForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Share Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sharedDashboards.map((dashboard) => (
          <Card
            key={dashboard.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                  <CardDescription>{dashboard.description}</CardDescription>
                </div>
                <Badge
                  className={getSecurityLevelColor(dashboard.securityLevel)}
                >
                  {dashboard.securityLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Owner:</span>{" "}
                    {dashboard.owner}
                  </div>
                  <div>
                    <span className="font-medium">Access Count:</span>{" "}
                    {dashboard.accessCount}
                  </div>
                  <div>
                    <span className="font-medium">Refresh:</span>{" "}
                    {dashboard.refreshFrequency}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {new Date(dashboard.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Shared with:</div>
                  <div className="flex flex-wrap gap-1">
                    {dashboard.sharedWith.map((share, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {share.entity} ({share.accessLevel})
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Data Scope:</div>
                  <div className="flex flex-wrap gap-1">
                    {dashboard.dataScope.map((scope, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {scope.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderScheduledReportsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Scheduled Reports</h3>
          <p className="text-gray-600">
            Automated report generation and distribution
          </p>
        </div>
        <Button onClick={() => setShowReportForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Report
        </Button>
      </div>

      <div className="space-y-4">
        {scheduledReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{report.name}</h4>
                    <Badge
                      className={
                        report.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {report.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{report.frequency}</Badge>
                    <Badge variant="secondary">{report.format}</Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{report.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Next Run:</span>{" "}
                      {new Date(report.nextRun).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Recipients:</span>{" "}
                      {report.recipients.length}
                    </div>
                    <div>
                      <span className="font-medium">Generated:</span>{" "}
                      {report.generatedCount} times
                    </div>
                    <div>
                      <span className="font-medium">Owner:</span> {report.owner}
                    </div>
                    <div>
                      <span className="font-medium">Data Categories:</span>{" "}
                      {report.dataScope.length}
                    </div>
                    {report.lastRun && (
                      <div>
                        <span className="font-medium">Last Run:</span>{" "}
                        {new Date(report.lastRun).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-1">Recipients:</div>
                    <div className="flex flex-wrap gap-1">
                      {report.recipients.map((recipient, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {recipient.role} ({recipient.entity})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Information Sharing & Requests
          </h1>
          <p className="text-gray-600 mt-1">
            Secure data sharing, automated reporting, and information requests
            across Connect PNG stakeholders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Database className="h-4 w-4" />
            Data Catalog
          </Button>
          <Button variant="outline" className="gap-2">
            <Shield className="h-4 w-4" />
            Security Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {informationRequests.length}
            </div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {sharedDashboards.length}
            </div>
            <div className="text-sm text-gray-600">Shared Dashboards</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {scheduledReports.length}
            </div>
            <div className="text-sm text-gray-600">Scheduled Reports</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {availableDataCategories.length}
            </div>
            <div className="text-sm text-gray-600">Data Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests" className="gap-2">
            <Send className="h-4 w-4" />
            Requests
          </TabsTrigger>
          <TabsTrigger value="dashboards" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboards
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <Calendar className="h-4 w-4" />
            Scheduled Reports
          </TabsTrigger>
          <TabsTrigger value="catalog" className="gap-2">
            <Database className="h-4 w-4" />
            Data Catalog
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">{renderRequestsTab()}</TabsContent>

        <TabsContent value="dashboards">{renderDashboardsTab()}</TabsContent>

        <TabsContent value="reports">{renderScheduledReportsTab()}</TabsContent>

        <TabsContent value="catalog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Catalog</CardTitle>
              <CardDescription>
                Available data categories and access permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(DATA_CATEGORIES).map(([key, category]) => {
                  const IconComponent = category.icon;
                  const hasAccess = availableDataCategories.includes(key);

                  return (
                    <Card
                      key={key}
                      className={`${hasAccess ? "border-green-200" : "border-gray-200"}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${hasAccess ? "bg-green-100" : "bg-gray-100"}`}
                          >
                            <IconComponent
                              className={`h-5 w-5 ${hasAccess ? "text-green-600" : "text-gray-600"}`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{category.label}</h4>
                              {hasAccess ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Lock className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {category.description}
                            </p>
                            <div className="mt-2">
                              <div className="text-xs font-medium text-gray-500 mb-1">
                                Examples:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {category.examples
                                  .slice(0, 3)
                                  .map((example, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {example}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">New Information Request</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRequestForm(false)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Request Title *</Label>
                  <Input
                    id="title"
                    value={requestForm.title}
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Brief description of your request"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={requestForm.description}
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Detailed description of what information you need"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Request Type *</Label>
                    <Select
                      value={requestForm.requestType}
                      onValueChange={(value) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          requestType: value as any,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REPORT_GENERATION">
                          Report Generation
                        </SelectItem>
                        <SelectItem value="DATA_EXPORT">Data Export</SelectItem>
                        <SelectItem value="DASHBOARD_ACCESS">
                          Dashboard Access
                        </SelectItem>
                        <SelectItem value="DOCUMENT_SHARING">
                          Document Sharing
                        </SelectItem>
                        <SelectItem value="REAL_TIME_FEED">
                          Real-time Feed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Priority *</Label>
                    <Select
                      value={requestForm.priority}
                      onValueChange={(value) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          priority: value as any,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Data Categories *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableDataCategories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={requestForm.dataCategories.includes(
                            category,
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRequestForm((prev) => ({
                                ...prev,
                                dataCategories: [
                                  ...prev.dataCategories,
                                  category,
                                ],
                              }));
                            } else {
                              setRequestForm((prev) => ({
                                ...prev,
                                dataCategories: prev.dataCategories.filter(
                                  (cat) => cat !== category,
                                ),
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">
                          {DATA_CATEGORIES[category].label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Output Format *</Label>
                    <Select
                      value={requestForm.format}
                      onValueChange={(value) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          format: value as any,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF Report</SelectItem>
                        <SelectItem value="EXCEL">Excel Spreadsheet</SelectItem>
                        <SelectItem value="WORD">Word Document</SelectItem>
                        <SelectItem value="CSV">CSV Data</SelectItem>
                        <SelectItem value="JSON">JSON Data</SelectItem>
                        <SelectItem value="DASHBOARD">
                          Dashboard Access
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Security Level *</Label>
                    <Select
                      value={requestForm.securityLevel}
                      onValueChange={(value) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          securityLevel: value as any,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Public</SelectItem>
                        <SelectItem value="INTERNAL">Internal</SelectItem>
                        <SelectItem value="CONFIDENTIAL">
                          Confidential
                        </SelectItem>
                        <SelectItem value="RESTRICTED">Restricted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSubmitRequest}
                    className="flex-1"
                    disabled={
                      !requestForm.title ||
                      !requestForm.description ||
                      requestForm.dataCategories.length === 0
                    }
                  >
                    Submit Request
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRequestForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
