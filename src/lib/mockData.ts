// Mock data for PNG Road Construction Monitor
// This provides immediate functionality while API issues are resolved

export interface MockProject {
  id: string;
  name: string;
  description: string;
  location: string;
  provinceId: string;
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  contractor: string;
  managerId: string;
  fundingSource: string;
  latitude?: number;
  longitude?: number;
  totalDistance?: number;
  completedDistance?: number;
  contractValue?: number;
  roadStartPoint?: string;
  roadEndPoint?: string;
  tenderNumber?: string;
  contractDate?: string;
  province?: {
    id: string;
    name: string;
    code: string;
    region: string;
  };
  manager?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockProvince {
  id: string;
  name: string;
  code: string;
  region: string;
}

export interface MockGPSEntry {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  projectId: string;
  userId: string;
  taskName: string;
  workType: string;
  roadSide: string;
  startChainage: string;
  endChainage: string;
  taskDescription: string;
  photos: string[];
  timestamp: string;
  createdAt: string;
}

export interface MockFinancialEntry {
  id: string;
  projectId: string;
  userId: string;
  category: string;
  type: "EXPENSE" | "PAYMENT" | "REFUND" | "ADJUSTMENT";
  amount: number;
  description: string;
  date: string;
  invoiceNumber: string;
  vendor: string;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  currency: string;
  exchangeRate: number;
}

// Mock Provinces (PNG's 22 provinces)
export const mockProvinces: MockProvince[] = [
  { id: "prov-1", name: "Western Highlands", code: "WHP", region: "Highlands" },
  {
    id: "prov-2",
    name: "National Capital District",
    code: "NCD",
    region: "Southern",
  },
  { id: "prov-3", name: "Morobe", code: "MPL", region: "Momase" },
  { id: "prov-4", name: "Eastern Highlands", code: "EHP", region: "Highlands" },
  {
    id: "prov-5",
    name: "Southern Highlands",
    code: "SHP",
    region: "Highlands",
  },
  { id: "prov-6", name: "Central", code: "CPK", region: "Southern" },
  { id: "prov-7", name: "Chimbu", code: "CHM", region: "Highlands" },
  { id: "prov-8", name: "East New Britain", code: "ENB", region: "Islands" },
  { id: "prov-9", name: "East Sepik", code: "ESP", region: "Momase" },
  { id: "prov-10", name: "Enga", code: "ENG", region: "Highlands" },
];

// Mock Users
export const mockUsers: MockUser[] = [
  {
    id: "user-1",
    email: "admin@doworks.gov.pg",
    name: "Demo Administrator",
    role: "ADMIN",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    email: "john.kerenga@doworks.gov.pg",
    name: "John Kerenga",
    role: "PROJECT_MANAGER",
    isActive: true,
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2024-03-15T00:00:00Z",
  },
  {
    id: "user-3",
    email: "sarah.mendi@doworks.gov.pg",
    name: "Sarah Mendi",
    role: "SITE_ENGINEER",
    isActive: true,
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "user-4",
    email: "peter.waigani@doworks.gov.pg",
    name: "Peter Waigani",
    role: "FINANCIAL_OFFICER",
    isActive: true,
    createdAt: "2024-08-01T00:00:00Z",
    updatedAt: "2024-08-01T00:00:00Z",
  },
];

// Mock Projects with comprehensive PNG road construction data
export const mockProjects: MockProject[] = [
  {
    id: "proj-1",
    name: "Mt. Hagen-Kagamuga Road Upgrade",
    description:
      "Upgrade of the critical 15km road connecting Mt. Hagen city to Kagamuga Airport, including improved drainage, bridge repairs, and complete resurfacing.",
    location: "Mt. Hagen to Kagamuga Airport, Western Highlands Province",
    provinceId: "prov-1",
    status: "ACTIVE",
    progress: 68,
    budget: 45000000, // K45M
    spent: 30600000, // K30.6M
    startDate: "2024-03-01",
    endDate: "2025-06-30",
    contractor: "PNG Roads Limited",
    managerId: "user-2",
    fundingSource: "GOVERNMENT",
    latitude: -5.837104,
    longitude: 144.295472,
    totalDistance: 15.2,
    completedDistance: 10.3,
    contractValue: 45000000,
    roadStartPoint: "Mt. Hagen Town Center",
    roadEndPoint: "Kagamuga Airport",
    tenderNumber: "WHP-2024-001",
    contractDate: "2024-02-15",
    province: {
      id: "prov-1",
      name: "Western Highlands",
      code: "WHP",
      region: "Highlands",
    },
    manager: {
      id: "user-2",
      name: "John Kerenga",
      email: "john.kerenga@doworks.gov.pg",
      role: "PROJECT_MANAGER",
    },
  },
  {
    id: "proj-2",
    name: "Port Moresby Ring Road Extension",
    description:
      "Major extension of the ring road system connecting Gerehu, Morata, and surrounding suburbs to improve traffic flow and reduce congestion in Port Moresby.",
    location: "Port Moresby Metropolitan Area, National Capital District",
    provinceId: "prov-2",
    status: "ACTIVE",
    progress: 45,
    budget: 95000000, // K95M
    spent: 42750000, // K42.75M
    startDate: "2024-01-15",
    endDate: "2025-12-31",
    contractor: "Capital Infrastructure Pty Ltd",
    managerId: "user-2",
    fundingSource: "GOVERNMENT",
    latitude: -9.4438,
    longitude: 147.1803,
    totalDistance: 28.7,
    completedDistance: 12.9,
    contractValue: 95000000,
    roadStartPoint: "Gerehu Flyover",
    roadEndPoint: "Morata Junction",
    tenderNumber: "NCD-2024-002",
    contractDate: "2023-12-20",
    province: {
      id: "prov-2",
      name: "National Capital District",
      code: "NCD",
      region: "Southern",
    },
    manager: {
      id: "user-2",
      name: "John Kerenga",
      email: "john.kerenga@doworks.gov.pg",
      role: "PROJECT_MANAGER",
    },
  },
  {
    id: "proj-3",
    name: "Lae-Nadzab Highway Reconstruction",
    description:
      "Complete reconstruction of the 42km highway connecting Lae city to Nadzab Airport, including new bridges, improved drainage, and upgraded intersections.",
    location: "Lae to Nadzab Airport, Morobe Province",
    provinceId: "prov-3",
    status: "PLANNING",
    progress: 18,
    budget: 68000000, // K68M
    spent: 12240000, // K12.24M
    startDate: "2024-06-01",
    endDate: "2026-03-31",
    contractor: "Morobe Construction Group",
    managerId: "user-2",
    fundingSource: "GOVERNMENT",
    latitude: -6.7248,
    longitude: 147.0003,
    totalDistance: 42.1,
    completedDistance: 7.6,
    contractValue: 68000000,
    roadStartPoint: "Lae Port Junction",
    roadEndPoint: "Nadzab Airport Terminal",
    tenderNumber: "MPL-2024-003",
    contractDate: "2024-05-10",
    province: {
      id: "prov-3",
      name: "Morobe",
      code: "MPL",
      region: "Momase",
    },
    manager: {
      id: "user-2",
      name: "John Kerenga",
      email: "john.kerenga@doworks.gov.pg",
      role: "PROJECT_MANAGER",
    },
  },
  {
    id: "proj-4",
    name: "Highlands Highway Maintenance Program",
    description:
      "Comprehensive maintenance program for the Highlands Highway covering critical sections from Lae to Mt. Hagen with emphasis on landslide prevention.",
    location: "Lae to Mt. Hagen via Highlands Highway",
    provinceId: "prov-4",
    status: "ACTIVE",
    progress: 32,
    budget: 52000000, // K52M
    spent: 16640000, // K16.64M
    startDate: "2024-02-01",
    endDate: "2025-08-31",
    contractor: "Highlands Road Maintenance Ltd",
    managerId: "user-2",
    fundingSource: "GOVERNMENT",
    latitude: -6.0847,
    longitude: 145.3933,
    totalDistance: 165.8,
    completedDistance: 53.1,
    contractValue: 52000000,
    roadStartPoint: "Lae Industrial Area",
    roadEndPoint: "Mt. Hagen Central",
    tenderNumber: "HHP-2024-004",
    contractDate: "2024-01-18",
    province: {
      id: "prov-4",
      name: "Eastern Highlands",
      code: "EHP",
      region: "Highlands",
    },
    manager: {
      id: "user-2",
      name: "John Kerenga",
      email: "john.kerenga@doworks.gov.pg",
      role: "PROJECT_MANAGER",
    },
  },
  {
    id: "proj-5",
    name: "Vanimo-Green River Road Upgrade",
    description:
      "Upgrading the coastal road connecting Vanimo to Green River to improve access to the Indonesia border and support economic development in Sandaun Province.",
    location: "Vanimo to Green River, Sandaun Province",
    provinceId: "prov-5",
    status: "ON_HOLD",
    progress: 8,
    budget: 38000000, // K38M
    spent: 3040000, // K3.04M
    startDate: "2024-04-01",
    endDate: "2025-10-31",
    contractor: "Border Region Contractors",
    managerId: "user-2",
    fundingSource: "GOVERNMENT",
    latitude: -2.6816,
    longitude: 141.3031,
    totalDistance: 38.4,
    completedDistance: 3.1,
    contractValue: 38000000,
    roadStartPoint: "Vanimo Town Center",
    roadEndPoint: "Green River Bridge",
    tenderNumber: "SDP-2024-005",
    contractDate: "2024-03-25",
    province: {
      id: "prov-5",
      name: "Sandaun",
      code: "SDP",
      region: "Momase",
    },
    manager: {
      id: "user-2",
      name: "John Kerenga",
      email: "john.kerenga@doworks.gov.pg",
      role: "PROJECT_MANAGER",
    },
  },
];

// Mock GPS Entries
export const mockGPSEntries: MockGPSEntry[] = [
  // Mt. Hagen-Kagamuga Road Upgrade (proj-1)
  {
    id: "gps-1",
    latitude: -5.837104,
    longitude: 144.295472,
    description: "Mt. Hagen Town Center - Project Start Point",
    projectId: "proj-1",
    userId: "user-3",
    taskName: "Site Survey and Traffic Count",
    workType: "Survey",
    roadSide: "Both",
    startChainage: "0+000",
    endChainage: "0+500",
    taskDescription:
      "Initial site survey, traffic count, and existing condition assessment",
    photos: [],
    timestamp: "2024-03-05T08:30:00Z",
    createdAt: "2024-03-05T08:30:00Z",
  },
  {
    id: "gps-2",
    latitude: -5.84589,
    longitude: 144.310456,
    description: "Kagamuga Road Mid-section Bridge Construction",
    projectId: "proj-1",
    userId: "user-3",
    taskName: "Bridge Foundation Work",
    workType: "Construction",
    roadSide: "Both",
    startChainage: "7+200",
    endChainage: "7+800",
    taskDescription:
      "Bridge foundation and abutment construction over Kagamuga Creek",
    photos: [],
    timestamp: "2024-07-12T09:45:00Z",
    createdAt: "2024-07-12T09:45:00Z",
  },
  {
    id: "gps-3",
    latitude: -5.856789,
    longitude: 144.326543,
    description: "Kagamuga Airport Terminal Approach",
    projectId: "proj-1",
    userId: "user-3",
    taskName: "Road Surface Completion",
    workType: "Construction",
    roadSide: "Both",
    startChainage: "14+500",
    endChainage: "15+200",
    taskDescription: "Final road surface and airport approach road completion",
    photos: [],
    timestamp: "2024-07-15T11:20:00Z",
    createdAt: "2024-07-15T11:20:00Z",
  },

  // Port Moresby Ring Road Extension (proj-2)
  {
    id: "gps-4",
    latitude: -9.4438,
    longitude: 147.1803,
    description: "Jacksons Airport Junction - Ring Road Extension",
    projectId: "proj-2",
    userId: "user-3",
    taskName: "Foundation Preparation",
    workType: "Construction",
    roadSide: "Left",
    startChainage: "1+200",
    endChainage: "1+800",
    taskDescription:
      "Foundation preparation and utility relocation for ring road extension",
    photos: [],
    timestamp: "2024-01-20T10:15:00Z",
    createdAt: "2024-01-20T10:15:00Z",
  },
  {
    id: "gps-5",
    latitude: -9.4789,
    longitude: 147.1456,
    description: "Gerehu Flyover Construction Zone",
    projectId: "proj-2",
    userId: "user-3",
    taskName: "Flyover Structural Work",
    workType: "Construction",
    roadSide: "Both",
    startChainage: "8+400",
    endChainage: "9+200",
    taskDescription:
      "Main flyover structural work and approach road construction",
    photos: [],
    timestamp: "2024-06-28T13:15:00Z",
    createdAt: "2024-06-28T13:15:00Z",
  },
  {
    id: "gps-6",
    latitude: -9.5123,
    longitude: 147.1098,
    description: "Morata Junction Intersection Upgrade",
    projectId: "proj-2",
    userId: "user-3",
    taskName: "Traffic Light Installation",
    workType: "Infrastructure",
    roadSide: "Central",
    startChainage: "26+800",
    endChainage: "27+200",
    taskDescription: "Traffic light system installation and road marking",
    photos: [],
    timestamp: "2024-07-05T16:30:00Z",
    createdAt: "2024-07-05T16:30:00Z",
  },

  // Lae-Nadzab Highway Reconstruction (proj-3)
  {
    id: "gps-7",
    latitude: -6.7248,
    longitude: 147.0003,
    description: "Lae Port Access Road Assessment",
    projectId: "proj-3",
    userId: "user-3",
    taskName: "Environmental Assessment",
    workType: "Assessment",
    roadSide: "Both",
    startChainage: "0+000",
    endChainage: "2+000",
    taskDescription:
      "Environmental impact assessment and cultural heritage survey",
    photos: [],
    timestamp: "2024-06-15T14:30:00Z",
    createdAt: "2024-06-15T14:30:00Z",
  },
  {
    id: "gps-8",
    latitude: -6.6789,
    longitude: 146.9456,
    description: "Nadzab Highway Bridge Planning",
    projectId: "proj-3",
    userId: "user-3",
    taskName: "Bridge Design Survey",
    workType: "Survey",
    roadSide: "Both",
    startChainage: "18+400",
    endChainage: "19+200",
    taskDescription: "Bridge design survey and geotechnical investigation",
    photos: [],
    timestamp: "2024-07-22T10:45:00Z",
    createdAt: "2024-07-22T10:45:00Z",
  },

  // Highlands Highway Maintenance (proj-4)
  {
    id: "gps-9",
    latitude: -6.0847,
    longitude: 145.3933,
    description: "Highlands Highway Landslide Prevention",
    projectId: "proj-4",
    userId: "user-3",
    taskName: "Retaining Wall Construction",
    workType: "Maintenance",
    roadSide: "Left",
    startChainage: "45+200",
    endChainage: "46+800",
    taskDescription: "Retaining wall construction for landslide prevention",
    photos: [],
    timestamp: "2024-05-18T07:20:00Z",
    createdAt: "2024-05-18T07:20:00Z",
  },
  {
    id: "gps-10",
    latitude: -6.1234,
    longitude: 145.4567,
    description: "Kainantu Section Road Repairs",
    projectId: "proj-4",
    userId: "user-3",
    taskName: "Pothole Repair and Resurfacing",
    workType: "Maintenance",
    roadSide: "Both",
    startChainage: "78+600",
    endChainage: "82+400",
    taskDescription: "Major pothole repairs and road resurfacing work",
    photos: [],
    timestamp: "2024-07-08T12:00:00Z",
    createdAt: "2024-07-08T12:00:00Z",
  },

  // Vanimo-Green River Road (proj-5)
  {
    id: "gps-11",
    latitude: -2.6816,
    longitude: 141.3031,
    description: "Vanimo Town Center - Border Road Start",
    projectId: "proj-5",
    userId: "user-3",
    taskName: "Initial Site Assessment",
    workType: "Assessment",
    roadSide: "Both",
    startChainage: "0+000",
    endChainage: "1+000",
    taskDescription: "Initial site assessment and environmental clearance",
    photos: [],
    timestamp: "2024-04-15T09:00:00Z",
    createdAt: "2024-04-15T09:00:00Z",
  },
];

// Mock Financial Entries
export const mockFinancialEntries: MockFinancialEntry[] = [
  {
    id: "fin-1",
    projectId: "proj-1",
    userId: "user-2",
    category: "MATERIALS",
    type: "EXPENSE",
    amount: 2500000, // K2.5M
    description: "Aggregate, bitumen, and cement delivery for road surfacing",
    date: "2024-03-10",
    invoiceNumber: "INV-2024-001",
    vendor: "PNG Materials Supply Co.",
    isApproved: true,
    approvedBy: "user-1",
    approvedAt: "2024-03-12",
    currency: "PGK",
    exchangeRate: 1.0,
  },
  {
    id: "fin-2",
    projectId: "proj-2",
    userId: "user-2",
    category: "EQUIPMENT",
    type: "EXPENSE",
    amount: 1800000, // K1.8M
    description: "Heavy machinery rental - excavators, graders, and compactors",
    date: "2024-01-25",
    invoiceNumber: "INV-2024-002",
    vendor: "PNG Heavy Equipment Hire",
    isApproved: true,
    approvedBy: "user-1",
    approvedAt: "2024-01-26",
    currency: "PGK",
    exchangeRate: 1.0,
  },
  {
    id: "fin-3",
    projectId: "proj-1",
    userId: "user-4",
    category: "LABOR",
    type: "PAYMENT",
    amount: 3200000, // K3.2M
    description: "Monthly wages for construction crew - December 2024",
    date: "2024-12-01",
    invoiceNumber: "PAY-2024-003",
    vendor: "PNG Roads Limited",
    isApproved: true,
    approvedBy: "user-1",
    approvedAt: "2024-12-02",
    currency: "PGK",
    exchangeRate: 1.0,
  },
  {
    id: "fin-4",
    projectId: "proj-2",
    userId: "user-4",
    category: "UTILITIES",
    type: "EXPENSE",
    amount: 850000, // K850K
    description: "Utility relocation and protection works",
    date: "2024-11-15",
    invoiceNumber: "INV-2024-004",
    vendor: "PNG Power Limited",
    isApproved: true,
    approvedBy: "user-1",
    approvedAt: "2024-11-16",
    currency: "PGK",
    exchangeRate: 1.0,
  },
  {
    id: "fin-5",
    projectId: "proj-3",
    userId: "user-4",
    category: "CONSULTING",
    type: "EXPENSE",
    amount: 620000, // K620K
    description: "Environmental and social impact assessment consultancy",
    date: "2024-06-20",
    invoiceNumber: "INV-2024-005",
    vendor: "Pacific Environmental Consultants",
    isApproved: true,
    approvedBy: "user-1",
    approvedAt: "2024-06-22",
    currency: "PGK",
    exchangeRate: 1.0,
  },
];

// Summary statistics for dashboard
export const mockDashboardStats = {
  totalProjects: mockProjects.length,
  activeProjects: mockProjects.filter((p) => p.status === "ACTIVE").length,
  totalBudget: mockProjects.reduce((sum, p) => sum + p.budget, 0),
  totalSpent: mockProjects.reduce((sum, p) => sum + p.spent, 0),
  averageProgress: Math.round(
    mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length,
  ),
  totalGPSEntries: mockGPSEntries.length,
  totalFinancialEntries: mockFinancialEntries.length,
  provincesWithProjects: new Set(mockProjects.map((p) => p.provinceId)).size,
};

// Mock API Response Helper
export function createMockAPIResponse<T>(
  data: T,
  success = true,
  message = "Success",
) {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}
