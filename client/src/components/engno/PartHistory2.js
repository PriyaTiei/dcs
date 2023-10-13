import React from "react";

function PartHistory2() {
  return (
    <div>
      <div className="h5">Part history</div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist">FG Date & Time</div>
        <div className="p-2 border histValue">{hDate}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist">Leak test Date & Time</div>
        <div className="p-2 border histValue">{hDate}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist">Crank boring Date & Time</div>
        <div className="p-2 border histValue">{hDate}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist">RM feed Date & Time</div>
        <div className="p-2 border histValue">{hDate}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist">ETA</div>
        <div className="p-2 border histValue">{hDate}</div>
      </div>
    </div>
  );
}

export default PartHistory2;
