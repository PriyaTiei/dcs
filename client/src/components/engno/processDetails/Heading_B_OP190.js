import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function Heading_B_OP190({ setExcelData, excelData }) {
  const dataRange = useSelector((state) => state.process.dataRange.data);
  useEffect(() => {
    setExcelData([[]]);
    setExcelData([
      [
        "Block No.",
        "Process Date & Time",
        "J1",
        "J2",
        "J3",
        "J4",
        "J5",
        "Engine No.",
        "Dispatch Status",
        "Dispatched Date & Time",
      ],
    ]);
  }, [dataRange]);
  return (
    <>
      <div className="mt-3">
        <div className="h5">Journal diameter in mm</div>
        <div className="d-flex flex-wrap gap-0 deta ">
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Block No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            J1
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            J2
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            J3
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            J4
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            J5
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Engine No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Dispatch Status
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Dispatched Date & Time
          </div>
        </div>
      </div>
    </>
  );
}

export default Heading_B_OP190;
