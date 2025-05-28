import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createPart, updatePart, getParts } from '../api/piezas';
import { getCategories } from '../api/categories';

export default function PartForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  
  const isEditing = !!id;
  const [isLoadingPart, setIsLoadingPart] = useState(isEditing);
  
  const [formData, setFormData] = useState({
    nombre: '',
    color: '',
    precio: '',
    idCategoria: '',
    medida: '',
    stock: 0,
    estado: true
  });

  // Obtener categorías para el select
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(1, 100),
  });

  const findPartInAllPages = async (partId) => {
    let currentPage = 1;
    let foundPart = null;
    let hasMorePages = true;

    while (hasMorePages && !foundPart) {
      try {
        const response = await getParts(currentPage, 10);
        const part = response.data.find(p => p.idPieza === parseInt(partId));
        
        if (part) {
          foundPart = part;
        } else {
          hasMorePages = currentPage < response.pagination.pages;
          currentPage++;
        }
      } catch (error) {
        console.error('Error buscando pieza:', error);
        break;
      }
    }

    return foundPart;
  };

  useEffect(() => {
    if (!isEditing) return;

    const loadPartData = async () => {
      try {
        const part = await findPartInAllPages(id);
        if (part) {
          setFormData({
            nombre: part.nombre,
            color: part.color,
            precio: part.precio,
            idCategoria: part.idCategoria,
            medida: part.medida,
            stock: part.stock,
            estado: part.estado
          });
        } else {
          console.warn(`No se encontró la pieza con ID ${id}`);
        }
      } catch (error) {
        console.error('Error cargando pieza:', error);
      } finally {
        setIsLoadingPart(false);
      }
    };

    loadPartData();
  }, [id, isEditing]);

  const mutation = useMutation({
    mutationFn: isEditing 
      ? (data) => updatePart(id, data)
      : createPart,
    onSuccess: () => {
      queryClient.invalidateQueries(['parts']);
      navigate('/piezas');
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
    
    // Convertir a número los campos necesarios
    const dataToSend = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      idCategoria: parseInt(formData.idCategoria)
    };
    
    mutation.mutate(dataToSend);
  };

  if (isEditing && isLoadingPart) {
    return <div>Cargando pieza...</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">{isEditing ? 'Editar Pieza' : 'Nueva Pieza'}</h2>
  
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
  
        <div className="form-group">
          <label htmlFor="color" className="form-label">Color:</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="precio" className="form-label">Precio:</label>
          <input
            type="number"
            step="0.01"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="idCategoria" className="form-label">Categoría:</label>
          <select
            id="idCategoria"
            name="idCategoria"
            value={formData.idCategoria}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">Seleccione una categoría</option>
            {categories?.data?.map(cat => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
  
        <div className="form-group">
          <label htmlFor="medida" className="form-label">Medida:</label>
          <input
            type="text"
            id="medida"
            name="medida"
            value={formData.medida}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="stock" className="form-label">Stock:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
  
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
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
          <button type="button" onClick={() => navigate('/piezas')} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}