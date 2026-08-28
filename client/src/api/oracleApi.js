import apiClient from './apiClient';

export const oracleApi = {
  // Fetch engine assembly history & machining references
  getEngineData: (engineNo) => apiClient.get(`/oracle/engineNo/${engineNo}`),

  // Fetch engine date details
  getEngineDate: (engineNo) => apiClient.get(`/oracle/date/${engineNo}`),

  // Fetch individual part details (Head, Crank, Block)
  getPartData: (partNo) => apiClient.get(`/oracle/partNo/${partNo}`),

  // Fetch 3-part combined machining telemetry (Head, Crank, Block)
  getPart3Data: (partNo1, partNo2, partNo3) =>
    apiClient.get(`/oracle/partNo1/${partNo1}/partNo2/${partNo2}/partNo3/${partNo3}`),

  // Machining process date range query
  getDateRangeData: (processNo, fromDate, toDate) =>
    apiClient.get(`/oracle/processNo/${processNo}/fromDate/${fromDate}/toDate/${toDate}`),

  // Full Machining process data
  getFullData: (processNo, fromDate, toDate) =>
    apiClient.get(`/oracle/getFullData/${processNo}/fromDate/${fromDate}/toDate/${toDate}`),

  // Full Assembly process data
  getFullDataAssy: (processNo, fromDate, toDate) =>
    apiClient.get(`/oracle/getFullDataAssy/${processNo}/fromDate/${fromDate}/toDate/${toDate}`),

  // Serial number list matching query
  getEngineNoMatchingSerialNoList: (serialNumbers) =>
    apiClient.post('/oracle/serialNoListString', { serialNumbers }),

  // Dispatch dates matching engine list query
  getDispatchDatesMatchingEngineNoList: (engineNumbers) =>
    apiClient.post('/oracle/dispatchDates/engineNoListString', { engineNumbers }),

  // Casting number date range query
  getCastingNoDateRangeData: () => apiClient.get('/oracle/parts/castingNo'),
};

export default oracleApi;
