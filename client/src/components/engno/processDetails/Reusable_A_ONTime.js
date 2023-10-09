import React from "react";
import moment from "moment";

function Reusable_A_ONTime({ date, engineNo, dispatchedDate }) {
  var display = null;

  display = (
    <div className="d-flex flex-wrap gap-0 deta ">
      <div className="text-center font-weight-bold flex-1">{engineNo}</div>

      <div className="text-center font-weight-bold flex-1">
        {moment(date).format("DD-MM-YYYY HH:mm:ss")}
      </div>

      <div className="text-center font-weight-bold flex-1">
        {engineNo != "-" && dispatchedDate != "-" ? "Dispatched" : null}
      </div>
      <div className="text-center font-weight-bold flex-1">
        {engineNo != "-" && dispatchedDate != "-"
          ? moment(dispatchedDate).format("DD-MM-YYYY HH:mm:ss")
          : null}
      </div>
    </div>
  );

  return <>{display}</>;
}

export default Reusable_A_ONTime;
