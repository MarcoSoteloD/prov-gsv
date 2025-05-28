import api from './axios';

export const getUsers = async (page = 1, perPage = 8) => {
  const response = await api.get('/user/usuarios', {
    params: {
      page,
      perPage 
    }
  });
  return response.data;
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/user/${id}`, {
      name: userData.name,
      email: userData.email,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};