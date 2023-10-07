import React from "react";

function Heading_H_OP50() {
  let subElements = [];
  for (let i = 0; i < 8; i++) {
    subElements.push(
      <div
        className="text-center font-weight-bold flex-1-mod bg-dark text-light"
        style={{ minWidth: 85 }}
      >
        T{i + 1} (0.001g/sec)
      </div>
    );
  }

  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - Leak Testing values</div>
        <div className="d-flex   gap-0 hB">
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 130 }}
          >
            Head No.
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 140 }}
          >
            Date
          </div>

          <>
            {subElements}
          </>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 100 }}
          >
            Engine No.
          </div>
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
            Dispatched Date
          </div>
        </div>
      </div>
    </>
  );
}

export default Heading_H_OP50;
