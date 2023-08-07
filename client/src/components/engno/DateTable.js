import React from "react";
import moment from "moment";

function DateTable({ title, date }) {
  const newDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
  // const newDate = new Date(date);
  title=title.toUpperCase()
  if(title==="FUELLEAK"){
    title="FUEL LEAK";
  }
  else if(title==="OILELEAK"){
    title="OIL LEAK";
  }
  else if(title==="WALTERLEAK"){
    title="WATER LEAK";
  }
  return (
    <div className="d-flex gap-0">
      <div className="p-2 border hist">{title}</div>
      <div className="p-2 border histValue">{newDate}</div>
    </div>
  );
}

export default DateTable;
