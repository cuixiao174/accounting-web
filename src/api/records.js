import api from './index';

export const getRecords = async (params) => {
  return api.get('/records', { params });
};

export const createRecord = async (record) => {
  return api.post('/records', record);
};

export const updateRecord = async (id, record) => {
  return api.put(`/records/${id}`, record);
};

export const deleteRecord = async (id) => {
  return api.delete(`/records/${id}`);
};
