import { configureStore } from "@reduxjs/toolkit";
import dcsReducer from "./slices/dcsSlice";
import navBarReducer from "./slices/navbarSlice";
import pqcsReducer from "./slices/pqcsSlice"

const store = configureStore({
  reducer: {
    dcs: dcsReducer,
    navBar: navBarReducer,
    pqcs : pqcsReducer
  },
   
});

export default store;
