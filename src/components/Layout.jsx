import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/auth';
import { useEffect } from 'react';
import '../styles/layout.scss';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      navigate('/login');
    }
  }, [isError, navigate]);

  const isActive = (path) => location.pathname === path;

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-top">
          <div className="user-info">
            <h3>Bienvenido, {user?.name}</h3>
            <p>{user?.email}</p>
          </div>

          <div className="sidebar-shortcuts">
            <Link
              to="/dashboard"
              className={`shortcut-button ${isActive('/dashboard') ? 'active' : ''}`}
              title="Inicio"
            >
              <i className="fas fa-home"></i>
            </Link>
            <Link
              to="/usuarios"
              className={`shortcut-button ${isActive('/usuarios') ? 'active' : ''}`}
              title="Usuarios"
            >
              <i className="fas fa-user"></i>
            </Link>
          </div>

          <ul className="nav-links">
            <li>
              <Link to="/categorias">Categorías</Link>
            </li>
            <li>
              <Link to="/piezas">Piezas</Link>
            </li>
            <li>
              <Link to="/proveedores">Proveedores</Link>
            </li>
            <li>
              <Link to="/suministros">Suministros</Link>
            </li>
          </ul>
        </div>

        <div className="logout-button">
          <button
            onClick={() => {
              localStorage.removeItem('auth_token');
              navigate('/login');
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
