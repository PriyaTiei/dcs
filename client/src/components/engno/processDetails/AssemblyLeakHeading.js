import React from "react";

function DetailsTableHeading2() {
  return (
    <>
      <div className="mt-3">
        <div className="h5">Engine Produced From Date - to Date</div>
        <div className="d-flex flex-wrap gap-0 deta2 ">
          <div className="text-center font-weight-bold " style={{width:"10vw"}}>Serial No</div>
          <div className="text-center font-weight-bold">Date & Time</div>
          <div className="text-center font-weight-bold">W/J </div>
          <div className="text-center font-weight-bold">
            Leak Rate (ml/min.){" "}
          </div>
          <div className="text-center font-weight-bold">OH</div>
          <div className="text-center font-weight-bold">
            Leak Rate (ml/min.){" "}
          </div>
          <div className="text-center font-weight-bold">Cam case</div>
          <div className="text-center font-weight-bold">
            Leak Rate (ml/min.){" "}
          </div>
          <div className="text-center font-weight-bold">EGR</div>
          <div className="text-center font-weight-bold">
            Leak Rate (ml/min.){" "}
          </div>
          <div className="text-center font-weight-bold">Engine No.</div>
          <div className="text-center font-weight-bold">Engine Status</div>
          <div className="text-center font-weight-bold">Customer</div>
        </div>
      </div>
    </>
  );
}

export default DetailsTableHeading2;
