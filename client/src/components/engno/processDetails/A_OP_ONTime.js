import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Reusable_A_ONTime from "./Reusable_A_ONTime";
import moment from "moment";

function A_OP_ONTime({ setExcelData, excelData }) {
  console.log("test_Data engine no")
    console.log(excelData)
  const processName = useSelector((state) => state.process.processName);
  const dataOneDay = useSelector((state) => state.process.dataOneDay);
  const processEngine = useSelector((state) => state.process.processEngine);
  const processEngineDate = useSelector(
    (state) => state.process.processEngineDate
  );
  const [combineTable, setCombineTable] = useState([]);
  const dataRange = useSelector((state) => state.process.dataRange.data);

  
  useEffect(() => {
    let bigList2 = dataRange?.map((element) => {
      return [
        element[1],
        moment(element[2]).format("DD-MM-YYYY HH:mm:ss"),              
        element[1] != "-" && element[3] != "-" ? "Dispatched" : null,
        element[1] != "-" && element[3] != "-"
          ? moment(element[3]).format("DD-MM-YYYY HH:mm:ss")
          : null,
      ];
    });
    if (bigList2 != undefined && bigList2.length > 0) {
      setExcelData([...excelData, ...bigList2]);
    }
  }, [dataRange]);

  var bigList = null;

  bigList = dataRange?.map((element) => (
    <Reusable_A_ONTime
      key={element[1]}
      date={element[2]}
      engineNo={element[1]}
      dispatchedDate={element[3]}
    />
  ));

  return <div>{bigList}</div>;
}

export default A_OP_ONTime;
