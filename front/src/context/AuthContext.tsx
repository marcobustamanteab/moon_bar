import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthAPI } from '../api/endpoints/authService';
import { UserAPI } from '../api/endpoints/users';
import api from '../api/axios';
import { User } from '../interfaces/user.interface';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  const fetchUserInfo = async (username?: string) => {
    try {
      const users = await UserAPI.getAll();
      const searchUsername = username || localStorage.getItem('username');
      const currentUser = users.find(u => u.username === searchUsername);
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const isValid = await AuthAPI.validateToken(token);
          setIsAuthenticated(isValid);
          if (isValid) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await fetchUserInfo();
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
    };

    checkAuth();
  }, []);

  const login = async ({ username, password }: { username: string; password: string }) => {
    try {
      const data = await AuthAPI.login({ username, password });
      setToken(data.access);
      localStorage.setItem('token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('username', username);
      setIsAuthenticated(true);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      
      await fetchUserInfo(username);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};