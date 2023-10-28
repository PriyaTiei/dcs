import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Reusable_C_OP150_170 from "./Reusable_C_OP150_170";
import moment from "moment";
import { decode_C_150_170 } from "./func_C_150_170";

function C_OP_150_170({ setExcelData, excelData }) {
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
      var result = decode_C_150_170(element[0]);
      var plug1to7 = [];
      var PLabel = [
        "1st CW",
        "2nd CW",
        "3rd CW",
        "4th CW",
        "5th CW",
        "6th CW",
        "7th CW",
        "8th CW",
        "Initial",
        "Final",
      ];
      for (let i = 0; i < 32; i += 4) {
        plug1to7.push(result[i + 3]);
        plug1to7.push(result[i + 4]);
        plug1to7.push(result[i + 5]);
        plug1to7.push(result[i + 6]);    
      }
    
      for (let i = 32; i < 40; i += 4) {
        plug1to7.push(result[i + 3]);
        plug1to7.push(result[i + 4]);
        plug1to7.push(result[i + 5]);
        plug1to7.push(result[i + 6]); 
      
      }


      return [
        element[1],
        result[1],
        result[2],
        moment(element[2]).format("DD-MM-YYYY HH:mm:ss"),   
        ...plug1to7,   
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
    <Reusable_C_OP150_170
      key={element[2]}
      serialNo={element[1]}
      data={element[0]}
      date={element[2]}
      engineNo={element[3]}
      dispatchedDate={element[4]}
    />
  ));

  return (
    <div className="" style={{ height: "80vh" , width:"max-content", overflowX:"hidden",overflowY:"auto"}}>
      {bigList}
    </div>
  );
}

export default C_OP_150_170;
