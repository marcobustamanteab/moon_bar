/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLoading } from '../../context/LoadingContext';
import { ProductAPI } from '../../api/endpoints/products';
import { Product, Category } from '../../interfaces/product.interface';
import { SimpleCard } from '../common/DivCard';
import { useNavigate } from 'react-router-dom';

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: undefined,
    is_available: true,
  });
  const [errors, setErrors] = useState<Partial<Product>>({});
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await ProductAPI.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const productData = new FormData();
      productData.append('name', formData.name || '');
      productData.append('description', formData.description || '');
      productData.append('price', formData.price?.toString() || '');
      if (formData.category) {
        productData.append('category', formData.category.toString());
      }
      productData.append('is_available', formData.is_available ? 'true' : 'false');
      await ProductAPI.createProduct(productData);
      navigate('/products/list');
    } catch (error) {
      console.error('Error al crear el producto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <div className="mb-4">
        <h5 className="mb-1">Crear Producto</h5>
        <p className="text-muted small">Añadir nuevo producto al catálogo</p>
      </div>

      <SimpleCard>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nombre del Producto</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Categoría</label>
              <select
                className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: Number(e.target.value) })}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Precio</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                  required
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Estado</label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                />
                <label className="form-check-label">
                  {formData.is_available ? 'Disponible' : 'No disponible'}
                </label>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            <div className="col-12">
              <hr />
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/products/list')}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear Producto
                </button>
              </div>
            </div>
          </div>
        </form>
      </SimpleCard>
    </div>
  );
};

export default ProductForm;