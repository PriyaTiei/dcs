import { ENGINE_FETCH, ENGINE_SUCCESS, ENGINE_FAIL } from "./egNoTypes";
import {
  SHIPPING_DATA_FETCH,
  SHIPPING_DATA_SUCCESS,
  SHIPPING_DATA_FAIL,
} from "./egNoTypes";

import { SECTION, SUB_SECTION} from "./egNoTypes";

const initialEngineState = {
  loading: false,
  engineData: {},
  error: "",
  shippingDate: [],
  section:"Assembly",
  subSection:"Shipment"
};

const engineReducer = (state = initialEngineState, action) => {
  switch (action.type) {
    case ENGINE_FETCH:
      return { ...state, loading: true };
    case ENGINE_SUCCESS:
      return {
        ...state,
        loading: false,
        engineData: action.payload,
        error: "",
      };
    case ENGINE_FAIL:
      return { ...state, loading: false, engineData: [], error: action.error };
    case SHIPPING_DATA_FETCH:
      return { ...state, loading: true };
    case SHIPPING_DATA_SUCCESS:
      return { ...state, shippingData: action.payload };
    case SHIPPING_DATA_FAIL:
      return { ...state, shippingData: action.error };
      case SECTION:
        return { ...state, section: action.payload };
        case SUB_SECTION:
          return { ...state, subSection: action.payload };
    default:
      return state;
  }
};

export default engineReducer;
