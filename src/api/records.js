import api from './index';

export const getRecords = async (userId) => {
  const response = await api.get('/records', {
    params: {
      user_id: userId,
    },
  });
  return response.content;
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
