import { User } from '../../interfaces';
import api from '../axios';

export const UserAPI = {
  getAll: async () => {
    const response = await api.get<User[]>('/api/users/');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get<User>(`/api/users/${id}/`);
    return response.data;
  },
  
  create: async (userData: Partial<User>) => {
    const response = await api.post<User>('/api/users/', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<User>('/api/users/me/');
    return response.data;
  }
};