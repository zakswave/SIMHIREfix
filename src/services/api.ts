
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    if (!this.token && !endpoint.includes('/auth/')) {
      console.warn('⚠️ No auth token found. User needs to login.');
    }

    const headers: HeadersInit = {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        data = { 
          success: false, 
          message: response.statusText || 'Unknown error' 
        };
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        const error: any = new Error(errorMessage);
        error.status = response.status;
        error.details = data.error?.details || data.errors;
        error.code = data.error?.code;
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('API Request Error:', {
        endpoint,
        status: error.status,
        message: error.message,
        details: error.details
      });
      throw error;
    }
  }

  async register(formData: FormData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: formData,
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(formData: FormData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: formData,
    });
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    this.clearToken();
    return response;
  }

  async getJobs(params?: {
    search?: string;
    location?: string;
    employmentType?: string;
    experienceLevel?: string;
    minSalary?: number;
    maxSalary?: number;
    skills?: string;
    remote?: boolean;
  }) {
    const cleanParams: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanParams[key] = String(value);
        }
      });
    }

    const queryString = Object.keys(cleanParams).length > 0 
      ? `?${new URLSearchParams(cleanParams)}` 
      : '';
    return this.request(`/jobs${queryString}`);
  }

  async getJob(id: string) {
    return this.request(`/jobs/${id}`);
  }

  async createJob(formData: FormData) {
    return this.request('/jobs', {
      method: 'POST',
      body: formData,
    });
  }

  async updateJob(id: string, formData: FormData) {
    return this.request(`/jobs/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  async deleteJob(id: string) {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async closeJob(id: string) {
    return this.request(`/jobs/${id}/close`, {
      method: 'PUT',
    });
  }

  async getCompanyJobs() {
    return this.request('/jobs/company/my-jobs');
  }

  async applyForJob(formData: FormData) {
    if (!this.token && !localStorage.getItem('authToken')) {
      throw new Error('Please login as a candidate to apply for jobs.');
    }

    return this.request('/applications/apply', {
      method: 'POST',
      body: formData,
    });
  }

  async getMyApplications(params?: { status?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request(`/applications/my-applications${queryString}`);
  }

  async getCompanyApplications(params?: {
    jobId?: string;
    status?: string;
  }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request(`/applications/company${queryString}`);
  }

  async getApplicationDetails(id: string) {
    return this.request(`/applications/${id}`);
  }

  async updateApplicationStatus(id: string, status: string, note?: string) {
    return this.request(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    });
  }

  async withdrawApplication(id: string) {
    return this.request(`/applications/${id}/withdraw`, {
      method: 'DELETE',
    });
  }

  async getApplicationStats() {
    return this.request('/applications/stats');
  }

  async submitSimulasi(data: {
    categoryId: string;
    taskResults: Array<{
      taskId: string;
      answer: string | {
        text?: string;
        code?: string;
        files?: string[];
      };
      timeSpent: number;
    }>;
    breakdown: {
      technical: number;
      creativity: number;
      efficiency: number;
      communication: number;
    };
  }) {
    return this.request('/simulasi/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMySimulasiResults() {
    return this.request('/simulasi/my-results');
  }

  async getSimulasiStats() {
    return this.request('/simulasi/stats');
  }

  async getLeaderboards() {
    return this.request('/simulasi/leaderboards');
  }

  async getAllSimulasiResults() {
    return this.request('/simulasi/results');
  }

  async getLeaderboard(categoryId: string) {
    return this.request(`/simulasi/leaderboard/${categoryId}`);
  }

  async getSimulasiResult(id: string) {
    return this.request(`/simulasi/result/${id}`);
  }

  async getAllPortfolios(params?: { userId?: string; featured?: boolean }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request(`/portfolio${queryString}`);
  }

  async getPortfolio(id: string) {
    return this.request(`/portfolio/${id}`);
  }

  async getMyPortfolios() {
    return this.request('/portfolio/my/portfolios');
  }

  async createPortfolio(formData: FormData) {
    return this.request('/portfolio', {
      method: 'POST',
      body: formData,
    });
  }

  async updatePortfolio(id: string, formData: FormData) {
    return this.request(`/portfolio/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  async deletePortfolio(id: string) {
    return this.request(`/portfolio/${id}`, {
      method: 'DELETE',
    });
  }

  async togglePortfolioFeatured(id: string) {
    return this.request(`/portfolio/${id}/toggle-featured`, {
      method: 'PUT',
    });
  }

  async searchCandidates(params: {
    search?: string;
    skills?: string;
    location?: string;
    experience?: number;
    availability?: string;
    simulasiCategory?: string;
    minScore?: number;
  }) {
    const queryString = new URLSearchParams(params as any);
    return this.request(`/candidates/search?${queryString}`);
  }

  async getTopCandidates(params?: { limit?: number; category?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request(`/candidates/top${queryString}`);
  }

  async getCandidateRecommendations(jobId: string) {
    return this.request(`/candidates/recommendations/${jobId}`);
  }

  async getCandidateProfile(id: string) {
    return this.request(`/candidates/${id}`);
  }

  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }
  async getInternships(filters?: {
    search?: string;
    location?: string;
    duration?: string;
    isPaid?: boolean;
    remote?: boolean;
    tags?: string[];
    page?: number;
    limit?: number;
  }) {
    const queryString = filters ? `?${new URLSearchParams(filters as any)}` : '';
    return this.request(`/internships${queryString}`);
  }

  async getInternshipById(id: string) {
    return this.request(`/internships/${id}`);
  }
  async createInternship(data: any) {
    return this.request('/internships', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInternship(id: string, data: any) {
    return this.request(`/internships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInternship(id: string) {
    return this.request(`/internships/${id}`, {
      method: 'DELETE',
    });
  }

  async getCompanyInternships() {
    return this.request('/internships/company/my-internships');
  }
  async applyForInternship(data: any) {
    return this.request('/internship-applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCandidateInternshipApplications() {
    return this.request('/internship-applications/candidate/my-applications');
  }
  async getCompanyInternshipApplications(filters?: {
    internshipId?: string;
    status?: string;
  }) {
    const queryString = filters ? `?${new URLSearchParams(filters as any)}` : '';
    return this.request(`/internship-applications/company/applications${queryString}`);
  }

  async getInternshipApplicationStats() {
    return this.request('/internship-applications/company/stats');
  }

  async updateInternshipApplicationStatus(id: string, data: {
    status: string;
    notes?: string;
    interviewSchedule?: string;
  }) {
    return this.request(`/internship-applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getInternshipApplicationById(id: string) {
    return this.request(`/internship-applications/${id}`);
  }

  async deleteInternshipApplication(id: string) {
    return this.request(`/internship-applications/${id}`, {
      method: 'DELETE',
    });
  }
}
export const api = new ApiService();
export { ApiService };
