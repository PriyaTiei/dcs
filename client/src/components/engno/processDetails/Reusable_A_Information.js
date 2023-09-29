import React from "react";
import moment from "moment";

function Reusable_A_Information({ data, date, engineNo, dispatchedDate }) {
  let code = data.slice(38, 41);
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
  }

  var display = null;

  display = (
    <div className="d-flex flex-wrap gap-0 deta ">
      <div className="text-center font-weight-bold flex-1">{engineNo}</div>
      <div className="text-center font-weight-bold flex-1">{code}</div>
      <div className="text-center font-weight-bold flex-1">{lts}</div>
      <div className="text-center font-weight-bold flex-1">{customer}</div>

      <div className="text-center font-weight-bold flex-1">
        {moment(date).format("DD-MM-YYYY HH:mm:ss")}
      </div>

      {/* <div className="text-center font-weight-bold flex-1">{moment(date).format("DD-MM-YYYY HH:mm:ss")}</div> */}

      <div className="text-center font-weight-bold flex-1">
        {engineNo != "-" ? "Dispatched" : null}
      </div>
      <div className="text-center font-weight-bold flex-1">
        {engineNo != "-"
          ? moment(dispatchedDate).format("DD-MM-YYYY HH:mm:ss")
          : null}
      </div>
    </div>
  );

  return <>{display}</>;
}

export default Reusable_A_Information;
