import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import  Reusable_C_FG from "./Reusable_C_FG"
import moment from "moment";

function C_OP_FG({ setExcelData, excelData }) {
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
        element[3],
        element[3] != "-" && element[4] != "-" ? "Dispatched" : null,
        element[3] != "-" && element[4] != "-"
          ? moment(element[4]).format("DD-MM-YYYY HH:mm:ss")
          : null,
      ];
    });
    if (bigList2 != undefined && bigList2.length > 0) {
      setExcelData([...excelData, ...bigList2]);
    }
  }, [dataRange]);



  var bigList = null;
 

  bigList = dataRange?.map((element) => (
    <Reusable_C_FG
      key={element[2]}
      data={element[1]}
      date={element[2]}
      engineNo={element[3]}
      dispatchedDate={element[4]}
    />
  ));

  return <div>{bigList}</div>;
}

export default C_OP_FG;
