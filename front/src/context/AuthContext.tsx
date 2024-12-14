import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AuthAPI } from "../api/endpoints/authService";
import { UserAPI } from "../api/endpoints/users";
import api from "../api/axios";
import { User, ActivityType, UserActivity } from "../interfaces/user.interface";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const logUserActivity = async (
  username: string,
  activityType: ActivityType,
  details: string
) => {
  try {
    const activityData: UserActivity = {
      username,
      activity_type: activityType,
      details
    };
    await UserAPI.logActivity(activityData);
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);

  const fetchUserInfo = async (username?: string) => {
    try {
      const users = await UserAPI.getAll();
      const searchUsername = username || localStorage.getItem("username");
      const currentUser = users.find((u) => u.username === searchUsername);
      if (currentUser) {
        setUser(currentUser);
        // Log successful user info fetch
        await logUserActivity(
          currentUser.username,
          "profile_fetch",
          "Usuario obtuvo información de perfil"
        );
      }
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
      // Log failed user info fetch
      if (username) {
        await logUserActivity(
          username,
          "profile_fetch_failed",
          "Error al obtener información del perfil"
        );
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const isValid = await AuthAPI.validateToken(token);
          setIsAuthenticated(isValid);
          if (isValid) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await fetchUserInfo();
            // Log successful token validation
            const username = localStorage.getItem("username");
            if (username) {
              await logUserActivity(
                username,
                "token_validation",
                "Token validado exitosamente"
              );
            }
          } else {
            logout();
            // Log failed token validation
            const username = localStorage.getItem("username");
            if (username) {
              await logUserActivity(
                username,
                "token_validation_failed",
                "Token inválido"
              );
            }
          }
        } catch {
          logout();
        }
      }
    };

    checkAuth();
  }, []);

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const data = await AuthAPI.login({ username, password });
      setToken(data.access);
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("username", username);
      setIsAuthenticated(true);

      api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

      await fetchUserInfo(username);
      
      // Log successful login
      await logUserActivity(
        username,
        "login",
        "Inicio de sesión exitoso"
      );
    } catch (error) {
      // Log failed login attempt
      await logUserActivity(
        username,
        "failed_login",
        "Intento fallido de inicio de sesión"
      );
      throw error;
    }
  };

  const logout = async () => {
    // Log logout activity before clearing user data
    if (user) {
      await logUserActivity(
        user.username,
        "logout",
        "Cierre de sesión"
      );
    }

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};