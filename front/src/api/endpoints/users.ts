import { User, UserActivity } from "../../interfaces";
import api from "../axios";

export const UserAPI = {
  getAll: async () => {
    const response = await api.get<User[]>("/api/users/");
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
    const response = await api.post<User>("/api/users/create/", userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<User>("/api/users/me/");
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.post("/api/users/change-password/", data);
    return response.data;
  },

  getGroups: async () => {
    const response = await api.get("/api/groups/");
    return response.data;
  },

  getActivityLogs: async (params?: {
    days?: number;
    activity_type?: string;
    username?: string;
  }) => {
    const response = await api.get("/api/users/activity-logs/", { params });
    return response.data;
  },

  logActivity: async (activityData: UserActivity) => {
    const response = await api.post('/api/users/activity-logs/', activityData);
    return response.data;
  },
  
  createGroup: async (data: { name: string }) => {
    const response = await api.post('/api/groups/create/', data);
    return response.data;
  },

  updateGroup: async (id: number, data: { name: string }) => {
    const response = await api.put(`/api/groups/${id}/update/`, data);
    return response.data;
  },

  deleteGroup: async (id: number) => {
    const response = await api.delete(`/api/groups/${id}/delete/`);
    return response.data;
  } 

};
