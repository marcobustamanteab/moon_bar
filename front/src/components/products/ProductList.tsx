import React, { useState, useEffect } from 'react';
import { SimpleCard } from '../common/DivCard';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';
import { ProductAPI } from '../../api/endpoints/products';
import { Product } from '../../interfaces/product.interface';
import { Modal, Button, Toast } from 'react-bootstrap';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string>('');
  const { setLoading } = useLoading();
  const [showModal, setShowModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');

  const showToastMessage = (message: string, type: 'success' | 'danger') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductAPI.getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      setError('Error al cargar los productos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtrar productos cuando cambia el término de búsqueda
  useEffect(() => {
    const filtered = products.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      const price = formatPrice(product.price).toLowerCase();
      
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.category_name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        price.includes(searchLower)
      );
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleDeleteConfirmation = (id: number) => {
    setDeleteProductId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (deleteProductId) {
      try {
        setLoading(true);
        await ProductAPI.deleteProduct(deleteProductId);
        showToastMessage('Producto eliminado exitosamente', 'success');
        fetchProducts();
        setShowModal(false);
      } catch (error) {
        showToastMessage('Error al eliminar el producto', 'danger');
        console.error('Error:', error);
      } finally {
        setLoading(false);
        setDeleteProductId(null);
      }
    }
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/products/edit/${productId}`);
  };

  // Función para formatear precio de forma segura
  const formatPrice = (price: number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(numPrice) ? `$${Number(numPrice).toFixed(2)}` : '$0.00';
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => navigate('/products/create')}
          >
            <Plus size={16} />
            Nuevo Producto
          </button>

          <div className="position-relative">
            <input 
              type="text" 
              className="form-control pl-4" 
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '30px', minWidth: '300px' }}
            />
            <Search 
              size={16} 
              className="position-absolute text-muted" 
              style={{ 
                left: '10px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }} 
            />
          </div>
        </div>
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
                <th>Categoría</th>
                <th>Precio</th>
                <th className="text-center">Estado</th>
                <th>Stock</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description || 'Sin descripción'}</td>
                  <td>{product.category_name}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td className="text-center">
                    <span 
                      className={`badge ${product.is_available ? 'bg-success' : 'bg-danger'}`}
                    >
                      {product.is_available ? 'Disponible' : 'No disponible'}
                    </span>
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditProduct(product.id)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteConfirmation(product.id)}
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

      {/* Modal de confirmación de eliminación */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de eliminar este producto?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast de notificación */}
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

export default ProductList;