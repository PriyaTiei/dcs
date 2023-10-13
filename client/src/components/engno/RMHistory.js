import React from "react";

function RMHistory() {
  const hDate = new Date(Date.now()).toUTCString();

  return (
    <div>
      <div className="h5">RM history</div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist">ETA Date & Time</div>
        <div className="p-2 border histValue">{hDate}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist">Invoice No.</div>
        <div className="p-2 border histValue">{hDate}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist">Feed Date & Time</div>
        <div className="p-2 border histValue">{hDate}</div>
      </div>

   
    </div>
  );
}

export default RMHistory;
