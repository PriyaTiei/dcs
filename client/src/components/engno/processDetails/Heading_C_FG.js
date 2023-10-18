import React, { useEffect } from "react";
import { useSelector } from "react-redux";


function Heading_C_FG({ setExcelData, excelData }) {

  const dataRange = useSelector((state) => state.process.dataRange.data);

  useEffect(() => {
    setExcelData([[]]);
    setExcelData([
      [
        "CrankShaft No.",
        "FG Date & Time",
        "Engine No.",
        "Dispatch Status",
        "Dispatched Date & Time",
      ],
    ]);
  }, [dataRange]);


  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - FG Date & Time</div>
        <div className="d-flex flex-wrap gap-0 deta ">
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            CrankShaft No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
           FG Date & Time
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

export default Heading_C_FG;
