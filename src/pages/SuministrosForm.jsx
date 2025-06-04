import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createSupply, updateSupply, getSupplies } from '../api/suministros';
import { getProviders } from '../api/proveedores';
import { fetchCsrfToken } from '../api/axios';

export default function SupplyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  
  const isEditing = !!id;
  const [isLoadingSupply, setIsLoadingSupply] = useState(isEditing);
  
  const [formData, setFormData] = useState({
    idProveedor: '',
    fecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    monto: '',
    estado: true
  });

  // Obtener proveedores para el select
  const { data: providers } = useQuery({
    queryKey: ['providers'],
    queryFn: () => getProviders(1, 100),
  });

  const findSupplyInAllPages = async (supplyId) => {
    let currentPage = 1;
    let foundSupply = null;
    let hasMorePages = true;

    while (hasMorePages && !foundSupply) {
      try {
        const response = await getSupplies(currentPage, 10);
        const supply = response.data.find(s => s.idSuministro === parseInt(supplyId));
        
        if (supply) {
          foundSupply = supply;
        } else {
          hasMorePages = currentPage < response.pagination.pages;
          currentPage++;
        }
      } catch (error) {
        console.error('Error buscando suministro:', error);
        break;
      }
    }

    return foundSupply;
  };

  // Obtener token CSRF al montar el formulario
  useEffect(() => {
    fetchCsrfToken();
  }, []);
  
  useEffect(() => {
    if (!isEditing) return;

    const loadSupplyData = async () => {
      try {
        const supply = await findSupplyInAllPages(id);
        if (supply) {
          setFormData({
            idProveedor: supply.idProveedor,
            fecha: supply.fecha.split('T')[0], // Formatear fecha para input date
            monto: supply.monto,
            estado: supply.estado
          });
        } else {
          console.warn(`No se encontró el suministro con ID ${id}`);
        }
      } catch (error) {
        console.error('Error cargando suministro:', error);
      } finally {
        setIsLoadingSupply(false);
      }
    };

    loadSupplyData();
  }, [id, isEditing]);

  const mutation = useMutation({
    mutationFn: isEditing 
      ? (data) => updateSupply(id, data)
      : createSupply,
    onSuccess: () => {
      queryClient.invalidateQueries(['supplies']);
      navigate('/suministros');
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
    
    // Convertir a número el monto
    const dataToSend = {
      ...formData,
      monto: parseFloat(formData.monto),
      idProveedor: parseInt(formData.idProveedor)
    };
    
    mutation.mutate(dataToSend);
  };

  if (isEditing && isLoadingSupply) {
    return <div>Cargando suministro...</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">{isEditing ? 'Editar Suministro' : 'Nuevo Suministro'}</h2>
  
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="idProveedor" className="form-label">Proveedor:</label>
          <select
            id="idProveedor"
            name="idProveedor"
            value={formData.idProveedor}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">Seleccione un proveedor</option>
            {providers?.data?.map(provider => (
              <option key={provider.idProveedor} value={provider.idProveedor}>
                {provider.nombre}
              </option>
            ))}
          </select>
        </div>
  
        <div className="form-group">
          <label htmlFor="fecha" className="form-label">Fecha:</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="monto" className="form-label">Monto:</label>
          <input
            type="number"
            step="0.10"
            id="monto"
            name="monto"
            value={formData.monto}
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
          <button type="button" onClick={() => navigate('/suministros')} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
  
}