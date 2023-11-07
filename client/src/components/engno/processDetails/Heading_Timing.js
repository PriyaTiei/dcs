import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { excelTableHeading } from "../../../redux/slices/processData/processActions";

function Heading_Timing({ line, op, setExcelData, excelData }) {
  const dispatch = useDispatch();
  const dataRange = useSelector((state) => state.process.dataRange.data);

  useEffect(() => {
    dispatch(excelTableHeading([
      `${line} No.`,
      `${op} Date & Time`,
      "Engine No.",
      "Dispatch Status",
      "Dispatched Date & Time",
    ]))
    // setExcelData([[]]);
    // setExcelData([
    //   [
    //     `${line} No.`,
    //     `${op} Date & Time`,
    //     "Engine No.",
    //     "Dispatch Status",
    //     "Dispatched Date & Time",
    //   ],
    // ]);
  }, [dataRange]);

  return (
    <>
      <div className="mt-3">
        <div className="h5">
          Day wise - {line} {op}
        </div>
        <div className="d-flex flex-wrap gap-0 deta ">
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            {line} No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            {op} Date & Time
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

export default Heading_Timing;
