import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Reusable_A_Information from "./Reusable_A_Information";

function A_OP_Information() {
  const processName = useSelector((state) => state.process.processName);
  const dataOneDay = useSelector((state) => state.process.dataOneDay);
  const processEngine = useSelector((state) => state.process.processEngine);
  const processEngineDate = useSelector(
    (state) => state.process.processEngineDate
  );
  const [combineTable, setCombineTable] = useState([]);
  const dataRange = useSelector((state) => state.process.dataRange.data);

  var bigList = null;

  bigList = dataRange?.map((element) => {
    if (element[1].slice(0, 1) === "N") {
      return (
        <Reusable_A_Information
          key={element[1]}
          data={element[0]}
          date={element[2]}
          engineNo={element[1]}
          dispatchedDate={element[3]}
        />
      );
    }
  });

  return <div>{bigList}</div>;
}

export default A_OP_Information;
