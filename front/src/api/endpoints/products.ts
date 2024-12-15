import api from '../axios';
import { Category, PaginatedProducts, Product } from '../../interfaces/product.interface';

export const ProductAPI = {
  // Categorías
  getCategories: async () => {
    const response = await api.get<Category[]>('/api/categories/');
    return response.data;
  },

  createCategory: async (data: Partial<Category>) => {
    const response = await api.post<Category>('/api/categories/', data);
    return response.data;
  },

  updateCategory: async (id: number, data: Partial<Category>) => {
    const response = await api.put<Category>(`/api/categories/${id}/`, data);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await api.delete(`/api/categories/${id}/`);
    return response.data;
  },

  // Productos
  getProducts: async (params?: { 
    page?: number; 
    page_size?: number; 
    search?: string 
  }) => {
    const response = await api.get<PaginatedProducts>('/api/products/', { params });
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await api.get<Product>(`/api/products/${id}/`);
    return response.data;
  },

  createProduct: async (data: FormData) => {
    const response = await api.post<Product>('/api/products/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id: number, data: FormData) => {
    const response = await api.put<Product>(`/api/products/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await api.delete(`/api/products/${id}/`);
    return response.data;
  },
};