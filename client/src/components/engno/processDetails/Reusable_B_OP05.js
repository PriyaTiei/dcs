import React from 'react'
import moment from 'moment';

function Reusable_B_OP05({ serialNo, date}) {
  return (
    <>
      
       
          
        <div className="d-flex flex-wrap gap-0 deta ">
         
          <div className="text-center font-weight-bold w-25">{serialNo.slice(0,16)}</div>
          <div className="text-center font-weight-bold w-25">{serialNo.slice(16,)}</div>
          <div className="text-center font-weight-bold w-25">{moment(date).format("DD-MM-YYYY HH:mm:ss")}</div>
         
        
     </div>
    </>
  );
}

export default Reusable_B_OP05