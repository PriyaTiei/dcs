import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import  Reusable_A_HeadNR from "./Reusable_A_HeadNR"

function A_OP_HeadNR() {
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
    <Reusable_A_HeadNR
      key={element[1]}
      serialNo={element[1]}
      data={element[0]}
      date={element[2]}
      engineNo={element[1]}
      dispatchedDate={element[3]}
    />
  ));

  return <div className="" style={{height:"80vh", overflowY:"auto", overflowX:"hidden", width:"max-content"}}>{bigList}</div>;
}

export default A_OP_HeadNR;
