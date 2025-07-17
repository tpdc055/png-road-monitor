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
  Award,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit3,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Contractor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  license: string;
  specialty: string[];
  rating: number;
  isActive: boolean;
  registrationDate: string;
  totalProjects: number;
  activeProjects: number;
  totalValue: number;
  performanceScore: number;
  certifications: string[];
  insuranceExpiry: string;
  licenseExpiry: string;
}

interface ContractorProject {
  id: string;
  projectName: string;
  contractorId: string;
  contractValue: number;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "delayed" | "terminated";
  progress: number;
  paymentStatus: "current" | "overdue" | "pending";
  qualityScore: number;
  safetyScore: number;
}

interface Payment {
  id: string;
  contractorId: string;
  projectId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "pending" | "paid" | "overdue" | "disputed";
  invoiceNumber: string;
  description: string;
}

interface PerformanceMetric {
  contractorId: string;
  metric: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
}

export default function ContractorManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [projects, setProjects] = useState<ContractorProject[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [showContractorDialog, setShowContractorDialog] = useState(false);
  const [selectedContractor, setSelectedContractor] =
    useState<Contractor | null>(null);

  useEffect(() => {
    loadContractorData();
  }, []);

  const loadContractorData = () => {
    // Mock contractor data for PNG road construction
    const mockContractors: Contractor[] = [
      {
        id: "C001",
        name: "Papua Construction Ltd",
        email: "contracts@papuaconstruction.pg",
        phone: "+675 325 8900",
        address: "Section 43, Lot 15, Gerehu, Port Moresby, NCD",
        license: "PNG-CONST-001-2024",
        specialty: ["Road Construction", "Bridge Building", "Earthworks"],
        rating: 4.2,
        isActive: true,
        registrationDate: "2020-03-15",
        totalProjects: 12,
        activeProjects: 2,
        totalValue: 45000000,
        performanceScore: 87,
        certifications: [
          "ISO 9001",
          "PNG Construction License",
          "Safety Certification",
        ],
        insuranceExpiry: "2025-12-31",
        licenseExpiry: "2026-03-15",
      },
      {
        id: "C002",
        name: "Highlands Engineering Corp",
        email: "admin@highlanders.pg",
        phone: "+675 542 1234",
        address: "Kagamuga Road, Mt. Hagen, WHP",
        license: "PNG-CONST-002-2023",
        specialty: [
          "Mountain Roads",
          "Slope Stabilization",
          "Drainage Systems",
        ],
        rating: 4.5,
        isActive: true,
        registrationDate: "2018-08-22",
        totalProjects: 18,
        activeProjects: 1,
        totalValue: 67000000,
        performanceScore: 92,
        certifications: [
          "ISO 14001",
          "Mountain Construction Specialist",
          "Environmental Compliance",
        ],
        insuranceExpiry: "2025-08-22",
        licenseExpiry: "2025-08-22",
      },
      {
        id: "C003",
        name: "Morobe Infrastructure Pty",
        email: "projects@morobeinfra.pg",
        phone: "+675 472 3456",
        address: "Markham Road, Lae, Morobe Province",
        license: "PNG-CONST-003-2022",
        specialty: [
          "Highway Construction",
          "Airport Access Roads",
          "Industrial Roads",
        ],
        rating: 3.8,
        isActive: true,
        registrationDate: "2019-01-10",
        totalProjects: 8,
        activeProjects: 1,
        totalValue: 25000000,
        performanceScore: 78,
        certifications: [
          "PNG Construction License",
          "Heavy Equipment Certification",
        ],
        insuranceExpiry: "2025-01-10",
        licenseExpiry: "2025-01-10",
      },
    ];

    const mockProjects: ContractorProject[] = [
      {
        id: "CP001",
        projectName: "Mt. Hagen-Kagamuga Road Upgrade",
        contractorId: "C001",
        contractValue: 25000000,
        startDate: "2024-06-01",
        endDate: "2025-08-31",
        status: "active",
        progress: 65,
        paymentStatus: "current",
        qualityScore: 88,
        safetyScore: 92,
      },
      {
        id: "CP002",
        projectName: "Port Moresby Ring Road - Section A",
        contractorId: "C001",
        contractValue: 18000000,
        startDate: "2024-09-15",
        endDate: "2025-12-15",
        status: "active",
        progress: 35,
        paymentStatus: "pending",
        qualityScore: 85,
        safetyScore: 90,
      },
      {
        id: "CP003",
        projectName: "Lae-Nadzab Highway Extension",
        contractorId: "C003",
        contractValue: 22000000,
        startDate: "2024-04-01",
        endDate: "2025-10-31",
        status: "delayed",
        progress: 45,
        paymentStatus: "overdue",
        qualityScore: 75,
        safetyScore: 82,
      },
    ];

    const mockPayments: Payment[] = [
      {
        id: "PAY001",
        contractorId: "C001",
        projectId: "CP001",
        amount: 2500000,
        dueDate: "2025-01-15",
        paidDate: "2025-01-12",
        status: "paid",
        invoiceNumber: "INV-MH-001",
        description: "Monthly progress payment for Mt. Hagen road works",
      },
      {
        id: "PAY002",
        contractorId: "C001",
        projectId: "CP002",
        amount: 1800000,
        dueDate: "2025-01-20",
        status: "pending",
        invoiceNumber: "INV-POM-002",
        description: "Progress payment for Port Moresby ring road section",
      },
      {
        id: "PAY003",
        contractorId: "C003",
        projectId: "CP003",
        amount: 1200000,
        dueDate: "2024-12-31",
        status: "overdue",
        invoiceNumber: "INV-LAE-003",
        description: "Delayed payment for Lae-Nadzab highway works",
      },
    ];

    const mockMetrics: PerformanceMetric[] = [
      {
        contractorId: "C001",
        metric: "On-Time Delivery",
        value: 85,
        target: 90,
        unit: "%",
        trend: "up",
      },
      {
        contractorId: "C001",
        metric: "Quality Score",
        value: 87,
        target: 85,
        unit: "%",
        trend: "stable",
      },
      {
        contractorId: "C001",
        metric: "Safety Rating",
        value: 91,
        target: 95,
        unit: "%",
        trend: "up",
      },
      {
        contractorId: "C002",
        metric: "On-Time Delivery",
        value: 92,
        target: 90,
        unit: "%",
        trend: "stable",
      },
      {
        contractorId: "C002",
        metric: "Quality Score",
        value: 94,
        target: 85,
        unit: "%",
        trend: "up",
      },
      {
        contractorId: "C002",
        metric: "Safety Rating",
        value: 96,
        target: 95,
        unit: "%",
        trend: "stable",
      },
      {
        contractorId: "C003",
        metric: "On-Time Delivery",
        value: 72,
        target: 90,
        unit: "%",
        trend: "down",
      },
      {
        contractorId: "C003",
        metric: "Quality Score",
        value: 78,
        target: 85,
        unit: "%",
        trend: "down",
      },
      {
        contractorId: "C003",
        metric: "Safety Rating",
        value: 82,
        target: 95,
        unit: "%",
        trend: "stable",
      },
    ];

    setContractors(mockContractors);
    setProjects(mockProjects);
    setPayments(mockPayments);
    setMetrics(mockMetrics);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "paid":
      case "current":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "delayed":
      case "overdue":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "terminated":
      case "disputed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50"
        />,
      );
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    return stars;
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
    { id: "contractors", label: "Contractors", icon: Users },
    { id: "projects", label: "Projects", icon: Building },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "performance", label: "Performance", icon: TrendingUp },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {contractors.filter((c) => c.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Active Contractors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {projects.filter((p) => p.status === "active").length}
                </div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  K{" "}
                  {(
                    contractors.reduce((sum, c) => sum + c.totalValue, 0) /
                    1000000
                  ).toFixed(0)}
                  M
                </div>
                <div className="text-sm text-gray-600">
                  Total Contract Value
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {contractors.length > 0
                    ? (
                        contractors.reduce((sum, c) => sum + c.rating, 0) /
                        contractors.length
                      ).toFixed(1)
                    : "0.0"}
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Contractors */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Contractors</CardTitle>
          <CardDescription>
            Contractors ranked by performance score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contractors
              .sort((a, b) => b.performanceScore - a.performanceScore)
              .slice(0, 3)
              .map((contractor, index) => (
                <div
                  key={contractor.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                            ? "bg-gray-400"
                            : "bg-orange-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{contractor.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{contractor.specialty[0]}</span>
                        <span>•</span>
                        <span>{contractor.activeProjects} active projects</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {contractor.performanceScore}%
                    </div>
                    <div className="flex items-center gap-1">
                      {getRatingStars(contractor.rating).slice(0, 5)}
                      <span className="text-sm text-gray-600 ml-1">
                        ({contractor.rating})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Paid</span>
                <Badge className="bg-green-100 text-green-800">
                  {payments.filter((p) => p.status === "paid").length} payments
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {payments.filter((p) => p.status === "pending").length}{" "}
                  payments
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Overdue</span>
                <Badge className="bg-red-100 text-red-800">
                  {payments.filter((p) => p.status === "overdue").length}{" "}
                  payments
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active</span>
                <Badge className="bg-green-100 text-green-800">
                  {projects.filter((p) => p.status === "active").length}{" "}
                  projects
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Delayed</span>
                <Badge className="bg-red-100 text-red-800">
                  {projects.filter((p) => p.status === "delayed").length}{" "}
                  projects
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {projects.filter((p) => p.status === "completed").length}{" "}
                  projects
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContractors = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Contractor Registry</h3>
          <p className="text-gray-600">
            Manage contractor information and qualifications
          </p>
        </div>
        <Dialog
          open={showContractorDialog}
          onOpenChange={setShowContractorDialog}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Contractor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Contractor</DialogTitle>
              <DialogDescription>
                Register a new contractor in the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Input placeholder="Contractor company name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="contact@company.pg" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input placeholder="+675 XXX XXXX" />
              </div>
              <div>
                <Label>Address</Label>
                <Textarea placeholder="Company address" />
              </div>
              <div>
                <Label>License Number</Label>
                <Input placeholder="PNG-CONST-XXX-YYYY" />
              </div>
              <div>
                <Label>Specialty</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Primary specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="road">Road Construction</SelectItem>
                    <SelectItem value="bridge">Bridge Building</SelectItem>
                    <SelectItem value="earthworks">Earthworks</SelectItem>
                    <SelectItem value="drainage">Drainage Systems</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Register</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowContractorDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {contractors.map((contractor) => (
          <Card
            key={contractor.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{contractor.name}</CardTitle>
                  <div className="flex items-center gap-1 mt-1">
                    {getRatingStars(contractor.rating)}
                    <span className="text-sm text-gray-600 ml-1">
                      ({contractor.rating})
                    </span>
                  </div>
                </div>
                <Badge
                  className={
                    contractor.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {contractor.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {contractor.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                {contractor.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {contractor.address.split(",").slice(0, 2).join(", ")}
              </div>
              <div className="pt-2">
                <div className="text-sm font-medium mb-1">Specialties:</div>
                <div className="flex flex-wrap gap-1">
                  {contractor.specialty.slice(0, 2).map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {contractor.specialty.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{contractor.specialty.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Projects</div>
                    <div className="font-medium">
                      {contractor.activeProjects} active
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Performance</div>
                    <div className="font-medium">
                      {contractor.performanceScore}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">Active Contractors</div>
              <div className="text-xs text-blue-600 mt-1">
                Approved & Working
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">94%</div>
              <div className="text-sm text-gray-600">Performance Rating</div>
              <div className="text-xs text-green-600 mt-1">Average</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">K 45M</div>
              <div className="text-sm text-gray-600">Total Contract Value</div>
              <div className="text-xs text-orange-600 mt-1">
                Active contracts
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">New Applications</div>
              <div className="text-xs text-purple-600 mt-1">Under review</div>
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
      case "contractors":
        return renderContractors();
      case "projects":
        return renderPlaceholder(
          "Project Management",
          "Track contractor project assignments, progress, and deliverables",
        );
      case "payments":
        return renderPlaceholder(
          "Payment Tracking",
          "Manage contractor payments, invoices, and financial records",
        );
      case "performance":
        return renderPlaceholder(
          "Performance Analytics",
          "Analyze contractor performance metrics, trends, and evaluations",
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
            Contractor Management
          </h2>
          <p className="text-gray-600">
            Manage contractor relationships, performance, and payments
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
