import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { excelTableHeading } from "../../../redux/slices/processData/processActions";

function Heading_C_OP220({ setExcelData, excelData }) {
  const dispatch = useDispatch();
  const dataRange = useSelector((state) => state.process.dataRange.data);
  useEffect(() => {
    dispatch(excelTableHeading([
      "CrankShaft No.",
      "Model",
      "Process Date & Time",
      "J1 - ⌀1",
      "J1 - ⌀2",
      "J1 - ⌀3",
      "J2 - ⌀1",
      "J2 - ⌀2",
      "J2 - ⌀3",
      "J3 - ⌀1",
      "J3 - ⌀2",
      "J3 - ⌀3",
      "J4 - ⌀1",
      "J4 - ⌀2",
      "J4 - ⌀3",
      "J5 - ⌀1",
      "J5 - ⌀2",
      "J5 - ⌀3",
      "J1 - Taper",
      "J2 - Taper",
      "J3 - Taper",
      "J4 - Taper",
      "J5 - Taper",
      "P1 - ⌀1",
      "P1 - ⌀2",
      "P1 - ⌀3",
      "P2 - ⌀1",
      "P2 - ⌀2",
      "P2 - ⌀3",
      "P3 - ⌀1",
      "P3 - ⌀2",
      "P3 - ⌀3",
      "P4 - ⌀1",
      "P4 - ⌀2",
      "P4 - ⌀3",
      "P1 - Taper",
      "P2 - Taper",
      "P3 - Taper",
      "P4 - Taper",
      "Rr Flange ⌀",
      "J1～J5 stamped rank value",
      "Engine No.",
      "Dispatch Status",
      "Dispatched Date & Time",
    ]))
    // setExcelData([[]]);
    // setExcelData([
    //   [
    //     "CrankShaft No.",
    //     "Model",
    //     "Process Date & Time",
    //     "J1 - ⌀1",
    //     "J1 - ⌀2",
    //     "J1 - ⌀3",
    //     "J2 - ⌀1",
    //     "J2 - ⌀2",
    //     "J2 - ⌀3",
    //     "J3 - ⌀1",
    //     "J3 - ⌀2",
    //     "J3 - ⌀3",
    //     "J4 - ⌀1",
    //     "J4 - ⌀2",
    //     "J4 - ⌀3",
    //     "J5 - ⌀1",
    //     "J5 - ⌀2",
    //     "J5 - ⌀3",
    //     "J1 - Taper",
    //     "J2 - Taper",
    //     "J3 - Taper",
    //     "J4 - Taper",
    //     "J5 - Taper",
    //     "P1 - ⌀1",
    //     "P1 - ⌀2",
    //     "P1 - ⌀3",
    //     "P2 - ⌀1",
    //     "P2 - ⌀2",
    //     "P2 - ⌀3",
    //     "P3 - ⌀1",
    //     "P3 - ⌀2",
    //     "P3 - ⌀3",
    //     "P4 - ⌀1",
    //     "P4 - ⌀2",
    //     "P4 - ⌀3",
    //     "P1 - Taper",
    //     "P2 - Taper",
    //     "P3 - Taper",
    //     "P4 - Taper",
    //     "Rr Flange ⌀",
    //     "J1～J5 stamped rank value",
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
          Day wise - Journal & Pin Diameter & Taper details
        </div>
        <div className="d-flex   gap-0 hB">
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 130 }}
          >
            CrankShaft No.
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 65 }}
          >
            Model
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 140 }}
          >
            Date & Time
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J1 - ⌀1
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J1 - ⌀2
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J1 - ⌀3
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J2 - ⌀1
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J2 - ⌀2
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J2 - ⌀3
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J3 - ⌀1
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J3 - ⌀2
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J3 - ⌀3
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J4 - ⌀1
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J4 - ⌀2
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J4 - ⌀3
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J5 - ⌀1
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J5 - ⌀2
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J5 - ⌀3
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J1 - Taper
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J2 - Taper
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J3 - Taper
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J4 - Taper
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J5 - Taper
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P1 - ⌀1
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P1 - ⌀2
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P1 - ⌀3
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P2 - ⌀1
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P2 - ⌀2
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P2 - ⌀3
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P3 - ⌀1
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P3 - ⌀2
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P3 - ⌀3
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P4 - ⌀1
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P4 - ⌀2
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P4 - ⌀3
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P1 - Taper
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P2 - Taper
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P3 - Taper
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            P4 - Taper
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            Rr Flange ⌀
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            J1～J5 stamped rank value
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 100 }}
          >
            Engine No.
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 100 }}
          >
            Dispatch Status
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 140 }}
          >
            Dispatched Date & Time
          </div>
        </div>
      </div>
    </>
  );
}

export default Heading_C_OP220;
