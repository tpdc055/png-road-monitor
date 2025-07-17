// Enhanced Entity Management Types for Connect PNG Program

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  entity: EntityType;
  entityId: string;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
  profileImage?: string;
  contactInfo: ContactInfo;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole =
  | "SYSTEM_ADMIN"
  | "GOVERNMENT_ADMIN"
  | "DONOR_ADMIN"
  | "CONTRACTOR_ADMIN"
  | "PROVINCIAL_ADMIN"
  | "PROJECT_MANAGER"
  | "SITE_ENGINEER"
  | "FINANCIAL_OFFICER"
  | "COMMUNITY_LIAISON"
  | "AUDITOR"
  | "READ_ONLY_VIEWER";

export type EntityType =
  | "GOVERNMENT_DEPARTMENT"
  | "DONOR_AGENCY"
  | "CONTRACTOR"
  | "PROVINCIAL_OFFICE"
  | "DISTRICT_OFFICE"
  | "COMMUNITY"
  | "CONSULTANT";

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  category: EntityCategory;
  description?: string;
  contactInfo: ContactInfo;
  address: Address;
  isActive: boolean;
  parentEntityId?: string; // For hierarchical relationships
  childEntities?: string[]; // Sub-entities
  createdAt: Date;
  updatedAt: Date;
}

export type EntityCategory =
  | "CENTRAL_GOVERNMENT"
  | "PROVINCIAL_GOVERNMENT"
  | "DISTRICT_GOVERNMENT"
  | "INTERNATIONAL_DONOR"
  | "BILATERAL_DONOR"
  | "MULTILATERAL_DONOR"
  | "LOCAL_CONTRACTOR"
  | "INTERNATIONAL_CONTRACTOR"
  | "CONSULTANT"
  | "COMMUNITY_GROUP";

export interface ContactInfo {
  primaryPhone: string;
  secondaryPhone?: string;
  email: string;
  alternateEmail?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface Address {
  street: string;
  city: string;
  province: string;
  district?: string;
  postalCode?: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ConnectPNGProject extends Project {
  // Enhanced project structure for Connect PNG
  fundingSources: FundingSource[];
  totalFunding: number;
  disbursements: Disbursement[];
  stakeholders: ProjectStakeholder[];
  milestones: EnhancedMilestone[];
  compliance: ComplianceRecord[];
  communityFeedback: CommunityFeedback[];
  safeguards: SafeguardRecord[];
  documents: ProjectDocument[];
  workflow: WorkflowState;
  geography: ProjectGeography;
  sustainability: SustainabilityMetrics;
}

export interface FundingSource {
  id: string;
  donorId: string;
  donorName: string;
  donorType: "GOVERNMENT" | "INTERNATIONAL" | "BILATERAL" | "MULTILATERAL";
  fundingType: "GRANT" | "LOAN" | "TECHNICAL_ASSISTANCE" | "CO_FINANCING";
  allocatedAmount: number;
  currency: string;
  disbursedAmount: number;
  remainingAmount: number;
  conditions: string[];
  agreementDate: Date;
  expiryDate: Date;
  reportingRequirements: ReportingRequirement[];
}

export interface Disbursement {
  id: string;
  fundingSourceId: string;
  amount: number;
  currency: string;
  disbursementDate: Date;
  purpose: string;
  requestedBy: string;
  approvedBy: string;
  status: "PENDING" | "APPROVED" | "DISBURSED" | "REJECTED";
  documentation: string[];
  auditTrail: AuditTrail[];
}

export interface ProjectStakeholder {
  id: string;
  entityId: string;
  entityName: string;
  role: StakeholderRole;
  responsibility: string;
  contactPerson: string;
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
}

export type StakeholderRole =
  | "FUNDING_AGENCY"
  | "IMPLEMENTING_AGENCY"
  | "CONTRACTOR"
  | "SUPERVISOR"
  | "BENEFICIARY_COMMUNITY"
  | "OVERSIGHT_BODY"
  | "TECHNICAL_ADVISOR";

export interface EnhancedMilestone extends Milestone {
  stakeholderApprovals: StakeholderApproval[];
  evidence: Evidence[];
  impactMetrics: ImpactMetric[];
  communityVerification?: CommunityVerification;
}

export interface StakeholderApproval {
  stakeholderId: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "CONDITIONAL";
  approvalDate?: Date;
  comments?: string;
  conditions?: string[];
}

export interface Evidence {
  id: string;
  type: "PHOTO" | "VIDEO" | "DOCUMENT" | "MEASUREMENT" | "SURVEY";
  url: string;
  description: string;
  gpsLocation?: Coordinates;
  timestamp: Date;
  uploadedBy: string;
  verified: boolean;
}

export interface ImpactMetric {
  indicator: string;
  baseline: number;
  target: number;
  current: number;
  unit: string;
  measurementDate: Date;
  dataSource: string;
}

export interface CommunityFeedback {
  id: string;
  projectId: string;
  submittedBy: string;
  submitterType:
    | "COMMUNITY_MEMBER"
    | "LOCAL_LEADER"
    | "BENEFICIARY"
    | "AFFECTED_PERSON";
  feedbackType:
    | "COMPLAINT"
    | "SUGGESTION"
    | "COMPLIMENT"
    | "CONCERN"
    | "REQUEST";
  category:
    | "CONSTRUCTION_QUALITY"
    | "ENVIRONMENTAL_IMPACT"
    | "SOCIAL_IMPACT"
    | "ECONOMIC_IMPACT"
    | "ACCESS"
    | "SAFETY";
  description: string;
  location?: Coordinates;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "INVESTIGATING"
    | "RESOLVED"
    | "CLOSED";
  assignedTo?: string;
  resolution?: string;
  resolutionDate?: Date;
  submissionDate: Date;
  followUpRequired: boolean;
  contactPreference:
    | "PHONE"
    | "EMAIL"
    | "SMS"
    | "IN_PERSON"
    | "COMMUNITY_MEETING";
  isAnonymous: boolean;
  attachments?: string[];
}

export interface SafeguardRecord {
  id: string;
  type:
    | "ENVIRONMENTAL"
    | "SOCIAL"
    | "LAND_ACQUISITION"
    | "RESETTLEMENT"
    | "CULTURAL_HERITAGE";
  requirement: string;
  status:
    | "COMPLIANT"
    | "NON_COMPLIANT"
    | "PARTIALLY_COMPLIANT"
    | "UNDER_REVIEW";
  assessmentDate: Date;
  assessedBy: string;
  evidence: Evidence[];
  mitigationMeasures: string[];
  monitoringSchedule: MonitoringSchedule[];
  complianceDeadline?: Date;
}

export interface ProjectDocument {
  id: string;
  title: string;
  type: DocumentType;
  category: DocumentCategory;
  version: string;
  uploadDate: Date;
  uploadedBy: string;
  fileUrl: string;
  fileSize: number;
  accessLevel: "PUBLIC" | "STAKEHOLDERS" | "INTERNAL" | "CONFIDENTIAL";
  requiredApprovals: string[];
  approvalStatus: "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  expiryDate?: Date;
  isLatestVersion: boolean;
  relatedDocuments?: string[];
}

export type DocumentType =
  | "CONTRACT"
  | "TECHNICAL_DRAWING"
  | "PROGRESS_REPORT"
  | "FINANCIAL_REPORT"
  | "ENVIRONMENTAL_ASSESSMENT"
  | "SOCIAL_ASSESSMENT"
  | "AUDIT_REPORT"
  | "COMPLIANCE_CERTIFICATE"
  | "PERMIT"
  | "CORRESPONDENCE";

export type DocumentCategory =
  | "PLANNING"
  | "IMPLEMENTATION"
  | "MONITORING"
  | "REPORTING"
  | "COMPLIANCE"
  | "SAFEGUARDS"
  | "FINANCIAL"
  | "TECHNICAL";

export interface WorkflowState {
  currentStage: ProjectStage;
  stageProgress: number;
  nextMilestone: string;
  blockers: Blocker[];
  approvalsPending: PendingApproval[];
  workflowHistory: WorkflowHistory[];
}

export type ProjectStage =
  | "PLANNING"
  | "DESIGN"
  | "PROCUREMENT"
  | "IMPLEMENTATION"
  | "MONITORING"
  | "COMPLETION"
  | "MAINTENANCE";

export interface Blocker {
  id: string;
  type:
    | "FUNDING"
    | "APPROVAL"
    | "TECHNICAL"
    | "ENVIRONMENTAL"
    | "SOCIAL"
    | "PROCUREMENT";
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  blockedSince: Date;
  assignedTo: string;
  estimatedResolutionDate?: Date;
  mitigationActions: string[];
}

export interface PendingApproval {
  id: string;
  documentId: string;
  documentTitle: string;
  approverEntityId: string;
  approverName: string;
  requestDate: Date;
  dueDate: Date;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  remindersSent: number;
}

export interface ReportingRequirement {
  id: string;
  donorId: string;
  reportType: "PROGRESS" | "FINANCIAL" | "COMPLIANCE" | "IMPACT" | "COMPLETION";
  frequency: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "ANNUALLY" | "AD_HOC";
  template?: string;
  nextDueDate: Date;
  recipients: string[];
  autoGenerate: boolean;
}

export interface Permission {
  resource: string;
  actions: ("CREATE" | "READ" | "UPDATE" | "DELETE" | "APPROVE")[];
  conditions?: Record<string, any>;
}

export interface AuditTrail {
  id: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: Date;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

export interface MonitoringSchedule {
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "ANNUALLY";
  nextDate: Date;
  responsible: string;
  checklist: string[];
}

export interface ProjectGeography {
  startPoint: Coordinates;
  endPoint: Coordinates;
  route: Coordinates[];
  affectedAreas: GeographicArea[];
  accessPoints: AccessPoint[];
}

export interface GeographicArea {
  id: string;
  name: string;
  type: "VILLAGE" | "DISTRICT" | "PROVINCE" | "WATERSHED" | "PROTECTED_AREA";
  boundary: Coordinates[];
  population?: number;
  demographics?: Demographics;
}

export interface AccessPoint {
  id: string;
  name: string;
  type: "MAIN_ROAD" | "FEEDER_ROAD" | "BRIDGE" | "AIRSTRIP" | "PORT";
  coordinates: Coordinates;
  currentCondition: "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | "CRITICAL";
  improvements: string[];
}

export interface Demographics {
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  ageGroups: AgeGroup[];
  ethnicGroups: EthnicGroup[];
  languages: string[];
  literacy: number;
  employment: EmploymentData;
}

export interface AgeGroup {
  range: string;
  count: number;
  percentage: number;
}

export interface EthnicGroup {
  name: string;
  count: number;
  percentage: number;
}

export interface EmploymentData {
  totalLabourForce: number;
  employed: number;
  unemployed: number;
  sectors: SectorEmployment[];
}

export interface SectorEmployment {
  sector: string;
  employed: number;
  percentage: number;
}

export interface SustainabilityMetrics {
  environmentalImpact: EnvironmentalImpact;
  socialImpact: SocialImpact;
  economicImpact: EconomicImpact;
  maintenanceRequirements: MaintenanceRequirement[];
}

export interface EnvironmentalImpact {
  carbonFootprint: number;
  treesPlanted: number;
  soilErosionPrevention: number;
  waterQualityImpact: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  biodiversityImpact: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  mitigationMeasures: string[];
}

export interface SocialImpact {
  beneficiaries: number;
  jobsCreated: number;
  localContentPercentage: number;
  skillsDeveloped: SkillDevelopment[];
  communityInfrastructureImproved: string[];
  accessImprovement: AccessImprovement;
}

export interface SkillDevelopment {
  skill: string;
  peopleTrained: number;
  trainingProvider: string;
  certificationProvided: boolean;
}

export interface AccessImprovement {
  schoolsAccessible: number;
  healthFacilitiesAccessible: number;
  marketsAccessible: number;
  travelTimeReduction: number; // in minutes
  transportCostReduction: number; // percentage
}

export interface EconomicImpact {
  localProcurementValue: number;
  localProcurementPercentage: number;
  indirectJobsCreated: number;
  economicGrowthContribution: number;
  tradeFacilitation: TradeFacilitation;
}

export interface TradeFacilitation {
  cargoVolumeIncrease: number;
  newMarketsAccessed: number;
  businessesEstablished: number;
  tourismGrowth: number;
}

export interface MaintenanceRequirement {
  component: string;
  frequency: string;
  estimatedCost: number;
  responsibility: "GOVERNMENT" | "CONTRACTOR" | "COMMUNITY" | "DONOR";
  skillsRequired: string[];
  equipmentNeeded: string[];
  warrantyCovered: boolean;
  warrantyPeriod?: number;
}

export interface CommunityVerification {
  verificationDate: Date;
  verifiedBy: string;
  communityRepresentatives: string[];
  verificationMethod:
    | "SITE_VISIT"
    | "COMMUNITY_MEETING"
    | "SURVEY"
    | "FOCUS_GROUP";
  verificationStatus: "VERIFIED" | "DISPUTED" | "PARTIALLY_VERIFIED";
  comments?: string;
  evidence?: Evidence[];
}

export interface WorkflowHistory {
  id: string;
  stage: ProjectStage;
  startDate: Date;
  endDate?: Date;
  duration?: number;
  completionPercentage: number;
  achievements: string[];
  challenges: string[];
  lessonsLearned: string[];
}
