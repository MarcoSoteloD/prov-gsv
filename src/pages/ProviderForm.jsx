import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createProvider, updateProvider, getProviders } from '../api/proveedores';
import { fetchCsrfToken } from '../api/axios';

export default function ProviderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const isEditing = !!id;
  const [isLoadingProvider, setIsLoadingProvider] = useState(isEditing);

  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    estado: true
  });

  const findProviderInAllPages = async (providerId) => {
    let currentPage = 1;
    let foundProvider = null;
    let hasMorePages = true;

    while (hasMorePages && !foundProvider) {
      try {
        const response = await getProviders(currentPage, 10);
        const provider = response.data.find(prov => prov.idProveedor === parseInt(providerId));

        if (provider) {
          foundProvider = provider;
        } else {
          hasMorePages = currentPage < response.pagination.pages;
          currentPage++;
        }
      } catch (error) {
        console.error('Error buscando proveedor:', error);
        break;
      }
    }

    return foundProvider;
  };

  // Obtener token CSRF al montar el formulario
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  useEffect(() => {
    if (!isEditing) return;

    const loadProviderData = async () => {
      try {
        const provider = await findProviderInAllPages(id);
        if (provider) {
          setFormData({
            nombre: provider.nombre,
            direccion: provider.direccion,
            telefono: provider.telefono,
            email: provider.email,
            estado: provider.estado
          });
        } else {
          console.warn(`No se encontró el proveedor con ID ${id}`);
        }
      } catch (error) {
        console.error('Error cargando proveedor:', error);
      } finally {
        setIsLoadingProvider(false);
      }
    };

    loadProviderData();
  }, [id, isEditing]);

  const mutation = useMutation({
    mutationFn: isEditing
      ? (data) => updateProvider(id, data)
      : createProvider,
    onSuccess: () => {
      queryClient.invalidateQueries(['providers']);
      navigate('/proveedores');
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

  if (isEditing && isLoadingProvider) {
    return <div>Cargando proveedor...</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">{isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>

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
          <label htmlFor="direccion" className="form-label">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono" className="form-label">Teléfono:</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
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
          <button type="button" onClick={() => navigate('/proveedores')} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );

}