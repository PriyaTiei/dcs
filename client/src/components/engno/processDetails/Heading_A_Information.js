import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { excelTableHeading } from "../../../redux/slices/processData/processActions";

function Heading_A_Information({ setExcelData, excelData }) {
  const dataRange = useSelector((state) => state.process.dataRange.data);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(excelTableHeading(  [
      "Engine No.",
      "Code",
      "Engine Type",
      "Customer",
      "Process Date & Time",
      "Dispatch Status",
      "Dispatched Date & Time",
    ]))
    // setExcelData([[]]);
    // setExcelData([
    //   [
    //     "Engine No.",
    //     "Code",
    //     "Engine Type",
    //     "Customer",
    //     "Process Date & Time",
    //     "Dispatch Status",
    //     "Dispatched Date & Time",
    //   ],
    // ]);
  }, [dataRange]);

  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - Leak values</div>
        <div className="d-flex flex-wrap gap-0 deta ">
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Engine No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Code
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Engine Type
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Customer
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Process Date & Time
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

export default Heading_A_Information;
