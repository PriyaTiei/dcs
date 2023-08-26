import React from "react";
import ChangePointValue from "./ReuasableChangePointValues.js";

function ChangePointAssembly() {
  return (
    <div className="">
      <div className="h5">Change Point Information [Assembly Line]</div>
      <div className="d-flex flex-wrap gap-1 chan ">
        <div className="text-center font-weight-bold">Station</div>
        <div className="text-center font-weight-bold">4M</div>
        <div className="text-center font-weight-bold">Abnormality</div>
        <div className="text-center font-weight-bold">Breakdown</div>
        <div className="text-center font-weight-bold">Rework</div>

        <ChangePointValue
          station={"MK4"}
          m4={"Not Available"}
          abnormality={"Not Available"}
          breakdown={"Not Available"}
          rework={"Not Available"}
        />
        <ChangePointValue
          station={"MK25"}
          m4={"Available"}
          abnormality={"Not Available"}
          breakdown={"Not Available"}
          rework={"Not Available"}
        />
        <ChangePointValue
          station={"BS8"}
          m4={"Not Available"}
          abnormality={"Not Available"}
          breakdown={"Not Available"}
          rework={"Not Available"}
        />
        <ChangePointValue
          station={"BS3"}
          m4={"Not Available"}
          abnormality={"Not Available"}
          breakdown={"Not Available"}
          rework={"Not Available"}
        />
        <ChangePointValue
          station={"HS6"}
          m4={"Not Available"}
          abnormality={"Not Available"}
          breakdown={"Not Available"}
          rework={"Not Available"}
        />
        <ChangePointValue
          station={"HS4"}
          m4={"Not Available"}
          abnormality={"Not Available"}
          breakdown={"Not Available"}
          rework={"Not Available"}
        />
        <ChangePointValue
          station={"SPS2"}
          m4={"Not Available"}
          abnormality={"Not Available"}
          breakdown={"Not Available"}
          rework={"Not Available"}
        />
      </div>
    </div>
  );
}

export default ChangePointAssembly;
