/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAPI } from "../../api/endpoints";
import { Group, User } from "../../interfaces";
import { ArrowLeft, UserPlus } from "lucide-react";

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Partial<User>>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    groups: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | "">("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsData = await UserAPI.getGroups();
        setGroups(groupsData);
      } catch (error) {
        console.error("Error al cargar grupos:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setSelectedGroup(value);
    setErrors((prev) => ({ ...prev, groups: "" }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!user.username) {
      newErrors.username = "El nombre de usuario es requerido";
    }
    if (!user.email) {
      newErrors.email = "El email es requerido";
    }
    if (!user.first_name) {
      newErrors.first_name = "El nombre es requerido";
    }
    if (!user.last_name) {
      newErrors.last_name = "El apellido es requerido";
    }
    if (!user.password) {
      newErrors.password = "La contraseña es requerida";
    }
    if (!selectedGroup) {
      newErrors.groups = "Debe seleccionar un grupo";
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
          username: user.username,
          email: user.email,
          password: user.password,
          first_name: user.first_name,
          last_name: user.last_name,
          groups: selectedGroup ? [selectedGroup] : [],
        };

        await UserAPI.create(dataToSend);
        navigate("/users/manage", {
          state: {
            showToast: true,
            toastMessage: "Usuario creado exitosamente",
            toastType: "success",
          },
        });
      } catch (error: any) {
        if (error.response?.data) {
          setErrors(error.response.data);
        } else {
          setErrors({ general: "Error al crear el usuario" });
        }
        console.error("Error al crear usuario:", error);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Crear Usuario</h2>
      {errors.general && (
        <div className="alert alert-danger">{errors.general}</div>
      )}
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
            value={user.username || ""}
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
            className={`form-select ${errors.groups ? "is-invalid" : ""}`}
            id="group"
            value={selectedGroup || ""}
            onChange={handleGroupChange}
          >
            <option value="">Seleccionar grupo</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          {errors.groups && (
            <div className="invalid-feedback">{errors.groups}</div>
          )}
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
            value={user.email || ""}
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
            value={user.first_name || ""}
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
            value={user.last_name || ""}
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
            onChange={handleChange}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center gap-2"
            disabled={isSubmitting}
          >
            <UserPlus size={16} />
            {isSubmitting ? "Creando..." : "Crear Usuario"}
          </button>

          <button
            type="button"
            className="btn btn-secondary d-flex align-items-center gap-2"
            onClick={() => navigate("/users/manage")}
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
