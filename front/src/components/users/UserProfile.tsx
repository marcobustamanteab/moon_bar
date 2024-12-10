import { useAuth } from "../../context/AuthContext";
import { Card } from "react-bootstrap";
import { User, Mail, Users, Calendar, Clock } from "lucide-react";
import avatarImage from "../../assets/images/avatar001.jpeg";

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-4">
        <div className="text-center" lang="es">
          No se encontró información del usuario
        </div>
      </div>
    );
  }

  const joinDate = new Date(user.date_joined).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-4">
      <div className="d-flex align-items-center mb-4">
        <h2
          className="mb-0"
          style={{ color: "#2d3564", fontSize: "1.75rem", fontWeight: "600" }}
        >
          Mi Perfil
        </h2>
      </div>

      <div className="row g-4">
        {/* Columna izquierda */}
        <div className="col-12 col-md-3">
          <Card className="shadow-sm border-0">
            <Card.Header
              className="bg-white border-bottom"
              style={{ borderColor: "rgba(45, 53, 100, 0.1)" }}
            >
              <h5
                className="mb-0"
                style={{ color: "#2d3564", fontSize: "1.1rem" }}
              >
                Información Principal
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-column gap-4">
                <div className="text-center mb-4">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3 overflow-hidden"
                    style={{
                      width: "96px",
                      height: "96px",
                      backgroundColor: "rgba(45, 53, 100, 0.1)",
                      border: "2px solid rgba(45, 53, 100, 0.2)",
                    }}
                  >
                    <img
                      src={avatarImage}
                      alt="Avatar del usuario"
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                  <h3 className="fs-5 fw-medium" style={{ color: "#2d3564" }}>
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-muted small">
                    {user.groups?.[0] || "Sin grupo asignado"}
                  </p>
                </div>

                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2 small">
                    <User size={16} style={{ color: "#2d3564" }} />
                    <span className="fw-medium">Usuario:</span>
                    <span>{user.username}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2 small">
                    <Users size={16} style={{ color: "#2d3564" }} />
                    <span className="fw-medium">Rol:</span>
                    <span>{user.groups?.[0] || "Sin rol"}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2 small">
                    <Mail size={16} style={{ color: "#2d3564" }} />
                    <span className="fw-medium">Email:</span>
                    <span className="text-truncate">{user.email}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Columna derecha */}
        <div className="col-12 col-md-9">
          <Card className="shadow-sm border-0">
            <Card.Header
              className="bg-white border-bottom"
              style={{ borderColor: "rgba(45, 53, 100, 0.1)" }}
            >
              <h5
                className="mb-0"
                style={{ color: "#2d3564", fontSize: "1.1rem" }}
              >
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
                        {user.first_name} {user.last_name}
                      </p>
                    </div>

                    <div>
                      <h6 className="text-muted small mb-1">
                        Nombre de Usuario
                      </h6>
                      <p className="mb-0" style={{ color: "#2d3564" }}>
                        {user.username}
                      </p>
                    </div>

                    <div>
                      <h6 className="text-muted small mb-1">Email</h6>
                      <p className="mb-0" style={{ color: "#2d3564" }}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="d-flex flex-column gap-4">
                    <div>
                      <h6 className="text-muted small mb-1">
                        Estado de la Cuenta
                      </h6>
                      <span
                        className={`badge ${
                          user.is_active ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {user.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <div>
                      <h6 className="text-muted small mb-1">
                        Fecha de Registro
                      </h6>
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={16} style={{ color: "#2d3564" }} />
                        <span style={{ color: "#2d3564" }}>{joinDate}</span>
                      </div>
                    </div>

                    <div>
                      <h6 className="text-muted small mb-1">Último Acceso</h6>
                      <div className="d-flex align-items-center gap-2">
                        <Clock size={16} style={{ color: "#2d3564" }} />
                        <span style={{ color: "#2d3564" }}>Hace 2 horas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-4 shadow-sm border-0">
            <Card.Header
              className="bg-white border-bottom"
              style={{ borderColor: "rgba(45, 53, 100, 0.1)" }}
            >
              <h5
                className="mb-0"
                style={{ color: "#2d3564", fontSize: "1.1rem" }}
              >
                Permisos y Accesos
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="row g-4">
                <div className="col-12 col-md-4">
                  <h6 className="text-muted small mb-2">Grupo</h6>
                  <p className="mb-0" style={{ color: "#2d3564" }}>
                    {user.groups?.[0] || "Sin grupo asignado"}
                  </p>
                </div>
                <div className="col-12 col-md-4">
                  <h6 className="text-muted small mb-2">Nivel de Acceso</h6>
                  <p className="mb-0" style={{ color: "#2d3564" }}>
                    Usuario Estándar
                  </p>
                </div>
                <div className="col-12 col-md-4">
                  <h6 className="text-muted small mb-2">
                    Última Actualización
                  </h6>
                  <p className="mb-0" style={{ color: "#2d3564" }}>
                    Hace 1 mes
                  </p>
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
