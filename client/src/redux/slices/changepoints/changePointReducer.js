import {
  CHANGEPOINT_FETCH,
  CHANGEPOINT_SUCCESS,
  CHANGEPOINT_FAIL,
  CHANGEPOINT_PAGINATION_FAIL,
  CHANGEPOINT_PAGINATION_SUCCESS,
  CHANGEPOINT_PAGINATION_FETCH,
  CHANGEPOINT_PAGINATION_CHANGE,
  CHANGEPOINT_DOCSPERPAGE_CHANGE,
} from "./changePointTypes";

const initialStateChangePoints = {
  loading: false,
  changePoints: [],
  changePointPagination: {
    currentPage: 1,
    totalPages: 0,
    docsPerPage: 10
  },
  error: "",
};

const changePointReducer = (state = initialStateChangePoints, action) => {
  switch (action.type) {
    case CHANGEPOINT_PAGINATION_FETCH:
      return { 
        ...state, 
        loading: true, 
        changePointPagination: {
          ...state.changePointPagination,
          totalPages: 0
        },
        error: "" 
      };
    case CHANGEPOINT_PAGINATION_SUCCESS:
      return {
        ...state,
        loading: false,
        changePointPagination: {
          ...state.changePointPagination,
          totalPages: action.payload
        },
        error: "",
      };
    case CHANGEPOINT_PAGINATION_FAIL:
      return {
        ...state,
        loading: false,
        changePointPagination: {
          ...state.changePointPagination,
          totalPages: 0
        },
        error: action.error,
      };
    case CHANGEPOINT_PAGINATION_CHANGE:
        return {
          ...state,
          loading: false,
          changePointPagination: {
            ...state.changePointPagination,
            currentPage: action.payload
          },
          error: "",
        };
    case CHANGEPOINT_DOCSPERPAGE_CHANGE:
      return {
        ...state,
        loading: false,
        changePointPagination: {
          ...state.changePointPagination,
          docsPerPage: action.payload
        },
        error: "",
      };
    case CHANGEPOINT_FETCH:
      return { 
        ...state, 
        loading: true, 
        changePoints: [], 
        error: "" };
    case CHANGEPOINT_SUCCESS:
      return {
        ...state,
        loading: false,
        changePoints: action.payload,
        error: "",
      };
    case CHANGEPOINT_FAIL:
      return {
        ...state,
        loading: false,
        changePoints: [],
        error: action.error,
      };
    default:
      return initialStateChangePoints;
  }
};


export default changePointReducer