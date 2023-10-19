import React, { useEffect } from 'react'
import { useSelector } from "react-redux";

function Heading_H_OP05({ setExcelData, excelData }) {
  const dataRange = useSelector((state) => state.process.dataRange.data);

  useEffect(() => {
    setExcelData([[]]);
    setExcelData([
      [
        "Head No.",
        "Serial No.",
        "Process Date & Time",
        "Engine No.",
        "Dispatch Status",
        "Dispatched Date & Time",
      ],
    ]);
  }, [dataRange]);
 
    return (
      <>
        <div className="mt-3">
          <div className="h5">Engraving Done on that day</div>
          <div className="d-flex flex-wrap gap-0 deta ">
   
            <div className="text-center font-weight-bold flex-1">Head No.</div>
            <div className="text-center font-weight-bold flex-1">Serial No.</div>
            <div className="text-center font-weight-bold flex-1">Process Date & Time</div>
            <div className="text-center font-weight-bold flex-1">Engine No.</div>
            <div className="text-center font-weight-bold flex-1">Dispatch Status</div>
            <div className="text-center font-weight-bold flex-1">Dispatched Date & Time</div>
            
          </div>
        </div>
      </>
    );
}

export default Heading_H_OP05