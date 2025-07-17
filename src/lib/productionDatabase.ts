// Production Database Service for PNG Road Construction Monitor
// Pure mock data mode - no database dependencies

import { MockAPIService } from "./mockApiService";

// Real-time update interface for cross-component communication
export interface RealtimeUpdate {
  id: string;
  type: "project" | "gps" | "financial" | "user";
  action: "create" | "update" | "delete";
  data: any;
  timestamp: Date;
  userId?: string;
  source?: string;
}

// Production database service in pure mock mode
class ProductionDatabaseService {
  private useMockData = true;
  private realtimeEnabled = false;
  private pngApiEnabled = false;

  constructor() {
    console.log("Production Database Service initialized in pure mock mode:", {
      useMockData: this.useMockData,
      realtimeEnabled: this.realtimeEnabled,
      pngApiEnabled: this.pngApiEnabled,
      environment: process.env.NODE_ENV,
    });
  }

  // Health check for the database service
  async healthCheck() {
    return {
      status: "healthy",
      dataSource: "mock",
      message: "Using mock data service (no database required)",
      timestamp: new Date().toISOString(),
    };
  }

  // All methods delegate to MockAPIService
  async getProjects() {
    return await MockAPIService.getProjects();
  }

  async getProject(id: string) {
    return await MockAPIService.getProject(id);
  }

  async createProject(projectData: any) {
    const result = await MockAPIService.createProject(projectData);

    // Mock real-time update
    if (this.realtimeEnabled && result.success) {
      console.log("Mock real-time update:", {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "project",
        action: "create",
        data: result.data,
        timestamp: new Date(),
      });
    }

    return result;
  }

  async getGPSEntries(projectId?: string) {
    return await MockAPIService.getGPSEntries(projectId);
  }

  async createGPSEntry(entryData: any) {
    const result = await MockAPIService.createGPSEntry(entryData);

    // Mock real-time update
    if (this.realtimeEnabled && result.success) {
      console.log("Mock real-time update:", {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "gps",
        action: "create",
        data: result.data,
        timestamp: new Date(),
      });
    }

    return result;
  }

  async getFinancialEntries(projectId?: string) {
    return await MockAPIService.getFinancialEntries(projectId);
  }

  async createFinancialEntry(entryData: any) {
    const result = await MockAPIService.createFinancialEntry(entryData);

    // Mock real-time update
    if (this.realtimeEnabled && result.success) {
      console.log("Mock real-time update:", {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "financial",
        action: "create",
        data: result.data,
        timestamp: new Date(),
      });
    }

    return result;
  }

  async getUsers() {
    return await MockAPIService.getUsers();
  }

  async getProvinces() {
    return await MockAPIService.getProvinces();
  }

  async getWorkTypes() {
    return await MockAPIService.getWorkTypes();
  }

  // Mock PNG Government API integration
  async syncWithPNGAPI() {
    return {
      success: false,
      message: "PNG API integration is disabled (mock mode)",
    };
  }

  // Configuration methods
  getConfiguration() {
    return {
      useMockData: this.useMockData,
      realtimeEnabled: this.realtimeEnabled,
      pngApiEnabled: this.pngApiEnabled,
      environment: process.env.NODE_ENV,
      mode: "pure-mock",
    };
  }
}

// Export singleton instance
export const productionDatabaseService = new ProductionDatabaseService();
