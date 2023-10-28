import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Reusable_B_OP235 from "./Reusable_B_OP235";
import { decodeBlock235 } from "./func_B_235";
import moment from "moment";

function B_OP_235({ setExcelData, excelData }) {
  const processName = useSelector((state) => state.process.processName);
  const dataOneDay = useSelector((state) => state.process.dataOneDay);
  const processEngine = useSelector((state) => state.process.processEngine);
  const processEngineDate = useSelector(
    (state) => state.process.processEngineDate
  );
  const [combineTable, setCombineTable] = useState([]);
  const dataRange = useSelector((state) => state.process.dataRange.data);

  var bigList = null;

  useEffect(() => {
    let bigList2 = dataRange?.map((element) => {
      var result = decodeBlock235(element[0]);
      var PLabel = ["P1", "P2", "P3", "P4", "P5", "P6", "", "SP"];
      var plug1to7 = [];
      for (let i = 0; i < 40; i += 5) {
        if (i === 30) {
          continue;
        }
        plug1to7.push(result[i + 3]);
        plug1to7.push(result[i + 4]);
        plug1to7.push(result[i + 5]);
        plug1to7.push(result[i + 6]);
        plug1to7.push(result[i + 7]);
      }
      return [
        element[1],
        result[1].model,
        result[1].lts,
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


  bigList = dataRange?.map((element) => (
    <Reusable_B_OP235
      key={element[2]}
      serialNo={element[1]}
      data={element[0]}
      date={element[2]}
      engineNo={element[3]}
      dispatchedDate={element[4]}
      setExcelData={setExcelData}
      excelData={excelData}
    />
  ));

  return (
    <div
      className=""
      style={{
        height: "80vh",
        width: "max-content",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {bigList}
    </div>
  );
}

export default B_OP_235;
