import api from './index';

export const login = async (credentials) => {
  return api.post('/user/login', credentials);
};

export const register = async (userData) => {
  return api.post('/user/register', userData);
};
