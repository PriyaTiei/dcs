import React from "react";
import moment from "moment";
import { decode_C_150_170 } from "./func_C_150_170";

function Reusable_C_OP150_170({
  serialNo,
  data,
  date,
  engineNo,
  dispatchedDate,
}) {
  var result = decode_C_150_170(data);
  var plug1to7 = [];
  var PLabel = [
    "1st CW",
    "2nd CW",
    "3rd CW",
    "4th CW",
    "5th CW",
    "6th CW",
    "7th CW",
    "8th CW",
    "Initial",
    "Final",
  ];
  for (let i = 0; i < 32; i += 4) {
    let el = (
      <>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {/* <div className="bg-dark text-light">Judgement</div>{" "} */}
          {result[i + 3]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {/* <div className="bg-dark text-light">
            Measurement leak (mL / min)
          </div>{" "} */}
          {result[i + 4]}
        </div>

        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {/* <div className="bg-dark text-light">
            Correction (mL / min)
          </div>{" "} */}
          {result[i + 5]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {/* <div className="bg-dark text-light">Test pressure(kPa)</div>{" "} */}
          {result[i + 6]}
        </div>

        {/* </div> */}
      </>
    );
    plug1to7.push(el);
  }

  for (let i = 32; i < 40; i += 4) {
    let el = (
      <>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {/* <div className="bg-dark text-light">Judgement</div>{" "} */}
          {result[i + 3]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {/* <div className="bg-dark text-light">
            Measurement leak (mL / min)
          </div>{" "} */}
          {result[i + 4]}
        </div>

        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {/* <div className="bg-dark text-light">
            Correction (mL / min)
          </div>{" "} */}
          {result[i + 5]}
        </div>
        <div
          className="text-center font-weight-bold flex-1-mod"
          style={{ minWidth: 85 }}
        >
          {/* <div className="bg-dark text-light">Test pressure(kPa)</div>{" "} */}
          {result[i + 6]}
        </div>

        {/* </div> */}
      </>
    );
    plug1to7.push(el);
  }

  var display = null;

  display = (
    <div className="d-flex flex-wrap gap-0 hB ">
      <div
        className="text-center font-weight-bold flex-1-mod"
        style={{ minWidth: 130 }}
      >
        {serialNo}
      </div>
      <div
        className="text-center font-weight-bold flex-1-mod"
        style={{ minWidth: 80 }}
      >
        {" "}
        {result[1]}
      </div>
      <div
        className="text-center font-weight-bold flex-1-mod"
        style={{ minWidth: 50 }}
      >
        {result[2]}
      </div>

      <div
        className="text-center font-weight-bold flex-1-mod"
        style={{ minWidth: 140 }}
      >
        {moment(date).format("DD-MM-YYYY HH:mm:ss")}
      </div>
      {plug1to7}
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

export default Reusable_C_OP150_170;
