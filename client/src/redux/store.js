import { configureStore } from "@reduxjs/toolkit";
import dcsReducer from "./slices/dcsSlice";
import navBarReducer from "./slices/navbarSlice";
import pqcsReducer from "./slices/pqcsSlice"
import changePointReducer from "./slices/changepoints/changePointReducer";
const store = configureStore({
  reducer: {
    dcs: dcsReducer,
    navBar: navBarReducer,
    pqcs : pqcsReducer,
    changePoints:changePointReducer
  },
   
});

export default store;
