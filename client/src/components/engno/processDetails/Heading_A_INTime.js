import React from "react";

function Heading_A_INTIME() {
  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - Process Time details</div>
        <div className="d-flex flex-wrap gap-0 deta ">
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Serial No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Process Time
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Engine no.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Dispatch Status
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Dispatched Date
          </div>
        </div>
      </div>
    </>
  );
}

export default Heading_A_INTIME;
