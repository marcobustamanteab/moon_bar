/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/companies/CompanyManagement.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyAPI } from '../../api/endpoints/companies';
import { Company } from '../../interfaces/company.interface';
import { useLoading } from '../../context/LoadingContext';
import CustomDataTable from '../common/CustomDataTable';
import { TableColumn } from 'react-data-table-component';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Toast, Modal, Button } from 'react-bootstrap';

const CompanyManagement: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const { setLoading } = useLoading();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await CompanyAPI.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      showToastMessage('Error al cargar las empresas', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDeleteClick = (id: number) => {
    setCompanyToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;

    try {
      setLoading(true);
      await CompanyAPI.delete(companyToDelete);
      await fetchCompanies();
      showToastMessage('Empresa eliminada exitosamente', 'success');
    } catch (error) {
      console.error('Error deleting company:', error);
      showToastMessage('Error al eliminar la empresa', 'danger');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setCompanyToDelete(null);
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'danger') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const columns: TableColumn<Company>[] = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '70px',
    },
    {
      name: 'Nombre',
      selector: row => row.name,
      sortable: true,
      width: '200px',
    },
    {
      name: 'RUT',
      selector: row => row.rut,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Estado',
      selector: row => row.is_active,
      sortable: true,
      width: '100px',
      cell: row => (
        <span className={`badge ${row.is_active ? 'bg-success' : 'bg-danger'}`}>
          {row.is_active ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      name: 'Acciones',
      cell: row => (
        <div className="d-flex gap-2">
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => navigate(`/companies/${row.id}/edit`)}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDeleteClick(row.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
      width: '120px',
      right: true,
    },
  ];

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-1">Gestión de Empresas</h5>
          <p className="text-muted small mb-0">
            Administración de empresas y sus módulos
          </p>
        </div>
        <Button
          variant="primary"
          className="d-flex align-items-center gap-2"
          onClick={() => navigate('/companies/create')}
        >
          <Plus size={16} />
          Nueva Empresa
        </Button>
      </div>

      <CustomDataTable
        columns={columns}
        data={companies}
        pagination
        searchable
        onSearch={handleSearch}
      />

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar esta empresa? Esta acción no se puede deshacer.
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
        <Toast.Header>
          <strong className="me-auto">
            {toastType === 'success' ? 'Éxito' : 'Error'}
          </strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default CompanyManagement;