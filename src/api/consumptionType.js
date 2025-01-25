import api from './index';

export const getConsumptionTypes = async () => {
  const response = await api.get('/consumption-types');
  return response.content;
};

export const createConsumptionType = async (type) => {
  return api.post('/consumption-types', type);
};

export const updateConsumptionType = async (id, type) => {
  return api.put(`/consumption-types/${id}`, type);
};

export const deleteConsumptionType = async (id) => {
  return api.delete(`/consumption-types/${id}`);
};
