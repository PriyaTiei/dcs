import React from "react";

function Heading_H_FG() {
  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - FG Time</div>
        <div className="d-flex flex-wrap gap-0 deta ">
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Head No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
           FG Time
          </div>
         
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Engine No.
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

export default Heading_H_FG;
