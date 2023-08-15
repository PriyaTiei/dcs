import { ENGINE_FETCH, ENGINE_SUCCESS, ENGINE_FAIL } from "./egNoTypes";
import { SHIPPING_DATA_FETCH, SHIPPING_DATA_SUCCESS, SHIPPING_DATA_FAIL } from "./egNoTypes";
import { SECTION, SUB_SECTION} from "./egNoTypes";
import axios from "axios"


// object generator _ for Engine 
export const engineFetch = () => {
  return {
    type: ENGINE_FETCH,
  };
};

export const engineSuccess = (data) => {
  return {
    type: ENGINE_SUCCESS,
    payload: data,
  };
};

export const engineFail = (error) => {
  return {
    type: ENGINE_FAIL,
    error: error,
  };
};


// object generator _ for Shipping date
export const shippingDataFetch = () => {
  return {
    type: SHIPPING_DATA_FETCH,
  };
};

export const shippingDataSuccess = (data) => {
  return {
    type: SHIPPING_DATA_SUCCESS,
    payload: data,
  };
};

export const shippingDataFail = (error) => {
  return {
    type: SHIPPING_DATA_FAIL,
    error: error,
  };
};




// Wrapper function _ for Engine No & shipping date
export const getEngineData = (engineNo) => {
  return (dispatch) => {
    dispatch(engineFetch());
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/oracle/engineNo/${engineNo}`)
      .then((result) => {
        console.log(result.data);
        dispatch(engineSuccess(result.data));

        // console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
        dispatch(engineFail(err));
      });
    dispatch(shippingDataFetch());
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/oracle/date/${engineNo}`)
      .then((result) => {
        console.log(result.data.data, "my data");
        const dateRow = result.data.data.filter((item) => item[1] === "200");

        console.log(dateRow[0], "Date row");
        dispatch(shippingDataSuccess(dateRow[0]))
    
      })
      .catch((err) => {
        console.log(err)
        dispatch(shippingDataFail(err))
      });
  };
};


// section & sub section object generator
export const setSectionRedux = (section) => {
  return {
    type: SECTION,
    payload: section,
  };
};

export const setSubSectionRedux = (subSection) => {
  return {
    type: SUB_SECTION,
   payload: subSection,
  };
};


