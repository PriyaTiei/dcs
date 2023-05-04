import React from "react";
import moment from "moment";

function Rows({ element }) {
  const {
    entryDate,
    m4,
    line,
    station,
    changePoint,
    reason,
    action,
    traceability,
    result,
    next,
    responsibility,
    countermeasure,
  } = element;

  return (
    <div className="d-flex ">
      <div className=" col-1  text-center border border-dark ">
        {moment(entryDate).format("DD-MMM-YYYY h:mm a")}
      </div>

      <div className="col-1  text-center  border border-dark ">{m4}</div>

      <div className="col-1  text-center    border border-dark ">{line}</div>

      <div className="col-1  text-center    border border-dark ">{station}</div>

      <div className=" col-1  text-center   border border-dark ">
        {changePoint}
      </div>

      <div className=" col-1  text-center   border border-dark ">{reason}</div>

      <div className=" col-1  text-center   border border-dark ">{action}</div>

      <div className=" col-1  text-center   border border-dark ">
        {traceability}
      </div>

      <div className="col-1  text-center   border border-dark ">
        {result}
      </div>

      <div className=" col-1  text-center   border border-dark ">{next}</div>

      <div className="col-1  text-center    border border-dark ">
        {responsibility}
      </div>

      <div className="  col-1  text-center  border border-dark ">
        {countermeasure}
      </div>
    </div>
  );
}

export default Rows;
