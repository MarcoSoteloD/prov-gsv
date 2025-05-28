import api from './axios';

export const getParts = async (page = 1, perPage = 8) => {
  const response = await api.get('/piezas', {
    params: {
      page,
      perPage
    }
  });
  return response.data;
};

export const createPart = async (partData) => {
  try {
    const response = await api.post('/piezas', partData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updatePart = async (id, partData) => {
  try {
    const response = await api.put(`/piezas/${id}`, partData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletePart = async (id) => {
  try {
    const response = await api.delete(`/piezas/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};