import apiClient, { BACKEND_URL } from './apiClient';

export const dcsApi = {
  // Submit new assembly offline treatment defect form
  createDcsForm: (formData) => apiClient.post('/dcs/dcs-form', formData),

  // Retrieve all submitted defect forms
  getAllDcsForms: () => apiClient.get('/dcs/dcs-forms'),

  // Upload single defect photo (multipart)
  uploadDefectImage: (formData) =>
    apiClient.post('/dcs/dcs-form/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Upload single rework image (multipart)
  uploadReworkImage: (formData) =>
    apiClient.post('/dcs/reworkImages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Upload multiple rework images (multipart)
  uploadReworkImagesMultiple: (formData) =>
    apiClient.post('/dcs/reworkImagesMultiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Get rework images by engine number
  getReworkImagesByEngineNo: (engineNo) =>
    apiClient.get(`/dcs/reworkImagesList/${engineNo}`),

  // Query rework images with multi-filter (engineNo, shift, plant, fromDate, toDate)
  queryReworkImages: (params) => {
    const query = new URLSearchParams();
    if (params.engineNo) query.append('engineNo', params.engineNo);
    if (params.shift) query.append('shift', params.shift);
    if (params.plant) query.append('plant', params.plant);
    if (params.fromDate) query.append('fromDate', params.fromDate);
    if (params.toDate) query.append('toDate', params.toDate);
    return apiClient.get(`/dcs/reworkImagesListQuery?${query.toString()}`);
  },

  // Helper for static rework image URL
  getReworkImageUrl: (imageName) => `${BACKEND_URL}/dcs/reworkImages/${imageName}`,
};

export default dcsApi;
