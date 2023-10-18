import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function Heading_B_OP235({ setExcelData, excelData }) {
  const dataRange = useSelector((state) => state.process.dataRange.data);
  let plug = ["P1", "P2", "P3", "P4", "P5", "P6", "SP"];
  useEffect(() => {
    let dataList1 = [];
    plug.forEach((plugName) => {
      dataList1.push(`${plugName} Judgement`);
      dataList1.push(`${plugName} Measurement leak (mL / min)`);
      dataList1.push(`${plugName} Correction (mL / min)`);
      dataList1.push(`${plugName} Test pressure(kPa)`);
      dataList1.push(`${plugName} K (Ve) value (mL)`);
    });
    setExcelData([[]]);
    // let dataList1 = plug.map((plugName) =>`${plugName} Judgement`,`${plugName} Measurement leak (mL / min)`)
    setExcelData([
      [
        "Block No.",
        "Model",
        "Lts",
        "Judgement",
        "OP235 process Date & Time",
        ...dataList1,
        "Engine No.",
        "Dispatch Status",
        "Dispatched Date & Time",
      ],
    ]);
  }, [dataRange]);

  // useEffect(()=>{
  //   console.log(excelData);
  // },[excelData])

  let dataList = plug.map((plugName) => {
    return (
      <>
        {/* <div className="text-center font-weight-bold flex-1 bg-dark text-light">
          {plugName}
        </div> */}
        <div
          className="text-center font-weight-bold flex-1 bg-dark text-light"
          style={{ minWidth: 85 }}
        >
          {plugName} Judgement
        </div>
        <div
          className="text-center font-weight-bold flex-1 bg-dark text-light"
          style={{ minWidth: 85 }}
        >
          {plugName} Measurement leak (mL / min)
        </div>
        <div
          className="text-center font-weight-bold flex-1 bg-dark text-light"
          style={{ minWidth: 85 }}
        >
          {plugName} Correction (mL / min)
        </div>
        <div
          className="text-center font-weight-bold flex-1 bg-dark text-light"
          style={{ minWidth: 85 }}
        >
          {plugName} Test pressure(kPa)
        </div>
        <div
          className="text-center font-weight-bold flex-1 bg-dark text-light"
          style={{ minWidth: 85 }}
        >
          {plugName} K (Ve) value (mL)
        </div>
      </>
    );
  });

  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - Block OP235</div>
        <div className="d-flex  gap-0 deta ">
          <div
            className="text-center font-weight-bold flex-1 bg-dark text-light"
            style={{ minWidth: 130 }}
          >
            Block No.
          </div>
          <div
            className="text-center font-weight-bold flex-1 bg-dark text-light"
            style={{ minWidth: 80 }}
          >
            Model
          </div>
          <div
            className="text-center font-weight-bold flex-1 bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            Lts
          </div>
          <div
            className="text-center font-weight-bold flex-1 bg-dark text-light"
            style={{ minWidth: 50 }}
          >
            Judgement
          </div>
          <div
            className="text-center font-weight-bold flex-1 bg-dark text-light"
            style={{ minWidth: 140 }}
          >
            OP235 process Date & Time
          </div>

          {dataList}

          <div
            className="text-center font-weight-bold flex-1 bg-dark text-light"
            style={{ minWidth: 100 }}
          >
            Engine No.
          </div>
          <div
            className="text-center font-weight-bold flex-1 bg-dark text-light"
            style={{ minWidth: 100 }}
          >
            Dispatch Status
          </div>
          <div
            className="text-center font-weight-bold flex-1 bg-dark text-light"
            style={{ minWidth: 140 }}
          >
            Dispatched Date & Time
          </div>
        </div>
      </div>
    </>
  );
}

export default Heading_B_OP235;
