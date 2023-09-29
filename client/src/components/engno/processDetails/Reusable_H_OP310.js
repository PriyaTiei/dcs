import React from "react";
import moment from "moment";

function Reusable_H_OP310({ serialNo, data, date, engineNo, dispatchedDate }) {
  let H_OP310_list = data.split(",");
  console.log("H_OP310_list")
 console.log(H_OP310_list)
  // H_OP310_list.forEach((item) => console.log(item));
  let f1 = H_OP310_list[0]?.slice(16, 17);
  console.log("f1")
  console.log(f1)
  let correctList = H_OP310_list?.map((item) => parseFloat(item));




  var display = null;
if(correctList != undefined && correctList.length>1){
  console.log("correctLIst")
  console.log(correctList)
  display = (
    <div className="d-flex flex-wrap gap-0 deta " style={{width:"89vw"}}>
      <div className="text-center font-weight-bold flex-1-mod">{serialNo}</div>   
      <div className="text-center font-weight-bold flex-1-mod">
        {moment(date).format("DD-MM-YYYY HH:mm:ss")}
      </div>

   
      <div className="text-center font-weight-bold flex-1-mod">
                        {f1 == "1"
                          ? "LL NG"
                          : f1 == "2"
                          ? "OK"
                          : f1 == "4"
                          ? "UL NG"
                          : f1 == "9"
                          ? "LL2 NG"
                          : f1 == "D"
                          ? "ERR"
                          : ""}
                      </div>
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[1]}</div>   
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[4]}</div>  
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[5]}</div>  
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[6]}</div> 
                      <div className="text-center font-weight-bold flex-1-mod">
                        {correctList[7].toString() == "1"
                          ? "LL NG"
                          : correctList[7].toString() == "2"
                          ? "OK"
                          : correctList[7].toString() == "4"
                          ? "UL NG"
                          : correctList[7].toString() == "9"
                          ? "LL2 NG"
                          : correctList[7].toString() == "D"
                          ? "ERR"
                          : ""}
                      </div>

                      <div className="text-center font-weight-bold flex-1-mod">{correctList[8]}</div>  
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[11]}</div>
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[12]}</div>
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[13]}</div>
                      <div className="text-center font-weight-bold flex-1-mod">  {correctList[14].toString() == "1"
                          ? "LL NG"
                          : correctList[14].toString() == "2"
                          ? "OK"
                          : correctList[14].toString() == "4"
                          ? "UL NG"
                          : correctList[14].toString() == "9"
                          ? "LL2 NG"
                          : correctList[14].toString() == "D"
                          ? "ERR"
                          : ""}</div>

                      <div className="text-center font-weight-bold flex-1-mod">{correctList[15]}</div>  
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[18]}</div>
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[19]}</div>
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[20]}</div>
                      <div className="text-center font-weight-bold flex-1-mod">  {correctList[21].toString() == "1"
                          ? "LL NG"
                          : correctList[21].toString() == "2"
                          ? "OK"
                          : correctList[21].toString() == "4"
                          ? "UL NG"
                          : correctList[21].toString() == "9"
                          ? "LL2 NG"
                          : correctList[21].toString() == "D"
                          ? "ERR"
                          : ""}</div>
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[22]}</div>  
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[25]}</div>
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[26]}</div>
                      <div className="text-center font-weight-bold flex-1-mod">{correctList[27]}</div>
                   


                    
  
      {/* <div className="text-center font-weight-bold flex-1-mod">{moment(date).format("DD-MM-YYYY HH:mm:ss")}</div> */}
      <div className="text-center font-weight-bold flex-1-mod">{engineNo}</div>
      <div className="text-center font-weight-bold flex-1-mod">
        {engineNo != "-" ? "Dispatched" : null}
      </div>
      <div className="text-center font-weight-bold flex-1-mod">
        {engineNo != "-"
          ? moment(dispatchedDate).format("DD-MM-YYYY HH:mm:ss")
          : null}
      </div>
    </div>
  );
}

  return <>{display}</>;
}

export default Reusable_H_OP310;
