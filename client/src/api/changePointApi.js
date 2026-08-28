import apiClient from './apiClient';

export const changePointApi = {
  // Get all 4M change points with optional query filters & pagination
  getAllChangePoints: () => apiClient.get('/changePoint/getAllChangePoints'),

  // Get total count of change points
  getChangePointsCount: () => apiClient.get('/changePoint/getChangePointsCount'),

  // Get change point by ID
  getChangePointById: (id) => apiClient.get(`/changePoint/get/${id}`),

  // Create new change point
  createChangePoint: (data) => apiClient.post('/changePoint/add', data),

  // Update existing change point
  updateChangePoint: (id, data) => apiClient.put(`/changePoint/update/${id}`, data),

  // Delete change point
  deleteChangePoint: (id) => apiClient.delete(`/changePoint/delete/${id}`),
};

export default changePointApi;
