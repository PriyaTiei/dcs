import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Reusable_C_OP220 from "./Reusable_C_OP220";
import moment from "moment";

function C_OP_220({ setExcelData, excelData }) {
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
      let C_OP220_list = element[0]?.split(",");
      let correctList = C_OP220_list.map((item) => {
        let newItem = item.split("-");
        if (newItem.length >= 2) {
          return -1 * newItem[1];
        } else {
          return parseInt(newItem[0]);
        }
      });

      var tt;
      var ttString;
      if (correctList[39] != undefined) {
        ttString = tt = correctList[39]?.toString().replace(".", "")?.slice(0, 8);

        if (correctList[1] === 11) {
          tt = ttString?.slice(0, 4);
        } else {
          tt = ttString?.slice(7, 8) + ttString?.slice(0, 4);
        }
      }

      let jpData = [];
      for (let i = 2; i <= 38; i++) {
        jpData.push(correctList[i]);
      }

      return [
        element[1],
        correctList[1] === 11
          ? "Model 1"
          : correctList[1] === 12
          ? "Model 2"
          : correctList[1] === 13
          ? "Model 3"
          : "",
          moment(element[2]).format("DD-MM-YYYY HH:mm:ss"),
        ...jpData,
        tt,
        
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
    <Reusable_C_OP220
      key={i}
      serialNo={element[1]}
      data={element[0]}
      date={element[2]}
      engineNo={element[3]}
      dispatchedDate={element[4]}
    />
  ));

  return (
    <div
      style={{
        height: "80vh",
        overflowY: "auto",
        overflowX: "hidden",
        width: "max-content",
      }}
    >
      {bigList}
    </div>
  );
}

export default C_OP_220;
