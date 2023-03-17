import { configureStore } from "@reduxjs/toolkit";
import dcsReducer from "./slices/dcsSlice";

const store = configureStore({
  reducer: {
    dcs: dcsReducer,
  },
});

export default store;
