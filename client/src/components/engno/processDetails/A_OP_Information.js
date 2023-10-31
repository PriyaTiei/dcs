import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Reusable_A_Information from "./Reusable_A_Information";
import moment from "moment";

function A_OP_Information({ setExcelData, excelData }) {
  const processName = useSelector((state) => state.process.processName);
  const dataOneDay = useSelector((state) => state.process.dataOneDay);
  const processEngine = useSelector((state) => state.process.processEngine);
  const processEngineDate = useSelector(
    (state) => state.process.processEngineDate
  );
  const [combineTable, setCombineTable] = useState([]);
  const dataRange = useSelector((state) => state.process.dataRange.data);

  useEffect(() => {
    let bigLis2Filter = dataRange?.filter((element) =>element[1].slice(0, 1) === "N" )   
    let bigList2 = bigLis2Filter?.map((element) => {
      let code = element[0]?.slice(38, 41); 
      let lts;
      let customer;
      switch (code) {
        case "101":
          lts = "1.5 Lts. Hydbrid";
          customer = "TKM";
          break;
        case "201":
          lts = "2.0 Lts. Hydbrid";
          customer = "TKM";
          break;
        case "202":
          lts = "2.0 Lts. Conventional";
          customer = "TKM";
          break;
        case "203":
          lts = "2.0 Lts. Hydbrid";
          customer = "TMMIN";
          break;
        case "204":
          lts = "2.0 Lts. Conventional";
          customer = "TMMIN";
          break;
          default:
            lts = "null";
          customer = "null";
    
      }

      return [
        element[1],
        code,
        lts,
        customer,
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

  bigList = dataRange?.map((element, i) => {
    if (element[1].slice(0, 1) === "N") {
      return (
        <Reusable_A_Information
          key={i}
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
