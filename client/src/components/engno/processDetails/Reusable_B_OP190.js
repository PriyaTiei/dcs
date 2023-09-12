import React from 'react'
import moment from 'moment';

function Reusable_B_OP190({ serialNo, date, engineNo, dispatchedDate}) {
  return (
    <>
      
       
          
        <div className="d-flex flex-wrap gap-0 deta ">
         
          <div className="text-center font-weight-bold flex-1">{serialNo.slice(0,16)}</div>
          <div className="text-center font-weight-bold flex-1">{serialNo.slice(16,)}</div>
          {/* <div className="text-center font-weight-bold flex-1">{moment(date).format("DD-MM-YYYY HH:mm:ss")}</div> */}
          <div className="text-center font-weight-bold flex-1">{engineNo}</div>
          <div className="text-center font-weight-bold flex-1">{engineNo != "-"? "Dispatched": null}</div>
          <div className="text-center font-weight-bold flex-1">{engineNo != "-"? moment(dispatchedDate).format("DD-MM-YYYY HH:mm:ss"):null}</div>
        
     </div>
    </>
  );
}

export default Reusable_B_OP190