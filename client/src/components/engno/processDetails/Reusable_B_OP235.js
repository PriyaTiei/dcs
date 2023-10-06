import React from "react";
import moment from "moment";
import { decodeBlock235 } from "./func_B_235";

function Reusable_B_OP235({ serialNo, data, date, engineNo, dispatchedDate }) {
  var result = decodeBlock235(data);
  var plug1to7 = [];
  var PLabel = ["P1", "P2", "P3", "P4", "P5", "P6", "", "SP"];
  for (let i = 0; i < 40; i += 5) {
    if (i === 30) {
      continue;
    }
    let el = (
      <>
        {/* <div className="d-flex flex-row flex-wrap mt-2"> */}
        {/* <div className="d-flex flex-column dt3">
          <div className="bg-warning text-light">{PLabel[i / 5]}</div>{" "}
          
        </div> */}
        <div className="text-center font-weight-bold flex-1-mod"  style={{minWidth:85}}>
          {/* <div className="bg-dark text-light">Judgment</div>{" "} */}
          {result[i + 3]}
        </div>
        <div className="text-center font-weight-bold flex-1-mod" style={{minWidth:85}}>
          {/* <div className="bg-dark text-light">
            Measurement leak (mL / min)
          </div>{" "} */}
          {result[i + 4]}
        </div>

        <div className="text-center font-weight-bold flex-1-mod" style={{minWidth:85}}>
          {/* <div className="bg-dark text-light">
            Correction (mL / min)
          </div>{" "} */}
          {result[i + 5]}
        </div>
        <div className="text-center font-weight-bold flex-1-mod" style={{minWidth:85}}>
          {/* <div className="bg-dark text-light">Test pressure(kPa)</div>{" "} */}
          {result[i + 6]}
        </div>
        <div className="text-center font-weight-bold flex-1-mod" style={{minWidth:85}}>
          {/* <div className="bg-dark text-light">K (Ve) value (mL)</div>{" "} */}
          {result[i + 7]}
        </div>
        {/* </div> */}
      </>
    );
    plug1to7.push(el);
  }
  var display = null;

  display = (
    <div className="d-flex flex-wrap gap-0 hB " >
      <div className="text-center font-weight-bold flex-1-mod" style={{minWidth:130}} >{serialNo}</div>
      <div className="text-center font-weight-bold flex-1-mod"  style={{minWidth:80}}>
        {" "}
        {result[1].model}
      </div>
      <div className="text-center font-weight-bold flex-1-mod"  style={{minWidth:50}}>
        {result[1].lts}
      </div>
      <div className="text-center font-weight-bold flex-1-mod"  style={{minWidth:50}}>{result[2]}</div>

      <div className="text-center font-weight-bold flex-1-mod"  style={{minWidth:140}}>
        {moment(date).format("DD-MM-YYYY HH:mm:ss")}
      </div>
      {plug1to7}
      {/* <div className="text-center font-weight-bold flex-1-mod">{moment(date).format("DD-MM-YYYY HH:mm:ss")}</div> */}
      <div className="text-center font-weight-bold flex-1-mod"  style={{minWidth:100}}>{engineNo}</div>
      <div className="text-center font-weight-bold flex-1-mod"  style={{minWidth:100}}>
        {engineNo != "-" ? "Dispatched" : null}
      </div>
      <div className="text-center font-weight-bold flex-1-mod"  style={{minWidth:140}}>
        {engineNo != "-"
          ? moment(dispatchedDate).format("DD-MM-YYYY HH:mm:ss")
          : null}
      </div>
    </div>
  );

  return <>{display}</>;
}

export default Reusable_B_OP235;
