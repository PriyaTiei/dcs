import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import  Reusable_Timing from "./Reusable_Timing"

function Timing({selectedProcessName}) {
  const processName = useSelector((state) => state.process.processName);
  const dataOneDay = useSelector((state) => state.process.dataOneDay);
  const processEngine = useSelector((state) => state.process.processEngine);
  const processEngineDate = useSelector(
    (state) => state.process.processEngineDate
  );
  const [combineTable, setCombineTable] = useState([]);




  var bigList =null;
  useEffect(() => {
    if (
      dataOneDay.hasOwnProperty("data") &&
      dataOneDay.data.length > 0 &&
      processEngine.hasOwnProperty("data") &&
      processEngine.data.length > 0 &&
      processEngine.data[0].length > 0 &&
      processEngineDate.hasOwnProperty("data") &&
      processEngineDate.data.length > 0 &&
      processEngineDate.data[0].length > 0
    ) {
      // map to list serial no.s

      if (
        processName ==   selectedProcessName &&
        processEngine.data[0].length > 0 &&
        processEngineDate.data[0].length > 0
      ) {
        const list1 = [...dataOneDay.data];
        const list2 = [...processEngine.data];
        const list3 = [...processEngineDate.data];

        // mapping between list2 & list3
        const resultList2 = [];

        list2.forEach((a) => {
          let flag2 = false;
          list3.forEach((b) => {
            if (a[1].trim() === b[0]) {
              // let tempList = [...b.splice(1)];
              // let tempList = ["Number available"];
              resultList2.push([...a, b[1]]);
              flag2 = true;
            } else {
            }
          });

          if (flag2 == false) {
            resultList2.push([...a, "-"]);
          }
        });

        // console.log(resultList2[0])

        const resultList1 = [];

        list1.forEach((a) => {
          let flag1 = false;
          resultList2.forEach((b) => {
            if (a[2].trim() === b[0]) {
              // let tempList = [...b.splice(1)];
              // let tempList = ["Number available"];
              resultList1.push([...a, b[1], b[2]]);
              flag1 = true;
            } else {
            }
          });

          if (flag1 == false) {
            resultList1.push([...a, "-"]);
          }
        });

        // console.log(resultList1[0])
        //// console.log(resultList);

        setCombineTable(resultList1);
      }
    }
  }, [processEngineDate]);

  bigList = combineTable.map((element) => (
    <Reusable_Timing
      key={element[1]}
      data={element[2]}
      date={element[8]}
      engineNo={element[10]}
      dispatchedDate={element[11]}
    />
  ));

  return <div>{bigList}</div>;
}

export default Timing
;
