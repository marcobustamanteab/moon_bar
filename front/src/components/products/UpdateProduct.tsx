/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { SimpleCard } from '../common/DivCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';

interface Category {
  id: number;
  name: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: number;
  category_id: number;
  is_available: boolean;
}

const UpdateProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    category_id: 0,
    is_available: true
  });
  const [errors, setErrors] = useState<Partial<ProductForm>>({});

  useEffect(() => {
    // Cargar datos del producto
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de actualización
  };

  return (
    <div className="p-3">
      <div className="mb-4">
        <h5 className="mb-1">Editar Producto</h5>
        <p className="text-muted small">Modificar información del producto</p>
      </div>

      <SimpleCard>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Los mismos campos que en CreateProduct */}
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
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </form>
      </SimpleCard>
    </div>
  );
};

export default UpdateProduct;