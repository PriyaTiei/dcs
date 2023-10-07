import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import  Reusable_H_OP50 from "./Reusable_H_OP50"

function H_OP_50() {
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
    <Reusable_H_OP50
      key={element[1]}
      serialNo={element[1]}
      data={element[0]}
      date={element[2]}
      engineNo={element[3]}
      dispatchedDate={element[4]}
    />
  ));

  return <div className="" style={{height:"80vh", overflowY:"auto", overflowX:"hidden", width:"max-content"}}>{bigList}</div>;
}

export default H_OP_50;
