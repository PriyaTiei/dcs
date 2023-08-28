import {
  PROCESS_FETCH,
  PROCESS_SUCCESS,
  PROCESS_FAILURE,
  SET_PROCESS_NO,
} from "./processTypes";

const initialStateProcess = {
  processNo: "",
  loading: false,
  data: [],
  error: "",
};

const processReducer = (state = initialStateProcess, action) => {
  switch (action.type) {
    case SET_PROCESS_NO:
      return {
        ...state,
        processNo: action.processNo,
      };
    case PROCESS_FETCH:
      return {
        ...state,
        loading: true,
      };
    case PROCESS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: "",
      };
    case PROCESS_FAILURE:
      return {
        ...state,
        loading: false,
        data: [],
        error: action.error,
      };
    default:
      return state;
  }
};

export default processReducer;
