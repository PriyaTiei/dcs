import React from "react";
import moment from "moment";

function Reusable_C_OP220({ serialNo, data, date, engineNo, dispatchedDate }) {
  let C_OP220_list = data.split(",");
  // console.log(C_OP220_list)
  C_OP220_list.forEach((item) => console.log(item));

  let correctList = C_OP220_list.map((item) => {
    let newItem = item.split("-");
    // console.log(newItem)
    if (newItem.length >= 2) {
      return -1 * newItem[1];
    } else {
      return parseInt(newItem[0]);
    }
  });

  var tt;
  var ttString;
  if (correctList[39] != undefined) {
    ttString = tt = correctList[39].toString().replace(".", "").slice(0, 8);

    if (correctList[1] === 11) {
      tt = ttString.slice(0, 4);
    } else {
      tt = ttString.slice(7, 8) + ttString.slice(0, 4);
    }
  }

  let jpData = [];
  for (let i = 2; i <= 38; i++) {
    jpData.push(
      <div
        className="text-center font-weight-bold flex-1-mod"
        style={{ minWidth: 50 }}
      >
        {correctList[i]}
      </div>
    );
  }

  var display = null;

  display = (
    <div className="d-flex gap-0 detaBOP235">
      <div
        className="text-center font-weight-bold flex-1-mod"
        style={{ minWidth: 130 }}
      >
        {serialNo}
      </div>
      <div
        className="text-center font-weight-bold flex-1-mod"
        style={{ minWidth: 65 }}
      >
        {correctList[1] === 11
          ? "Model 1"
          : correctList[1] === 12
          ? "Model 2"
          : correctList[1] === 13
          ? "Model 3"
          : ""}
      </div>
      <div
        className="text-center font-weight-bold flex-1-mod"
        style={{ minWidth: 140 }}
      >
        {moment(date).format("DD-MM-YYYY HH:mm:ss")}
      </div>
      {jpData}
      <div
        className="text-center font-weight-bold flex-1-mod"
        style={{ minWidth: 50 }}
      >
        {tt}
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

  return <>{display}</>;
}

export default Reusable_C_OP220;
