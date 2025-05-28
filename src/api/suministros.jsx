import api from './axios';

export const getSupplies = async (page = 1, perPage = 8) => {
  const response = await api.get('/suministros', {
    params: {
      page,
      perPage
    }
  });
  return response.data;
};

export const createSupply = async (supplyData) => {
  try {
    const response = await api.post('/suministros', supplyData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateSupply = async (id, supplyData) => {
  try {
    const response = await api.put(`/suministros/${id}`, supplyData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};