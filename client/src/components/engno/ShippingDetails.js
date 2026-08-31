import React from 'react'

function ShippingDetails() {
  const detail1 = "details";

  
  return (
    <div>
    <div className="h5">Shipping Detail</div>
    <div className="d-flex gap-0">
      <div className="p-2 border ship">Consignment No:</div>
      <div className="p-2 border ship">{detail1}</div>
    </div>
    <div className="d-flex gap-0">
      <div className="p-2 border ship">Truck No:</div>
      <div className="p-2 border ship">{detail1}</div>
    </div>
    <div className="d-flex gap-0">
      <div className="p-2 border ship ">Customer name</div>
      <div className="p-2 border ship">{detail1}</div>
    </div>
    <div className="d-flex gap-0">
      <div className="p-2 border ship">Module No:</div>
      <div className="p-2 border ship"> {detail1}</div>
    </div>
  </div>
  )
}

export default ShippingDetails