import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getProviders } from '../api/proveedores';

export default function ProvidersPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['providers', currentPage],
    queryFn: () => getProviders(currentPage),
  });

  if (isLoading) return <p>Cargando proveedores...</p>;
  if (isError) return <p>Error al cargar los proveedores</p>;

  const providers = response?.data || [];
  const pagination = response?.pagination || {
    total: 0,
    pages: 1,
    currentPage: 1,
    perPage: 8,
  };

  return (
    <div className="catalog-page">
      <div className="header-line">
        <h2>Proveedores</h2>
        <button
          onClick={() => navigate('/proveedores/nuevo')}
          className="button"
        >
          Agregar
        </button>
      </div>
      <div className="catalog-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.idProveedor}>
                <td>{provider.idProveedor}</td>
                <td>{provider.nombre}</td>
                <td>{provider.direccion}</td>
                <td>{provider.telefono}</td>
                <td>{provider.email}</td>
                <td>
                  <span className={`status ${provider.estado ? 'active' : 'inactive'}`}>
                    {provider.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/proveedores/editar/${provider.idProveedor}`)}
                    className="edit-button"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="nav-button"
          >
            Anterior
          </button>

          {Array.from({ length: pagination.pages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))}
            disabled={currentPage === pagination.pages}
            className="nav-button"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
