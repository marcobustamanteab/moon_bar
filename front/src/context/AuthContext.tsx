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
import { CompanyUser } from "../interfaces/company.interface";
import { CompanyAPI } from "../api/endpoints/companies";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  companies: CompanyUser[];  // Cambio importante
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
  const [companies, setCompanies] = useState<CompanyUser[]>([]);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);

  const fetchUserInfo = async (username?: string) => {
    try {
      console.log("Fetching user info for:", username);
      const users = await UserAPI.getAll();
      const searchUsername = username || localStorage.getItem("username");
      console.log("Search username:", searchUsername);
      
      const currentUser = users.find((u) => u.username === searchUsername);
      console.log("Current user found:", currentUser);
      
      if (currentUser) {
        setUser(currentUser);
        
        // Recuperar las empresas del usuario actual
        try {
          // Obtener todas las empresas del usuario
          const companies = await CompanyAPI.getAll();
          const userCompanies: CompanyUser[] = [];
  
          // Filtrar y obtener usuarios de cada empresa
          for (const company of companies) {
            try {
              const companyUsers = await CompanyAPI.getCompanyUsers(company.id);
              
              // Modificar para manejar diferentes estructuras de user
              const userCompanyUser = companyUsers.find(cu => {
                // Manejar diferentes posibles estructuras de user
                const userId = typeof cu.user === 'object' ? cu.user.id : cu.user;
                return userId === currentUser.id;
              });
              
              if (userCompanyUser) {
                userCompanies.push(userCompanyUser);
              }
            } catch (companyUsersError) {
              console.error(`Error fetching users for company ${company.id}:`, companyUsersError);
            }
          }
  
          console.log("Fetched user companies:", userCompanies);
          
          if (userCompanies.length > 0) {
            setCompanies(userCompanies);
            
            // Recuperar empresa almacenada o guardar la primera
            const storedCompany = localStorage.getItem("selectedCompany");
            if (!storedCompany) {
              try {
                localStorage.setItem(
                  "selectedCompany", 
                  JSON.stringify(userCompanies[0].company)
                );
              } catch (error) {
                console.error("Error saving selected company:", error);
              }
            }
          } else {
            console.warn("No companies found for the user");
          }
        } catch (companiesError) {
          console.error("Error fetching companies:", companiesError);
        }
        
        await logUserActivity(
          currentUser.username,
          "profile_fetch",
          "Usuario obtuvo información de perfil"
        );
      }
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
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
            const username = localStorage.getItem("username");
            await fetchUserInfo(username || undefined);
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

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const data = await AuthAPI.login({ username, password });
      console.log("Login response:", data);

      setToken(data.access);
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("username", username);
      setIsAuthenticated(true);
      
      // Establecer empresas directamente desde la respuesta
      if (data.companies) {
        console.log("Estableciendo empresas:", data.companies);
        setCompanies(data.companies);
        
        // Guardar la primera empresa si existe
        if (data.companies.length > 0) {
          try {
            localStorage.setItem(
              "selectedCompany", 
              JSON.stringify(data.companies[0].company)
            );
          } catch (error) {
            console.error("Error guardando empresa seleccionada:", error);
          }
        }
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

      await fetchUserInfo(username);
      
      await logUserActivity(
        username,
        "login",
        "Inicio de sesión exitoso"
      );
    } catch (error) {
      await logUserActivity(
        username,
        "failed_login",
        "Intento fallido de inicio de sesión"
      );
      throw error;

    }
  };

  const logout = async () => {
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
    setCompanies([]);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("selectedCompany");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        token, 
        user, 
        companies, 
        login, 
        logout 
      }}
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