import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import  Reusable_C_OP220 from "./Reusable_C_OP220"

function C_OP_220() {
  const processName = useSelector((state) => state.process.processName);
  const dataOneDay = useSelector((state) => state.process.dataOneDay);
  const processEngine = useSelector((state) => state.process.processEngine);
  const processEngineDate = useSelector(
    (state) => state.process.processEngineDate
  );
  const [combineTable, setCombineTable] = useState([]);
  const dataRange = useSelector((state) => state.process.dataRange.data);

  var bigList = null;
  
  bigList = dataRange?.map((element) => (
    <Reusable_C_OP220
      key={element[1]}
      serialNo={element[1]}
      data={element[0]}
      date={element[2]}
      engineNo={element[3]}
      dispatchedDate={element[4]}
    />
  ));

  return <div className="overflow-auto" style={{height:"80vh"}}>{bigList}</div>;
}

export default C_OP_220;
