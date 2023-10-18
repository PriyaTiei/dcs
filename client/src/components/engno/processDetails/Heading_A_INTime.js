import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function Heading_A_INTIME({ setExcelData, excelData }) {
  const dataRange = useSelector((state) => state.process.dataRange.data);
  const processName = useSelector((state) => state.process.processName);

  useEffect(() => {
    console.log("test_Heading serial no")
    console.log(excelData)
    setExcelData([[]]);
    setExcelData([
      [
        "Serial No.",
        "Process Date & Time",
        "Engine No.",
        "Dispatch Status",
        "Dispatched Date & Time",
      ],
    ]);
  }, [processName]);
  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - Process Date & Time details</div>
        <div className="d-flex flex-wrap gap-0 deta ">
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Serial No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Process Date & Time
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Engine no.
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

export default Heading_A_INTIME;
