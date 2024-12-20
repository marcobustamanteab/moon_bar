import { useAuth } from "../../context/AuthContext";
import { Card } from "react-bootstrap";
import { User as UserIcon, Users, Calendar, Clock, Phone } from "lucide-react";
import avatarImage from "../../assets/images/avatar001.jpeg";
import { useEffect, useState } from "react";
import { UserAPI } from "../../api/endpoints/users";
import { User } from "../../interfaces/user.interface";
import { useParams } from "react-router-dom";

interface ActivityLog {
  id: number;
  username: string;
  activity_type: ActivityType;
  timestamp: string;
  details: string;
  ip_address: string;
}

type ActivityType =
  | "login"
  | "logout"
  | "password_change"
  | "password_change_failed"
  | "profile_update"
  | "failed_login"
  | "user_created"
  | "token_validation"
  | "token_validation_failed";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [lastLogin, setLastLogin] = useState<ActivityLog | null>(null);
  const [lastUpdate, setLastUpdate] = useState<ActivityLog | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (id) {
          const userData = await UserAPI.getById(parseInt(id));
          setProfileUser(userData);
        } else {
          setProfileUser(currentUser);
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    }

    fetchUserData();
  }, [id, currentUser]);

  useEffect(() => {
    async function fetchUserActivity() {
      if (!profileUser) return;

      try {
        const loginLogs = await UserAPI.getActivityLogs({
          activity_type: "login",
          days: 30,
          username: profileUser.username,
        });

        if (loginLogs && Array.isArray(loginLogs) && loginLogs.length > 0) {
          const sortedLoginLogs = loginLogs.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setLastLogin(sortedLoginLogs[0]);
        }

        const updateLogs = await UserAPI.getActivityLogs({
          activity_type: "profile_update",
          days: 90,
          username: profileUser.username,
        });

        if (updateLogs && Array.isArray(updateLogs) && updateLogs.length > 0) {
          const sortedUpdateLogs = updateLogs.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setLastUpdate(sortedUpdateLogs[0]);
        }
      } catch (error) {
        console.error("Error al obtener la actividad del usuario:", error);
      }
    }

    fetchUserActivity();
  }, [profileUser]);

  if (!profileUser) {
    return (
      <div className="p-4">
        <div className="text-center" lang="es">
          No se encontró información del usuario
        </div>
      </div>
    );
  }

  const formatLastAccess = (log: ActivityLog | null) => {
    if (!log) return "No hay registros";

    const date = new Date(log.timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minutos`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
    } else {
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const joinDate = new Date(profileUser.date_joined).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const LastAccessSection = () => {
    const formattedDate = formatLastAccess(lastLogin);
    if (lastLogin && (currentUser?.is_superuser || currentUser?.is_system_admin)) {
      return (
        <div>
          <span>{formattedDate}</span>
          <div className="small text-muted mt-1">IP: {lastLogin.ip_address}</div>
        </div>
      );
    }
    return formattedDate;
  };

  const getAccessLevelDescription = (user: User): string => {
    if (user.is_superuser) {
      return "Acceso completo a todas las funcionalidades del sistema";
    }
    if (user.is_system_admin) {
      return "Acceso administrativo general";
    }
    if (user.groups?.includes("Administrador")) {
      return "Gestión de empresa y usuarios asociados";
    }
    if (user.groups?.includes("Garzón")) {
      return "Acceso a funciones de servicio y atención";
    }
    if (user.groups?.includes("Cajero")) {
      return "Gestión de pagos y transacciones";
    }
    if (user.groups?.includes("Bodeguero")) {
      return "Control y gestión de inventario";
    }
    return "Acceso básico al sistema";
  };

  return (
    <div className="p-4">
      <div className="row g-4">
        <div className="col-12 col-md-3">
          <Card className="border-0" style={{
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}>
            <div 
              className="position-relative"
              style={{ 
                background: 'rgb(45, 53, 100)',
                height: '65px'
              }}
            >
              <div 
                className="position-absolute"
                style={{
                  bottom: '-40px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              >
                <div
                  className="rounded-circle p-1 bg-white"
                  style={{
                    width: '90px',
                    height: '90px',
                    boxShadow: '0 1.5px 3px 0 rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <div
                    className="rounded-circle overflow-hidden w-100 h-100"
                    style={{
                      border: '2px solid rgba(45, 53, 100, 0.2)',
                    }}
                  >
                    <img
                      src={avatarImage}
                      alt="Avatar del usuario"
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Card.Body>
              <div className="d-flex flex-column gap-4">
                <div className="text-center" style={{ marginTop: '35px' }}>
                  <h3 className="fs-5 fw-medium" style={{ color: "#2d3564" }}>
                    {profileUser.first_name} {profileUser.last_name}
                  </h3>
                  <p className="text-muted small mb-0">
                    {profileUser.groups?.[0] || "Sin grupo asignado"}
                  </p>
                  
                  <hr className="my-3" />
                </div>

                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2 small">
                    <UserIcon size={16} style={{ color: "#2d3564" }} />
                    <span className="fw-medium">Usuario:</span>
                    <span>{profileUser.username}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2 small">
                    <Users size={16} style={{ color: "#2d3564" }} />
                    <span className="fw-medium">Perfil:</span>
                    <span>{profileUser.groups?.[0] || "Sin rol"}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2 small">
                    <Phone size={16} style={{ color: "#2d3564" }} />
                    <span className="fw-medium">Teléfono:</span>
                    <span className="text-truncate">
                      {profileUser.phone || "No registrado"}
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-12 col-md-9">
          <Card className="border-0" style={{
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}>
            <Card.Header className="bg-white border-bottom" style={{ borderColor: "rgba(45, 53, 100, 0.1)" }}>
              <h5 className="mb-0" style={{ color: "#2d3564", fontSize: "1.1rem" }}>
                Detalles de la Cuenta
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="d-flex flex-column gap-4">
                    <div>
                      <h6 className="text-muted small mb-1">Nombre Completo</h6>
                      <p className="mb-0" style={{ color: "#2d3564" }}>
                        {profileUser.first_name} {profileUser.last_name}
                      </p>
                    </div>

                    <div>
                      <h6 className="text-muted small mb-1">Usuario</h6>
                      <p className="mb-0" style={{ color: "#2d3564" }}>
                        {profileUser.username}
                      </p>
                    </div>

                    <div>
                      <h6 className="text-muted small mb-1">Email</h6>
                      <p className="mb-0" style={{ color: "#2d3564" }}>
                        {profileUser.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="d-flex flex-column gap-4">
                    <div>
                      <h6 className="text-muted small mb-1">Estado de la Cuenta</h6>
                      <span className={`badge ${profileUser.is_active ? "bg-success" : "bg-danger"}`}>
                        {profileUser.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <div>
                      <h6 className="text-muted small mb-1">Fecha de Registro</h6>
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={16} style={{ color: "#2d3564" }} />
                        <span style={{ color: "#2d3564" }}>{joinDate}</span>
                      </div>
                    </div>

                    <div>
                      <h6 className="text-muted small mb-1">Última Actualización</h6>
                      <div className="d-flex align-items-center gap-2">
                        <Clock size={16} style={{ color: "#2d3564" }} />
                        <span style={{ color: "#2d3564" }}>
                          {formatLastAccess(lastUpdate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-4 border-0" style={{
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}>
            <Card.Header className="bg-white border-bottom" style={{ borderColor: "rgba(45, 53, 100, 0.1)" }}>
              <h5 className="mb-0" style={{ color: "#2d3564", fontSize: "1.1rem" }}>
                Permisos y Accesos
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="row g-4">
                <div className="col-12 col-md-4">
                  <h6 className="text-muted small mb-2">Perfil</h6>
                  <p className="mb-0" style={{ color: "#2d3564" }}>
                    {profileUser.groups?.[0] || "Sin grupo asignado"}
                  </p>
                </div>
                <div className="col-12 col-md-4">
                  <h6 className="text-muted small mb-2">Nivel de Acceso</h6>
                  <p className="mb-0" style={{ color: "#2d3564" }}>
                    {getAccessLevelDescription(profileUser)}
                  </p>
                </div>
                <div className="col-12 col-md-4">
                  <h6 className="text-muted small mb-2">Último Acceso</h6>
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={16} style={{ color: "#2d3564" }} />
                    <span style={{ color: "#2d3564" }}>
                      <LastAccessSection />
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;