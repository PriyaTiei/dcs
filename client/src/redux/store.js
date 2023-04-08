import { configureStore } from "@reduxjs/toolkit";
import dcsReducer from "./slices/dcsSlice";
import navBarReducer from "./slices/navbarSlice";

const store = configureStore({
  reducer: {
    dcs: dcsReducer,
    navBar: navBarReducer,
  },
});

export default store;
