import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bolt: "",
    inspectionTorque: "",
    measurements: ["", "", "", "", "", "", "", ""],
    confirmation: ""
  };

export const pqcsSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setBolt: (state, action) => {
      state.bolt = action.payload;
    },
    setInspectionTorque: (state, action) => {
      state.inspectionTorque = action.payload;
    },
    setMeasurement: (state, action) => {
      const { index, value } = action.payload;
      state.measurements[index] = value;
    },
    setConfirmation: (state, action) => {
      state.confirmation = action.payload;
    },
    resetForm: (state) => {
      state.bolt = "";
      state.inspectionTorque = "";
      state.measurements = ["", "", "", "", "", "", "", ""];
      state.confirmation = "";
    }
  }
});

export const { setBolt, setInspectionTorque, setMeasurement, setConfirmation } = pqcsSlice.actions;
export default pqcsSlice.reducer;