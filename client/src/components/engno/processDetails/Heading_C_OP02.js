import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function Heading_C_OP02({ setExcelData, excelData }) {
  const dataRange = useSelector((state) => state.process.dataRange.data);

  useEffect(() => {
    setExcelData([[]]);
    setExcelData([
      [
        "Crank Shaft No.",
        "OP02 Date & Time",
        "Engine No.",
        "Dispatch Status",
        "Dispatched Date & Time",
      ],
    ]);
  }, [dataRange]);

  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - Crank OP02</div>
        <div className="d-flex flex-wrap gap-0 deta ">
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Crank Shaft No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            OP02 Date & Time
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

export default Heading_C_OP02;
