import React from "react";

function Heading_A_HeadNR() {
  let subElements = [];
  for (let i = 0; i < 10; i++) {
    subElements.push(
      <div
        className="text-center font-weight-bold flex-1-mod bg-dark text-light"
        style={{ minWidth: 85 }}
      >
       Torque #{i + 1} 
      </div>
    );
  }

  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - Head Nutrunner</div>
        <div className="d-flex   gap-0 hB">
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 100 }}
          >
            Engine No.
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 140 }}
          >
            Process Date & Time
          </div>

          <>
            {subElements}
          </>

          
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 100 }}
          >
            Dispatch Status
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 140 }}
          >
            Dispatched Date & Time
          </div>
        </div>
      </div>
    </>
  );
}

export default Heading_A_HeadNR;
