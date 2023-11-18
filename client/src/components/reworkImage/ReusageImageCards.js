import React from "react";
import moment from "moment";


function ReusageImageCards({ imageData }) {
  return (
    <div
      className="p-3 border border-dark"
      style={{ width: "20%", height: "auto" }}
    >
      <div className="d-flex gap-1">
        <h6 className="w-50 ">Part / Engine No: </h6>
        <h6 className="w-50 ">{imageData.engineNo}</h6>
      </div>
      <div className="d-flex gap-1">
        <h6 className="w-50 ">Checked by: </h6>
        <h6 className="w-50 ">{imageData.checkedBy}</h6>
      </div>
      <div className="d-flex gap-1 ">
        <h6 className="w-50 ">Date & Time: </h6>
        <h6 className="w-50 ">
          {moment(imageData.createdAt).format("DD-MM-YYYY HH:mm:ss")}
        </h6>
      </div>
      <div className="d-flex gap-1">
        <h6 className="w-50 ">Remarks: </h6>
        <h6 className="w-50 ">{imageData.commonRemarks}</h6>
      </div>
      <div className="d-flex gap-1">
        <h6 className="w-50 ">Line: </h6>
        <h6 className="w-50 ">{imageData.line}</h6>
      </div>
      <div className="d-flex gap-1">
        <h6 className="w-50 ">Shift: </h6>
        <h6 className="w-50 ">{imageData.shift}</h6>
     
      </div>

      <img
        style={{ width: "100%", height: "auto" }}
        src={`${process.env.REACT_APP_BACKEND_URL}/dcs/reworkImages/${imageData.imageName}`}
      ></img>
    </div>
  );
}

export default ReusageImageCards;
