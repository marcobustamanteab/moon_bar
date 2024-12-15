import React, { useState, useEffect } from 'react';
import { SimpleCard } from '../common/DivCard';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Modal, Button, Toast } from 'react-bootstrap';
import { useLoading } from '../../context/LoadingContext';
import { ProductAPI } from '../../api/endpoints/products';
import { Category } from '../../interfaces/product.interface';


interface FormData {
  name: string;
  description: string;
}

const ProductCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>('');
  const { setLoading } = useLoading();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');

  const handleShowModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name ?? '',
        description: category.description ?? '',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const showToastMessage = (message: string, type: 'success' | 'danger') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingCategory) {
        await ProductAPI.updateCategory(editingCategory.id, formData);
        showToastMessage('Categoría actualizada exitosamente', 'success');
      } else {
        await ProductAPI.createCategory(formData);
        showToastMessage('Categoría creada exitosamente', 'success');
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      showToastMessage('Error al guardar la categoría', 'danger');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta categoría?')) {
      try {
        setLoading(true);
        await ProductAPI.deleteCategory(id);
        showToastMessage('Categoría eliminada exitosamente', 'success');
        fetchCategories();
      } catch (error) {
        showToastMessage('Error al eliminar la categoría', 'danger');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await ProductAPI.getCategories();
      setCategories(data);
    } catch (error) {
      setError('Error al cargar las categorías');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-1">Categorías de Productos</h5>
          <p className="text-muted small mb-0">Gestión de categorías</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => handleShowModal()}
        >
          <Plus size={16} />
          Nueva Categoría
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
                <th>Descripción</th>
                <th className="text-center">Productos</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td className="text-center">{category.product_count || 0}</td>
                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleShowModal(category)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(category.id)}
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

      {/* Modal para crear/editar categoría */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

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

export default ProductCategories;