import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";



const initialState = {
  partNo: '',
  remarks: '',
  date: new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }),
  time: new Date().toLocaleTimeString('en-IN', {
    hour: 'numeric',
  minute: 'numeric',
  hour12: true
  }),
  checker: '',
  engineCode: '',
  defectType: '',
  image: null,
  imagePreview: '',
  showModal: false,
  dropPart: false,
};

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
  initialState: initialState,
  reducers: {
    setPartNo: (state, action) => {
      state.partNo = action.payload;
    },
    setRemarks: (state, action) => {
      state.remarks = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setTime: (state, action) => {
      state.time = action.payload;
    },
    setChecker: (state, action) => {
      state.checker = action.payload;
    },
    setEngineCode: (state, action) => {
      state.engineCode = action.payload;
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
    setDropPart: (state, action) => {
      state.dropPart = action.payload;
    },
    resetForm: (state) => {
      state.partNo = "";
      state.remarks = "";
      state.defectType = "";
      state.image = null;
      state.imagePreview = "";
    }
  }

});

export const {
  setPartNo,
  setRemarks,
  setDate,
  setTime,
  setChecker,
  setEngineCode,
  setDefectType,
  setImage,
  setImagePreview,
  setShowModal,
  setDropPart,
  resetForm
} = dcsSlice.actions;

export default dcsSlice.reducer;
