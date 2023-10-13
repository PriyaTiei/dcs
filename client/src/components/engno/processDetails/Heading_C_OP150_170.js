import React from "react";

function Heading_C_OP150_170() {
  let plug = ["1st CW", "2nd CW", "3rd CW","4th CW", "5th CW", "6th CW","7th CW", "8th CW"];
  let dataList = plug.map((plugName) => {
    return (
      <>
        {/* <div className="text-center font-weight-bold flex-1 bg-dark text-light">
          {plugName}
        </div> */}
        <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:85}}>
          {plugName} 1st hole Hole angle (0.1 °)
        </div>
        <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:85}}>
        {plugName} 1st hole Hole depth (0.1mm)
        </div>
        <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:85}}>
        {plugName} 1st hole Hole depth (0.1mm)
        </div>
        <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:85}}>
        {plugName} 2nd hole Hole depth (0.1mm)
        </div>
        
      </>
    );
  });

  let plug2 = ["Initial", "Final"];
  let dataList2 = plug2.map((plugName) => {
    return (
      <>
        {/* <div className="text-center font-weight-bold flex-1 bg-dark text-light">
          {plugName}
        </div> */}
        <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:85}}>
          {plugName} 1-sided measure (0.1 gcm)
        </div>
        <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:85}}>
        {plugName} two-sided measure (0.1 gcm)
        </div>
        <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:85}}>
        {plugName}  1-sided measurement angle (0.1 °)
        </div>
        <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:85}}>
        {plugName} two-sided measurement angle (0.1 °)
        </div>
        
      </>
    );
  });

  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - Crank OP150-OP170</div>
        <div className="d-flex  gap-0 deta ">
          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:130}}>
           Crank No.
          </div>
         
          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:80}}>
            Process No
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:80}}>
            Model
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:140}}>
            process Date & Time
          </div>
                    
          {dataList}
          {dataList2}

          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:100}}>
            Engine No.
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:100}}>
            Dispatch Status
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light" style={{minWidth:140}}>
            Dispatched Date & Time
          </div>
        </div>
      </div>
    </>
  );
}

export default Heading_C_OP150_170;
