import React from 'react';

const UserProfile: React.FC = () => {
  return (
    <div className="container">
      <h2>Mi Perfil</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Información del Usuario</h5>
          {/* Aquí irá el contenido del perfil */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;