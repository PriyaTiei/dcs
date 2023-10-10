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
  CLEAR
} from "./processTypes";
import axios from "axios";
import {toast} from "react-toastify"

export const setProcessNo = (processNo, processName) => {
  return {
    type: SET_PROCESS_NO,
    processNo: processNo,
    processName:processName
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

export const processEngineFetch = () => {
  return {
    type: PROCESS_ENGINE_FETCH,
  };
};

export const processEngineSuccess = (data) => {
  return {
    type: PROCESS_ENGINE_SUCCESS,
    payload: data,
  };
};

export const processEngineFailure = (error) => {
  return {
    type: PROCESS_ENGINE_FAILURE,
    error: error,
  };
};
export const processEngineDateFetch = () => {
  return {
    type: PROCESS_ENGINE_DATE_FETCH,
  };
};

export const processEngineDateSuccess = (data) => {
  return {
    type: PROCESS_ENGINE_DATE_SUCCESS,
    payload: data,
  };
};

export const processEngineDateFailure = (error) => {
  return {
    type: PROCESS_ENGINE_DATE_FAILURE,
    error: error,
  };
};

export const newFromDate = (date) => {
  return {
    type: SET_FROM_DATE,
    payload: date,
  };
};

export const newToDate = (date) => {
  return {
    type: SET_TO_DATE,
    payload: date,
  };
};
export const setProcessName = (name) => {
  return {
    type: SET_PROCESS_NAME,
    payload: name,
  };
};


export const processCastingNoFetch = () => {
  return {
    type: PROCESS_CASTING_NO_FETCH,
  };
};

export const processCastingNoSuccess = (data) => {
  return {
    type: PROCESS_CASTING_NO_SUCCESS,
    payload: data,
  };
};

export const processCastingNoFailure = (error) => {
  return {
    type: PROCESS_CASTING_NO_FAILURE,
    error: error,
  };
};

export const processDataClear = () => {
  return {
    type: CLEAR,    
  };
};



export const getProcessDetails = (partNo) => {
  return (dispatch) => {
    // console.log("inside dispatch");
    dispatch(processFetch());
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/oracle/partNo/${partNo}`)
      .then((response) => {
        dispatch(processSuccess(response.data));
        toast.success("3C Part information obtained Successfully")
      })
      .catch((err) => {
        dispatch(processFailure(err.message));
        toast.error(err.message)
      });
  };
};

export const getProcessOneDayDetails = (partNo, fromDate, toDate) => {
 
  if(partNo==="H1_Material input/engraving"){
    partNo="H1_Material_input_engraving"
  }
  return (dispatch) => {
    dispatch(processOneDayFetch());
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/oracle/processNo/${partNo}/fromDate/${fromDate}/toDate/${toDate}`
      )
      .then((response) => {
        dispatch(processOneDaySuccess(response.data));
        // toast.success("3C part information from certain period obtained Successfully")
      })
      .catch((err) => {
        dispatch(processOneDayFailure(err.message));
        toast.error(err.message)
      });
  };
};

export const getProcessRangeDetails = (partNo, fromDate, toDate) => {

  if(partNo==="H1_Material input/engraving"){
    partNo="H1_Material_input_engraving"
  }
  return (dispatch) => {
    dispatch(processRangeFetch());
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/oracle/getFullData/${partNo}/fromDate/${fromDate}/toDate/${toDate}`
      )
      .then((response) => {
        dispatch(processRangeSuccess(response.data));
        // toast.success("3C part information from certain period obtained Successfully")
      })
      .catch((err) => {
        dispatch(processRangeFailure(err.message));
        toast.error(err.message)
      });
  };
};

export const getProcessRangeDetailsAssy = (partNo, fromDate, toDate) => {

 
  if(partNo==="H1_Material input/engraving"){
    partNo="H1_Material_input_engraving"
  }else if(partNo==="IN cam S / N"){
    partNo="IN_cam_S_N"
  }else if(partNo==="EX cam S / N"){
    partNo="EX_cam_S_N"
  }else if(partNo==="Block S / N"){
    partNo="Block_S_N"
  }else if(partNo==="Crank S / N"){
    partNo="Crank_S_N"
  }else if(partNo==="Head S / N"){
    partNo="Head_S_N"
  }else if(partNo==="CamHousing S/N"){
    partNo="CamHousing_S_N"
  }


 
  return (dispatch) => {
    dispatch(processRangeFetch());
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/oracle/getFullDataAssy/${partNo}/fromDate/${fromDate}/toDate/${toDate}`
      )
      .then((response) => {
        dispatch(processRangeSuccess(response.data));
        // toast.success("3C part information from certain period obtained Successfully")
      })
      .catch((err) => {
        dispatch(processRangeFailure(err.message));
        toast.error(err.message)
      });
  };
};

export const getProcessEngineDetails = (serialNoListString) => {
  return (dispatch) => {
    dispatch(processEngineFetch());
    axios
      // .get(
      //   `${process.env.REACT_APP_BACKEND_URL}/oracle/serialNoListString?serialNoListString=${serialNoListString}`
      // )
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/oracle/serialNoListString`,{"serialNoListString":serialNoListString}
      )
      .then((response) => {
        dispatch(processEngineSuccess(response.data));
        // toast.success("Engine Information for all part obtained Successfully")
      })
      .catch((err) => {
        dispatch(processEngineFailure(err.message));
        toast.error(err.message)
      });
  };
};

export const getProcessEngineDateDetails = (engineNoListString) => {
  return (dispatch) => {
    dispatch(processEngineDateFetch());
    axios
      // .get(
      //   `${process.env.REACT_APP_BACKEND_URL}/oracle/dispatchDates/engineNoListString?engineNoListString=${engineNoListString}`
      // )
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/oracle/dispatchDates/engineNoListString`, {"engineNoListString":engineNoListString}
      )
      .then((response) => {
        dispatch(processEngineDateSuccess(response.data));
        toast.success("Shipment date for all the Engines obtained Successfully")
      })
      .catch((err) => {
        dispatch(processEngineDateFailure(err.message));
        toast.error(err.message)
      });
  };
};

export const getProcessCastingNo = (castingNo) => {
  return (dispatch) => {
    dispatch(processCastingNoFetch());
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/oracle/parts/castingNo?castingNo=${castingNo}`
       
      )
   
      .then((response) => {
        dispatch(processCastingNoSuccess(response.data));
        toast.success("Part Information w.r.t casting details obtained Successfully")
      })
      .catch((err) => {
        dispatch(processCastingNoFailure(err.message));
        toast.error(err.message)
      });
  };
};

// http://localhost:5081/oracle/serialNoListString?serialNoListString=3611222303205354,3611132306192321
