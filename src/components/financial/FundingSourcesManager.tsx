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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Disbursement,
  type DonorAgency,
  FundingCondition,
  FundingProgram,
  type FundingSource,
  PNG_COMMON_DONORS,
  PNG_FUNDING_PROGRAMS,
  ReportingRequirement,
} from "@/types/financial";
import {
  AlertCircle,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface FundingSourcesManagerProps {
  projectId: string;
  projectName: string;
}

export default function FundingSourcesManager({
  projectId,
  projectName,
}: FundingSourcesManagerProps) {
  const [fundingSources, setFundingSources] = useState<FundingSource[]>([]);
  const [donorAgencies, setDonorAgencies] = useState<DonorAgency[]>([]);
  const [activeTab, setActiveTab] = useState("sources");
  const [editingSource, setEditingSource] = useState<FundingSource | null>(
    null,
  );
  const [editingDonor, setEditingDonor] = useState<DonorAgency | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadFundingData();
  }, [projectId]);

  const loadFundingData = () => {
    // Mock funding sources data
    const mockSources: FundingSource[] = [
      {
        id: "fs1",
        projectId,
        donorId: "adb1",
        sourceName: "ADB Road Development Loan",
        sourceType: "concessional-loan",
        amount: 50000000,
        currency: "USD",
        exchangeRate: 3.7,
        amountKina: 185000000,
        percentage: 60,
        status: "disbursed",
        agreementDate: new Date("2023-06-15"),
        firstDisbursementDate: new Date("2023-09-01"),
        interestRate: 1.5,
        repaymentTerms: "20 years with 5-year grace period",
        conditions: [],
        disbursements: [],
        reportingRequirements: [],
      },
      {
        id: "fs2",
        projectId,
        donorId: "wb1",
        sourceName: "World Bank Transport Grant",
        sourceType: "grant",
        amount: 15000000,
        currency: "USD",
        exchangeRate: 3.7,
        amountKina: 55500000,
        percentage: 25,
        status: "committed",
        agreementDate: new Date("2023-08-20"),
        conditions: [],
        disbursements: [],
        reportingRequirements: [],
      },
      {
        id: "fs3",
        projectId,
        donorId: "gov1",
        sourceName: "PNG Government Counterpart",
        sourceType: "government-budget",
        amount: 15000000,
        currency: "PGK",
        amountKina: 15000000,
        percentage: 15,
        status: "committed",
        conditions: [],
        disbursements: [],
        reportingRequirements: [],
      },
    ];

    // Mock donor agencies
    const mockDonors: DonorAgency[] = [
      {
        id: "adb1",
        name: "Asian Development Bank",
        type: "multilateral",
        contactPerson: "Maria Santos",
        email: "msantos@adb.org",
        phone: "+675 321 0400",
        address: "Level 3, Pacific Place, Port Moresby",
        specializations: ["Infrastructure", "Transport", "Rural Development"],
        pngOffice: {
          address: "Level 3, Pacific Place, Kumul Highway, Port Moresby",
          contactPerson: "PNG Resident Mission",
          phone: "+675 321 0400",
          email: "adbpng@adb.org",
        },
      },
      {
        id: "wb1",
        name: "World Bank",
        type: "multilateral",
        contactPerson: "John Mitchell",
        email: "jmitchell@worldbank.org",
        phone: "+675 321 1500",
        address: "Level 8, Pacific Place, Port Moresby",
        specializations: [
          "Infrastructure",
          "Governance",
          "Economic Development",
        ],
        pngOffice: {
          address: "Level 8, Pacific Place, Kumul Highway, Port Moresby",
          contactPerson: "PNG Country Office",
          phone: "+675 321 1500",
          email: "png@worldbank.org",
        },
      },
      {
        id: "gov1",
        name: "PNG Department of Treasury",
        type: "government",
        country: "Papua New Guinea",
        contactPerson: "Peter Kila",
        email: "pkila@treasury.gov.pg",
        phone: "+675 313 4444",
        address: "Central Government Offices, Waigani",
        specializations: ["Government Budget", "Public Finance"],
      },
    ];

    setFundingSources(mockSources);
    setDonorAgencies(mockDonors);
  };

  const formatCurrency = (amount: number, currency = "PGK") => {
    if (currency === "PGK") {
      return `K ${(amount / 1000000).toFixed(1)}M`;
    }
    return `${currency} ${(amount / 1000000).toFixed(1)}M`;
  };

  const getDonorName = (donorId: string) => {
    const donor = donorAgencies.find((d) => d.id === donorId);
    return donor?.name || "Unknown Donor";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disbursed":
        return "bg-green-100 text-green-800";
      case "committed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "grant":
        return "bg-green-100 text-green-800";
      case "loan":
        return "bg-blue-100 text-blue-800";
      case "concessional-loan":
        return "bg-purple-100 text-purple-800";
      case "commercial-loan":
        return "bg-orange-100 text-orange-800";
      case "government-budget":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalFunding = fundingSources.reduce(
    (sum, source) => sum + source.amountKina,
    0,
  );
  const disbursedFunding = fundingSources
    .filter((source) => source.status === "disbursed")
    .reduce((sum, source) => sum + source.amountKina, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Funding Sources Management
          </h3>
          <p className="text-gray-600">
            {projectName} - Donor and Funding Administration
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Funding Source
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Funding</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalFunding)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disbursed</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(disbursedFunding)}
                </p>
                <p className="text-xs text-gray-500">
                  {((disbursedFunding / totalFunding) * 100).toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Donors</p>
                <p className="text-2xl font-bold text-purple-600">
                  {donorAgencies.length}
                </p>
              </div>
              <Building className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Funding Sources</p>
                <p className="text-2xl font-bold text-orange-600">
                  {fundingSources.length}
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="sources">Funding Sources</TabsTrigger>
          <TabsTrigger value="donors">Donor Agencies</TabsTrigger>
          <TabsTrigger value="disbursements">Disbursements</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Funding Sources</CardTitle>
              <CardDescription>
                All funding sources and their current status for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source Name</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fundingSources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell className="font-medium">
                        {source.sourceName}
                      </TableCell>
                      <TableCell>{getDonorName(source.donorId)}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(source.sourceType)}>
                          {source.sourceType.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {formatCurrency(source.amountKina)}
                          </div>
                          {source.currency !== "PGK" && (
                            <div className="text-xs text-gray-500">
                              {formatCurrency(source.amount, source.currency)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(source.status)}>
                          {source.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donor Agencies</CardTitle>
              <CardDescription>
                Manage donor agency information and contacts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agency Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Specializations</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donorAgencies.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell className="font-medium">
                        {donor.name}
                        {donor.country && (
                          <div className="text-xs text-gray-500">
                            {donor.country}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{donor.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {donor.contactPerson}
                          </div>
                          <div className="text-xs text-gray-500">
                            {donor.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {donor.specializations
                            .slice(0, 2)
                            .map((spec, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {spec}
                              </Badge>
                            ))}
                          {donor.specializations.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{donor.specializations.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disbursements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Disbursement Schedule</CardTitle>
              <CardDescription>
                Track planned and actual fund disbursements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Disbursement Tracking
                </h3>
                <p className="text-gray-600 mb-4">
                  Detailed disbursement schedules and tracking will be displayed
                  here
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Disbursement Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
