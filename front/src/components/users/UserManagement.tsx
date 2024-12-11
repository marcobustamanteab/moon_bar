/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo  } from "react";
import { User } from "../../interfaces/user.interface";
import { UserAPI } from "../../api/endpoints/users";
import { useLoading } from "../../context/LoadingContext";
import { Edit2, Trash2, UserPlus } from "lucide-react";
import CustomDataTable from "../common/CustomDataTable";
import { TableColumn } from "react-data-table-component";
import { Toast, Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const { setLoading } = useLoading();
  const [error, setError] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "danger">("success");
  const [searchTerm, setSearchTerm] = useState<string>("")


  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (!searchTerm) return true;
      
      const searchValue = searchTerm.toLowerCase();
      const userGroups = user.groups || [];
      
      return (
        user.id.toString().includes(searchValue) ||
        user.username.toLowerCase().includes(searchValue) ||
        user.first_name.toLowerCase().includes(searchValue) ||
        user.last_name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        userGroups.some(group => group.toLowerCase().includes(searchValue))
      );
    });
  }, [users, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleCreateUser = () => {
    navigate("/users/create");
  };

  const handleEditClick = (userId: number) => {
  navigate(`/users/${userId}/update`);
};

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);
      await UserAPI.deleteUser(userToDelete);
      setShowDeleteModal(false);
      // Recargar la lista de usuarios
      await fetchUsers();
      setToastMessage("Usuario eliminado exitosamente");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      setError("Error al eliminar el usuario");
      setToastMessage("Error al eliminar el usuario");
      setToastType("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
      setUserToDelete(null);
    }
  };

  useEffect(() => {
    fetchUsers();
    if (location.state?.showToast) {
      setToastMessage(location.state.toastMessage);
      setToastType(location.state.toastType);
      setShowToast(true);
    }
  }, [location.state]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserAPI.getAll();
      setUsers(data);
    } catch (error) {
      setError("Error al cargar los usuarios");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const columns: TableColumn<User>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "65px",
    },
    {
      name: "Usuario",
      selector: (row) => row.username,
      sortable: true,
      width: "150px",
    },
    {
      name: "Nombre",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
      width: "230px",
      wrap: true,
    },
    {
      name: "Perfil",
      selector: (row) => row.groups?.join(", ") || "",
      sortable: true,
      width: "150px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "190px",
    },
    {
      name: "Fecha Creación",
      selector: (row) => row.date_joined,
      sortable: true,
      format: (row) => formatDate(row.date_joined),
      width: "180px",
    },
    {
      name: "Estado",
      selector: (row) => row.is_active,
      sortable: true,
      width: "100px",
      cell: (row) => (
        <span className={`badge ${row.is_active ? "bg-success" : "bg-danger"}`}>
          {row.is_active ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="btn-group">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEditClick(row.id)}
          >
            <Edit2 size={16} />
          </button>
          <button
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={() => handleDeleteClick(row.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      width: "110px",
      right: true,
    },
  ];

  return (
    <div className="h-100">
      <div className="mb-4">
        <h5 className="mb-1">Gestión de Usuarios</h5>
        <p className="text-muted small">
          Administración de usuarios del sistema
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <CustomDataTable
        columns={columns}
        data={filteredUsers}
        loading={false}
        pagination
        searchable
        onSearch={handleSearch}
        actions={
          <button className="btn btn-primary" onClick={handleCreateUser}>
            <UserPlus size={16} />
                      Nuevo Usuario
          </button>
        }
      />

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar este usuario? Esta acción no se puede
          deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
        bg={toastType}
        className={`text-${toastType === "danger" ? "white" : "dark"}`}
      >
        <Toast.Header closeButton>
          <strong className="me-auto">
            {toastType === "success" ? "Éxito" : "Error"}
          </strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default UserManagement;
