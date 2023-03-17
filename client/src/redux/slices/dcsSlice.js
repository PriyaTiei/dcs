import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

export const addDcsFormData = createAsyncThunk(
  "dcs/addDcsFormData",
  async (formData, thunkAPI) => {
    const imageData = new FormData();
    imageData.append("image", formData.image);
    const imagePath = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}dcs/dcs-forms/upload-image`,
      imageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/dcs/dcs-form`,
        {
          date: formData.date,
          time: formData.time,
          remarks: formData.remarks,
          partNo: formData.partNo,
          defectType: formData.defectType,
          image: imagePath.data["imagePath"],
        }
      );
      toast.success("Successful !");
      return response.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const dcsSlice = createSlice({
  name: "dcs",
  initialState: {
    partNo: "",
    remarks: "",
    defectType: "",
    image: null,
    imagePreview: null,
    showModal: false,
    loading: false,
    error: null,
  },
  reducers: {
    setPartNo: (state, action) => {
      state.partNo = action.payload;
    },
    setRemarks: (state, action) => {
      state.remarks = action.payload;
    },
    setDefectType: (state, action) => {
      state.defectType = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setImagePreview: (state, action) => {
      state.imagePreview = action.payload;
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload;
    },
    resetForm: (state) => {
      state.partNo = "";
      state.remarks = "";
      state.defectType = "";
      state.image = null;
      state.imagePreview = null;
    },
  },
  extraReducers: {
    [addDcsFormData.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [addDcsFormData.fulfilled]: (state) => {
      state.loading = false;
      state.error = null;
    },
    [addDcsFormData.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setPartNo,
  setRemarks,
  setDefectType,
  setImage,
  setImagePreview,
  setShowModal,
  resetForm,
} = dcsSlice.actions;

export default dcsSlice.reducer;
