import { User } from '../../interfaces';
import api from '../axios';

export const UserAPI = {
  
  getAll: async () => {
    const response = await api.get<User[]>('/api/users/');
    return response.data;
  },

  updateUser: async (id: number, userData: Partial<User>) => {
    const response = await api.put(`/api/users/${id}/update/`, userData);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/api/users/${id}/delete`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get<User>(`/api/users/${id}/get-user/`);
    return response.data;
  },
  
  create: async (userData: Partial<User>) => {
    const response = await api.post<User>('/api/users/create/', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<User>('/api/users/me/');
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.post('/api/users/change-password/', data);
    return response.data;
  },

  getGroups: async () => {
    const response = await api.get('/api/groups/');
    return response.data;
  }

  
};