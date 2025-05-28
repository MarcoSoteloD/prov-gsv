// pages/CategoryForm.jsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createCategory, updateCategory, getCategories } from '../api/categories';

export default function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const isEditing = !!id;
  const [isLoadingCategory, setIsLoadingCategory] = useState(isEditing);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    estado: true
  });

  // Función para buscar la categoría en todas las páginas
  const findCategoryInAllPages = async (categoryId) => {
    let currentPage = 1;
    let foundCategory = null;
    let hasMorePages = true;

    while (hasMorePages && !foundCategory) {
      try {
        const response = await getCategories(currentPage, 6);
        const category = response.data.find(cat => cat.idCategoria === parseInt(categoryId));

        if (category) {
          foundCategory = category;
        } else {
          // Verificar si hay más páginas
          hasMorePages = currentPage < response.pagination.pages;
          currentPage++;
        }
      } catch (error) {
        console.error('Error buscando categoría:', error);
        break;
      }
    }

    return foundCategory;
  };

  // Cargar datos de la categoría al montar el componente si estamos editando
  useEffect(() => {
    if (!isEditing) return;

    const loadCategoryData = async () => {
      try {
        const category = await findCategoryInAllPages(id);
        if (category) {
          setFormData({
            nombre: category.nombre,
            estado: category.estado
          });
        } else {
          console.warn(`No se encontró la categoría con ID ${id}`);
        }
      } catch (error) {
        console.error('Error cargando categoría:', error);
      } finally {
        setIsLoadingCategory(false);
      }
    };

    loadCategoryData();
  }, [id, isEditing]);

  // Mutaciones para crear/actualizar
  const mutation = useMutation({
    mutationFn: isEditing
      ? (data) => updateCategory(id, data)
      : createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      navigate('/categorias');
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isEditing && isLoadingCategory) {
    return <div>Cargando categoría...</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="nombre" className="form-label">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="form-label checkbox-label">
            <input
              type="checkbox"
              name="estado"
              checked={formData.estado}
              onChange={handleChange}
              className="form-checkbox"
            />
            Activo
          </label>
        </div>

        <div className="form-buttons">
          <button type="submit" disabled={mutation.isLoading} className="btn btn-primary">
            {mutation.isLoading ? 'Guardando...' : 'Guardar'}
          </button>

          <button type="button" onClick={() => navigate('/categorias')} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );

}