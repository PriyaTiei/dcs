import {
  CHANGEPOINT_FETCH,
  CHANGEPOINT_SUCCESS,
  CHANGEPOINT_FAIL,
} from "./changePointTypes";

const initialStateChangePoints = {
  loading: false,
  changePoints: [],
  error: "",
};

const changePointReducer = (state = initialStateChangePoints, action) => {
  switch (action.type) {
    case CHANGEPOINT_FETCH:
      return { ...state, loading: true, changePoints: [], error: "" };
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