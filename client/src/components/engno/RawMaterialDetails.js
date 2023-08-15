import React from 'react'

function RawMaterialDetails() {
  
  const detail1 = "details";
  
  return (
    <div>
    <div className="h5">RM Detail</div>
    <div className="d-flex gap-0">
      <div className="p-2 border ship">Machine No: :</div>
      <div className="p-2 border ship">{detail1}</div>
    </div>
    <div className="d-flex gap-0">
      <div className="p-2 border ship">Die No: :</div>
      <div className="p-2 border ship">{detail1}</div>
    </div>
    <div className="d-flex gap-0">
      <div className="p-2 border ship ">Supplier name</div>
      <div className="p-2 border ship">{detail1}</div>
    </div>
    <div className="d-flex gap-0">
      <div className="p-2 border ship">ETD:</div>
      <div className="p-2 border ship"> {detail1}</div>
    </div>
  </div>
  )
}

export default RawMaterialDetails