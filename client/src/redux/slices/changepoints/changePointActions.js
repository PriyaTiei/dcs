import {
  CHANGEPOINT_FETCH,
  CHANGEPOINT_SUCCESS,
  CHANGEPOINT_FAIL,
} from "./changePointTypes";
import axios from "axios"

export const changePointFetch = () => {
  return {
    type: CHANGEPOINT_FETCH,
  };
};

//pass payload as data <Array>
export const changePointSuccess = (payload) => {
  return {
    type: CHANGEPOINT_SUCCESS,
    payload: payload,
  };
};

//pass error as error message <String>
export const changePointFail = (error) => {
  return {
    type: CHANGEPOINT_FAIL,
    error: error,
  };
};

export const getChangePoints = () => {
  return (dispatch) => {
    dispatch(changePointFetch());
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/changePoint/getAllChangePoints`)
    .then(result=>{
      dispatch(changePointSuccess(result.data.changePoints))
    })
    .catch(err=>{
      dispatch(changePointFail(err.message))
    })
  };
};
