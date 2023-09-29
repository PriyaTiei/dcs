import React from "react";

function Heading_A_LeakTest() {
  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - Leak values</div>
        <div className="d-flex flex-wrap gap-0 deta ">
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Engine No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Leak values
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Judgment
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Leak test Time
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

export default Heading_A_LeakTest;
