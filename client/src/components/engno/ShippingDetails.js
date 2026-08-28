import React from 'react';

function ShippingDetails({ shippingData }) {
  const consignmentNo = shippingData?.consignmentNo || shippingData?.[0] || '-';
  const truckNo = shippingData?.truckNo || shippingData?.[1] || '-';
  const customerName = shippingData?.customerName || shippingData?.[2] || '-';
  const moduleNo = shippingData?.moduleNo || '-';

  return (
    <div>
      <div className="h5">Shipping Detail</div>
      <div className="d-flex gap-0">
        <div className="p-2 border ship">Consignment No:</div>
        <div className="p-2 border shipValue">{consignmentNo}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border ship">Truck No:</div>
        <div className="p-2 border shipValue">{truckNo}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border ship">Customer Name:</div>
        <div className="p-2 border shipValue">{customerName}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border ship">Module No:</div>
        <div className="p-2 border shipValue">{moduleNo}</div>
      </div>
    </div>
  );
}

export default ShippingDetails;