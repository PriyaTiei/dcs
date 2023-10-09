import React from "react";
import moment from "moment";
import { decodeAssyHeadBoltNR } from "./func_A_HeadBoltNR";

function Reusable_A_HeadNR({ serialNo, data, date, engineNo, dispatchedDate }) {
  var display = null;

  let result = decodeAssyHeadBoltNR(data);
  var assemblyHeadNRElements = [];
  if (result.length > 0) {
    for (let i = 0; i < 10; i++) {
      assemblyHeadNRElements.push(
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
        style={{ minWidth: 100 }}
      >
        {engineNo}
      </div>

      <div
        className="text-center font-weight-bold flex-1-mod"
        style={{ minWidth: 140 }}
      >
        {moment(date).format("DD-MM-YYYY HH:mm:ss")}
      </div>

      {assemblyHeadNRElements}

      {/* <div className="text-center font-weight-bold flex-1-mod">{moment(date).format("DD-MM-YYYY HH:mm:ss")}</div> */}

      <div
        className="text-center font-weight-bold flex-1-mod"
        style={{ minWidth: 100 }}
      >
        {dispatchedDate != "-" &&
        dispatchedDate != undefined &&
        dispatchedDate != "" &&
        dispatchedDate != null
          ? "Dispatched te"
          : "fsdf"}
      </div>
      <div
        className="text-center font-weight-bold flex-1-mod"
        style={{ minWidth: 140 }}
      >
        {dispatchedDate != "-"  &&
        dispatchedDate != undefined &&
        dispatchedDate != "" &&
        dispatchedDate != null
          ? moment(dispatchedDate).format("DD-MM-YYYY HH:mm:ss")
          : null}
      </div>
    </div>
  );

  return <>{display}</>;
}

export default Reusable_A_HeadNR;
