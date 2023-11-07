import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { excelTableHeading } from "../../../redux/slices/processData/processActions";

function Heading_B_OP195({ setExcelData, excelData }) {
  const dispatch = useDispatch();
  const dataRange = useSelector((state) => state.process.dataRange.data);
  useEffect(() => {
    dispatch(excelTableHeading([
      "Block No.",
      "OP195A or OP195B",
      "Engine No.",
      "Dispatch Status",
      "Dispatched Date & Time",
    ]))
    // setExcelData([[]]);
    // setExcelData([
    //   [
    //     "Block No.",
    //     "OP195A or OP195B",
    //     "Engine No.",
    //     "Dispatch Status",
    //     "Dispatched Date & Time",
    //   ],
    // ]);
  }, [dataRange]);
  return (
    <>
      <div className="mt-3">
        <div className="h5">Machine OP195A or OP195B</div>
        <div className="d-flex flex-wrap gap-0 deta ">
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Block No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            OP195A or OP195B
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

export default Heading_B_OP195;
