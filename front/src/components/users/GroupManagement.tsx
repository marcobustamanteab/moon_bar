/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { SimpleCard } from '../common/DivCard';
import { UserAPI } from '../../api/endpoints/users';
import { useLoading } from '../../context/LoadingContext';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';
import { Toast } from 'react-bootstrap';

interface Group {
  id: number;
  name: string;
  permissions?: string[];
  user_count?: number;
}

const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string>('');
  const { setLoading } = useLoading();
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [groupName, setGroupName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await UserAPI.getGroups();
      setGroups(data);
    } catch (error) {
      setError('Error al cargar los grupos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleShowModal = (group?: Group) => {
    if (group) {
      setEditingGroup(group);
      setGroupName(group.name);
    } else {
      setEditingGroup(null);
      setGroupName('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGroup(null);
    setGroupName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingGroup) {
        await UserAPI.updateGroup(editingGroup.id, { name: groupName });
        showToastMessage('Grupo actualizado exitosamente', 'success');
      } else {
        await UserAPI.createGroup({ name: groupName });
        showToastMessage('Grupo creado exitosamente', 'success');
      }
      fetchGroups();
      handleCloseModal();
    } catch (error) {
      showToastMessage('Error al guardar el grupo', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este grupo?')) {
      try {
        setLoading(true);
        await UserAPI.deleteGroup(id);
        showToastMessage('Grupo eliminado exitosamente', 'success');
        fetchGroups();
      } catch (error) {
        showToastMessage('Error al eliminar el grupo', 'danger');
      } finally {
        setLoading(false);
      }
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'danger') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-1">Gestión de Grupos</h5>
          <p className="text-muted small mb-0">Administración de roles y permisos</p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => handleShowModal()}
        >
          <Plus size={16} />
          Nuevo Grupo
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <SimpleCard>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Usuarios</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {groups.map(group => (
                <tr key={group.id}>
                  <td>{group.id}</td>
                  <td>{group.name}</td>
                  <td>{group.user_count || 0}</td>
                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleShowModal(group)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(group.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SimpleCard>

      {/* Modal para crear/editar grupo */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingGroup ? 'Editar Grupo' : 'Nuevo Grupo'}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Nombre del Grupo</label>
              <input
                type="text"
                className="form-control"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingGroup ? 'Guardar Cambios' : 'Crear Grupo'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Toast notifications */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
        bg={toastType}
        className="text-white"
      >
        <Toast.Header closeButton>
          <strong className="me-auto">
            {toastType === 'success' ? 'Éxito' : 'Error'}
          </strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default GroupManagement;