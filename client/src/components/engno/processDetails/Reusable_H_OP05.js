import React from "react";
import moment from "moment";

function Reusable_H_OP05({ data, date, engineNo, dispatchedDate }) {
  return (
    <>
      <div className="d-flex flex-wrap gap-0 deta ">
        <div className="text-center font-weight-bold flex-1">
          {data.slice(0, 16)}
        </div>
        <div className="text-center font-weight-bold flex-1">
          {data.slice(16)}
        </div>

        <div className="text-center font-weight-bold flex-1">
          {moment(date).format("DD-MM-YYYY HH:mm:ss")}
        </div>
        <div className="text-center font-weight-bold flex-1">{engineNo}</div>
        <div className="text-center font-weight-bold flex-1">
          {engineNo != "-"  && dispatchedDate != "-"
            ? "Dispatched"
            : null}
        </div>
        <div className="text-center font-weight-bold flex-1">
          {engineNo != "-" && dispatchedDate != "-"
            ? moment(dispatchedDate).format("DD-MM-YYYY HH:mm:ss")
            : null}
        </div>
      </div>
    </>
  );
}

export default Reusable_H_OP05;
