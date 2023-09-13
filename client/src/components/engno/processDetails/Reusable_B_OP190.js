import React from 'react'
import moment from 'moment';

function Reusable_B_OP190({ data, date, engineNo, dispatchedDate}) {
  var dataList = data.split(",")
  var display = null;
  if(dataList.length >=11){
display=     <div className="d-flex flex-wrap gap-0 deta ">
         
<div className="text-center font-weight-bold flex-1">{dataList[0]}</div>
<div className="text-center font-weight-bold flex-1">{parseInt(dataList[7].slice(0,6))}</div>
<div className="text-center font-weight-bold flex-1">{parseInt(dataList[8].slice(0,6))}</div>
<div className="text-center font-weight-bold flex-1">{parseInt(dataList[9].slice(0,6))}</div>
<div className="text-center font-weight-bold flex-1">{parseInt(dataList[10].slice(0,6))}</div>
<div className="text-center font-weight-bold flex-1">{parseInt(dataList[11].slice(0,6))}</div>

{/* <div className="text-center font-weight-bold flex-1">{moment(date).format("DD-MM-YYYY HH:mm:ss")}</div> */}
<div className="text-center font-weight-bold flex-1">{engineNo}</div>
<div className="text-center font-weight-bold flex-1">{engineNo != "-"? "Dispatched": null}</div>
<div className="text-center font-weight-bold flex-1">{engineNo != "-"? moment(dispatchedDate).format("DD-MM-YYYY HH:mm:ss"):null}</div>

</div>
  }
  
  return (
    <>
      
       {display}
          
    
    </>
  );
}

export default Reusable_B_OP190