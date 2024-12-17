export interface Company {
  id: number;
  name: string;
  business_name: string;
  rut: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  website?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  modules?: CompanyModule[];
  role?: string;
  is_admin?: boolean;
}
  
  export interface CompanyModule {
    id: number;
    name: string;
    is_active: boolean;
    config: Record<string, unknown>;
    expiration_date?: string;
  }
  
  export interface CompanyUser {
    id: number;
    user: number | {  
      id: number;
      username: string;
    };
    username: string;
    full_name: string;
    company: Company;
    role: 'admin' | 'manager' | 'staff';
    is_company_admin: boolean;
    is_active: boolean;
    created_at: string;
  }