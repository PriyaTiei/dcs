import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProcessDetails,
  setProcessNo,
} from "../../redux/slices/processData/processActions";

function ProcessData({ processNo }) {
  const dispatch = useDispatch();

  //populate process no
  const processNoElements = processNo.map((item) => (
    <div className="p-2 border btn" onClick={() => processHandler(item.value)}>
      {item.label}
    </div>
  ));
  console.log(processNo, "process No");

  //dispatch process no & fetch the required data
  const processHandler = (processNo) => {
    dispatch(setProcessNo(processNo));
    // dispatch(getProcessDetails(processNo));
  };

  //return the component
  return (
    <div>
      <div className="h5">Process Numbers </div>
      <div className="d-flex flex-wrap gap-1 prosMach ">
        {processNoElements}
      </div>
    </div>
  );
}

export default ProcessData;
