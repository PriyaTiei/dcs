import apiClient from './apiClient';

export const crankApi = {
  // Get crank information by engine number
  getCrankInfoByEngineNo: (engineNo) =>
    apiClient.get(`/crank/crankinformation/${engineNo}`),

  // Update crank information by engine number
  updateCrankInfoByEngineNo: (engineNo, data) =>
    apiClient.put(`/crank/crankinformation/${engineNo}`, data),

  // Delete crank information by engine number
  deleteCrankInfoByEngineNo: (engineNo) =>
    apiClient.delete(`/crank/crankinformation/${engineNo}`),

  // Get all crank records
  getAllCrankInfo: () => apiClient.get('/crank/crankinfo'),

  // Create new crank record
  createCrankInfo: (data) => apiClient.post('/crank/crankinfo', data),

  // Get crank info by MongoDB ID
  getCrankInfoById: (id) => apiClient.get(`/crank/crankinfo/${id}`),

  // Update crank info by MongoDB ID
  updateCrankInfoById: (id, data) => apiClient.put(`/crank/crankinfo/${id}`, data),

  // Delete crank info by MongoDB ID
  deleteCrankInfoById: (id) => apiClient.delete(`/crank/crankinfo/${id}`),
};

export default crankApi;
