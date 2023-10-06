import React from "react";

function Heading_B_OP235() {
  let plug = ["P1", "P2", "P3", "P4", "P5", "P6", "SP"];
  let dataList = plug.map((plugName) => {
    return (
      <>
        {/* <div className="text-center font-weight-bold flex-1 bg-dark text-light">
          {plugName}
        </div> */}
        <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:85}}>
          {plugName} Judgment
        </div>
        <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:85}}>
        {plugName} Measurement leak (mL / min)
        </div>
        <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:85}}>
        {plugName} Correction (mL / min)
        </div>
        <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:85}}>
        {plugName} Test pressure(kPa)
        </div>
        <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:85}}>
        {plugName}   K (Ve) value (mL)
        </div>
      </>
    );
  });

  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - Block OP235</div>
        <div className="d-flex  gap-0 deta ">
          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:130}}>
            Block No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:80}}>
            Model
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:50}}>
            Lts
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:50}}>
            Judgment
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:140}}>
            OP235 process Time
          </div>

          {dataList}

          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:100}}>
            Engine No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:100}}>
            Dispatch Status
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:140}}>
            Dispatched Date
          </div>
        </div>
      </div>
    </>
  );
}

export default Heading_B_OP235;
