import { Axios } from "../../../config/Axios";
import {
  CHANGEPOINT_FETCH,
  CHANGEPOINT_SUCCESS,
  CHANGEPOINT_FAIL,
  CHANGEPOINT_PAGINATION_FETCH,
  CHANGEPOINT_PAGINATION_SUCCESS,
  CHANGEPOINT_PAGINATION_FAIL,
  CHANGEPOINT_PAGINATION_CHANGE,
  CHANGEPOINT_DOCSPERPAGE_CHANGE,
} from "./changePointTypes";

export const changePointPaginationFetch = () => {
  return {
    type: CHANGEPOINT_PAGINATION_FETCH,
  };
};

//pass payload as data <Array>
export const changePointPaginationSuccess = (payload) => {
  return {
    type: CHANGEPOINT_PAGINATION_SUCCESS,
    payload: payload,
  };
};

export const changePointPaginationChange = (payload) => {
  return {
    type: CHANGEPOINT_PAGINATION_CHANGE,
    payload: payload,
  };
};

export const changePointDocsPerPagenChange = (payload) => {
  return {
    type: CHANGEPOINT_DOCSPERPAGE_CHANGE,
    payload: payload,
  };
};

//pass error as error message <String>
export const changePointPaginationFail = (error) => {
  return {
    type: CHANGEPOINT_PAGINATION_FAIL,
    error: error,
  };
};

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

export const changePointsDocsPerPage = (val) => {
  return (dispatch) => {
    dispatch(changePointDocsPerPagenChange(val))
  };
};

export const changePointsPagination = (currentPage) => {
  return (dispatch) => {
    dispatch(changePointPaginationChange(currentPage))
  };
};

export const getChangePoints = (filtered,currentPage,docsPerPage) => {
  return (dispatch) => {
    dispatch(changePointFetch());
     if(filtered.startDate!=""){
      console.log(typeof filtered.startDate.toLocaleDateString());
      filtered.startDate = new Date(filtered.startDate.toString()).toLocaleDateString()
    }else{
      filtered.startDate = ""
    }
    if(filtered.endDate!=""){
      console.log(filtered.endDate.toString());
      filtered.endDate = new Date(filtered.endDate.toString()).toLocaleDateString()
    }else{
      filtered.endDate = ""
    }
    console.log(filtered);
    Axios.get(`/changePoint/getAllChangePoints`,{
      params:{
        filtered:filtered,
        currentPage:currentPage,
        docsPerPage: docsPerPage
      }
    })
    .then(result=>{
      dispatch(changePointPaginationSuccess(result.data.totalCount))
      dispatch(changePointSuccess(result.data.headCheckList))
    })
    .catch(err=>{
      dispatch(changePointFail(err.message))
    })
  };
};
