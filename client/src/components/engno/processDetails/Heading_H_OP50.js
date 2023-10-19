import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function Heading_H_OP50({ setExcelData, excelData }) {
  let subElements = [];
  for (let i = 0; i < 8; i++) {
    subElements.push(
      <div
        className="text-center font-weight-bold flex-1-mod bg-dark text-light"
        style={{ minWidth: 85 }}
      >
        T{i + 1} (0.001g/sec)
      </div>
    );
  }
  const dataRange = useSelector((state) => state.process.dataRange.data);

  useEffect(() => {

    let subElements2 = [];
    for (let i = 0; i < 8; i++) {
      subElements2.push(`T${i + 1} (0.001g/sec) `);
    }
    setExcelData([[]]);
    setExcelData([
      [
        "Head No.",
        "Process Date & Time",
        ...subElements2,
        "Engine No.",
        "Dispatch Status",
        "Dispatched Date & Time",
      ],
    ]);
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
            Process Date & Time
          </div>

          <>
            {subElements}
          </>

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

export default Heading_H_OP50;
