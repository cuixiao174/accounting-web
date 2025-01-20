import api from './index';

export const getStatistics = async (params) => {
  return api.get('/statistics', { params });
};
