/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserAPI } from "../../api/endpoints";
import { Group, User } from "../../interfaces";

interface ApiError {
    response?: {
      data: {
        [key: string]: string | string[];
      };
      status?: number;
    };
    message: string;
  }

const UpdateUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<Partial<User>>({});
  const [errors, setErrors] = useState<Partial<User>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, groupsData] = await Promise.all([
          UserAPI.getById(Number(id)),
          UserAPI.getGroups()
        ]);
        
        // Eliminamos password directamente del objeto
        delete userData.password;
        setUser(userData);
        setGroups(groupsData);
        
        if (userData.groups && userData.groups.length > 0) {
          setSelectedGroup(userData.groups[0]);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
  
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    // Limpiar error específico cuando el usuario empieza a escribir
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};

    if (!user.username) newErrors.username = "El nombre de usuario es requerido";
    if (!user.email) newErrors.email = "El email es requerido";
    if (!user.first_name) newErrors.first_name = "El nombre es requerido";
    if (!user.last_name) newErrors.last_name = "El apellido es requerido";
    if (user.password && user.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (validate()) {
      try {
        const dataToSend = {
          ...user,
          groups: selectedGroup ? [selectedGroup] : []
        };
        
        if (!dataToSend.password) {
          delete dataToSend.password;
        }

        await UserAPI.updateUser(Number(id), dataToSend);
        navigate("/users/manage", {
          state: {
            showToast: true,
            toastMessage: "Usuario actualizado exitosamente",
            toastType: "success",
          },
        });
      } catch (error: unknown) {
        const apiError = error as ApiError;
        
        if (apiError.response?.data) {
          const backendErrors = apiError.response.data;
          const newErrors: {[key: string]: string} = {};
          
          Object.entries(backendErrors).forEach(([key, value]) => {
            newErrors[key] = Array.isArray(value) ? value[0] : value as string;
          });
          
          setErrors(newErrors);
        }
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Editar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Nombre de usuario
          </label>
          <input
            type="text"
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="group" className="form-label">
            Grupo
          </label>
          <select
            className="form-select"
            id="group"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Seleccionar grupo</option>
            {groups.map((group) => (
              <option key={group.id} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
            id="first_name"
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
          />
          {errors.first_name && (
            <div className="invalid-feedback">{errors.first_name}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Apellido
          </label>
          <input
            type="text"
            className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
            id="last_name"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
          />
          {errors.last_name && (
            <div className="invalid-feedback">{errors.last_name}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            id="password"
            name="password"
            value={user.password || ""}
            onChange={handleChange}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
