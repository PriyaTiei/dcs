import React from "react";
import ChangePointValue from "./changePointValue.js";

function ChangePointMachining() {
  return (
    <div className="mt-3">
      <div className="h5">Change Point Information [Machining Line]</div>
      <div className="d-flex flex-wrap gap-1 chan ">
        <div className="text-center font-weight-bold">OP/ Station</div>
        <div className="text-center font-weight-bold">4M</div>
        <div className="text-center font-weight-bold">Abnormality</div>
        <div className="text-center font-weight-bold">Breakdown</div>
        <div className="text-center font-weight-bold">Rework</div>

        <ChangePointValue
          station={"QC1"}
          m4={"Not Available"}
          abnormality={"Not Available"}
          breakdown={"Not Available"}
          rework={"Not Available"}
        />
        <ChangePointValue
          station={"QC2"}
          m4={"Not Available"}
          abnormality={"Not Available"}
          breakdown={"Not Available"}
          rework={"Not Available"}
        />
        <ChangePointValue
          station={"QC3"}
          m4={"Not Available"}
          abnormality={"Not Available"}
          breakdown={"Not Available"}
          rework={"Available"}
        />
        <ChangePointValue
          station={"QC4"}
          m4={"Not Available"}
          abnormality={"Not Available"}
          breakdown={"Not Available"}
          rework={"Not Available"}
        />
        <ChangePointValue
          station={"OP160"}
          m4={"Not Available"}
          abnormality={"Available"}
          breakdown={"Not Available"}
          rework={"Not Available"}
        />
        <ChangePointValue
          station={"OP230"}
          m4={"Not Available"}
          abnormality={"Not Available"}
          breakdown={"Not Available"}
          rework={"Not Available"}
        />
        <ChangePointValue
          station={"OP235"}
          m4={"Not Available"}
          abnormality={"Not Available"}
          breakdown={"Not Available"}
          rework={"Not Available"}
        />
      </div>
    </div>
  );
}

export default ChangePointMachining;
