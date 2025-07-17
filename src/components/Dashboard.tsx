"use client";

import CommunityFeedbackSystem from "@/components/CommunityFeedbackSystem";
import ContractorManagement from "@/components/ContractorManagement";
import EntityManagement from "@/components/EntityManagement";
import FinancialDashboard from "@/components/FinancialDashboard";
import GPSMonitoring from "@/components/GPSMonitoring";
import GPSTaskEntry from "@/components/GPSTaskEntry";
import HSEReports from "@/components/HSEReports";
import InformationSharingSystem from "@/components/InformationSharingSystem";
import MobileGPSCollector from "@/components/MobileGPSCollector";
import ProgressMapping from "@/components/ProgressMapping";
import ProjectManagement from "@/components/ProjectManagement";
import ProjectProgressMonitoring from "@/components/ProjectProgressMonitoring";
import ProjectTrackingModule from "@/components/ProjectTrackingModule";
import QualityManagement from "@/components/QualityManagement";
import ReportsGenerator from "@/components/ReportsGenerator";
import RoadProgressMapper from "@/components/RoadProgressMapper";
import StakeholderDashboard from "@/components/StakeholderDashboard";
import SystemSettings from "@/components/SystemSettings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSelector, useLanguage } from "@/contexts/LanguageContext";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building,
  Building2,
  Calculator,
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Flag,
  Map as MapIcon,
  MapPin,
  Navigation,
  Network,
  Plus,
  Settings,
  Share2,
  Shield,
  Target,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";

// PNG Traditional Art Inspired Icons
const PNGIcons = {
  Projects: ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M2 20 L12 4 L22 20 Z" opacity="0.6" />
      <path d="M6 16 L12 8 L18 16 Z" opacity="0.8" />
      <circle cx="12" cy="16" r="2" />
      <path
        d="M8 14 L16 14"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  ),
  Financial: ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <circle cx="12" cy="12" r="8" opacity="0.3" />
      <path
        d="M8 8 L16 16 M16 8 L8 16"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="8" cy="8" r="2" opacity="0.7" />
      <circle cx="16" cy="8" r="2" opacity="0.7" />
      <circle cx="8" cy="16" r="2" opacity="0.7" />
      <circle cx="16" cy="16" r="2" opacity="0.7" />
    </svg>
  ),
  GPS: ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <circle cx="12" cy="12" r="10" opacity="0.2" />
      <path
        d="M12 2 L14 8 L20 6 L16 12 L22 14 L16 16 L14 20 L12 14 L6 16 L10 12 L4 10 L10 8 Z"
        opacity="0.8"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Progress: ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <rect x="2" y="6" width="20" height="3" opacity="0.4" />
      <rect x="2" y="11" width="15" height="3" opacity="0.6" />
      <rect x="2" y="16" width="10" height="3" opacity="0.8" />
      <circle cx="20" cy="17.5" r="2" />
      <path
        d="M18 15.5 L22 15.5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  ),
};

function useDropdown() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMenuEnter = (id: string) => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setOpenMenu(id);
  };

  const handleMenuLeave = () => {
    menuTimeout.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const handleMenuClick = (id: string) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  return {
    openMenu,
    handleMenuEnter,
    handleMenuLeave,
    handleMenuClick,
    setOpenMenu,
  };
}

export default function Dashboard() {
  const { user, logout, login } = useAuth();
  const { settings } = useSystemSettings();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [financialSubTab, setFinancialSubTab] = useState("overview");
  const [activeView, setActiveView] = useState("overview");

  // Enhanced Navigation menu structure for comprehensive Connect PNG system
  const navigationMenus = [
    {
      id: "program-overview",
      label: "Connect PNG Program Overview",
      icon: BarChart3,
      items: [
        { id: "overview", label: "Executive Dashboard", icon: BarChart3 },
        {
          id: "stakeholder-dashboard",
          label: "Stakeholder Dashboard",
          icon: Network,
        },
        {
          id: "program-metrics",
          label: "Program Metrics & KPIs",
          icon: TrendingUp,
        },
        { id: "strategic-overview", label: "Strategic Overview", icon: Target },
      ],
    },
    {
      id: "stakeholder-management",
      label: "Entity & Stakeholder Management",
      icon: Users,
      items: [
        { id: "entity-management", label: "Entity Directory", icon: Building2 },
        { id: "user-management", label: "User Management", icon: Users },
        {
          id: "stakeholder-coordination",
          label: "Stakeholder Coordination",
          icon: Navigation,
        },
        {
          id: "partnership-management",
          label: "Partnership Management",
          icon: Flag,
        },
      ],
    },
    {
      id: "project-lifecycle",
      label: "Project Lifecycle Management",
      icon: MapPin,
      items: [
        {
          id: "project-registration",
          label: "Project Registration",
          icon: Plus,
        },
        { id: "project-tracking", label: "Project Tracking", icon: Navigation },
        {
          id: "milestone-management",
          label: "Milestone Management",
          icon: Target,
        },
        {
          id: "workflow-management",
          label: "Workflow Management",
          icon: Settings,
        },
      ],
    },
    {
      id: "field-operations",
      label: "Field Operations",
      icon: MapIcon,
      items: [
        { id: "gps-entry", label: "GPS Data Entry", icon: MapPin },
        { id: "mobile-gps", label: "Mobile GPS Collector", icon: Navigation },
        {
          id: "road-progress",
          label: "Road Progress Mapping",
          icon: Navigation,
        },
        { id: "machine-tracking", label: "Equipment Tracking", icon: Truck },
        { id: "site-monitoring", label: "Site Monitoring", icon: Eye },
        {
          id: "quality-assurance",
          label: "Quality Assurance",
          icon: CheckCircle,
        },
      ],
    },
    {
      id: "financial-management",
      label: "Financial Management & Reporting",
      icon: DollarSign,
      items: [
        { id: "financial", label: "Financial Dashboard", icon: DollarSign },
        { id: "funding-sources", label: "Funding Sources", icon: Building },
        {
          id: "disbursement-tracking",
          label: "Disbursement Tracking",
          icon: TrendingUp,
        },
        { id: "donor-reporting", label: "Donor Reporting", icon: FileText },
      ],
    },
    {
      id: "compliance-safeguards",
      label: "Compliance & Safeguards",
      icon: Shield,
      items: [
        { id: "hse", label: "Health, Safety & Environment", icon: Shield },
        { id: "social-safeguards", label: "Social Safeguards", icon: Users },
        {
          id: "environmental-compliance",
          label: "Environmental Compliance",
          icon: CheckCircle,
        },
        { id: "audit-compliance", label: "Audit & Compliance", icon: FileText },
      ],
    },
    {
      id: "information-sharing",
      label: "Information Sharing & Collaboration",
      icon: Share2,
      items: [
        {
          id: "information-sharing",
          label: "Data Sharing Portal",
          icon: Share2,
        },
        {
          id: "document-management",
          label: "Document Management",
          icon: FileText,
        },
        {
          id: "workflow-collaboration",
          label: "Workflow Collaboration",
          icon: Network,
        },
        {
          id: "approval-workflows",
          label: "Approval Workflows",
          icon: CheckCircle,
        },
      ],
    },
    {
      id: "community-engagement",
      label: "Community Engagement & Feedback",
      icon: Users,
      items: [
        {
          id: "community-feedback",
          label: "Community Feedback System",
          icon: Users,
        },
        {
          id: "grievance-mechanism",
          label: "Grievance Mechanism",
          icon: AlertTriangle,
        },
        {
          id: "beneficiary-monitoring",
          label: "Beneficiary Monitoring",
          icon: Eye,
        },
        {
          id: "social-impact",
          label: "Social Impact Assessment",
          icon: TrendingUp,
        },
      ],
    },
    {
      id: "reporting-analytics",
      label: "Monitoring, Reporting & Analytics",
      icon: FileText,
      items: [
        { id: "reports", label: "Standard Reports", icon: FileText },
        { id: "custom-reports", label: "Custom Reports", icon: BarChart3 },
        { id: "data-analytics", label: "Data Analytics", icon: TrendingUp },
        {
          id: "performance-dashboard",
          label: "Performance Dashboard",
          icon: Activity,
        },
      ],
    },
    {
      id: "system-administration",
      label: "System Administration",
      icon: Settings,
      items: [
        { id: "contractors", label: "Contractor Management", icon: Building },
        {
          id: "document-management",
          label: "Document Management",
          icon: FileText,
        },
        {
          id: "workflow-configuration",
          label: "Workflow Configuration",
          icon: Settings,
        },
        { id: "system-settings", label: "System Settings", icon: Settings },
      ],
    },
  ];

  const financialSubTabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "budget-actual", label: "Budget vs Actual", icon: Calculator },
    { id: "progress", label: "Progress Monitor", icon: Activity },
    { id: "unplanned", label: "Unplanned Costs", icon: AlertTriangle },
    { id: "cashflow", label: "Cash Flow", icon: TrendingUp },
    { id: "change-orders", label: "Change Orders", icon: FileText },
    { id: "funding", label: "Funding Sources", icon: Building },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
  ];

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      logout();
    }
  };

  const renderPlaceholderContent = (
    title: string,
    description: string,
    IconComponent: any,
  ) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-6 w-6" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <IconComponent className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  Available Soon
                </div>
                <div className="text-sm text-gray-600">
                  Comprehensive {title.toLowerCase()} features
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  Full Integration
                </div>
                <div className="text-sm text-gray-600">
                  Connected to Connect PNG workflow
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  Role-Based Access
                </div>
                <div className="text-sm text-gray-600">
                  Customized for your entity type
                </div>
              </Card>
            </div>
            <Button
              className="mt-6 bg-blue-600 hover:bg-blue-700"
              onClick={() =>
                alert(
                  `${title} functionality will be available in the next release. This comprehensive system includes all requested Connect PNG features.`,
                )
              }
            >
              Learn More About {title}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFinancialSubContent = () => {
    const mockProject = {
      id: "PNG001",
      name: "Mt. Hagen-Kagamuga Road Upgrade",
      budget: 25000000,
      progress: 65,
    };

    switch (financialSubTab) {
      case "overview":
        return (
          <FinancialDashboard
            projectId={mockProject.id}
            projectName={mockProject.name}
            projectBudget={mockProject.budget}
            projectProgress={mockProject.progress}
          />
        );

      case "budget-actual":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual Analysis</CardTitle>
              <CardDescription>
                Detailed budget performance by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        K 25.0M
                      </div>
                      <div className="text-sm text-gray-600">Total Budget</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        K 16.3M
                      </div>
                      <div className="text-sm text-gray-600">Actual Spent</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        +5.2%
                      </div>
                      <div className="text-sm text-gray-600">
                        Budget Variance
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="h-96 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Budget vs Actual Chart
                    </h3>
                    <p className="text-gray-600">
                      Interactive budget comparison charts will be displayed
                      here
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "progress":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Progress Monitoring</CardTitle>
              <CardDescription>
                Physical vs financial progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        65%
                      </div>
                      <div className="text-sm text-gray-600">
                        Physical Progress
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        68%
                      </div>
                      <div className="text-sm text-gray-600">
                        Financial Progress
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        62%
                      </div>
                      <div className="text-sm text-gray-600">
                        Planned Progress
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="h-96 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <Activity className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Progress Monitoring Dashboard
                    </h3>
                    <p className="text-gray-600">
                      Physical vs financial progress comparison charts
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "cashflow":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
              <CardDescription>
                Monitor project cash inflows and outflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        K 18.5M
                      </div>
                      <div className="text-sm text-gray-600">Total Inflows</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        K 16.3M
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Outflows
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        K 2.2M
                      </div>
                      <div className="text-sm text-gray-600">
                        Current Balance
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        K 3.1M
                      </div>
                      <div className="text-sm text-gray-600">
                        Next Month Forecast
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="h-96 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Cash Flow Dashboard
                    </h3>
                    <p className="text-gray-600">
                      Monthly cash flow charts and forecasting
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {financialSubTab.replace("-", " ").toUpperCase()}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    K 15.2M
                  </div>
                  <div className="text-sm text-gray-600">Available Budget</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">67%</div>
                  <div className="text-sm text-gray-600">Budget Utilized</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-gray-600">Pending Invoices</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    K 2.8M
                  </div>
                  <div className="text-sm text-gray-600">Monthly Spend</div>
                </div>
              </div>
              <Button
                onClick={() => setActiveTab("financial")}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white"
              >
                Access Financial Dashboard
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  const renderFinancialContent = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow-sm border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Financial Management
          </h3>
          <div className="flex flex-wrap gap-2">
            {financialSubTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFinancialSubTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    financialSubTab === tab.id
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
        {renderFinancialSubContent()}
      </div>
    );
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Active Projects
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    K 155M
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Total Budget
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    57%
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Avg Progress
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    22
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <Building2 className="h-4 w-4" />
                    PNG Provinces
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Welcome to PNG Road Construction Monitor</CardTitle>
                <CardDescription>
                  Monitoring road construction projects across Papua New Guinea
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Use the navigation tabs above to access different sections of
                  the system. Start by creating a new project or entering GPS
                  data for existing projects.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      // Program Overview
      case "stakeholder-dashboard":
        return (
          <StakeholderDashboard
            userRole={user?.role || "ADMIN"}
            entityType="CENTRAL_GOVERNMENT"
            entityId={user?.id || "default"}
            userName={user?.name || "Administrator"}
          />
        );
      case "program-metrics":
        return renderPlaceholderContent(
          "Program Metrics & KPIs",
          "Comprehensive Connect PNG program performance indicators",
          TrendingUp,
        );
      case "strategic-overview":
        return renderPlaceholderContent(
          "Strategic Overview",
          "High-level strategic planning and program direction",
          Target,
        );

      // Entity & Stakeholder Management
      case "entity-management":
        return <EntityManagement userRole={user?.role} userId={user?.id} />;
      case "user-management":
        return <SystemSettings />;
      case "stakeholder-coordination":
        return renderPlaceholderContent(
          "Stakeholder Coordination",
          "Coordinate with all Connect PNG stakeholders",
          Users,
        );
      case "partnership-management":
        return renderPlaceholderContent(
          "Partnership Management",
          "Manage bilateral and multilateral partnerships",
          Flag,
        );

      // Project Lifecycle Management
      case "project-registration":
        return <ProjectManagement />;
      case "project-tracking":
        return <ProjectTrackingModule />;
      case "milestone-management":
        return renderPlaceholderContent(
          "Milestone Management",
          "Track project milestones and deliverables",
          Target,
        );
      case "workflow-management":
        return renderPlaceholderContent(
          "Workflow Management",
          "Configure project workflows and approvals",
          Settings,
        );

      // Field Operations
      case "gps-entry":
        return <GPSTaskEntry />;
      case "mobile-gps":
        return <MobileGPSCollector />;
      case "road-progress":
        return <RoadProgressMapper />;
      case "machine-tracking":
        return <GPSMonitoring />;
      case "site-monitoring":
        return renderPlaceholderContent(
          "Site Monitoring",
          "Monitor construction sites and activities",
          Eye,
        );
      case "quality-assurance":
        return <QualityManagement />;

      // Financial Management & Reporting
      case "financial":
        return renderFinancialContent();
      case "funding-sources":
        return renderPlaceholderContent(
          "Funding Sources",
          "Manage donor funding and sources",
          Building,
        );
      case "disbursement-tracking":
        return renderPlaceholderContent(
          "Disbursement Tracking",
          "Track fund disbursements and payments",
          TrendingUp,
        );
      case "donor-reporting":
        return renderPlaceholderContent(
          "Donor Reporting",
          "Generate reports for donor agencies",
          FileText,
        );

      // Compliance & Safeguards
      case "hse":
        return <HSEReports />;
      case "social-safeguards":
        return renderPlaceholderContent(
          "Social Safeguards",
          "Monitor social safeguards compliance",
          Users,
        );
      case "environmental-compliance":
        return renderPlaceholderContent(
          "Environmental Compliance",
          "Track environmental compliance",
          CheckCircle,
        );
      case "audit-compliance":
        return renderPlaceholderContent(
          "Audit & Compliance",
          "Audit trails and compliance monitoring",
          FileText,
        );

      // Information Sharing & Collaboration
      case "information-sharing":
        return (
          <InformationSharingSystem
            userRole={user?.role || "ADMIN"}
            entityType="CENTRAL_GOVERNMENT"
            entityId={user?.id || "default"}
            userName={user?.name || "Administrator"}
          />
        );
      case "document-management":
        return renderPlaceholderContent(
          "Document Management",
          "Centralized document repository and version control",
          FileText,
        );
      case "workflow-collaboration":
        return renderPlaceholderContent(
          "Workflow Collaboration",
          "Collaborative workflows and task management",
          Network,
        );
      case "approval-workflows":
        return renderPlaceholderContent(
          "Approval Workflows",
          "Automated approval processes and notifications",
          CheckCircle,
        );

      // Community Engagement & Feedback
      case "community-feedback":
        return (
          <CommunityFeedbackSystem
            userRole={user?.role || "COMMUNITY_LIAISON"}
            userId={user?.id}
          />
        );
      case "grievance-mechanism":
        return renderPlaceholderContent(
          "Grievance Mechanism",
          "Handle community grievances and complaints",
          AlertTriangle,
        );
      case "beneficiary-monitoring":
        return renderPlaceholderContent(
          "Beneficiary Monitoring",
          "Monitor project beneficiaries",
          Eye,
        );
      case "social-impact":
        return renderPlaceholderContent(
          "Social Impact Assessment",
          "Assess social impact of projects",
          TrendingUp,
        );

      // Reporting & Analytics
      case "reports":
        return <ReportsGenerator />;
      case "custom-reports":
        return renderPlaceholderContent(
          "Custom Reports",
          "Create custom reports for stakeholders",
          BarChart3,
        );
      case "data-analytics":
        return renderPlaceholderContent(
          "Data Analytics",
          "Advanced data analytics and insights",
          TrendingUp,
        );
      case "performance-dashboard":
        return renderPlaceholderContent(
          "Performance Dashboard",
          "Project performance metrics and KPIs",
          Activity,
        );

      // System Administration
      case "contractors":
        return <ContractorManagement />;
      case "document-management":
        return renderPlaceholderContent(
          "Document Management",
          "Manage project documents and files",
          FileText,
        );
      case "workflow-configuration":
        return renderPlaceholderContent(
          "Workflow Configuration",
          "Configure system workflows",
          Settings,
        );
      case "system-settings":
        return <SystemSettings />;
      default:
        return renderPlaceholderContent(
          "Page Not Found",
          "The requested page could not be found",
          AlertTriangle,
        );
    }
  };

  // Dropdown navigation logic
  const {
    openMenu,
    handleMenuEnter,
    handleMenuLeave,
    handleMenuClick,
    setOpenMenu,
  } = useDropdown();

  // For mobile: open/close all menus
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* PNG Cultural Header Pattern */}
      <div className="h-2 png-gradient-flag"></div>

      <header className="bg-white/90 backdrop-blur-sm text-gray-900 shadow-lg border-b png-border-red border-opacity-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 64 64" className="w-6 h-6 text-white">
                  <path
                    d="M8 56 L32 8 L56 56 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 40 L32 28 L44 40 L32 52 Z"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <circle cx="32" cy="40" r="3" fill="white" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold png-accent-black">
                  {settings?.systemName || t("header.title")}
                </h1>
                <p className="text-gray-600 text-sm">
                  {settings?.organizationName || t("header.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Role Switcher for Demo */}
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
                <span className="text-xs text-gray-600">Demo Role:</span>
                <select
                  value={user?.role || "ADMIN"}
                  onChange={(e) => {
                    const roles = {
                      ADMIN: {
                        id: "demo-admin-001",
                        name: "Demo Administrator",
                        email: "admin@png.gov.pg",
                        role: "ADMIN" as const,
                      },
                      PROJECT_MANAGER: {
                        id: "demo-manager-001",
                        name: "Demo Project Manager",
                        email: "manager@png.gov.pg",
                        role: "PROJECT_MANAGER" as const,
                      },
                      SITE_ENGINEER: {
                        id: "demo-engineer-001",
                        name: "Demo Site Engineer",
                        email: "engineer@png.gov.pg",
                        role: "SITE_ENGINEER" as const,
                      },
                      FINANCIAL_OFFICER: {
                        id: "demo-finance-001",
                        name: "Demo Financial Officer",
                        email: "finance@png.gov.pg",
                        role: "FINANCIAL_OFFICER" as const,
                      },
                    };
                    const newUser = roles[e.target.value as keyof typeof roles];
                    // Simulate a role change by calling login with the new user
                    login(newUser.email, "demo123");
                  }}
                  className="text-xs bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="PROJECT_MANAGER">Project Manager</option>
                  <option value="SITE_ENGINEER">Site Engineer</option>
                  <option value="FINANCIAL_OFFICER">Financial Officer</option>
                </select>
              </div>

              <LanguageSelector />

              {/* User Info */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.role?.replace("_", " ")}
                  </div>
                </div>
              </div>

              <span className="text-sm text-gray-700">
                {t("header.welcome")}, {user?.name || "Administrator"}
              </span>
              <Badge variant="secondary" className="png-bg-yellow text-black">
                {user?.role || "ADMIN"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                {t("action.signout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation with dropdowns */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b png-border-yellow border-opacity-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile nav toggle */}
          <div className="md:hidden flex justify-between items-center py-2">
            <span className="font-semibold text-lg">Menu</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              <ChevronDown
                className={`transition-transform ${mobileNavOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-4 py-2">
            {navigationMenus.map((menu, menuIdx) => {
              const IconComponent = menu.icon;
              const isOpen = openMenu === menu.id;
              return (
                <div
                  key={menu.id}
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(menu.id)}
                  onMouseLeave={handleMenuLeave}
                >
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      menu.items.some((tab) => tab.id === activeTab)
                        ? "bg-blue-100 text-blue-700 shadow"
                        : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                    }`}
                    onClick={() => handleMenuClick(menu.id)}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                  >
                    <IconComponent className="h-5 w-5" />
                    {menu.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {/* Dropdown menu */}
                  {isOpen && (
                    <div
                      className="absolute left-0 mt-2 min-w-[220px] bg-white border rounded-lg shadow-lg py-2 z-30"
                      onMouseEnter={() => handleMenuEnter(menu.id)}
                      onMouseLeave={handleMenuLeave}
                    >
                      {menu.items.map((tab, index) => {
                        const TabIcon = tab.icon;
                        const pngColors = [
                          "png-bg-red text-white",
                          "png-bg-yellow text-black",
                          "png-bg-black text-white",
                        ];
                        const activeColor = pngColors[index % pngColors.length];
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setOpenMenu(null);
                              if (tab.id === "financial") {
                                setFinancialSubTab("overview");
                              }
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-left transition-all ${
                              activeTab === tab.id
                                ? `${activeColor} shadow`
                                : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                            }`}
                          >
                            <TabIcon className="h-4 w-4" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Mobile navigation dropdowns */}
          {mobileNavOpen && (
            <div className="md:hidden flex flex-col gap-2 py-2">
              {navigationMenus.map((menu) => (
                <div key={menu.id} className="border-b last:border-b-0">
                  <button
                    className="w-full flex items-center justify-between px-4 py-2 font-medium text-gray-800"
                    onClick={() => handleMenuClick(menu.id)}
                  >
                    <span className="flex items-center gap-2">
                      <menu.icon className="h-5 w-5" />
                      {menu.label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${openMenu === menu.id ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openMenu === menu.id && (
                    <div className="flex flex-col gap-1 pl-8 pb-2">
                      {menu.items.map((tab, index) => {
                        const TabIcon = tab.icon;
                        const pngColors = [
                          "png-bg-red text-white",
                          "png-bg-yellow text-black",
                          "png-bg-black text-white",
                        ];
                        const activeColor = pngColors[index % pngColors.length];
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setOpenMenu(null);
                              setMobileNavOpen(false);
                              if (tab.id === "financial") {
                                setFinancialSubTab("overview");
                              }
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                              activeTab === tab.id
                                ? `${activeColor} shadow`
                                : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                            }`}
                          >
                            <TabIcon className="h-4 w-4" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">{renderMainContent()}</main>
    </div>
  );
}
