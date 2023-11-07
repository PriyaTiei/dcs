import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import  Reusable_H_OP50 from "./Reusable_H_OP50"
import moment from "moment";
import { decodeHead50 } from "./func_H_50";

function H_OP_50({ setExcelData, excelData }) {
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
  
    let bigList2 = dataRange?.map((element) => {

      let result = decodeHead50(element[0]);
      var headOP50Elements = [];
      if (result.length > 0) {
        for (let i = 22; i < 30; i++) {
          headOP50Elements.push(result[i]);
        }
      }

      return [
        element[1],
        moment(element[2]).format("DD-MM-YYYY HH:mm:ss"),   
        ...headOP50Elements,   
        element[3],
        element[3] != "-" && element[4] != "-" ? "Dispatched" : null,
        element[3] != "-" && element[4] != "-"
          ? moment(element[4]).format("DD-MM-YYYY HH:mm:ss")
          : null,
      ];
    });
    if (bigList2 != undefined && bigList2.length > 0) {
      setExcelData([excelTableHeading, ...bigList2]);
    }
  }, [dataRange]);


  var bigList = null;
  
  bigList = dataRange?.map((element, i) => (
    <Reusable_H_OP50
      key={i}
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
