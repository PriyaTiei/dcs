import React from "react";
import moment from "moment";

function Reusable_H_OP310({ serialNo, data, date, engineNo, dispatchedDate }) {
  let H_OP310_list = data.split(",");  
 
  let f1 = H_OP310_list[0]?.slice(16, 17);

  let correctList = H_OP310_list?.map((item) => parseFloat(item));

  var display = null;
  if (correctList != undefined && correctList.length > 1) {

    display = (
      <div className="d-flex  gap-0 hB ">
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 130 }}
        >
          {serialNo}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 140 }}
        >
          {moment(date).format("DD-MM-YYYY HH:mm:ss")}
        </div>

        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
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
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[1]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[4]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[5]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[6]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
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

        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[8]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[11]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[12]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[13]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {" "}
          {correctList[14].toString() == "1"
            ? "LL NG"
            : correctList[14].toString() == "2"
            ? "OK"
            : correctList[14].toString() == "4"
            ? "UL NG"
            : correctList[14].toString() == "9"
            ? "LL2 NG"
            : correctList[14].toString() == "D"
            ? "ERR"
            : ""}
        </div>

        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[15]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[18]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[19]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[20]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {" "}
          {correctList[21].toString() == "1"
            ? "LL NG"
            : correctList[21].toString() == "2"
            ? "OK"
            : correctList[21].toString() == "4"
            ? "UL NG"
            : correctList[21].toString() == "9"
            ? "LL2 NG"
            : correctList[21].toString() == "D"
            ? "ERR"
            : ""}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[22]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[25]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[26]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {correctList[27]}
        </div>

        {/* <div className="text-center font-weight-bold flex-1-mod">{moment(date).format("DD-MM-YYYY HH:mm:ss")}</div> */}
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 100 }}
        >
          {engineNo}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 100 }}
        >
          {engineNo != "-" && dispatchedDate != "-" ? "Dispatched" : null}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 140 }}
        >
          {engineNo != "-" && dispatchedDate != "-"
            ? moment(dispatchedDate).format("DD-MM-YYYY HH:mm:ss")
            : null}
        </div>
      </div>
    );
  }

  return <>{display}</>;
}

export default Reusable_H_OP310;
