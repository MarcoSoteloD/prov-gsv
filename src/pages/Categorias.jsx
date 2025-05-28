import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/categories';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Modificamos la query para aceptar parámetros de paginación
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['categories', currentPage],
    queryFn: () => getCategories(currentPage), // Pasamos la página actual
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <p>Cargando categorías...</p>;
  if (isError) return <p>Error al cargar las categorías</p>;

  // Extraemos los datos y la paginación de la respuesta
  const categories = response?.data || [];
  const pagination = response?.pagination || {
    total: 0,
    pages: 1,
    currentPage: 1,
    perPage: 8
  };

  return (
    <div className="catalog-page">
      <div className="header-line">
        <h2>Categorías</h2>
        <button
          onClick={() => navigate('/categorias/nueva')}
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
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.idCategoria}>
                <td>{cat.idCategoria}</td>
                <td>{cat.nombre}</td>
                <td>
                  <span className={`status ${cat.estado ? 'active' : 'inactive'}`}>
                    {cat.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/categorias/editar/${cat.idCategoria}`)}
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