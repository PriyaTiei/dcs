import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import  Reusable_B_OP195 from "./Reusable_B_OP195"
import moment from "moment";

function B_OP_195({ setExcelData, excelData }) {
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
      let op195Data = element[0]?.slice(16, 20);
      let opNo=op195Data === "0011" ? "OP195A" : op195Data === "0012" ? "OP195B" : ""
      return [
        element[1],
        // moment(element[2]).format("DD-MM-YYYY HH:mm:ss"), 
        opNo,     
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


  bigList = dataRange?.map((element, i) => (
    <Reusable_B_OP195
      key={i}
      data={element[0]}
      date={element[2]}
      engineNo={element[3]}
      dispatchedDate={element[4]}
    />
  ));

  return <div>{bigList}</div>;
}

export default B_OP_195;
