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
  SET_TO_DATE,
  PROCESS_ENGINE_FETCH,
  PROCESS_ENGINE_SUCCESS,
  PROCESS_ENGINE_FAILURE,
  PROCESS_ENGINE_DATE_FETCH,
  PROCESS_ENGINE_DATE_SUCCESS,
  PROCESS_ENGINE_DATE_FAILURE,
  SET_PROCESS_NAME,
  PROCESS_CASTING_NO_FETCH,
  PROCESS_CASTING_NO_SUCCESS,
  PROCESS_CASTING_NO_FAILURE,
  CLEAR,
} from "./processTypes";

var tempFromDate = new Date(Date.now());

tempFromDate.setDate(tempFromDate.getDate() - 1);
tempFromDate.setHours(23);
tempFromDate.setMinutes(60);
tempFromDate.setSeconds(1);

var tempToDate = new Date(Date.now());
tempToDate.setHours(23);
tempToDate.setMinutes(59);
tempToDate.setSeconds(59);

const initialStateProcess = {
  processNo: "",
  loading: false,
  data: {},
  error: "",
  dataOneDay: {},
  dataRange: {},
  fromDate: tempFromDate.toISOString(),
  toDate: tempToDate.toISOString(),
  processEngine: {},
  processEngineDate: {},
  processName: "",
};

const processReducer = (state = initialStateProcess, action) => {
  switch (action.type) {
    case SET_PROCESS_NO:
      return {
        ...state,
        processNo: action.processNo,
        processName: action.processName,
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
    case PROCESS_ONE_DAY_FETCH:
      return {
        ...state,
        loading: true,
      };
    case PROCESS_ONE_DAY_SUCCESS:
      return {
        ...state,
        loading: false,
        dataOneDay: action.payload,
        error: "",
      };
    case PROCESS_ONE_DAY_FAILURE:
      return {
        ...state,
        loading: false,
        dataOneDay: {},
        error: action.error,
      };
    case PROCESS_RANGE_FETCH:
      return {
        ...state,
        loading: true,
      };
    case PROCESS_RANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        dataRange: action.payload,
        error: "",
      };
    case PROCESS_RANGE_FAILURE:
      return {
        ...state,
        loading: false,
        dataRange: {},
        error: action.error,
      };
    case SET_FROM_DATE:
      return {
        ...state,
        fromDate: action.payload,
      };
    case SET_TO_DATE:
      return {
        ...state,
        toDate: action.payload,
      };

    case PROCESS_ENGINE_FETCH:
      return {
        ...state,
        loading: true,
      };
    case PROCESS_ENGINE_SUCCESS:
      return {
        ...state,
        loading: false,
        processEngine: action.payload,
        error: "",
      };
    case PROCESS_ENGINE_FAILURE:
      return {
        ...state,
        loading: false,
        processEngine: {},
        error: action.error,
      };

    case PROCESS_ENGINE_DATE_FETCH:
      return {
        ...state,
        loading: true,
      };
    case PROCESS_ENGINE_DATE_SUCCESS:
      return {
        ...state,
        loading: false,
        processEngineDate: action.payload,
        error: "",
      };
    case PROCESS_ENGINE_DATE_FAILURE:
      return {
        ...state,
        loading: false,
        processEngineDate: {},
        error: action.error,
      };
    case SET_PROCESS_NAME:
      return {
        ...state,
        processName: action.payload,
      };

    case PROCESS_CASTING_NO_FETCH:
      return {
        ...state,
        loading: true,
      };
    case PROCESS_CASTING_NO_SUCCESS:
      return {
        ...state,
        loading: false,
        dataOneDay: action.payload,
        error: "",
      };
    case PROCESS_CASTING_NO_FAILURE:
      return {
        ...state,
        loading: false,
        dataOneDay: {},
        error: action.error,
      };
    case CLEAR:
      return initialStateProcess;

    default:
      return state;
  }
};

export default processReducer;
