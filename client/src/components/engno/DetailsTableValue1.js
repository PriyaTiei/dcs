import React from "react";

function DetailsTableHeading1({headNo, oilLeak, wj, camCase, egr, engineNo, engineStatus, customer}) {
  return (
    <>
      
        <div className="d-flex flex-wrap gap-0 deta ">
          <div className="text-center font-weight-bold">{headNo}</div>
          <div className="text-center font-weight-bold">{oilLeak}</div>
          <div className="text-center font-weight-bold">{wj}	</div>
          <div className="text-center font-weight-bold">{camCase}</div>
          <div className="text-center font-weight-bold">{egr}</div>
          <div className="text-center font-weight-bold">{engineNo}</div>          
          <div className="text-center font-weight-bold">{engineStatus}</div>
          <div className="text-center font-weight-bold">{customer}</div>
        
     </div>
    </>
  );
}

export default DetailsTableHeading1;
