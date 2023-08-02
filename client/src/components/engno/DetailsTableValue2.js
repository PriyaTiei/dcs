import React from "react";

function DetailsTableHeading1({serial, dateTime, wj, wjLeak, oh, ohLeak, camCase,camCaseLeak, egr,egrLeak, engineNo, engineStatus, customer}) {
  return (
    <>
       <div className="d-flex flex-wrap gap-0 deta2 ">
          <div className="text-center font-weight-bold">{serial}</div>
          <div className="text-center font-weight-bold">{dateTime}</div>
          <div className="text-center font-weight-bold">{wj}	</div>
          <div className="text-center font-weight-bold">{wjLeak}	</div>
          <div className="text-center font-weight-bold">{oh}	</div>
          <div className="text-center font-weight-bold">{ohLeak}	</div>
          <div className="text-center font-weight-bold">{camCase}</div>
          <div className="text-center font-weight-bold">{camCaseLeak}</div>
          <div className="text-center font-weight-bold">{egr}</div>
          <div className="text-center font-weight-bold">{egrLeak}</div>
          <div className="text-center font-weight-bold">{engineNo}</div>          
          <div className="text-center font-weight-bold">{engineStatus}</div>
          <div className="text-center font-weight-bold">{customer}</div>

     </div>
    </>
  );
}

export default DetailsTableHeading1;
