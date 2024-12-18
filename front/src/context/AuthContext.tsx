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
  companies: CompanyUser[];
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
      details,
    };
    await UserAPI.logActivity(activityData);
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [companies, setCompanies] = useState<CompanyUser[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);

  const fetchUserInfo = async (username?: string) => {
    try {
      console.log("Fetching user info for:", username);
      
      // Intentar obtener el usuario almacenado localmente
      const storedUserString = localStorage.getItem("user");
      let currentUser: User | null = null;
  
      if (storedUserString) {
        currentUser = JSON.parse(storedUserString);
      }
  
      // Si no hay usuario almacenado, buscar por username
      if (!currentUser && username) {
        const users = await UserAPI.getAll();
        currentUser = users.find((u) => u.username === username) ?? null;
      }
  
      if (currentUser) {
        // Obtener información completa del usuario
        const fullUserData = await UserAPI.getById(currentUser.id);
        
        setUser(fullUserData);
        localStorage.setItem("user", JSON.stringify(fullUserData));
  
        // Depuración de información del usuario
        console.log("Usuario recuperado:", fullUserData);
        console.log("Es superusuario:", fullUserData.is_superuser);
        console.log("Grupos:", fullUserData.groups);
        console.log("Es administrador de sistema:", fullUserData.is_system_admin);
  
        try {
          if (fullUserData.is_superuser || fullUserData.is_system_admin || 
              fullUserData.groups?.includes("Administrador")) {
            // Para administradores, obtener todas las empresas
            const allCompanies = await CompanyAPI.getAll();
            const adminCompanies = allCompanies.map(company => ({
              id: company.id,
              user: fullUserData,
              company: company,
              username: fullUserData.username,
              full_name: `${fullUserData.first_name} ${fullUserData.last_name}`,
              role: 'admin' as const,
              is_company_admin: true,
              is_active: fullUserData.is_active,
              created_at: new Date().toISOString(),
              isSystemAdmin: true,
              groups: fullUserData.groups,
            }));
            
            setCompanies(adminCompanies);
            localStorage.setItem("companies", JSON.stringify(adminCompanies));
            
          } else {
            // Para usuarios normales
            const token = localStorage.getItem("token");
            if (token) {
              // Intentar obtener las empresas del usuario actual
              const companyUsers = await CompanyAPI.getCompaniesForUser(fullUserData.id);
              
              console.log("Empresas del usuario:", companyUsers);
  
              if (companyUsers.length > 0) {
                setCompanies(companyUsers);
                localStorage.setItem("companies", JSON.stringify(companyUsers));
                
                // Seleccionar la primera empresa si no hay una seleccionada
                const storedCompany = localStorage.getItem("selectedCompany");
                if (!storedCompany) {
                  localStorage.setItem("selectedCompany", JSON.stringify(companyUsers[0].company));
                }
              } else {
                console.warn("El usuario no tiene empresas asignadas");
                setCompanies([]);
                localStorage.removeItem("companies");
              }
            }
          }
  
        } catch (error) {
          console.error("Error al obtener empresas:", error);
        }
  
        // Registrar actividad de recuperación de perfil
        await logUserActivity(
          fullUserData.username,
          "profile_fetch",
          "Usuario obtuvo información de perfil"
        );
      } else {
        console.error("No se pudo encontrar el usuario");
      }
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
    }
  };
  
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
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
  
      api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
  
      if (data.user.is_superuser || data.user.is_system_admin) {
        const allCompanies = await CompanyAPI.getAll();
        const adminCompanies = allCompanies.map(company => ({
          id: company.id,
          user: data.user,
          company: company,
          username: data.user.username,
          full_name: `${data.user.first_name} ${data.user.last_name}`,
          role: 'admin' as const,
          is_company_admin: true,
          is_active: data.user.is_active,
          created_at: new Date().toISOString(),
          isSystemAdmin: true,
          groups: data.user.groups,
        }));
        setCompanies(adminCompanies);
        localStorage.setItem("companies", JSON.stringify(adminCompanies));
        
        // Seleccionar primera empresa por defecto para admins
        if (adminCompanies.length > 0) {
          localStorage.setItem("selectedCompany", JSON.stringify(adminCompanies[0].company));
        }
      } else {
        if (data.companies) {
          setCompanies(data.companies);
          localStorage.setItem("companies", JSON.stringify(data.companies));
          
          // Seleccionar primera empresa por defecto para usuarios normales
          if (data.companies.length > 0) {
            localStorage.setItem("selectedCompany", JSON.stringify(data.companies[0].company));
          }
        }
      }
  
      await fetchUserInfo(username);
      await logUserActivity(username, "login", "Inicio de sesión exitoso");
    } catch (error) {
      await logUserActivity(
        username,
        "failed_login",
        "Intento fallido de inicio de sesión"
      );
      throw error;
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

  const logout = async () => {
    if (user) {
      await logUserActivity(user.username, "logout", "Cierre de sesión");
    }

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setCompanies([]);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("selectedCompany");
    localStorage.removeItem("companies");
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
        logout,
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