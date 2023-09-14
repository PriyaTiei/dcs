import React from 'react'
import moment from 'moment';

function Reusable_B_OP190({ data, date, engineNo, dispatchedDate}) {
  let op195Data = data.slice(16,20)

  var display = null;
 
display=     <div className="d-flex flex-wrap gap-0 deta ">
         
<div className="text-center font-weight-bold flex-1">{data.slice(0,16)}</div>
<div className="text-center font-weight-bold flex-1">{op195Data==="0011" ? "OP195A" : (op195Data==="0012" ? "OP195B" : "")}</div>

{/* <div className="text-center font-weight-bold flex-1">{moment(date).format("DD-MM-YYYY HH:mm:ss")}</div> */}
<div className="text-center font-weight-bold flex-1">{engineNo}</div>
<div className="text-center font-weight-bold flex-1">{engineNo != "-"? "Dispatched": null}</div>
<div className="text-center font-weight-bold flex-1">{engineNo != "-"? moment(dispatchedDate).format("DD-MM-YYYY HH:mm:ss"):null}</div>

</div>
 
  
  return (
    <>
      
       {display}
          
    
    </>
  );
}

export default Reusable_B_OP190