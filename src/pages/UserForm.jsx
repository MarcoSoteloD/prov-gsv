// pages/UserForm.jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { registerUser, updateUser, getUsers } from '../api/users';

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const isEditing = !!id;
  const [isLoadingUser, setIsLoadingUser] = useState(isEditing);

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Función para buscar el usuario en todas las páginas
  const findUserInAllPages = async (userId) => {
    let currentPage = 1;
    let foundUser = null;
    let hasMorePages = true;

    while (hasMorePages && !foundUser) {
      try {
        const response = await getUsers(currentPage, 6);
        const user = response.data.find(u => u.id === parseInt(userId));

        if (user) {
          foundUser = user;
        } else {
          // Verificar si hay más páginas
          hasMorePages = currentPage < response.pagination.pages;
          currentPage++;
        }
      } catch (error) {
        console.error('Error buscando usuario:', error);
        break;
      }
    }

    return foundUser;
  };

  // Cargar datos del usuario al montar el componente si estamos editando
  useEffect(() => {
    if (!isEditing) return;

    const loadUserData = async () => {
      try {
        const user = await findUserInAllPages(id);
        if (user) {
          setFormData({
            name: user.name,
            email: user.email,
            password: ''
          });
        } else {
          console.warn(`No se encontró el usuario con ID ${id}`);
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserData();
  }, [id, isEditing]);

  // Mutaciones para crear/actualizar
  const mutation = useMutation({
    mutationFn: isEditing
      ? (data) => updateUser(id, data)
      : (data) => registerUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      navigate('/usuarios');
    },
    onError: (error) => {
      console.error('Error en la mutación:', error);
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
    
    // Validación básica para creación
    if (!isEditing && !formData.password) {
      alert('La contraseña es requerida');
      return;
    }

    mutation.mutate(formData);
  };

  if (isEditing && isLoadingUser) {
    return <div>Cargando usuario...</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
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

        <div className="form-buttons">
          <button type="submit" disabled={mutation.isLoading} className="btn btn-primary">
            {mutation.isLoading ? 'Guardando...' : 'Guardar'}
          </button>

          <button type="button" onClick={() => navigate('/usuarios')} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}