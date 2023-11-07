import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Reusable_A_INTime from "./Reusable_A_INTime";
import moment from "moment";

function A_OP_INTime({ setExcelData, excelData }) {
  console.log("test_Data Slno. no")
    console.log(excelData)
  const processName = useSelector((state) => state.process.processName);
  const dataOneDay = useSelector((state) => state.process.dataOneDay);
  const processEngine = useSelector((state) => state.process.processEngine);
  const processEngineDate = useSelector(
    (state) => state.process.processEngineDate
  );
  const [combineTable, setCombineTable] = useState([]);
  const dataRange = useSelector((state) => state.process.dataRange.data);
  const excelTableHeading = useSelector(state=>state.process.excelTableHeading)


  useEffect(() => {
    let bigLis2Filter = dataRange?.filter((element) =>element[1].slice(0, 1) === "N" )    
    let bigList2 = bigLis2Filter?.map((element) => {      
      return [
        element[0],
        moment(element[2]).format("DD-MM-YYYY HH:mm:ss"),      
        element[1],
        element[1] != "-" && element[3] != "-" ? "Dispatched" : null,
        element[1] != "-" && element[3] != "-"
          ? moment(element[3]).format("DD-MM-YYYY HH:mm:ss")
          : null,
      ];    
});
    if (bigList2 != undefined && bigList2.length > 0) {
      setExcelData([excelTableHeading, ...bigList2]);
    }
  }, [dataRange]);


  var bigList = null;

  bigList = dataRange?.map((element, i) => {
    if (element[1].slice(0, 1) === "N") {

   return  <Reusable_A_INTime
      key={i}
      data={element[0]}
      date={element[2]}
      engineNo={element[1]}
      dispatchedDate={element[3]}
    />
    }
});

  return <div>{bigList}</div>;
}

export default A_OP_INTime;
