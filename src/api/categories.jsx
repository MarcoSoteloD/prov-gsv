import api from './axios';

export const getCategories = async (page = 1, perPage = 8) => {
  const response = await api.get('/categorias', {
    params: {
      page,
      perPage 
    }
  });
  return response.data;
};

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categorias', {
      nombre: categoryData.nombre,
      estado: categoryData.estado || 1 // Valor por defecto
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categorias/${id}`, {
      nombre: categoryData.nombre,
      estado: categoryData.estado
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};