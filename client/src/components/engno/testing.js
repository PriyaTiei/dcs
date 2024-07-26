import React from 'react'

function CrankDetails() {
  const detail1 = "details";

  
  return (
    <div>
    <div className="h5">Crank Information</div>
    <div className="d-flex gap-0">
      <div className="p-2 border crank">Crank Housing Number:</div>
      <div className="p-2 border crank">{detail1}</div>
    </div>
    <div className="d-flex gap-0">
      <div className="p-2 border crank">Crank Housing Casting Number:</div>
      <div className="p-2 border crank"> {detail1}</div>
    </div>
    <div className="d-flex gap-0">
      <div className="p-2 border crank">Date Created:</div>
      <div className="p-2 border crank"> {detail1}</div>
    </div>
    <div className="d-flex gap-0">
      <div className="p-2 border crank">Time Created:</div>
      <div className="p-2 border crank">  {detail1}</div>
    </div>
  </div>
  )
}

export default CrankDetails