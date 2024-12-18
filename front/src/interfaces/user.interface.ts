import { Company } from "./company.interface";


export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  groups?: string[];
  companies?: Company[];
  is_superuser?: boolean;
  is_system_admin?: boolean;  
  phone?: string;
  group?: {
    id: number;
    name: string;
  } | null;
}

export interface Group {
  id: number;
  name: string;
  user_count: number;
}

export type ActivityType = 
  | 'login' 
  | 'logout' 
  | 'password_change' 
  | 'password_change_failed'
  | 'profile_update' 
  | 'failed_login' 
  | 'user_created' 
  | 'user_updated'
  | 'user_deleted'
  | 'token_validation'
  | 'token_validation_failed'
  | 'profile_fetch'
  | 'profile_fetch_failed';

export interface UserActivity {
  id?: number;
  username: string;
  activity_type: ActivityType;
  details: string;
  ip_address?: string;
  timestamp?: string;
}

export interface Group {
  id: number;
  name: string;
  user_count: number;
}

export type PartialUser = Partial<User>