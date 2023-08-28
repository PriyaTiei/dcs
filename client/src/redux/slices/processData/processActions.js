import {
  PROCESS_FETCH,
  PROCESS_SUCCESS,
  PROCESS_FAILURE,
  SET_PROCESS_NO,
} from "./processTypes";
import axios from "axios";

export const setProcessNo = (processNo) => {
  return {
    type: SET_PROCESS_NO,
    processNo: processNo,
  };
};

export const processFetch = () => {
  return {
    type: PROCESS_FETCH,
  };
};

export const processSuccess = (data) => {
  return {
    type: PROCESS_SUCCESS,
    payload: data,
  };
};

export const processFailure = (error) => {
  return {
    type: PROCESS_FAILURE,
    error: error,
  };
};

export const getProcessDetails = ( partNo) => {
  console.log("redux action called with part no:")
  console.log(partNo)
  return (dispatch)=>{
    console.log("inside dispatch")
    dispatch(processFetch());
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/oracle/partNo/${partNo}`
      ) // this is dummy URL
      .then((response) => {
        console.log("response success:")
        console.log(response.data)
        dispatch(processSuccess(response.data));
      })
      .catch((err) => {
        console.log("part erro:")
        console.log(err.message)
        dispatch(processFailure(err.message));
      });
  };
};
