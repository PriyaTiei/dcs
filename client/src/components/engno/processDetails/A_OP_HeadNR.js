import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import  Reusable_A_HeadNR from "./Reusable_A_HeadNR"
import moment from "moment";
import { decodeAssyHeadBoltNR } from "./func_A_HeadBoltNR";

function A_OP_HeadNR({setExcelData, excelData}) {
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

      let result = decodeAssyHeadBoltNR(element[0]);
      var assemblyHeadNRElements = [];
      if (result.length > 0) {
        for (let i = 0; i < 10; i++) {
          assemblyHeadNRElements.push(result[i]);
        }
      }

      return [
        element[1],
        moment(element[2]).format("DD-MM-YYYY HH:mm:ss"),      
        ...assemblyHeadNRElements ,
        element[1] != "-" && element[3] != "-" ? "Dispatched" : null,
        element[1] != "-" && element[3] != "-"
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
