import api from '../axios';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const AuthAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<LoginResponse>('/api/token/', credentials);
    return response.data;
  },

  refreshToken: async (refresh: string) => {
    const response = await api.post<{ access: string }>('/api/token/refresh/', {
      refresh
    });
    return response.data;
  },

  validateToken: async (token: string) => {
    try {
      await api.post('/api/token/verify/', { token });
      return true;
    } catch {
      return false;
    }
  }
};