import api from "../axios";
import {
  Company,
  CompanyModule,
  CompanyUser,
} from "../../interfaces/company.interface";

export const CompanyAPI = {
  getAll: async () => {
    const response = await api.get<Company[]>("/api/companies/");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Company>(`/api/companies/${id}/`);
    return response.data;
  },

  create: async (companyData: Partial<Company>) => {
    const response = await api.post<Company>("/api/companies/", companyData);
    return response.data;
  },

  updateUserCompany: async (companyId: number) => {
    const response = await api.patch("/api/companies/update-user-company/", {
      company_id: companyId,
    });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/api/companies/${id}/`);
  },

  // Módulos
  getModules: async (companyId: number) => {
    const response = await api.get<CompanyModule[]>(
      `/api/companies/${companyId}/modules/`
    );
    return response.data;
  },

  // Usuarios de la empresa
  getCompanyUsers: async (companyId: number) => {
    const response = await api.get<CompanyUser[]>(
      `/api/companies/${companyId}/users/`
    );
    return response.data;
  },

  async getCompaniesForUser(userId: number) {
    try {
      const response = await api.get(`/api/users/${userId}/companies/`);
      return response.data;
    } catch (error) {
      console.error("Error obteniendo empresas:", error);
      return [];
    }
  },
};
