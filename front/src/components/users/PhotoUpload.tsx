/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { User } from "../../interfaces/user.interface";
import { UserAPI } from "../../api/endpoints/users";
import { Camera, User as UserIcon } from "lucide-react";
import { Toast } from "react-bootstrap";

interface PhotoUploadProps {
    user: User;
    onPhotoUpdate: (newPhotoUrl: string) => void;
    disabled?: boolean;
  }
  
export const PhotoUpload: React.FC<PhotoUploadProps> = ({ user, onPhotoUpdate, disabled }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
  
    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB');
        setShowToast(true);
        return;
      }
  
      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setError('El archivo debe ser una imagen');
        setShowToast(true);
        return;
      }
  
      try {
        setIsUploading(true);
        setError(null);
        const response = await UserAPI.uploadPhoto(user.id, file);
        onPhotoUpdate(response.photo_url);
        setShowToast(true);
      } catch (error) {
        setError('Error al cargar la imagen');
        setShowToast(true);
      } finally {
        setIsUploading(false);
      }
    };
  
    return (
      <>
        <div className="position-relative">
          <div 
            className="d-flex align-items-center justify-content-center rounded-circle overflow-hidden"
            style={{
              width: "96px",
              height: "96px",
              backgroundColor: "rgba(45, 53, 100, 0.1)",
              border: "2px solid rgba(45, 53, 100, 0.2)",
            }}
          >
            {user.photo_url ? (
              <img
                src={user.photo_url}
                alt={`Foto de ${user.first_name}`}
                className="w-100 h-100 object-fit-cover"
              />
            ) : (
              <div className="text-muted">
                <UserIcon size={40} />
              </div>
            )}
          </div>
  
          {!disabled && (
            <div 
              className="position-absolute w-100 h-100 top-0 start-0 d-flex justify-content-center align-items-center"
              style={{
                background: 'rgba(0,0,0,0.5)',
                opacity: 0,
                transition: 'opacity 0.2s',
                cursor: 'pointer',
                ':hover': {
                  opacity: 1
                }
              }}
            >
              <label htmlFor="photo-upload" className="btn btn-sm btn-light">
                {isUploading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <Camera size={16} />
                )}
              </label>
              <input
                id="photo-upload"
                type="file"
                className="d-none"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isUploading || disabled}
              />
            </div>
          )}
        </div>
  
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1000
          }}
        >
          <Toast.Header>
            <strong className="me-auto">
              {error ? 'Error' : 'Éxito'}
            </strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowToast(false)}
            />
          </Toast.Header>
          <Toast.Body className={error ? 'text-danger' : 'text-success'}>
            {error || 'Foto actualizada correctamente'}
          </Toast.Body>
        </Toast>
      </>
    );
  };