// Mock API Service for PNG Road Construction Monitor
// This provides immediate functionality by simulating API responses

import {
  mockProjects,
  mockUsers,
  mockProvinces,
  mockGPSEntries,
  mockFinancialEntries,
  type mockDashboardStats,
  createMockAPIResponse,
  type MockProject,
  type MockUser,
  type MockProvince,
  type MockGPSEntry,
  type MockFinancialEntry
} from './mockData';

// Configuration flag to enable/disable mock mode
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Simulate API delay
const simulateDelay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export class MockAPIService {
  // Projects
  static async getProjects(): Promise<{ success: boolean; data: MockProject[]; count: number }> {
    await simulateDelay();
    return {
      success: true,
      data: mockProjects,
      count: mockProjects.length
    };
  }

  static async getProject(id: string): Promise<{ success: boolean; data: MockProject | null }> {
    await simulateDelay();
    const project = mockProjects.find(p => p.id === id);
    return {
      success: !!project,
      data: project || null
    };
  }

  static async createProject(projectData: Partial<MockProject>): Promise<{ success: boolean; data: MockProject }> {
    await simulateDelay();
    const newProject: MockProject = {
      id: `proj-${Date.now()}`,
      name: projectData.name || 'New Project',
      description: projectData.description || '',
      location: projectData.location || '',
      provinceId: projectData.provinceId || 'prov-1',
      status: projectData.status || 'PLANNING',
      progress: projectData.progress || 0,
      budget: projectData.budget || 0,
      spent: projectData.spent || 0,
      startDate: projectData.startDate || new Date().toISOString(),
      endDate: projectData.endDate || new Date().toISOString(),
      contractor: projectData.contractor || '',
      managerId: projectData.managerId || 'user-2',
      fundingSource: projectData.fundingSource || 'GOVERNMENT'
    };

    mockProjects.push(newProject);
    return {
      success: true,
      data: newProject
    };
  }

  // Users
  static async getUsers(): Promise<{ success: boolean; data: MockUser[]; count: number }> {
    await simulateDelay();
    return {
      success: true,
      data: mockUsers,
      count: mockUsers.length
    };
  }

  static async getUser(id: string): Promise<{ success: boolean; data: MockUser | null }> {
    await simulateDelay();
    const user = mockUsers.find(u => u.id === id);
    return {
      success: !!user,
      data: user || null
    };
  }

  // Provinces
  static async getProvinces(): Promise<{ success: boolean; data: MockProvince[]; count: number }> {
    await simulateDelay();
    return {
      success: true,
      data: mockProvinces,
      count: mockProvinces.length
    };
  }

  // GPS Entries
  static async getGPSEntries(projectId?: string): Promise<{ success: boolean; data: MockGPSEntry[]; count: number }> {
    await simulateDelay();
    const filteredEntries = projectId
      ? mockGPSEntries.filter(entry => entry.projectId === projectId)
      : mockGPSEntries;

    return {
      success: true,
      data: filteredEntries,
      count: filteredEntries.length
    };
  }

  static async createGPSEntry(entryData: Partial<MockGPSEntry>): Promise<{ success: boolean; data: MockGPSEntry }> {
    await simulateDelay();
    const newEntry: MockGPSEntry = {
      id: `gps-${Date.now()}`,
      latitude: entryData.latitude || 0,
      longitude: entryData.longitude || 0,
      description: entryData.description || '',
      projectId: entryData.projectId || 'proj-1',
      userId: entryData.userId || 'user-3',
      taskName: entryData.taskName || '',
      workType: entryData.workType || '',
      roadSide: entryData.roadSide || '',
      startChainage: entryData.startChainage || '',
      endChainage: entryData.endChainage || '',
      taskDescription: entryData.taskDescription || '',
      photos: entryData.photos || [],
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    mockGPSEntries.push(newEntry);
    return {
      success: true,
      data: newEntry
    };
  }

  // Financial Entries
  static async getFinancialEntries(projectId?: string): Promise<{ success: boolean; data: MockFinancialEntry[]; count: number }> {
    await simulateDelay();
    const filteredEntries = projectId
      ? mockFinancialEntries.filter(entry => entry.projectId === projectId)
      : mockFinancialEntries;

    return {
      success: true,
      data: filteredEntries,
      count: filteredEntries.length
    };
  }

  static async createFinancialEntry(entryData: Partial<MockFinancialEntry>): Promise<{ success: boolean; data: MockFinancialEntry }> {
    await simulateDelay();
    const newEntry: MockFinancialEntry = {
      id: `fin-${Date.now()}`,
      projectId: entryData.projectId || 'proj-1',
      userId: entryData.userId || 'user-4',
      category: entryData.category || 'MATERIALS',
      type: entryData.type || 'EXPENSE',
      amount: entryData.amount || 0,
      description: entryData.description || '',
      date: entryData.date || new Date().toISOString().split('T')[0],
      invoiceNumber: entryData.invoiceNumber || `INV-${Date.now()}`,
      vendor: entryData.vendor || '',
      isApproved: entryData.isApproved || false,
      currency: entryData.currency || 'PGK',
      exchangeRate: entryData.exchangeRate || 1.0
    };

    mockFinancialEntries.push(newEntry);
    return {
      success: true,
      data: newEntry
    };
  }

  // Dashboard Stats
  static async getDashboardStats(): Promise<{ success: boolean; data: typeof mockDashboardStats }> {
    await simulateDelay();
    // Recalculate stats in case data has changed
    const stats = {
      totalProjects: mockProjects.length,
      activeProjects: mockProjects.filter(p => p.status === 'ACTIVE').length,
      totalBudget: mockProjects.reduce((sum, p) => sum + p.budget, 0),
      totalSpent: mockProjects.reduce((sum, p) => sum + p.spent, 0),
      averageProgress: Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length),
      totalGPSEntries: mockGPSEntries.length,
      totalFinancialEntries: mockFinancialEntries.length,
      provincesWithProjects: new Set(mockProjects.map(p => p.provinceId)).size
    };

    return {
      success: true,
      data: stats
    };
  }

  // Authentication
  static async login(email: string, password: string): Promise<{ success: boolean; data?: { user: MockUser; token: string } }> {
    await simulateDelay();

    // Simple mock authentication
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return { success: false };
    }

    // In real implementation, you'd verify the password
    return {
      success: true,
      data: {
        user,
        token: `mock-jwt-token-${user.id}-${Date.now()}`
      }
    };
  }

  // Work Types
  static async getWorkTypes(): Promise<{ success: boolean; data: Array<{ id: string; name: string; category: string }> }> {
    await simulateDelay();
    return {
      success: true,
      data: [
        { id: 'wt-1', name: 'Road Construction', category: 'Infrastructure' },
        { id: 'wt-2', name: 'Bridge Construction', category: 'Infrastructure' },
        { id: 'wt-3', name: 'Road Maintenance', category: 'Maintenance' },
        { id: 'wt-4', name: 'Drainage Work', category: 'Infrastructure' },
        { id: 'wt-5', name: 'Surveying', category: 'Survey' },
        { id: 'wt-6', name: 'Quality Inspection', category: 'Quality Control' },
        { id: 'wt-7', name: 'Environmental Assessment', category: 'Environmental' },
        { id: 'wt-8', name: 'Traffic Management', category: 'Safety' }
      ]
    };
  }

  // Health Check
  static async healthCheck(): Promise<{ success: boolean; message: string; timestamp: string }> {
    await simulateDelay(100);
    return {
      success: true,
      message: 'Mock API service is running successfully',
      timestamp: new Date().toISOString()
    };
  }
}

// API Client wrapper that switches between real and mock APIs
export class APIClient {
  private static baseURL = '/api/v1';

  private static async request(endpoint: string, options: RequestInit = {}) {
    if (USE_MOCK_DATA) {
      // Route to appropriate mock method based on endpoint
      return this.routeToMockAPI(endpoint, options);
    }

    // Real API call
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private static async routeToMockAPI(endpoint: string, options: RequestInit) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : null;

    // Route to appropriate mock service method
    switch (true) {
      case endpoint === '/projects' && method === 'GET':
        return MockAPIService.getProjects();

      case endpoint === '/projects' && method === 'POST':
        return MockAPIService.createProject(body);

      case endpoint.startsWith('/projects/') && method === 'GET':
        const projectId = endpoint.split('/')[2];
        return MockAPIService.getProject(projectId);

      case endpoint === '/users' && method === 'GET':
        return MockAPIService.getUsers();

      case endpoint.startsWith('/users/') && method === 'GET':
        const userId = endpoint.split('/')[2];
        return MockAPIService.getUser(userId);

      case endpoint === '/provinces' && method === 'GET':
        return MockAPIService.getProvinces();

      case endpoint === '/gps' && method === 'GET':
        return MockAPIService.getGPSEntries();

      case endpoint === '/gps' && method === 'POST':
        return MockAPIService.createGPSEntry(body);

      case endpoint === '/financial' && method === 'GET':
        return MockAPIService.getFinancialEntries();

      case endpoint === '/financial' && method === 'POST':
        return MockAPIService.createFinancialEntry(body);

      case endpoint === '/work-types' && method === 'GET':
        return MockAPIService.getWorkTypes();

      case endpoint === '/dashboard/stats' && method === 'GET':
        return MockAPIService.getDashboardStats();

      default:
        return { success: false, error: 'Endpoint not found in mock API' };
    }
  }

  // Public API methods
  static getProjects() {
    return this.request('/projects');
  }

  static getProject(id: string) {
    return this.request(`/projects/${id}`);
  }

  static createProject(data: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static getUsers() {
    return this.request('/users');
  }

  static getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  static getProvinces() {
    return this.request('/provinces');
  }

  static getGPSEntries(projectId?: string) {
    const endpoint = projectId ? `/gps?projectId=${projectId}` : '/gps';
    return this.request(endpoint);
  }

  static createGPSEntry(data: any) {
    return this.request('/gps', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static getFinancialEntries(projectId?: string) {
    const endpoint = projectId ? `/financial?projectId=${projectId}` : '/financial';
    return this.request(endpoint);
  }

  static createFinancialEntry(data: any) {
    return this.request('/financial', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static getWorkTypes() {
    return this.request('/work-types');
  }

  static getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  static login(email: string, password: string) {
    if (USE_MOCK_DATA) {
      return MockAPIService.login(email, password);
    }
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static healthCheck() {
    if (USE_MOCK_DATA) {
      return MockAPIService.healthCheck();
    }
    return this.request('/health');
  }
}
