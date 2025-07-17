export interface FinancialSummary {
  projectId: string;
  totalBudget: number;
  totalSpent: number;
  totalCommitted: number;
  remainingBudget: number;
  percentageSpent: number;
  forecastFinalCost: number;
  varianceAmount: number;
  variancePercentage: number;
  contingencyUsed: number;
  contingencyRemaining: number;
  unplannedCosts: number;
  changeOrdersCost: number;
  costPerformanceIndex: number;
  schedulePerformanceIndex: number;
}

export interface FinancialTransaction {
  id: string;
  projectId: string;
  type: "payment" | "receipt" | "commitment" | "adjustment";
  category: string;
  amount: number;
  description: string;
  date: Date;
  reference: string;
  vendor?: string;
  approvedBy?: string;
  status: "pending" | "approved" | "paid" | "cancelled";
}

export interface UnplannedCost {
  id: string;
  projectId: string;
  category: string;
  description: string;
  amount: number;
  reason: string;
  impact: "low" | "medium" | "high";
  date: Date;
  reportedBy: string;
  approvalStatus: "pending" | "approved" | "rejected";
  mitigationPlan?: string;
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  title: string;
  description: string;
  reason: string;
  costImpact: number;
  timeImpact: number; // days
  requestedBy: string;
  requestDate: Date;
  status:
    | "draft"
    | "submitted"
    | "under-review"
    | "approved"
    | "rejected"
    | "implemented";
  approvedBy?: string;
  approvalDate?: Date;
  implementation?: {
    startDate: Date;
    endDate?: Date;
    actualCost?: number;
    notes?: string;
  };
}

export interface FinancialAlert {
  id: string;
  projectId: string;
  type:
    | "budget-threshold"
    | "payment-overdue"
    | "variance-high"
    | "cash-flow"
    | "approval-required";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  details?: string;
  createdAt: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
}

// Funding Sources and Donor Management Types
export interface DonorAgency {
  id: string;
  name: string;
  type: "multilateral" | "bilateral" | "commercial" | "government";
  country?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  specializations: string[];
  pngOffice?: {
    address: string;
    contactPerson: string;
    phone: string;
    email: string;
  };
}

export interface FundingProgram {
  id: string;
  donorId: string;
  name: string;
  description: string;
  sector: string;
  totalAmount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "completed" | "suspended" | "cancelled";
  eligibilityCriteria: string[];
  restrictions: string[];
  reportingRequirements: string[];
}

export interface FundingSource {
  id: string;
  projectId: string;
  donorId: string;
  programId?: string;
  sourceName: string;
  sourceType:
    | "grant"
    | "loan"
    | "concessional-loan"
    | "commercial-loan"
    | "government-budget";
  amount: number;
  currency: string;
  exchangeRate?: number;
  amountKina: number;
  percentage: number;
  status: "committed" | "disbursed" | "pending" | "cancelled";
  agreementDate?: Date;
  firstDisbursementDate?: Date;
  finalDisbursementDate?: Date;
  interestRate?: number;
  repaymentTerms?: string;
  conditions: FundingCondition[];
  disbursements: Disbursement[];
  reportingRequirements: ReportingRequirement[];
}

export interface FundingCondition {
  id: string;
  fundingSourceId: string;
  type:
    | "procurement"
    | "environmental"
    | "social"
    | "technical"
    | "financial"
    | "legal";
  description: string;
  status: "pending" | "in-progress" | "completed" | "waived";
  dueDate?: Date;
  completedDate?: Date;
  responsible: string;
  notes?: string;
}

export interface Disbursement {
  id: string;
  fundingSourceId: string;
  plannedAmount: number;
  actualAmount?: number;
  plannedDate: Date;
  actualDate?: Date;
  status: "scheduled" | "requested" | "approved" | "disbursed" | "delayed";
  conditions: string[];
  requestedBy?: string;
  approvedBy?: string;
  notes?: string;
  supportingDocuments: string[];
}

export interface ReportingRequirement {
  id: string;
  fundingSourceId: string;
  type:
    | "financial"
    | "progress"
    | "completion"
    | "audit"
    | "environmental"
    | "social";
  title: string;
  description: string;
  frequency:
    | "monthly"
    | "quarterly"
    | "semi-annual"
    | "annual"
    | "milestone-based"
    | "one-time";
  dueDate: Date;
  status: "pending" | "in-progress" | "submitted" | "approved" | "overdue";
  submittedDate?: Date;
  approvedDate?: Date;
  submittedBy?: string;
  approvedBy?: string;
  template?: string;
  notes?: string;
}

// PNG-specific donor data
export const PNG_COMMON_DONORS: Partial<DonorAgency>[] = [
  {
    name: "Asian Development Bank",
    type: "multilateral",
    specializations: ["Infrastructure", "Transport", "Rural Development"],
    pngOffice: {
      address: "Level 3, Pacific Place, Kumul Highway, Port Moresby",
      contactPerson: "PNG Resident Mission",
      phone: "+675 321 0400",
      email: "adbpng@adb.org",
    },
  },
  {
    name: "World Bank",
    type: "multilateral",
    specializations: ["Infrastructure", "Governance", "Economic Development"],
    pngOffice: {
      address: "Level 8, Pacific Place, Kumul Highway, Port Moresby",
      contactPerson: "PNG Country Office",
      phone: "+675 321 1500",
      email: "png@worldbank.org",
    },
  },
  {
    name: "Australian Department of Foreign Affairs and Trade",
    type: "bilateral",
    country: "Australia",
    specializations: ["Infrastructure", "Governance", "Health", "Education"],
  },
  {
    name: "Japan International Cooperation Agency",
    type: "bilateral",
    country: "Japan",
    specializations: [
      "Infrastructure",
      "Technical Cooperation",
      "Capacity Building",
    ],
  },
  {
    name: "European Union",
    type: "multilateral",
    specializations: ["Rural Development", "Governance", "Trade"],
  },
  {
    name: "China EXIM Bank",
    type: "bilateral",
    country: "China",
    specializations: ["Infrastructure", "Transport", "Energy"],
  },
];

export const PNG_FUNDING_PROGRAMS = [
  "PNG-Australia Partnership for Development Cooperation",
  "ADB PNG Transport Sector Development Program",
  "World Bank PNG Rural Communications Project",
  "EU Rural Development Programme",
  "JICA Transport Infrastructure Development",
  "China Belt and Road Initiative - PNG",
];

// Budget categories specific to PNG road construction
export const PNG_BUDGET_CATEGORIES = [
  "Land Acquisition",
  "Earthworks",
  "Drainage",
  "Pavement",
  "Bridges",
  "Culverts",
  "Road Furniture",
  "Signage",
  "Environmental Mitigation",
  "Social Safeguards",
  "Project Management",
  "Supervision",
  "Contingency",
];
