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
import type {
  Address,
  ContactInfo,
  Entity,
  EntityCategory,
  EntityType,
  User,
} from "@/types/connectpng";
import {
  Activity,
  AlertTriangle,
  Bell,
  Briefcase,
  Building,
  Building2,
  Calendar,
  CheckCircle,
  ChevronDown,
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
  Phone,
  Plus,
  Search,
  Settings,
  Shield,
  Star,
  Unlock,
  Upload,
  UserCheck,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface EntityManagementProps {
  userRole?: string;
  userId?: string;
}

// Enhanced Entity Categories for Connect PNG Program - Organized with dropdown structure
const CONNECT_PNG_ENTITIES = {
  CENTRAL_GOVERNMENT: {
    label: "Central Government Agencies",
    icon: Building2,
    color: "bg-blue-100 text-blue-800",
    description: "Core government departments managing Connect PNG program",
    entities: [
      "Department of Works & Highways",
      "Department of National Planning & Monitoring",
      "National Road Authority",
      "Department of Transport",
      "Department of Finance & Treasury",
      "Prime Minister's Office",
      "Department of Provincial & Local Government Affairs",
      "National Planning & Monitoring Department",
      "Treasury Department",
      "Public Service Commission",
      "Auditor General's Office",
      "Ombudsman Commission",
    ],
  },
  PROVINCIAL_DISTRICT: {
    label: "Provincial & District Offices",
    icon: MapPin,
    color: "bg-green-100 text-green-800",
    description: "Provincial and district level implementing agencies",
    entities: [
      "Western Highlands Provincial Works",
      "National Capital District Works",
      "Eastern Highlands Provincial Works",
      "Morobe Provincial Works",
      "Southern Highlands Provincial Works",
      "Central Provincial Works",
      "Milne Bay Provincial Works",
      "Northern Provincial Works",
      "Gulf Provincial Works",
      "Hela Provincial Works",
      "Jiwaka Provincial Works",
      "Chimbu Provincial Works",
      "Madang Provincial Works",
      "East Sepik Provincial Works",
      "West Sepik Provincial Works",
      "Manus Provincial Works",
      "New Ireland Provincial Works",
      "East New Britain Provincial Works",
      "West New Britain Provincial Works",
      "Bougainville Provincial Works",
      "Enga Provincial Works",
      "All District Works Offices",
    ],
  },
  INTERNATIONAL_DONORS: {
    label: "International Development Partners",
    icon: Globe,
    color: "bg-purple-100 text-purple-800",
    description: "Multilateral development finance institutions",
    entities: [
      "Asian Development Bank (ADB)",
      "World Bank Group",
      "International Monetary Fund (IMF)",
      "United Nations Development Programme (UNDP)",
      "European Union Delegation",
      "International Finance Corporation (IFC)",
      "European Investment Bank",
      "Islamic Development Bank",
      "Pacific Islands Development Forum",
      "ASEAN+3 Infrastructure Fund",
    ],
  },
  BILATERAL_PARTNERS: {
    label: "Bilateral Development Partners",
    icon: Flag,
    color: "bg-orange-100 text-orange-800",
    description: "Country-to-country development cooperation agencies",
    entities: [
      "Australian Department of Foreign Affairs & Trade (DFAT)",
      "Japan International Cooperation Agency (JICA)",
      "New Zealand Ministry of Foreign Affairs & Trade",
      "United States Agency for International Development (USAID)",
      "Chinese Embassy Development Cooperation",
      "Korean International Cooperation Agency (KOICA)",
      "German Development Cooperation (GIZ)",
      "French Development Agency (AFD)",
      "Indonesian Technical Cooperation",
      "Malaysian Technical Cooperation Programme",
    ],
  },
  CONTRACTORS_CONSULTANTS: {
    label: "Contractors & Consultants",
    icon: Building,
    color: "bg-yellow-100 text-yellow-800",
    description: "Construction companies and technical consultants",
    entities: [
      "PNG Local Construction Companies",
      "International Construction Contractors",
      "Engineering Consulting Firms",
      "Project Management Consultants",
      "Equipment Suppliers & Operators",
      "Material Suppliers",
      "Transport & Logistics Companies",
      "Technical Advisory Services",
      "Quality Assurance Consultants",
      "Environmental Consultants",
      "Social Development Consultants",
      "Financial Advisory Services",
    ],
  },
  FINANCIAL_INSTITUTIONS: {
    label: "Financial Institutions & Services",
    icon: DollarSign,
    color: "bg-indigo-100 text-indigo-800",
    description: "Banking and financial service providers",
    entities: [
      "Bank of Papua New Guinea",
      "PNG Commercial Banks",
      "Development Finance Institutions",
      "Microfinance Institutions",
      "Insurance Companies",
      "Financial Advisory Services",
      "Accounting & Audit Firms",
      "Payment System Providers",
      "Foreign Exchange Services",
      "Investment Management Companies",
    ],
  },
  COMMUNITY_STAKEHOLDERS: {
    label: "Community & Civil Society",
    icon: Users,
    color: "bg-pink-100 text-pink-800",
    description: "Community groups and civil society organizations",
    entities: [
      "Local Community Groups",
      "Landowner Associations",
      "Women's Groups & Cooperatives",
      "Youth Organizations",
      "Church Groups & Religious Organizations",
      "Traditional Authorities & Chiefs",
      "Civil Society Organizations",
      "Non-Governmental Organizations (NGOs)",
      "Community-Based Organizations (CBOs)",
      "Professional Associations",
      "Trade Unions",
      "Cultural Groups",
    ],
  },
  REGULATORY_OVERSIGHT: {
    label: "Regulatory & Oversight Bodies",
    icon: Shield,
    color: "bg-teal-100 text-teal-800",
    description: "Regulatory agencies and oversight institutions",
    entities: [
      "National Procurement Commission",
      "Independent Consumer & Competition Commission",
      "Environment & Conservation Authority",
      "Mineral Resources Authority",
      "National Fisheries Authority",
      "Civil Aviation Safety Authority",
      "PNG Harbours Board",
      "Technical Standards Authority",
      "Transparency International PNG",
      "PNG Institute of Engineers",
    ],
  },
  ACADEMIC_RESEARCH: {
    label: "Academic & Research Institutions",
    icon: UserCheck,
    color: "bg-cyan-100 text-cyan-800",
    description:
      "Universities, research institutes, and training organizations",
    entities: [
      "University of Papua New Guinea",
      "Papua New Guinea University of Technology",
      "Divine Word University",
      "Pacific Adventist University",
      "PNG Institute of Public Administration",
      "Construction Industry Training Authority",
      "National Research Institute",
      "PNG Forest Research Institute",
      "International Training Institutes",
      "Technical & Vocational Education Training Centers",
    ],
  },
  MEDIA_COMMUNICATIONS: {
    label: "Media & Communications",
    icon: Network,
    color: "bg-rose-100 text-rose-800",
    description: "Media organizations and communication platforms",
    entities: [
      "National Broadcasting Corporation",
      "The National Newspaper",
      "Post-Courier",
      "FM Radio Stations",
      "Television Broadcasters",
      "Online Media Platforms",
      "Community Radio Stations",
      "Social Media Platforms",
      "Government Information Services",
      "Provincial Media Outlets",
    ],
  },
};

// Stakeholder-specific role mappings
const STAKEHOLDER_ROLES = {
  CENTRAL_GOVERNMENT: [
    "GOVERNMENT_ADMIN",
    "PROJECT_MANAGER",
    "FINANCIAL_OFFICER",
    "COMPLIANCE_OFFICER",
  ],
  PROVINCIAL_DISTRICT: [
    "PROVINCIAL_ADMIN",
    "DISTRICT_ADMIN",
    "SITE_ENGINEER",
    "LOCAL_COORDINATOR",
  ],
  INTERNATIONAL_DONORS: [
    "DONOR_ADMIN",
    "PROGRAM_MANAGER",
    "FINANCIAL_ANALYST",
    "COMPLIANCE_MONITOR",
  ],
  BILATERAL_PARTNERS: [
    "BILATERAL_ADMIN",
    "PROGRAM_OFFICER",
    "TECHNICAL_ADVISOR",
    "LIAISON_OFFICER",
  ],
  CONTRACTORS_CONSULTANTS: [
    "CONTRACTOR_ADMIN",
    "PROJECT_COORDINATOR",
    "SITE_SUPERVISOR",
    "QUALITY_MANAGER",
  ],
  FINANCIAL_INSTITUTIONS: [
    "FINANCE_ADMIN",
    "LOAN_OFFICER",
    "RISK_MANAGER",
    "AUDIT_SPECIALIST",
  ],
  COMMUNITY_STAKEHOLDERS: [
    "COMMUNITY_LIAISON",
    "BENEFICIARY_REP",
    "FEEDBACK_COORDINATOR",
    "ADVOCACY_OFFICER",
  ],
  REGULATORY_OVERSIGHT: [
    "REGULATORY_OFFICER",
    "COMPLIANCE_AUDITOR",
    "STANDARDS_INSPECTOR",
    "OVERSIGHT_MANAGER",
  ],
  ACADEMIC_RESEARCH: [
    "RESEARCH_COORDINATOR",
    "ACADEMIC_ADVISOR",
    "TRAINING_MANAGER",
    "KNOWLEDGE_OFFICER",
  ],
  MEDIA_COMMUNICATIONS: [
    "MEDIA_LIAISON",
    "COMMUNICATIONS_OFFICER",
    "PUBLIC_RELATIONS",
    "CONTENT_MANAGER",
  ],
};

// Enhanced dashboard configurations for each entity type
const ENTITY_DASHBOARDS = {
  CENTRAL_GOVERNMENT: {
    primaryMetrics: [
      "Total Program Budget",
      "Projects Active",
      "Provinces Covered",
      "Completion Rate",
    ],
    keyViews: [
      "Program Overview",
      "Financial Summary",
      "Provincial Status",
      "Donor Relations",
    ],
    reports: [
      "Executive Summary",
      "Parliamentary Brief",
      "Cabinet Report",
      "Donor Updates",
    ],
  },
  PROVINCIAL_DISTRICT: {
    primaryMetrics: [
      "Local Projects",
      "Budget Allocated",
      "Completion Status",
      "Community Feedback",
    ],
    keyViews: [
      "Project Progress",
      "Local Contractors",
      "Community Engagement",
      "Maintenance Needs",
    ],
    reports: [
      "Provincial Summary",
      "District Reports",
      "Community Updates",
      "Maintenance Schedule",
    ],
  },
  INTERNATIONAL_DONORS: {
    primaryMetrics: [
      "Funding Committed",
      "Disbursement Rate",
      "Project Performance",
      "Impact Indicators",
    ],
    keyViews: [
      "Portfolio Overview",
      "Disbursement Tracking",
      "Results Framework",
      "Risk Management",
    ],
    reports: [
      "Donor Report",
      "Results Measurement",
      "Fiduciary Report",
      "Social Safeguards",
    ],
  },
  BILATERAL_PARTNERS: {
    primaryMetrics: [
      "Bilateral Funding",
      "Technical Assistance",
      "Capacity Building",
      "Partnership Impact",
    ],
    keyViews: [
      "Partnership Programs",
      "Technical Support",
      "Knowledge Transfer",
      "Diplomatic Relations",
    ],
    reports: [
      "Partnership Report",
      "Technical Progress",
      "Diplomatic Brief",
      "Cooperation Summary",
    ],
  },
  CONTRACTORS_CONSULTANTS: {
    primaryMetrics: [
      "Active Contracts",
      "Work Progress",
      "Payment Status",
      "Quality Scores",
    ],
    keyViews: [
      "Contract Management",
      "Site Progress",
      "Resource Planning",
      "Quality Control",
    ],
    reports: [
      "Progress Report",
      "Financial Claims",
      "Quality Report",
      "Completion Certificate",
    ],
  },
};

const PROVINCES = [
  "National Capital District",
  "Central Province",
  "Milne Bay Province",
  "Northern Province",
  "Southern Highlands Province",
  "Western Highlands Province",
  "Enga Province",
  "Western Province",
  "Gulf Province",
  "Hela Province",
  "Jiwaka Province",
  "Chimbu Province",
  "Eastern Highlands Province",
  "Morobe Province",
  "Madang Province",
  "East Sepik Province",
  "West Sepik Province",
  "Manus Province",
  "New Ireland Province",
  "East New Britain Province",
  "West New Britain Province",
  "Bougainville Province",
];

export default function EntityManagement({
  userRole = "ADMIN",
  userId,
}: EntityManagementProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [showEntityDetails, setShowEntityDetails] = useState(false);

  // Enhanced form states
  const [entityForm, setEntityForm] = useState({
    name: "",
    type: "" as EntityType,
    category: "" as EntityCategory,
    description: "",
    contactInfo: {
      primaryPhone: "",
      secondaryPhone: "",
      email: "",
      alternateEmail: "",
      website: "",
    } as ContactInfo,
    address: {
      street: "",
      city: "",
      province: "",
      district: "",
      postalCode: "",
      country: "Papua New Guinea",
    } as Address,
    stakeholderRole: "",
    fundingCapacity: "",
    technicalExpertise: [] as string[],
    partnerships: [] as string[],
  });

  useEffect(() => {
    loadEntities();
    loadUsers();
  }, []);

  const loadEntities = async () => {
    try {
      setLoading(true);
      // Enhanced mock data representing Connect PNG stakeholders
      const mockEntities: Entity[] = [
        {
          id: "entity-001",
          name: "Department of Works & Highways",
          type: "GOVERNMENT_DEPARTMENT",
          category: "CENTRAL_GOVERNMENT",
          description:
            "Lead central government agency responsible for road infrastructure development, maintenance, and oversight of the Connect PNG program",
          contactInfo: {
            primaryPhone: "+675 321 4567",
            secondaryPhone: "+675 321 4568",
            email: "secretary@works.gov.pg",
            alternateEmail: "info@works.gov.pg",
            website: "https://works.gov.pg",
          },
          address: {
            street: "Morauta Haus, Champion Parade",
            city: "Port Moresby",
            province: "National Capital District",
            country: "Papua New Guinea",
            coordinates: { latitude: -9.4438, longitude: 147.1803 },
          },
          isActive: true,
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-12-15"),
        },
        {
          id: "entity-002",
          name: "Asian Development Bank (ADB)",
          type: "DONOR_AGENCY",
          category: "INTERNATIONAL_DONORS",
          description:
            "Major multilateral development finance institution providing funding and technical assistance for Connect PNG program",
          contactInfo: {
            primaryPhone: "+675 321 1234",
            email: "png@adb.org",
            website: "https://adb.org/countries/papua-new-guinea",
          },
          address: {
            street: "Level 3, Deloitte Tower, Douglas Street",
            city: "Port Moresby",
            province: "National Capital District",
            country: "Papua New Guinea",
            coordinates: { latitude: -9.4456, longitude: 147.1832 },
          },
          isActive: true,
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-12-10"),
        },
        {
          id: "entity-003",
          name: "Australian Department of Foreign Affairs & Trade (DFAT)",
          type: "DONOR_AGENCY",
          category: "BILATERAL_PARTNERS",
          description:
            "Key bilateral development partner providing funding and technical cooperation for PNG infrastructure development",
          contactInfo: {
            primaryPhone: "+675 325 9333",
            email: "ausaid.png@dfat.gov.au",
            website: "https://png.embassy.gov.au",
          },
          address: {
            street: "Godwit Street, Red Hill",
            city: "Port Moresby",
            province: "National Capital District",
            country: "Papua New Guinea",
            coordinates: { latitude: -9.4215, longitude: 147.1803 },
          },
          isActive: true,
          createdAt: new Date("2024-01-08"),
          updatedAt: new Date("2024-12-08"),
        },
        {
          id: "entity-004",
          name: "Western Highlands Provincial Works",
          type: "PROVINCIAL_OFFICE",
          category: "PROVINCIAL_DISTRICT",
          description:
            "Provincial government office responsible for implementing Connect PNG projects in Western Highlands Province",
          contactInfo: {
            primaryPhone: "+675 542 1234",
            email: "works@whp.gov.pg",
            website: "https://whp.gov.pg/works",
          },
          address: {
            street: "Provincial Government Building, Highlands Highway",
            city: "Mount Hagen",
            province: "Western Highlands Province",
            country: "Papua New Guinea",
            coordinates: { latitude: -5.8536, longitude: 144.2302 },
          },
          isActive: true,
          createdAt: new Date("2024-02-01"),
          updatedAt: new Date("2024-12-01"),
        },
        {
          id: "entity-005",
          name: "Japan International Cooperation Agency (JICA)",
          type: "DONOR_AGENCY",
          category: "BILATERAL_PARTNERS",
          description:
            "Japanese bilateral development agency supporting PNG infrastructure and capacity building programs",
          contactInfo: {
            primaryPhone: "+675 325 6420",
            email: "png_office@jica.go.jp",
            website: "https://www.jica.go.jp/png",
          },
          address: {
            street: "Level 1, Vulupindi Haus, Poreporena Freeway",
            city: "Port Moresby",
            province: "National Capital District",
            country: "Papua New Guinea",
            coordinates: { latitude: -9.4647, longitude: 147.1925 },
          },
          isActive: true,
          createdAt: new Date("2024-01-12"),
          updatedAt: new Date("2024-12-12"),
        },
      ];
      setEntities(mockEntities);
    } catch (error) {
      console.error("Error loading entities:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      // Enhanced mock user data with stakeholder-specific roles
      const mockUsers: User[] = [
        {
          id: "user-001",
          name: "David Wereh",
          email: "d.wereh@works.gov.pg",
          role: "GOVERNMENT_ADMIN",
          entity: "GOVERNMENT_DEPARTMENT",
          entityId: "entity-001",
          permissions: [],
          isActive: true,
          contactInfo: {
            primaryPhone: "+675 321 4567",
            email: "d.wereh@works.gov.pg",
          },
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-12-15"),
        },
        {
          id: "user-002",
          name: "Sarah Wilson",
          email: "s.wilson@adb.org",
          role: "DONOR_ADMIN",
          entity: "DONOR_AGENCY",
          entityId: "entity-002",
          permissions: [],
          isActive: true,
          contactInfo: {
            primaryPhone: "+675 321 1234",
            email: "s.wilson@adb.org",
          },
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-12-10"),
        },
        {
          id: "user-003",
          name: "Michael Thompson",
          email: "m.thompson@dfat.gov.au",
          role: "BILATERAL_ADMIN",
          entity: "DONOR_AGENCY",
          entityId: "entity-003",
          permissions: [],
          isActive: true,
          contactInfo: {
            primaryPhone: "+675 325 9333",
            email: "m.thompson@dfat.gov.au",
          },
          createdAt: new Date("2024-01-08"),
          updatedAt: new Date("2024-12-08"),
        },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const handleAddEntity = async () => {
    try {
      const newEntity: Entity = {
        id: `entity-${Date.now()}`,
        ...entityForm,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setEntities((prev) => [...prev, newEntity]);
      setShowAddEntity(false);
      resetForm();
    } catch (error) {
      console.error("Error adding entity:", error);
    }
  };

  const resetForm = () => {
    setEntityForm({
      name: "",
      type: "" as EntityType,
      category: "" as EntityCategory,
      description: "",
      contactInfo: {
        primaryPhone: "",
        secondaryPhone: "",
        email: "",
        alternateEmail: "",
        website: "",
      } as ContactInfo,
      address: {
        street: "",
        city: "",
        province: "",
        district: "",
        postalCode: "",
        country: "Papua New Guinea",
      } as Address,
      stakeholderRole: "",
      fundingCapacity: "",
      technicalExpertise: [],
      partnerships: [],
    });
  };

  const filteredEntities = entities.filter((entity) => {
    const matchesSearch =
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || entity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getEntityStats = () => {
    const stats = {
      total: entities.length,
      active: entities.filter((e) => e.isActive).length,
      byCategory: {} as Record<string, number>,
      byType: {
        government: entities.filter((e) => e.category?.includes("GOVERNMENT"))
          .length,
        donors: entities.filter(
          (e) =>
            e.category?.includes("DONOR") || e.category?.includes("BILATERAL"),
        ).length,
        contractors: entities.filter((e) => e.category?.includes("CONTRACTOR"))
          .length,
        community: entities.filter((e) => e.category?.includes("COMMUNITY"))
          .length,
      },
    };

    Object.keys(CONNECT_PNG_ENTITIES).forEach((category) => {
      stats.byCategory[category] = entities.filter(
        (e) => e.category === category,
      ).length;
    });

    return stats;
  };

  const stats = getEntityStats();

  const renderEntityOverview = () => (
    <div className="space-y-6">
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-blue-100">Total Stakeholders</div>
              </div>
              <Building2 className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {stats.byType.government}
                </div>
                <div className="text-green-100">Government Entities</div>
              </div>
              <Flag className="h-10 w-10 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.byType.donors}</div>
                <div className="text-purple-100">Development Partners</div>
              </div>
              <Globe className="h-10 w-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{users.length}</div>
                <div className="text-orange-100">Active Users</div>
              </div>
              <Users className="h-10 w-10 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connect PNG Stakeholder Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-6 w-6" />
            Connect PNG Stakeholder Ecosystem
          </CardTitle>
          <CardDescription>
            Comprehensive stakeholder mapping for the Connect PNG road
            infrastructure program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(CONNECT_PNG_ENTITIES).map(([key, category]) => {
              const IconComponent = category.icon;
              const count = stats.byCategory[key] || 0;

              return (
                <Card
                  key={key}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${category.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base leading-tight">
                          {category.label}
                        </CardTitle>
                        <div className="text-sm text-gray-600 mt-1">
                          {count} registered • {category.entities.length} total
                          types
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-3">
                      {category.description}
                    </p>
                    <div className="space-y-1">
                      {category.entities.slice(0, 3).map((entity, index) => (
                        <div
                          key={index}
                          className="text-xs text-gray-500 flex items-center gap-1"
                        >
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          {entity}
                        </div>
                      ))}
                      {category.entities.length > 3 && (
                        <div className="text-xs text-gray-400 italic">
                          ... and {category.entities.length - 3} more entity
                          types
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => setSelectedCategory(key)}
                    >
                      View {category.label}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stakeholder Activity</CardTitle>
          <CardDescription>
            Latest updates from Connect PNG stakeholders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">
                  Department of Works & Highways
                </div>
                <div className="text-sm text-gray-600">
                  Updated project status for Mt. Hagen-Kagamuga Road
                </div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Asian Development Bank</div>
                <div className="text-sm text-gray-600">
                  Submitted quarterly disbursement report
                </div>
                <div className="text-xs text-gray-500">5 hours ago</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Flag className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">DFAT Australia</div>
                <div className="text-sm text-gray-600">
                  Approved technical assistance package
                </div>
                <div className="text-xs text-gray-500">1 day ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Connect PNG Stakeholder Management
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive stakeholder ecosystem management for the Connect PNG
            road infrastructure program
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Directory
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import Stakeholders
          </Button>
          <Button
            onClick={() => setShowAddEntity(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Register Entity
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="entities" className="gap-2">
            <Building2 className="h-4 w-4" />
            Stakeholders
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">{renderEntityOverview()}</TabsContent>

        <TabsContent value="entities" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search stakeholders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-80">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by stakeholder category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Stakeholder Categories</SelectItem>
                {Object.entries(CONNECT_PNG_ENTITIES).map(([key, category]) => (
                  <SelectItem key={key} value={key}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Entity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntities.map((entity) => {
              const categoryInfo = CONNECT_PNG_ENTITIES[entity.category];
              const IconComponent = categoryInfo?.icon || Building2;

              return (
                <Card
                  key={entity.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`p-2 rounded-lg ${categoryInfo?.color || "bg-gray-100 text-gray-800"}`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base leading-tight line-clamp-2">
                            {entity.name}
                          </CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {categoryInfo?.label || entity.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {entity.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {entity.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {entity.address.city}, {entity.address.province}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {entity.contactInfo.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <span>{entity.contactInfo.primaryPhone}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedEntity(entity)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stakeholder User Management</CardTitle>
              <CardDescription>
                Manage user accounts and access permissions across all Connect
                PNG stakeholders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">
                            {user.role.replace("_", " ")}
                          </Badge>
                          <Badge
                            className={
                              user.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {entities.find((e) => e.id === user.entityId)
                              ?.name || "Unknown Entity"}
                          </Badge>
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
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Stakeholder Reports & Analytics
              </h3>
              <p className="text-gray-600 mb-4">
                Generate comprehensive reports on stakeholder engagement and
                performance
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.total}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Stakeholders
                  </div>
                  <Button
                    size="sm"
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Directory Report
                  </Button>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.active}
                  </div>
                  <div className="text-sm text-gray-600">Active Entities</div>
                  <Button
                    size="sm"
                    className="mt-2 w-full bg-green-600 hover:bg-green-700"
                  >
                    Engagement Report
                  </Button>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.keys(CONNECT_PNG_ENTITIES).length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Stakeholder Categories
                  </div>
                  <Button
                    size="sm"
                    className="mt-2 w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Mapping Report
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardContent className="p-12 text-center">
              <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                System Configuration
              </h3>
              <p className="text-gray-600 mb-4">
                Configure stakeholder management settings and access controls
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Access Control</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Role-based Access</span>
                        <Badge className="bg-green-100 text-green-800">
                          Enabled
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Multi-entity Support</span>
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Audit Logging</span>
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Integration Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Financial Systems</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          Connected
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Document Management</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          Connected
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Reporting Engine</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          Connected
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Add Entity Modal */}
      {showAddEntity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Register New Connect PNG Stakeholder
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddEntity(false)}
                  className="text-2xl"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Entity Name *</Label>
                      <Input
                        id="name"
                        value={entityForm.name}
                        onChange={(e) =>
                          setEntityForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter full entity name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Stakeholder Category *</Label>
                      <Select
                        value={entityForm.category}
                        onValueChange={(value) =>
                          setEntityForm((prev) => ({
                            ...prev,
                            category: value as EntityCategory,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select stakeholder category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CONNECT_PNG_ENTITIES).map(
                            ([key, category]) => (
                              <SelectItem key={key} value={key}>
                                {category.label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={entityForm.description}
                      onChange={(e) =>
                        setEntityForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe the entity's role in Connect PNG program"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Primary Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={entityForm.contactInfo.email}
                        onChange={(e) =>
                          setEntityForm((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              email: e.target.value,
                            },
                          }))
                        }
                        placeholder="primary@entity.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Primary Phone *</Label>
                      <Input
                        id="phone"
                        value={entityForm.contactInfo.primaryPhone}
                        onChange={(e) =>
                          setEntityForm((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              primaryPhone: e.target.value,
                            },
                          }))
                        }
                        placeholder="+675 XXX XXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="alt-email">Alternate Email</Label>
                      <Input
                        id="alt-email"
                        type="email"
                        value={entityForm.contactInfo.alternateEmail}
                        onChange={(e) =>
                          setEntityForm((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              alternateEmail: e.target.value,
                            },
                          }))
                        }
                        placeholder="alternate@entity.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={entityForm.contactInfo.website}
                        onChange={(e) =>
                          setEntityForm((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              website: e.target.value,
                            },
                          }))
                        }
                        placeholder="https://www.entity.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City/Town *</Label>
                      <Input
                        id="city"
                        value={entityForm.address.city}
                        onChange={(e) =>
                          setEntityForm((prev) => ({
                            ...prev,
                            address: { ...prev.address, city: e.target.value },
                          }))
                        }
                        placeholder="Port Moresby"
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Province *</Label>
                      <Select
                        value={entityForm.address.province}
                        onValueChange={(value) =>
                          setEntityForm((prev) => ({
                            ...prev,
                            address: { ...prev.address, province: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVINCES.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={entityForm.address.street}
                        onChange={(e) =>
                          setEntityForm((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              street: e.target.value,
                            },
                          }))
                        }
                        placeholder="Street address and building details"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-6">
                  <Button
                    onClick={handleAddEntity}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={
                      !entityForm.name ||
                      !entityForm.category ||
                      !entityForm.contactInfo.email
                    }
                  >
                    Register Stakeholder
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddEntity(false)}
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
