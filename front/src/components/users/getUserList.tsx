import { useState, useEffect } from 'react';
import { User } from '../../interfaces';
import { UserAPI } from '../../api/endpoints';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserAPI.getAll();
        setUsers(data);
      } catch (error) {
        setError('Error al cargar los usuarios');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>
      <div className="grid gap-4">
        {users.map(user => (
          <div 
            key={user.id} 
            className="border p-4 rounded-lg shadow"
          >
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <div className="mt-2">
              <p>Nombre: {user.first_name} {user.last_name}</p>
              <p>Email: {user.email}</p>
              <p>Estado: {user.is_active ? 'Activo' : 'Inactivo'}</p>
              <p>Fecha de registro: {new Date(user.date_joined).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;