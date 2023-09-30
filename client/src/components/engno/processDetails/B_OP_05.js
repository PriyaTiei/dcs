import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Reusable_B_OP05 from "./Reusable_B_OP05";

function B_OP_05() {
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
    <Reusable_B_OP05
      key={element[1]}
      serialNo={element[0]}
      date={element[2]}
      engineNo={element[3]}
      dispatchedDate={element[4]}
    />
  ));

  return <div>{bigList}</div>;
}

export default B_OP_05;
