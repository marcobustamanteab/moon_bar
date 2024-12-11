import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { Key } from "lucide-react";
import { AxiosError } from "axios";
import { UserAPI } from "../../api/endpoints/users";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const { user } = useAuth();
  const { setLoading } = useLoading();
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePasswords = (): boolean => {
    if (formData.newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      return false;
    }
    if (formData.newPassword === formData.currentPassword) {
      setError("La nueva contraseña debe ser diferente a la actual");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validatePasswords()) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const response = await UserAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setSuccess(response.detail || "Contraseña actualizada exitosamente");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.detail || "Error al cambiar la contraseña");
      } else {
        setError("Error inesperado al cambiar la contraseña");
      }
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-3">
      <div className="mb-4">
        <h5 className="mb-1">Cambiar Contraseña</h5>
        <p className="text-muted small">Usuario: {user?.username}</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="currentPassword" className="form-label text-muted">
                Contraseña Actual
              </label>
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-light border-end-0">
                  <Key size={18} />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  style={{ backgroundColor: 'white' }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="newPassword" className="form-label text-muted">
                Nueva Contraseña
              </label>
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-light border-end-0">
                  <Key size={18} />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  minLength={8}
                  style={{ backgroundColor: 'white' }}
                />
              </div>
              <small className="text-muted mt-1 d-block">
                La contraseña debe tener al menos 8 caracteres
              </small>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label text-muted">
                Confirmar Nueva Contraseña
              </label>
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-light border-end-0">
                  <Key size={18} />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  style={{ backgroundColor: 'white' }}
                />
              </div>
            </div>

            <div className="d-grid gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Cambiando contraseña..." : "Cambiar Contraseña"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;