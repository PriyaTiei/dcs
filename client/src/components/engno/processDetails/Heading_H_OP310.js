import React, { useEffect }  from "react";
import { useSelector, useDispatch } from "react-redux";
import { excelTableHeading } from "../../../redux/slices/processData/processActions";

function Heading_H_OP310({ setExcelData, excelData }) {
  const dispatch = useDispatch();
  const dataRange = useSelector((state) => state.process.dataRange.data);

  useEffect(() => {

    dispatch(excelTableHeading([
      "Head No.",
      "Process Date & Time",       
      "WJ-Judgement",
      "WJ-Measurement leak (mL / min)",
      "WJ-Correction (mL / min)",
      "WJ-Test pressure(kPa)",
      "WJ-K (Ve) value (mL)",
      "OH-Judgement",
      "OH-Measurement leak (mL / min)",
      "OH-Correction (mL / min)",
      "OH-Test pressure(kPa)",
      "OH-K (Ve) value (mL)",
      "CC-Judgement",
      "CC-Measurement leak (mL / min)",
      "CC-Correction (mL / min)",
      "CC-Test pressure(kPa)",
      "CC-K (Ve) value (mL)",
      "EGR-Judgement",
      "EGR-Measurement leak (mL / min)",
      "EGR-Correction (mL / min)",
      "EGR-Test pressure(kPa)",
      "EGR-K (Ve) value (mL)",
      "Engine No.",
      "Dispatch Status",
      "Dispatched Date & Time",
    ]))

    // setExcelData([[]]);
    // setExcelData([
    //   [
    //     "Head No.",
    //     "Process Date & Time",       
    //     "WJ-Judgement",
    //     "WJ-Measurement leak (mL / min)",
    //     "WJ-Correction (mL / min)",
    //     "WJ-Test pressure(kPa)",
    //     "WJ-K (Ve) value (mL)",
    //     "OH-Judgement",
    //     "OH-Measurement leak (mL / min)",
    //     "OH-Correction (mL / min)",
    //     "OH-Test pressure(kPa)",
    //     "OH-K (Ve) value (mL)",
    //     "CC-Judgement",
    //     "CC-Measurement leak (mL / min)",
    //     "CC-Correction (mL / min)",
    //     "CC-Test pressure(kPa)",
    //     "CC-K (Ve) value (mL)",
    //     "EGR-Judgement",
    //     "EGR-Measurement leak (mL / min)",
    //     "EGR-Correction (mL / min)",
    //     "EGR-Test pressure(kPa)",
    //     "EGR-K (Ve) value (mL)",
    //     "Engine No.",
    //     "Dispatch Status",
    //     "Dispatched Date & Time",
    //   ],
    // ]);
  }, [dataRange]);


  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - Leak Testing values</div>
        <div className="d-flex   gap-0 hB">
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 130 }}
          >
            Head No.
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 140 }}
          >
            Date & Time
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Judgement
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Measurement leak (mL / min)
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Correction (mL / min)
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Test pressure(kPa)
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            K (Ve) value (mL)
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Judgement
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Measurement leak (mL / min)
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Correction (mL / min)
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Test pressure(kPa)
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            K (Ve) value (mL)
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Judgement
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Measurement leak (mL / min)
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Correction (mL / min)
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Test pressure(kPa)
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            K (Ve) value (mL)
          </div>

          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Judgement
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Measurement leak (mL / min)
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Correction (mL / min)
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            Test pressure(kPa)
          </div>
          <div
            className="text-center font-weight-bold flex-1-mod bg-dark text-light"
            style={{ minWidth: 85 }}
          >
            K (Ve) value (mL)
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

export default Heading_H_OP310;
