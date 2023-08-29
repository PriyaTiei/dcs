import {
  PROCESS_FETCH,
  PROCESS_SUCCESS,
  PROCESS_FAILURE,
  SET_PROCESS_NO,
  PROCESS_ONE_DAY_FETCH,
  PROCESS_ONE_DAY_SUCCESS,
  PROCESS_ONE_DAY_FAILURE,
  PROCESS_RANGE_FETCH,
  PROCESS_RANGE_SUCCESS,
  PROCESS_RANGE_FAILURE,
  SET_FROM_DATE,
  SET_TO_DATE
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

export const processOneDayFetch = () => {
  return {
    type: PROCESS_ONE_DAY_FETCH,
  };
};

export const processOneDaySuccess = (data) => {
  return {
    type: PROCESS_ONE_DAY_SUCCESS,
    payload: data,
  };
};

export const processOneDayFailure = (error) => {
  return {
    type: PROCESS_ONE_DAY_FAILURE,
    error: error,
  };
};

export const processRangeFetch = () => {
  return {
    type: PROCESS_RANGE_FETCH,
  };
};

export const processRangeSuccess = (data) => {
  return {
    type: PROCESS_RANGE_SUCCESS,
    payload: data,
  };
};

export const processRangeFailure = (error) => {
  return {
    type: PROCESS_RANGE_FAILURE,
    error: error,
  };
};

export const setFromDate = (date) => {
  return {
    type: SET_FROM_DATE,
     payload: date,
  };
};

export const setToDate = (date) => {
  return {
    type: SET_TO_DATE,
     payload: date,
  };
};



export const getProcessDetails = (partNo) => {
  return (dispatch) => {
    console.log("inside dispatch");
    dispatch(processFetch());
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/oracle/partNo/${partNo}`)
      .then((response) => {
        dispatch(processSuccess(response.data));
      })
      .catch((err) => {
        dispatch(processFailure(err.message));
      });
  };
};

export const getProcessOneDayDetails = (partNo, fromDate, toDate) => {
  return (dispatch) => {
    dispatch(processOneDayFetch());
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/oracle/processNo/${partNo}/fromDate/${fromDate}/toDate/${toDate}`
      )
      .then((response) => {
        dispatch(processOneDaySuccess(response.data));
      })
      .catch((err) => {
        dispatch(processOneDayFailure(err.message));
      });
  };
};

export const getProcessRangeDetails = (partNo, fromDate, toDate) => {
  return (dispatch) => {
    dispatch(processRangeFetch());
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/oracle/processNo/${partNo}/fromDate/${fromDate}/toDate/${toDate}`
      )
      .then((response) => {
        dispatch(processRangeSuccess(response.data));
      })
      .catch((err) => {
        dispatch(processRangeFailure(err.message));
      });
  };
};

// http://localhost:5081/oracle/processNo/OP10/fromDate/fromDate/toDate/toDate
