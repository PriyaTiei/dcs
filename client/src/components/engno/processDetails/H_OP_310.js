import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import  Reusable_H_OP310 from "./Reusable_H_OP310"
import moment from "moment";

function H_OP_310({ setExcelData, excelData }) {
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

      let H_OP310_list = element[0]?.split(",");  
 
      let f1 = H_OP310_list[0]?.slice(16, 17);
    
      let correctList = H_OP310_list?.map((item) => parseFloat(item));


      return [
        element[1],
        moment(element[2]).format("DD-MM-YYYY HH:mm:ss"),     
        f1 == "1"
            ? "LL NG"
            : f1 == "2"
            ? "OK"
            : f1 == "4"
            ? "UL NG"
            : f1 == "9"
            ? "LL2 NG"
            : f1 == "D"
            ? "ERR"
            : "", 
            correctList[1],
            correctList[4],
            correctList[5],
            correctList[6],
            correctList[7]?.toString() == "1"
            ? "LL NG"
            : correctList[7]?.toString() == "2"
            ? "OK"
            : correctList[7]?.toString() == "4"
            ? "UL NG"
            : correctList[7]?.toString() == "9"
            ? "LL2 NG"
            : correctList[7]?.toString() == "D"
            ? "ERR"
            : "",
            correctList[8],
            correctList[11],
            correctList[12],
            correctList[13],
            correctList[14]?.toString() == "1"
            ? "LL NG"
            : correctList[14]?.toString() == "2"
            ? "OK"
            : correctList[14]?.toString() == "4"
            ? "UL NG"
            : correctList[14]?.toString() == "9"
            ? "LL2 NG"
            : correctList[14]?.toString() == "D"
            ? "ERR"
            : "",
            correctList[15],
            correctList[18],
            correctList[19],
            correctList[20],
            correctList[21]?.toString() == "1"
            ? "LL NG"
            : correctList[21]?.toString() == "2"
            ? "OK"
            : correctList[21]?.toString() == "4"
            ? "UL NG"
            : correctList[21]?.toString() == "9"
            ? "LL2 NG"
            : correctList[21]?.toString() == "D"
            ? "ERR"
            : "",
            correctList[22],
            correctList[25],
            correctList[26],
            correctList[27],

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
    <Reusable_H_OP310
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

export default H_OP_310;
