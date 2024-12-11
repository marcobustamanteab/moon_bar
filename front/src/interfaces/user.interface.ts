

export interface User {
  id: number;
  username: string;
  password: string; 
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  groups?: number[];
}

export interface Group {
  id: number;
  name: string;
}