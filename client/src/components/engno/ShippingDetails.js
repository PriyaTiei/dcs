import React from 'react';
import { useSelector } from 'react-redux';

function ShippingDetails({ shippingData }) {
  const reduxShippingData = useSelector((state) => state.engine.shippingData);
  const data = shippingData || reduxShippingData;

  // Do not render table if shipping data is not present
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  const consignmentNo = data.consignmentNo || data[4] || "-";
  const truckNo = data.truckNo || data[5] || "-";
  const customerName = data.customerName || data[6] || "-";
  const moduleNo = data.moduleNo || data[7] || "-";

  return (
    <div>
      <div className="h5">Shipping Detail</div>
      <div className="d-flex gap-0">
        <div className="p-2 border ship">Consignment No:</div>
        <div className="p-2 border ship">{consignmentNo}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border ship">Truck No:</div>
        <div className="p-2 border ship">{truckNo}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border ship">Customer name</div>
        <div className="p-2 border ship">{customerName}</div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border ship">Module No:</div>
        <div className="p-2 border ship">{moduleNo}</div>
      </div>
    </div>
  );
}

export default ShippingDetails;