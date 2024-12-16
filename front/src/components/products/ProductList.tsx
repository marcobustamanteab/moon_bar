import React, { useState, useEffect } from 'react';
import { SimpleCard } from '../common/DivCard';
import { Edit2, Trash2, Plus, Search, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';
import { ProductAPI } from '../../api/endpoints/products';
import { Product, Category } from '../../interfaces/product.interface';
import { Modal, Button, Toast } from 'react-bootstrap';

interface CategoryGridViewProps {
  categories: Category[];
}

const CategoryGridView: React.FC<CategoryGridViewProps> = ({ categories }) => {
  const navigate = useNavigate();

  const onImageError = (category: Category) => {
    console.log('Error loading image for category:', category.name);
  };

  return (
    <SimpleCard>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
            onClick={() => navigate(`/products/category/${category.id}`)}
          >
            <div className="aspect-square bg-gray-200 w-full">
              <img
                src={`http://localhost:8000/media/${category.image}`}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={() => onImageError && onImageError(category)}
              />
            </div>
            
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4 transition-opacity duration-300 group-hover:bg-opacity-60">
              <h3 className="text-white text-xl font-bold mb-1">
                {category.name}
              </h3>
              <p className="text-white text-sm mb-2">
                {category.description || 'Sin descripción'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">
                  {category.product_count} productos
                </span>
                <span className="bg-white text-black px-3 py-1 rounded-full text-sm">
                  Ver más
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SimpleCard>
  );
};

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string>('');
  const { setLoading } = useLoading();
  const [showModal, setShowModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const showToastMessage = (message: string, type: 'success' | 'danger') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        ProductAPI.getProducts(),
        ProductAPI.getCategories()
      ]);

      if (Array.isArray(productsData)) {
        setProducts(productsData);
        setFilteredProducts(productsData);
      }

      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      }
    } catch (error) {
      setError('Error al cargar los datos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        fetchData();
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

  console.log('CategoryGridView rendering with categories:', categories);
  categories.forEach(category => {
    console.log(`Category ${category.name} image URL:`, category.image_url);
  });

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

          <div className="btn-group">
            <button
              className={`btn btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
            <button
              className={`btn btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {viewMode === 'list' ? (
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
      ) : (
        <>
        {console.log('Datos enviados a CategoryGridView:', categories)} 
        <CategoryGridView 
          categories={categories}
        />
      </>
      )}

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