import api from './axios';

export const getProviders = async (page = 1, perPage = 8) => {
  const response = await api.get('/proveedores', {
    params: {
      page,
      perPage
    }
  });
  return response.data;
};

export const createProvider = async (providerData) => {
  try {
    const response = await api.post('/proveedores', providerData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateProvider = async (id, providerData) => {
  try {
    const response = await api.put(`/proveedores/${id}`, providerData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};