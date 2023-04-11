import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const initialState = {
  partNo: "",
  remarks: "",
  date: new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }),
  time: new Date().toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }),
  checker: "",
  engineCode: "",
  defectType: "",
  fallenPart: null,
  image: null,
  imagePreview: "",
  stnOccured: "",
  stnDetected: "",
  pqcsList: [],
  showModal: false,
  dropPart: false,
};

export const addDcsFormData = createAsyncThunk(
  "dcs/addDcsFormData",
  async (formData, thunkAPI) => {
    let imagePath = null;  
    if(formData.image) {
      const imageData = new FormData();
    imageData.append("image", formData.image);
    const imageP = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/dcs/dcs-form/upload-image`,
      imageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    imagePath = imageP;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/dcs/dcs-form`,
        {
          date: formData.date,
          time: formData.time,
          remarks: formData.remarks,
          fallenPart: formData.fallenPart,
          engineNo: formData.partNo,
          defectContent: formData.defectType,
          engineCode: formData.engineCode,
          stnDetected: formData.stnDetected,
          stnOccured: formData.stnOccured,
          pqcs: formData.pqcsList,
          checker: formData.checker,
          image: imagePath  != null ? imagePath.data["imagePath"] : null,
        }
      );
      if(response.status === 201) {
        toast.success("Successful !");
        thunkAPI.dispatch(resetForm());
      }  
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
    setFallenPart: (state, action) => {
      state.fallenPart = action.payload;
    },
    setEngineCode: (state, action) => {
      state.engineCode = action.payload;
    },
    setDefectType: (state, action) => {
      state.defectType = action.payload;
      if (state.defectType === "Fallen Part") {
        state.dropPart = true;
      } else {
        state.dropPart = false;
      }
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setImagePreview: (state, action) => {
      state.imagePreview = action.payload;
    },
    setStnDetected: (state, action) => {
      state.stnDetected = action.payload;
    },
    setStnOccured: (state, action) => {
      state.stnOccured = action.payload;
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload;
    },
    addPqcsItem: (state, action) => {
      state.pqcsList.push(action.payload);
    },
    removePqcsItem: (state, action) => {
      const index = state.pqcsList.findIndex((i) => i === action.payload);
      state.pqcsList.splice(index, 1);
    },

    resetForm: (state) => {
      state.partNo = "";
      state.remarks = "";
      state.defectType = "";
      state.image = null;
      state.imagePreview = "";
      state.checker = "";
      state.engineCode = "";
      state.fallenPart = null;
      state.stnOccured = "";
      state.stnDetected = "";
      state.pqcsList = [];
    },
  },
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
  setFallenPart,
  resetForm,
} = dcsSlice.actions;

export default dcsSlice.reducer;
