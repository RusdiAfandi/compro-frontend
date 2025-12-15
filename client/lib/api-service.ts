import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from './api-config';

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: getAuthHeaders(),
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Authentication services
export const authService = {
  async login(nim: string, password: string) {
    return apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ nim, password }),
    });
  },

  async register(userData: {
    nim: string;
    nama: string;
    email_sso: string;
    password: string;
    jurusan?: string;
    fakultas?: string;
    angkatan?: number;
  }) {
    return apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Menu services
export const menuService = {
  async getMainMenu() {
    return apiRequest(API_ENDPOINTS.MENU);
  },
};

// Interests services
export const interestsService = {
  async getInterests() {
    return apiRequest(API_ENDPOINTS.INTERESTS.GET);
  },

  async updateInterests(interests: {
    hard_skills: string[];
    soft_skills: string[];
  }) {
    return apiRequest(API_ENDPOINTS.INTERESTS.UPDATE, {
      method: 'POST',
      body: JSON.stringify(interests),
    });
  },

  async getRecommendations() {
    return apiRequest(API_ENDPOINTS.INTERESTS.RECOMMEND, {
      method: 'POST',
    });
  },
};

// Courses services
export const coursesService = {
  async getCourses(params?: {
    keyword?: string;
    tingkat?: number;
    sks?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.keyword) queryParams.append('keyword', params.keyword);
    if (params?.tingkat) queryParams.append('tingkat', params.tingkat.toString());
    if (params?.sks) queryParams.append('sks', params.sks.toString());
    
    const endpoint = `${API_ENDPOINTS.COURSES}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiRequest(endpoint);
  },
};

// Simulation services
export const simulationService = {
  async getSimulationPlan(semester: number, studyPlan?: string) {
    const queryParams = new URLSearchParams();
    queryParams.append('semester', semester.toString());
    if (studyPlan) queryParams.append('study_plan', studyPlan);
    
    const endpoint = `${API_ENDPOINTS.SIMULATION.PLAN}?${queryParams.toString()}`;
    return apiRequest(endpoint);
  },

  async calculateSimulation(data: {
    target_semester: number;
    study_plan?: string;
    simulated_courses: Array<{
      nama_mk: string;
      sks: number;
      nilai: string;
    }>;
  }) {
    return apiRequest(API_ENDPOINTS.SIMULATION.CALCULATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async endSession() {
    return apiRequest(API_ENDPOINTS.SIMULATION.END_SESSION, {
      method: 'POST',
    });
  },
};