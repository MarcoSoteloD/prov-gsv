import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/users';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function UsersPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['users', currentPage],
    queryFn: () => getUsers(currentPage),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (isError) return <p>Error al cargar los usuarios</p>;

  const users = response?.data || [];
  const pagination = response?.pagination || {
    total: 0,
    pages: 1,
    currentPage: 1,
    perPage: 8
  };

  return (
    <div className="catalog-page">
      <div className="header-line">
        <h2>Usuarios</h2>
        <button
          onClick={() => navigate('/usuarios/nuevo')}
          className="button"
        >
          Registrar Usuario
        </button>
      </div>
      <div className="catalog-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => navigate(`/usuarios/editar/${user.id}`)}
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