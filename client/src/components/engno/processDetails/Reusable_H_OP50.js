import React from "react";
import moment from "moment";
import { decodeHead50 } from "./func_H_50";

function Reusable_H_OP50({ serialNo, data, date, engineNo, dispatchedDate }) {
  var display = null;

  let result = decodeHead50(data);
  var headOP50Elements = [];
  if (result.length > 0) {
    for (let i = 22; i < 30; i++) {
      headOP50Elements.push(
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {result[i]}
        </div>
      );
    }
  }

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

      {headOP50Elements}

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
        {engineNo != "-" ? "Dispatched" : null}
      </div>
      <div
        className="text-center font-weight-bold flex-1-mod"
        style={{ minWidth: 140 }}
      >
        {engineNo != "-"
          ? moment(dispatchedDate).format("DD-MM-YYYY HH:mm:ss")
          : null}
      </div>
    </div>
  );

  return <>{display}</>;
}

export default Reusable_H_OP50;
