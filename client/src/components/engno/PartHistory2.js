import React from "react";

function PartHistory2() {
  return (
    <div>
      <div className="h5">Part history</div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist">FG time</div>
        <div className="p-2 border histValue">{hDate}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist">Leak test time</div>
        <div className="p-2 border histValue">{hDate}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist">Crank boring time</div>
        <div className="p-2 border histValue">{hDate}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist">RM feed time</div>
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
