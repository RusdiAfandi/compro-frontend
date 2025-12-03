// API Base Configuration
const API_BASE_URL = '/api'; // This will be proxied to http://localhost:5001/api

// API Client
export class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage if available
    this.token = localStorage.getItem('authToken');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(nim: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ nim, password }),
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Menu methods
  async getMenu() {
    return this.request('/menu');
  }

  // Interests methods
  async getInterests() {
    return this.request('/interests');
  }

  async updateInterests(hardSkills: string[], softSkills: string[]) {
    return this.request('/interests', {
      method: 'POST',
      body: JSON.stringify({ hardSkills, softSkills }),
    });
  }

  async getRecommendations() {
    return this.request('/interests/recommend', {
      method: 'POST',
    });
  }

  // Courses methods
  async getCourses(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request(`/courses?${params}`);
  }

  // Simulation methods
  async getStudyPlan(semester: number) {
    return this.request(`/simulation/plan?semester=${semester}`);
  }

  async calculateSimulation(courses: any[]) {
    return this.request('/simulation/calculate', {
      method: 'POST',
      body: JSON.stringify({ courses }),
    });
  }

  async endSimulationSession() {
    return this.request('/simulation/end-session', {
      method: 'POST',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();