import apiClient, { BACKEND_URL } from './apiClient';

export const postgresApi = {
  // --- IoT Nutrunners & Tightening ---
  getImpactWrenchData: (engineNo) => apiClient.get(`/api/impactWrench/${engineNo}`),
  getYokotaData: (engineNo) => apiClient.get(`/api/yokota/${engineNo}`),
  getTorqueDataByDateRange: (stationNumber) =>
    apiClient.get(`/api/torque-data-by-date-range/${stationNumber}`),

  // --- Station Tool Mapping ---
  getStationToolMap: () => apiClient.get('/api/station-tool-map'),
  addStationToolMap: (toolData) => apiClient.post('/api/station-tool-map', toolData),
  updateStationToolMap: (oldStation, oldFolder, toolData) =>
    apiClient.put(`/api/station-tool-map/${encodeURIComponent(oldStation)}/${encodeURIComponent(oldFolder)}`, toolData),
  deleteStationToolMap: (station, folder) =>
    apiClient.delete(`/api/station-tool-map/${encodeURIComponent(station)}/${encodeURIComponent(folder)}`),

  // --- Part Traceability Data ---
  getIgCoilChainCoverData: (engineNo) => apiClient.get(`/api/ig_coil_chain_cover/${engineNo}`),
  getConnectingRodData: (engineNo) => apiClient.get(`/api/connecting_rod/${engineNo}`),
  getChainCaseData: (engineNo) => apiClient.get(`/api/chaincase/${engineNo}`),
  getChainCoverData: (engineNo) => apiClient.get(`/api/chaincover/${engineNo}`),
  getFuelDeliveryPipeData: (engineNo) => apiClient.get(`/api/fueldeliverypipe/${engineNo}`),
  getPCVData: (engineNo) => apiClient.get(`/api/pcv/${engineNo}`),
  getWireHarnessData: (engineNo) => apiClient.get(`/api/wireharness/${engineNo}`),
  getCamHousingData: (camhousingSN) => apiClient.get(`/api/camhousing/${camhousingSN}`),
  getPortInjectorData: (headSN) => apiClient.get(`/api/portinjector/${headSN}`),

  // --- High-Resolution Inspection Images ---
  getIgCoilImages: (engineNo) => apiClient.get(`/api/ig-coil-images/${engineNo}`),
  getConnectingRodImages: (engineNo) => apiClient.get(`/api/connecting-rod-images/${engineNo}`),

  // Image URL Helper builders
  getChainCaseImageUrl: (engineNo) => `${BACKEND_URL}/api/chaincase-image/${engineNo}`,
  getChainCoverImageUrl: (engineNo) => `${BACKEND_URL}/api/chaincover-image/${engineNo}`,
  getCamHousingImageUrl: (camhousingSN) => `${BACKEND_URL}/api/camhousing-image/${camhousingSN}`,
  getIgCoilImageUrl: (engineNo, index) => `${BACKEND_URL}/api/ig-coil-images/${engineNo}/${index}`,
  getConnectingRodImageUrl: (engineNo, index) => `${BACKEND_URL}/api/connecting-rod-images/${engineNo}/${index}`,
};

export default postgresApi;
